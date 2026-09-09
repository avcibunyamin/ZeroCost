import { useEffect, useRef, useState, type FormEvent } from "react";
import { listen } from "@tauri-apps/api/event";
import { Bot, LoaderCircle, Play, ShieldCheck, Square, Users } from "lucide-react";
import { desktopAvailable, rpc } from "./api";
import validateEvent from "./generated/validate-event.js";
import type {
  OrchestrationMessage,
  OrchestrationRun,
  OrchestrationStartInput,
  PricingCatalog,
  Snapshot,
} from "./generated/contract";

type StreamingMessage = {
  agent_id: string;
  phase: "analysis" | "review" | "synthesis";
  content: string;
};

type Approval = { workspaceId: string; paths: string[] };

export function Orchestration({ snapshot }: { snapshot: Snapshot | null }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [objective, setObjective] = useState("");
  const [rounds, setRounds] = useState(1);
  const [routingMode, setRoutingMode] = useState<"manual" | "auto">("auto");
  const [maxModelCalls, setMaxModelCalls] = useState(5);
  const [maxOutputTokens, setMaxOutputTokens] = useState(512);
  const [maxCostUsd, setMaxCostUsd] = useState(5);
  const [workspaceId, setWorkspaceId] = useState("");
  const [contextInput, setContextInput] = useState("");
  const [runs, setRuns] = useState<OrchestrationRun[]>([]);
  const [catalog, setCatalog] = useState<PricingCatalog | null>(null);
  const [streaming, setStreaming] = useState<StreamingMessage | null>(null);
  const [active, setActive] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [approval, setApproval] = useState<Approval | null>(null);
  const [error, setError] = useState("");
  const runId = useRef<string | null>(null);
  const eventSequence = useRef(0);

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
        setApproval({
          workspaceId: pending.workspace_id,
          paths: pending.context_paths,
        });
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
    }
  }, []);
  useEffect(() => {
    if (selected.length < 2 && (snapshot?.agents.length ?? 0) >= 2)
      setSelected(snapshot!.agents.slice(0, 2).map((agent) => agent.id));
  }, [snapshot]);
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
      if (!payload.type.startsWith("orchestration_")) return;
      if (
        payload.run_id !== runId.current ||
        payload.sequence <= eventSequence.current
      )
        return;
      eventSequence.current = payload.sequence;
      if (payload.type === "orchestration_chunk") {
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
          workspaceId: payload.workspace_id,
          paths: payload.paths,
        });
        setRuns((items) =>
          items.map((run) =>
            run.run_id === payload.run_id
              ? { ...run, status: "waiting_approval" }
              : run,
          ),
        );
      } else {
        if (payload.type === "orchestration_error") setError(payload.message);
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
  async function start(event: FormEvent) {
    event.preventDefault();
    if (selected.length < 2 || !objective.trim() || active) return;
    const id = crypto.randomUUID();
    const contextPaths = [
      ...new Set(
        contextInput
          .split("\n")
          .map((path) => path.trim())
          .filter(Boolean),
      ),
    ].slice(0, 10);
    const run: OrchestrationRun = {
      run_id: id,
      objective: objective.trim(),
      agent_ids: selected as OrchestrationStartInput["agent_ids"],
      rounds,
      routing_mode: routingMode,
      route_reason: "Yönlendirme bekleniyor.",
      max_model_calls: maxModelCalls,
      max_output_tokens: maxOutputTokens,
      max_cost_microusd: Math.round(maxCostUsd * 1_000_000),
      estimated_max_cost_microusd: 0,
      actual_cost_microusd: 0,
      input_tokens: 0,
      output_tokens: 0,
      price_catalog_version: catalog?.version ?? "yükleniyor",
      used_model_calls: 0,
      workspace_id: workspaceId || null,
      context_paths: contextPaths,
      status: "running",
      error: "",
      messages: [],
    };
    runId.current = id;
    eventSequence.current = 0;
    setRuns((items) => [run, ...items]);
    setActive(true);
    setError("");
    try {
      await rpc({
        method: "orchestration.start",
        params: {
          run_id: id,
          objective: run.objective,
          agent_ids: selected as OrchestrationStartInput["agent_ids"],
          rounds,
          routing_mode: routingMode,
          max_model_calls: maxModelCalls,
          max_output_tokens: maxOutputTokens,
          max_cost_microusd: Math.round(maxCostUsd * 1_000_000),
          workspace_id: workspaceId || null,
          context_paths:
            contextPaths as OrchestrationStartInput["context_paths"],
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

  const current = runs[0];
  const messages: (OrchestrationMessage | StreamingMessage)[] = [
    ...(current?.messages ?? []),
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
  const missingReadPermission =
    contextRequested &&
    selected.some(
      (id) =>
        !snapshot?.agents
          .find((agent) => agent.id === id)
          ?.permissions.includes("workspace.read"),
    );
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
      <div className="orchestration-layout">
        <form className="panel orchestration-form" onSubmit={start}>
          <div className="panel-heading">
            <div>
              <h2>Yeni ortak görev</h2>
              <p>2–4 ajan, en fazla 3 tartışma turu.</p>
            </div>
            <Users size={20} />
          </div>
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
          </label>
          <fieldset disabled={active}>
            <legend>Ajanlar</legend>
            {snapshot?.agents.map((agent) => (
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
          <label>
            Yönlendirme
            <select
              value={routingMode}
              onChange={(e) =>
                setRoutingMode(e.target.value as "manual" | "auto")
              }
              disabled={active}
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
                max={13}
                value={maxModelCalls}
                onChange={(e) => setMaxModelCalls(Number(e.target.value))}
                disabled={active}
              />
            </label>
            <label>
              Azami maliyet · USD
              <input
                type="number"
                min={0}
                max={1000}
                step={0.01}
                value={maxCostUsd}
                onChange={(e) => setMaxCostUsd(Number(e.target.value))}
                disabled={active}
              />
            </label>
            <label>
              Yanıt tokenı / çağrı
              <select
                value={maxOutputTokens}
                onChange={(e) => setMaxOutputTokens(Number(e.target.value))}
                disabled={active}
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
              value={rounds}
              onChange={(e) => setRounds(Number(e.target.value))}
              disabled={active}
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
          {missingReadPermission && (
            <div className="form-error">
              Seçili tüm ajanlara Ajanlar ekranından workspace okuma izni verin.
            </div>
          )}
          {approval && (
            <div className="approval-card" role="alert">
              <div>
                <ShieldCheck size={20} />
                <strong>Dosya okuma onayı</strong>
              </div>
              <p>Ajanlar şu dosyaları yalnız bu görev için okuyacak:</p>
              <ul>{approval.paths.map((path) => <li key={path}>{path}</li>)}</ul>
              <div className="approval-actions">
                <button type="button" className="button primary"
                  onClick={() => void decide("approve")} disabled={stopping}>
                  Onayla ve devam et
                </button>
                <button type="button" className="button secondary"
                  onClick={() => void decide("reject")} disabled={stopping}>
                  Reddet
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
                !objective.trim() ||
                (routingMode === "manual" &&
                  maxModelCalls < selected.length * rounds + 1) ||
                maxModelCalls < rounds * 2 + 1 ||
                !Number.isFinite(maxCostUsd) ||
                maxCostUsd < 0 ||
                maxCostUsd > 1000 ||
                missingReadPermission ||
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
              {current?.route_reason && (
                <small>
                  {current.route_reason} · {current.used_model_calls}/{current.max_model_calls} çağrı
                  {` · $${(current.actual_cost_microusd / 1_000_000).toFixed(6)} kullanılan`}
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
          {current?.error && <div className="form-error">{current.error}</div>}
        </section>
      </div>
    </>
  );
}
