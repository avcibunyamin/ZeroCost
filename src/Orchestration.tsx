import { useEffect, useRef, useState, type FormEvent } from "react";
import { listen } from "@tauri-apps/api/event";
import { BookOpen, Bot, LoaderCircle, Play, ShieldCheck, Square, Users } from "lucide-react";
import { desktopAvailable, rpc } from "./api";
import validateEvent from "./generated/validate-event.js";
import type {
  OrchestrationMessage,
  OrchestrationRun,
  OrchestrationStartInput,
  KnowledgeCollection,
  PricingCatalog,
  Snapshot,
  WorkflowTemplate,
} from "./generated/contract";

type StreamingMessage = {
  agent_id: string;
  phase: "analysis" | "review" | "synthesis";
  content: string;
};

type Approval = {
  permission: "workspace.read" | "workspace.write" | "terminal.execute";
  workspaceId: string;
  paths: string[];
  tool: "workspace.write" | "terminal.execute" | null;
  path: string;
  command: string[];
  preview: string;
  risk: "medium" | "high" | null;
  uncertain: boolean;
};

export function Orchestration({ snapshot }: { snapshot: Snapshot | null }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [workflowId, setWorkflowId] = useState("");
  const [objective, setObjective] = useState("");
  const [rounds, setRounds] = useState(1);
  const [routingMode, setRoutingMode] = useState<"manual" | "auto">("auto");
  const [maxModelCalls, setMaxModelCalls] = useState(5);
  const [maxOutputTokens, setMaxOutputTokens] = useState(512);
  const [maxCostUsd, setMaxCostUsd] = useState(5);
  const [workspaceId, setWorkspaceId] = useState("");
  const [contextInput, setContextInput] = useState("");
  const [enabledTools, setEnabledTools] = useState<("workspace.write" | "terminal.execute")[]>([]);
  const [knowledgeCollections, setKnowledgeCollections] = useState<KnowledgeCollection[]>([]);
  const [selectedKnowledge, setSelectedKnowledge] = useState<string[]>([]);
  const [runs, setRuns] = useState<OrchestrationRun[]>([]);
  const [catalog, setCatalog] = useState<PricingCatalog | null>(null);
  const [streaming, setStreaming] = useState<StreamingMessage | null>(null);
  const [active, setActive] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [approval, setApproval] = useState<Approval | null>(null);
  const [error, setError] = useState("");
  const [retryNotice, setRetryNotice] = useState("");
  const runId = useRef<string | null>(null);
  const eventSequence = useRef(0);
  const workflow: WorkflowTemplate | undefined = snapshot?.workflows.find(
    (item) => item.id === workflowId && !item.archived,
  );

  async function refresh() {
    const result = await rpc({ method: "orchestration.history" });
    if (!("runs" in result)) throw new Error("Görev geçmişi alınamadı.");
    setRuns(result.runs);
    const pending = result.runs.find((run) =>
      ["running", "waiting_approval"].includes(run.status),
    );
    if (pending) {
      runId.current = pending.run_id;
      setActive(true);
      if (pending.status === "waiting_approval" && pending.workspace_id)
        setApproval(pending.tool_action && pending.tool_action.tool !== "knowledge.search" ? {
          permission: pending.tool_action.tool,
          workspaceId: pending.workspace_id,
          paths: [], tool: pending.tool_action.tool,
          path: pending.tool_action.path, command: pending.tool_action.command,
          preview: pending.tool_action.preview, risk: pending.tool_action.risk,
          uncertain: pending.tool_action.status === "uncertain" ||
            (pending.error_class === "uncertain_tool" && pending.tool_action.status === "completed"),
        } : { permission: "workspace.read", workspaceId: pending.workspace_id,
          paths: pending.context_paths, tool: null, path: "", command: [], preview: "", risk: null,
          uncertain: false });
    }
  }

  useEffect(() => {
    if (desktopAvailable) {
      void refresh().catch((e) => setError(String(e)));
      void rpc({ method: "pricing.catalog" })
        .then((result) => {
          if ("currency" in result) setCatalog(result);
        })
        .catch((e) => setError(String(e)));
      void rpc({ method: "knowledge.snapshot" })
        .then((result) => {
          if ("collections" in result) setKnowledgeCollections(result.collections);
        })
        .catch((e) => setError(String(e)));
    }
  }, []);
  useEffect(() => {
    if (!workflowId && selected.length < 2 && (snapshot?.agents.length ?? 0) >= 2)
      setSelected(snapshot!.agents.slice(0, 2).map((agent) => agent.id));
  }, [snapshot, workflowId]);
  useEffect(() => {
    if (!workflow || !snapshot) return;
    const used = new Set<string>();
    const bindings = workflow.agent_slots.map((slot) => {
      const agent = snapshot.agents.find((candidate) =>
        !used.has(candidate.id) &&
        slot.required_skill_ids.every((skillId) => candidate.skill_ids.includes(skillId)));
      if (agent) used.add(agent.id);
      return agent?.id ?? "";
    });
    setSelected(bindings);
    setEnabledTools(workflow.required_tools.filter((tool) =>
      tool !== "knowledge.search") as ("workspace.write" | "terminal.execute")[]);
  }, [workflow, snapshot]);
  useEffect(() => {
    if (!desktopAvailable) return;
    let disposed = false;
    let unlisten: undefined | (() => void);
    listen<unknown>("chat_stream", ({ payload }) => {
      if (disposed || !validateEvent(payload))
        return;
      if (payload.type === "transport_error") {
        if (runId.current) {
          setError(payload.message);
          setActive(false);
          setStopping(false);
          setStreaming(null);
          runId.current = null;
        }
        return;
      }
      if (payload.type === "knowledge_ingestion_progress") return;
      if (!payload.type.startsWith("orchestration_")) return;
      if (
        payload.run_id !== runId.current ||
        payload.sequence <= eventSequence.current
      )
        return;
      eventSequence.current = payload.sequence;
      if (payload.type === "orchestration_chunk") {
        setRetryNotice("");
        setStreaming((current) => ({
          agent_id: payload.agent_id,
          phase: payload.phase,
          content:
            current &&
            current.agent_id === payload.agent_id &&
            current.phase === payload.phase
              ? current.content + payload.token
              : payload.token,
        }));
      } else if (payload.type === "orchestration_retrying") {
        setStreaming(null);
        setRetryNotice(payload.message);
      } else if (payload.type === "orchestration_fallback") {
        setStreaming(null);
        setRetryNotice(payload.message);
      } else if (payload.type === "orchestration_message_end") {
        setRuns((items) =>
          items.map((run) =>
            run.run_id === payload.run_id
              ? {
                  ...run,
                  messages: [
                    ...run.messages,
                    {
                      sequence: run.messages.length + 1,
                      agent_id: payload.agent_id,
                      phase: payload.phase,
                      content: payload.full_content,
                    },
                  ],
                }
              : run,
          ),
        );
        setStreaming(null);
      } else if (payload.type === "orchestration_route") {
        setRuns((items) =>
          items.map((run) =>
            run.run_id === payload.run_id
              ? {
                  ...run,
                  agent_ids: payload.agent_ids,
                  route_reason: payload.reason,
                  estimated_max_cost_microusd:
                    payload.estimated_max_cost_microusd,
                }
              : run,
          ),
        );
      } else if (payload.type === "orchestration_usage") {
        setRuns((items) =>
          items.map((run) =>
            run.run_id === payload.run_id
              ? {
                  ...run,
                  input_tokens: payload.input_tokens,
                  output_tokens: payload.output_tokens,
                  actual_cost_microusd: payload.actual_cost_microusd,
                  used_model_calls: run.used_model_calls + 1,
                }
              : run,
          ),
        );
      } else if (payload.type === "orchestration_approval_required") {
        setApproval({
          permission: payload.permission,
          workspaceId: payload.workspace_id,
          paths: payload.paths,
          tool: payload.tool,
          path: payload.path,
          command: payload.command,
          preview: payload.preview,
          risk: payload.risk,
          uncertain: false,
        });
        setRuns((items) =>
          items.map((run) =>
            run.run_id === payload.run_id
              ? { ...run, status: "waiting_approval" }
              : run,
          ),
        );
      } else if (payload.type === "orchestration_tool_result") {
        setRuns((items) => items.map((run) => run.run_id === payload.run_id
          ? { ...run, tool_action: run.tool_action
            ? { ...run.tool_action, status: payload.status, result: payload.result }
            : { tool: payload.tool, path: "", command: [], collection_id: "", query: "",
                limit: 5, preview: "", risk: "medium", status: payload.status,
                result: payload.result, args_hash: "", content_hash: "" } }
          : run));
      } else {
        if (payload.type === "orchestration_error") setError(payload.message);
        setRetryNotice("");
        setActive(false);
        setStopping(false);
        setStreaming(null);
        setApproval(null);
        runId.current = null;
        void refresh().catch((e) => setError(String(e)));
      }
    })
      .then((stop) => (disposed ? stop() : (unlisten = stop)))
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
    return () => {
      disposed = true;
      unlisten?.();
    };
  }, []);

  function choose(agentId: string) {
    setSelected((current) =>
      current.includes(agentId)
        ? current.filter((id) => id !== agentId)
        : current.length < 4
          ? [...current, agentId]
          : current,
    );
  }
  function bindSlot(index: number, agentId: string) {
    setSelected((current) => {
      const next = [...current];
      next[index] = agentId;
      return next;
    });
  }
  async function start(event: FormEvent) {
    event.preventDefault();
    if (selected.length < 2 || selected.some((id) => !id) || !objective.trim() || active) return;
    const id = crypto.randomUUID();
    const contextPaths = [
      ...new Set(
        contextInput
          .split("\n")
          .map((path) => path.trim())
          .filter(Boolean),
      ),
    ].slice(0, 10);
    const effectiveRounds = workflow?.rounds ?? rounds;
    const effectiveRouting = workflow ? "manual" : routingMode;
    const effectiveMaxCalls = workflow?.max_model_calls ?? maxModelCalls;
    const effectiveMaxTokens = workflow?.max_output_tokens ?? maxOutputTokens;
    const effectiveMaxCost = workflow?.max_cost_microusd ?? Math.round(maxCostUsd * 1_000_000);
    const effectiveTools = workflow
      ? workflow.required_tools.filter((tool) => tool !== "knowledge.search")
      : enabledTools;
    const fullObjective = workflow?.objective_prefix.trim()
      ? `${workflow.objective_prefix.trim()}\n\n${objective.trim()}`
      : objective.trim();
    const run: OrchestrationRun = {
      run_id: id,
      objective: fullObjective,
      agent_ids: selected as OrchestrationStartInput["agent_ids"],
      rounds: effectiveRounds,
      routing_mode: effectiveRouting,
      route_reason: "Yönlendirme bekleniyor.",
      max_model_calls: effectiveMaxCalls,
      max_output_tokens: effectiveMaxTokens,
      max_cost_microusd: effectiveMaxCost,
      estimated_max_cost_microusd: 0,
      actual_cost_microusd: 0,
      input_tokens: 0,
      output_tokens: 0,
      price_catalog_version: catalog?.version ?? "yükleniyor",
      used_model_calls: 0,
      workspace_id: workspaceId || null,
      context_paths: contextPaths,
      enabled_tools: effectiveTools as OrchestrationRun["enabled_tools"],
      knowledge_collection_ids: selectedKnowledge,
      workflow_id: workflow?.id ?? null,
      workflow_version: workflow?.version ?? null,
      tool_action: null,
      status: "running",
      error: "",
      attempt: 1,
      parent_run_id: null,
      resumed_from_node: "",
      failed_node: "",
      error_class: "",
      cumulative_model_calls: 0,
      cumulative_cost_microusd: 0,
      fallback_chain: selected.map((agentId) => {
        const agent = snapshot?.agents.find((item) => item.id === agentId);
        return agent ? [agent.connection_id, ...agent.fallback_connection_ids] : [];
      }),
      model_call_attempts: [],
      messages: [],
    };
    runId.current = id;
    eventSequence.current = 0;
    setRuns((items) => [run, ...items]);
    setActive(true);
    setError("");
    setRetryNotice("");
    try {
      await rpc({
        method: "orchestration.start",
        params: {
          run_id: id,
          objective: objective.trim(),
          agent_ids: selected as OrchestrationStartInput["agent_ids"],
          rounds: effectiveRounds,
          routing_mode: effectiveRouting,
          max_model_calls: effectiveMaxCalls,
          max_output_tokens: effectiveMaxTokens,
          max_cost_microusd: effectiveMaxCost,
          workspace_id: workspaceId || null,
          context_paths:
            contextPaths as OrchestrationStartInput["context_paths"],
          enabled_tools: effectiveTools as OrchestrationStartInput["enabled_tools"],
          knowledge_collection_ids:
            selectedKnowledge as OrchestrationStartInput["knowledge_collection_ids"],
          workflow_id: workflow?.id ?? null,
          workflow_version: workflow?.version ?? null,
        },
      });
    } catch (e) {
      runId.current = null;
      setActive(false);
      setError(e instanceof Error ? e.message : String(e));
      await refresh().catch(() => undefined);
    }
  }
  async function decide(decision: "approve" | "reject") {
    if (!runId.current) return;
    setStopping(true);
    try {
      await rpc({
        method: "orchestration.approve",
        params: { run_id: runId.current, decision },
      });
      setApproval(null);
      setRuns((items) =>
        items.map((run) =>
          run.run_id === runId.current ? { ...run, status: "running" } : run,
        ),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setStopping(false);
    }
  }
  async function cancel() {
    if (!runId.current) return;
    setStopping(true);
    try {
      await rpc({
        method: "orchestration.cancel",
        params: { run_id: runId.current },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setStopping(false);
    }
  }

  async function retry(run: OrchestrationRun) {
    if (active || run.status !== "failed" || run.error_class !== "retryable") return;
    const id = crypto.randomUUID();
    runId.current = id;
    eventSequence.current = 0;
    setActive(true);
    setError("");
    setRetryNotice("Checkpoint üzerinden başarısız düğüm yeniden başlatılıyor.");
    try {
      await rpc({
        method: "orchestration.retry",
        params: { run_id: run.run_id, new_run_id: id },
      });
      await refresh();
    } catch (e) {
      runId.current = null;
      setActive(false);
      setError(e instanceof Error ? e.message : String(e));
      await refresh().catch(() => undefined);
    }
  }

  const current = runs[0];
  const currentWorkflow = current?.workflow_id
    ? snapshot?.workflows.find((item) => item.id === current.workflow_id)
    : undefined;
  const lineageRoot = current?.parent_run_id ?? current?.run_id;
  const lineageMessages = lineageRoot
    ? runs.filter((run) => run.run_id === lineageRoot || run.parent_run_id === lineageRoot)
      .sort((left, right) => left.attempt - right.attempt)
      .flatMap((run) => run.messages)
    : [];
  const messages: (OrchestrationMessage | StreamingMessage)[] = [
    ...lineageMessages,
    ...(streaming ? [streaming] : []),
  ];
  const name = (id: string) =>
    snapshot?.agents.find((agent) => agent.id === id)?.name ?? "Ajan";
  const phase = {
    analysis: "Analiz",
    review: "Karşı görüş",
    synthesis: "Ortak sonuç",
  } as const;
  const contextRequested = !!contextInput.trim();
  const workflowNeedsKnowledge = workflow?.required_tools.some(
    (tool) => tool === "knowledge.search") ?? false;
  const effectiveTools: ("workspace.write" | "terminal.execute")[] = workflow
    ? workflow.required_tools.filter((tool) => tool !== "knowledge.search") as
      ("workspace.write" | "terminal.execute")[]
    : enabledTools;
  const effectiveRounds = workflow?.rounds ?? rounds;
  const effectiveMaxCalls = workflow?.max_model_calls ?? maxModelCalls;
  const effectiveMaxCostUsd = workflow
    ? workflow.max_cost_microusd / 1_000_000
    : maxCostUsd;
  const missingReadPermission =
    contextRequested &&
    selected.some(
      (id) =>
        !snapshot?.agents
          .find((agent) => agent.id === id)
          ?.permissions.includes("workspace.read"),
    );
  const missingToolPermission = effectiveTools.some((tool) =>
    selected.some((id) => !snapshot?.agents.find((agent) => agent.id === id)?.permissions.includes(tool)),
  );
  const missingWorkflowWorkspace = !!workflow && effectiveTools.length > 0 && !workspaceId;
  const missingWorkflowKnowledge = workflowNeedsKnowledge && selectedKnowledge.length === 0;
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">FAZ 2 · ÇOKLU AJAN</div>
          <h1>Ajan masası.</h1>
          <p>Uzmanları seçin; görüşlerini ve ortak kararı oluşurken izleyin.</p>
        </div>
        <span className="badge positive">LangGraph · Kalıcı durum</span>
      </div>
      {error && (
        <div className="banner error" role="alert">
          {error}
        </div>
      )}
      {retryNotice && <div className="banner">{retryNotice}</div>}
      <div className="orchestration-layout">
        <form className="panel orchestration-form" onSubmit={start}>
          <div className="panel-heading">
            <div>
              <h2>Yeni ortak görev</h2>
              <p>2–4 ajan, en fazla 3 tartışma turu.</p>
            </div>
            <Users size={20} />
          </div>
          {(snapshot?.workflows.some((item) => !item.archived) ?? false) && (
            <label>
              Workflow tarifi
              <select value={workflowId} onChange={(event) => setWorkflowId(event.target.value)}
                disabled={active}>
                <option value="">Serbest ajan görevi</option>
                {snapshot!.workflows.filter((item) => !item.archived).map((item) => (
                  <option key={item.id} value={item.id}>{item.name} · v{item.version}</option>
                ))}
              </select>
              <small>Tarif sabit ajan sırasını, skill gereksinimlerini ve bütçeyi uygular.</small>
            </label>
          )}
          <label>
            Görev
            <textarea
              rows={5}
              maxLength={12000}
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Ekibin çözmesini istediğiniz hedefi yazın…"
              disabled={active}
            />
            {workflow?.objective_prefix && <small>
              Sabit önek: {workflow.objective_prefix}
            </small>}
          </label>
          <fieldset disabled={active}>
            <legend>Ajanlar</legend>
            {workflow ? workflow.agent_slots.map((slot, index) => (
              <label key={`${workflow.id}-${slot.name}`}>
                {index + 1}. {slot.name}
                <select value={selected[index] ?? ""}
                  onChange={(event) => bindSlot(index, event.target.value)} required>
                  <option value="">Uygun ajan seçin</option>
                  {snapshot?.agents.filter((agent) =>
                    slot.required_skill_ids.every((skillId) => agent.skill_ids.includes(skillId)) &&
                    !selected.some((selectedId, selectedIndex) =>
                      selectedIndex !== index && selectedId === agent.id)).map((agent) => (
                    <option key={agent.id} value={agent.id}>{agent.name} · {agent.role}</option>
                  ))}
                </select>
                <small>{slot.required_skill_ids.length
                  ? `${slot.required_skill_ids.length} sabit skill sürümü gerekli`
                  : "Zorunlu skill yok"}</small>
              </label>
            )) : snapshot?.agents.map((agent) => (
              <label className="agent-choice" key={agent.id}>
                <input
                  type="checkbox"
                  checked={selected.includes(agent.id)}
                  onChange={() => choose(agent.id)}
                />
                <span>
                  <strong>{agent.name}</strong>
                  <small>{agent.role}</small>
                </span>
              </label>
            ))}
          </fieldset>
          {knowledgeCollections.length > 0 && <fieldset disabled={active}>
            <legend>Yerel bilgi koleksiyonları</legend>
            {knowledgeCollections.map((collection) => (
              <label className="agent-choice" key={collection.id}>
                <input type="checkbox" checked={selectedKnowledge.includes(collection.id)}
                  onChange={() => setSelectedKnowledge((current) => current.includes(collection.id)
                    ? current.filter((id) => id !== collection.id)
                    : current.length < 3 ? [...current, collection.id] : current)} />
                <BookOpen size={16} />
                <span><strong>{collection.name}</strong>
                  <small>{collection.source_count} belge · salt okunur hibrit arama</small></span>
              </label>
            ))}
            <small>En fazla 3 koleksiyon. Ajan arama isterse bir ek sentez çağrısı bütçelenir;
              bulut ajanında bulunan metin ilgili sağlayıcıya gönderilir.</small>
          </fieldset>}
          <label>
            Yönlendirme
            <select
              value={workflow ? "manual" : routingMode}
              onChange={(e) =>
                setRoutingMode(e.target.value as "manual" | "auto")
              }
              disabled={active || !!workflow}
            >
              <option value="auto">Otomatik · göreve göre sırala</option>
              <option value="manual">Manuel · seçim sırasını koru</option>
            </select>
          </label>
          <div className="budget-grid">
            <label>
              Model çağrısı bütçesi
              <input
                type="number"
                min={3}
                max={14}
                value={workflow?.max_model_calls ?? maxModelCalls}
                onChange={(e) => setMaxModelCalls(Number(e.target.value))}
                disabled={active || !!workflow}
              />
            </label>
            <label>
              Azami maliyet · USD
              <input
                type="number"
                min={0}
                max={1000}
                step={0.01}
                value={workflow ? workflow.max_cost_microusd / 1_000_000 : maxCostUsd}
                onChange={(e) => setMaxCostUsd(Number(e.target.value))}
                disabled={active || !!workflow}
              />
            </label>
            <label>
              Yanıt tokenı / çağrı
              <select
                value={workflow?.max_output_tokens ?? maxOutputTokens}
                onChange={(e) => setMaxOutputTokens(Number(e.target.value))}
                disabled={active || !!workflow}
              >
                {[256, 512, 1024, 2048, 4096].map((value) => (
                  <option value={value} key={value}>{value}</option>
                ))}
              </select>
            </label>
          </div>
          {catalog && (
            <details className="price-catalog">
              <summary>Fiyat kataloğu · {catalog.version}</summary>
              <p>Standart API liste fiyatları · USD / 1 milyon token</p>
              <div>
                {catalog.entries.map((entry) => (
                  <span key={`${entry.provider}-${entry.model_pattern}`}>
                    <strong>{entry.model_pattern}</strong>
                    {` $${entry.input_per_million_usd} giriş · $${entry.output_per_million_usd} çıkış`}
                  </span>
                ))}
              </div>
            </details>
          )}
          <label>
            Tartışma turu
            <select
              value={workflow?.rounds ?? rounds}
              onChange={(e) => setRounds(Number(e.target.value))}
              disabled={active || !!workflow}
            >
              <option value={1}>1 tur</option>
              <option value={2}>2 tur</option>
              <option value={3}>3 tur</option>
            </select>
          </label>
          <label>
            Çalışma alanı bağlamı
            <select
              value={workspaceId}
              onChange={(e) => setWorkspaceId(e.target.value)}
              disabled={active}
            >
              <option value="">Bağlam kullanma</option>
              {snapshot?.workspaces.map((workspace) => (
                <option value={workspace.id} key={workspace.id}>
                  {workspace.name}
                </option>
              ))}
            </select>
          </label>
          {workspaceId && (
            <label>
              Okunacak göreli dosyalar
              <textarea
                rows={3}
                value={contextInput}
                onChange={(e) => setContextInput(e.target.value)}
                placeholder={"README.md\nsrc/App.tsx"}
                disabled={active}
              />
              <small>
                Her satıra bir dosya. En fazla 10 dosya; yalnız okuma izni olan
                ajanlar kullanabilir.
              </small>
            </label>
          )}
          {(workspaceId || workflow) && (
            <fieldset disabled={active || !!workflow}>
              <legend>Model araç önerileri</legend>
              {(["workspace.write", "terminal.execute"] as const).map((tool) => (
                <label className="agent-choice" key={tool}>
                  <input type="checkbox" checked={effectiveTools.includes(tool)}
                    onChange={() => setEnabledTools((current) => current.includes(tool)
                      ? current.filter((item) => item !== tool) : [...current, tool])} />
                  <span><strong>{tool}</strong><small>Her çalıştırmada somut önizleme ve onay gerekir.</small></span>
                </label>
              ))}
              {workflowNeedsKnowledge && <small>knowledge.search için en az bir koleksiyon seçilmelidir.</small>}
            </fieldset>
          )}
          {missingReadPermission && (
            <div className="form-error">
              Seçili tüm ajanlara Ajanlar ekranından workspace okuma izni verin.
            </div>
          )}
          {missingToolPermission && <div className="form-error">
            Seçili ajanların araç izinlerini Ajanlar ekranından açın.
          </div>}
          {missingWorkflowWorkspace && <div className="form-error">
            Workflow araçları için bir çalışma alanı seçin.
          </div>}
          {missingWorkflowKnowledge && <div className="form-error">
            Workflow için en az bir yerel bilgi koleksiyonu seçin.
          </div>}
          {approval && (
            <div className="approval-card" role="alert">
              <div>
                <ShieldCheck size={20} />
                <strong>{approval.uncertain ? "Araç sonucu belirsiz" :
                  approval.permission === "workspace.read" ? "Dosya okuma onayı" : "Araç çalıştırma onayı"}</strong>
              </div>
              {approval.permission === "workspace.read" ? <>
                <p>Ajanlar şu dosyaları yalnız bu görev için okuyacak:</p>
                <ul>{approval.paths.map((path) => <li key={path}>{path}</li>)}</ul>
              </> : <>
                <p>{approval.uncertain
                  ? `${approval.tool} çalıştırılırken uygulama kapandı. Araç çalışmış olabilir; yeniden çalıştırmadan devam edebilirsiniz.`
                  : `${approval.tool} · risk: ${approval.risk}`}</p>
                {approval.path && <code>{approval.path}</code>}
                {approval.command.length > 0 && <code>argv: {JSON.stringify(approval.command)}</code>}
                <pre>{approval.preview}</pre>
              </>}
              <div className="approval-actions">
                <button type="button" className="button primary"
                  onClick={() => void decide("approve")} disabled={stopping}>
                  {approval.uncertain ? "Yeniden çalıştırmadan devam et" : "Onayla ve devam et"}
                </button>
                <button type="button" className="button secondary"
                  onClick={() => void decide("reject")} disabled={stopping}>
                  {approval.uncertain ? "Görevi durdur" : "Reddet"}
                </button>
              </div>
            </div>
          )}
          {active ? (
            <button
              type="button"
              className="button secondary"
              onClick={cancel}
              disabled={stopping}
            >
              <Square size={14} />
              {stopping ? "İşleniyor…" : "Görevi durdur"}
            </button>
          ) : (
            <button
              className="button primary"
              disabled={
                selected.length < 2 ||
                selected.some((id) => !id) ||
                !objective.trim() ||
                ((workflow || routingMode === "manual") &&
                  effectiveMaxCalls < selected.length * effectiveRounds + 1 + (selectedKnowledge.length ? 1 : 0)) ||
                effectiveMaxCalls < effectiveRounds * 2 + 1 + (selectedKnowledge.length ? 1 : 0) ||
                !Number.isFinite(effectiveMaxCostUsd) ||
                effectiveMaxCostUsd < 0 ||
                effectiveMaxCostUsd > 1000 ||
                missingReadPermission ||
                missingToolPermission ||
                missingWorkflowWorkspace ||
                missingWorkflowKnowledge ||
                (contextRequested && !workspaceId)
              }
            >
              <Play size={15} />
              Görevi başlat
            </button>
          )}
        </form>
        <section className="panel orchestration-transcript">
          <div className="panel-heading">
            <div>
              <h2>{current?.objective ?? "Görev akışı"}</h2>
              <p>
                {current
                  ? `${current.agent_ids.length} ajan · ${current.rounds} tur`
                  : "Henüz ortak görev yok."}
              </p>
              {current?.workflow_id && (
                <small>
                  Workflow: {currentWorkflow?.name ?? current.workflow_id} v{current.workflow_version}
                </small>
              )}
              {current && current.attempt > 1 && (
                <small>Deneme {current.attempt} · {current.resumed_from_node} düğümünden devam</small>
              )}
              {current?.route_reason && (
                <small>
                  {current.route_reason} · {current.cumulative_model_calls}/{current.max_model_calls} çağrı
                  {` · $${(current.cumulative_cost_microusd / 1_000_000).toFixed(6)} kullanılan`}
                  {` · $${(current.estimated_max_cost_microusd / 1_000_000).toFixed(4)} üst tahmin`}
                  {` · katalog ${current.price_catalog_version}`}
                </small>
              )}
            </div>
            {active && <LoaderCircle className="spin" size={19} />}
          </div>
          {!messages.length && (
            <div className="empty">
              <div className="empty-icon">
                <Bot size={26} />
              </div>
              <h3>Ajan görüşleri burada görünecek</h3>
              <p>Her mesaj hangi ajan ve aşamadan geldiğiyle kaydedilir.</p>
            </div>
          )}
          {messages.map((message, index) => (
            <article
              className={`orchestration-message phase-${message.phase}`}
              key={`${index}-${message.agent_id}-${message.phase}`}
            >
              <header>
                <strong>{name(message.agent_id)}</strong>
                <span>{phase[message.phase]}</span>
              </header>
              <p>{message.content || "Yanıt hazırlanıyor…"}</p>
            </article>
          ))}
          {current?.error && <div className="form-error">
            {current.error_class === "retryable" && "Geçici sağlayıcı hatası · "}
            {current.error_class === "permanent" && "Kalıcı hata · "}
            {current.error_class === "uncertain_tool" && "Belirsiz araç sonucu · "}
            {current.error}
            {current.failed_node && <small> Düğüm: {current.failed_node}</small>}
          </div>}
          {current?.status === "failed" && current.error_class === "retryable" &&
            current.cumulative_model_calls < current.max_model_calls && !active && (
              <button type="button" className="button primary" onClick={() => void retry(current)}>
                Başarısız düğümü yeniden dene
              </button>
            )}
          {current?.tool_action && <div className="approval-card">
            <strong>{current.tool_action.tool} · {current.tool_action.status}</strong>
            {current.tool_action.result && <pre>{current.tool_action.result}</pre>}
          </div>}
          {!!current?.model_call_attempts.length && (
            <div className="approval-card model-call-audit">
              <strong>Model çağrı günlüğü</strong>
              {current.model_call_attempts.map((item) => {
                const connection = snapshot?.connections.find(
                  (candidate) => candidate.id === item.connection_id,
                );
                return (
                  <div key={item.id}>
                    <span>{item.node_name} · {connection?.name ?? item.connection_id}</span>
                    <small>
                      {item.outcome} · {item.duration_ms} ms · ${
                        (item.cost_microusd / 1_000_000).toFixed(6)
                      }
                    </small>
                    {item.error_message && <small>{item.error_message}</small>}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
