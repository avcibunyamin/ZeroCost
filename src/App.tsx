import { useEffect, useState, type FormEvent } from "react";
import {
  Activity,
  ArrowDown,
  MessageSquare,
  ArrowRight,
  ArrowUp,
  Bot,
  Check,
  ChevronRight,
  CircleHelp,
  Cpu,
  Database,
  BookOpen,
  Folder,
  GitBranch,
  LayoutDashboard,
  LoaderCircle,
  Package,
  Plus,
  RefreshCw,
  Settings2,
  ShieldCheck,
  Sparkles,
  Unplug,
  Users,
  Workflow as WorkflowIcon,
  X,
} from "lucide-react";
import { desktopAvailable, send } from "./api";
import type {
  Snapshot,
  ConnectionInput,
  AgentInput,
  WorkspaceInput,
  Permission,
  AgentPermissionsInput,
  AgentFallbacksInput,
  SkillPackageInput,
  SkillAssignInput,
  WorkflowTemplateInput,
} from "./generated/contract";
import "./App.css";
import { Chat } from "./Chat";
import { VaultControl } from "./VaultControl";
import { Orchestration } from "./Orchestration";
import { Knowledge } from "./Knowledge";
import { ConnectionModelProbe } from "./ConnectionModelProbe";

type Page =
  | "chat"
  | "orchestration"
  | "knowledge"
  | "overview"
  | "agents"
  | "skills"
  | "workflows"
  | "connections"
  | "workspaces"
  | "system";
type Modal = "connection" | "agent" | "workspace" | "skill" | "workflow" | null;
const navigation = [
  { id: "overview", label: "Genel bakış", icon: LayoutDashboard },
  { id: "chat", label: "Sohbet", icon: MessageSquare },
  { id: "orchestration", label: "Ajan masası", icon: Users },
  { id: "knowledge", label: "Bilgi yönetimi", icon: BookOpen },
  { id: "agents", label: "Ajanlar", icon: Bot },
  { id: "skills", label: "Skill paketleri", icon: Package },
  { id: "workflows", label: "Workflow tarifleri", icon: WorkflowIcon },
  { id: "connections", label: "Model bağlantıları", icon: GitBranch },
  { id: "workspaces", label: "Çalışma alanları", icon: Folder },
  { id: "system", label: "Sistem", icon: Settings2 },
] as const;
const providers: Record<ConnectionInput["provider"], string> = {
  ollama: "Ollama",
  lmstudio: "LM Studio",
  anthropic: "Anthropic",
  gemini: "Google Gemini",
  openai: "OpenAI",
};
type WorkflowTool = "workspace.write" | "terminal.execute" | "knowledge.search";

export default function App() {
  const [page, setPage] = useState<Page>("overview");
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [modal, setModal] = useState<Modal>(null);
  const [workflowSlotCount, setWorkflowSlotCount] = useState(2);
  const [workflowRounds, setWorkflowRounds] = useState(1);
  const [workflowRequiredTools, setWorkflowRequiredTools] = useState<WorkflowTool[]>([]);
  const [workflowMaxCalls, setWorkflowMaxCalls] = useState(3);
  const [connectionProvider, setConnectionProvider] = useState<ConnectionInput["provider"]>("ollama");
  const workflowMinimumCalls = workflowSlotCount * workflowRounds + 1
    + (workflowRequiredTools.includes("knowledge.search") ? 1 : 0);
  const connected = desktopAvailable && !!snapshot;
  async function refresh() {
    setLoading(true);
    setError("");
    try {
      setSnapshot(await send({ method: "snapshot" }));
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (desktopAvailable) void refresh();
  }, []);
  useEffect(() => {
    if (!modal) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) setModal(null);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [modal, loading]);
  useEffect(() => {
    setWorkflowMaxCalls((current) => Math.max(current, workflowMinimumCalls));
  }, [workflowMinimumCalls]);
  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const field = (name: string) => String(data.get(name) ?? "").trim();
    setLoading(true);
    setError("");
    try {
      let result: Snapshot;
      if (modal === "connection") {
        const params: ConnectionInput = {
          name: field("name"),
          provider: field("provider") as ConnectionInput["provider"],
          model_id: field("model_id"),
          base_url: field("base_url"),
          supports_tools: field("supports_tools") as ConnectionInput["supports_tools"],
        };
        result = await send({ method: "connection.create", params });
      } else if (modal === "agent") {
        const params: AgentInput = {
          name: field("name"),
          role: field("role"),
          connection_id: field("connection_id"),
          instructions: field("instructions"),
        };
        result = await send({ method: "agent.create", params });
      } else if (modal === "skill") {
        const tools = Array.from(data.getAll("required_tools")) as SkillPackageInput["required_tools"];
        const perms = Array.from(data.getAll("required_permissions")) as SkillPackageInput["required_permissions"];
        const hint = field("provider_hint");
        const params: SkillPackageInput = {
          name: field("name"),
          version: field("version") || "1.0.0",
          description: field("description"),
          instructions: field("instructions"),
          required_tools: tools,
          required_permissions: perms,
          provider_hint: (hint || null) as SkillPackageInput["provider_hint"],
        };
        result = await send({ method: "skill.create", params });
      } else if (modal === "workflow") {
        const tools = workflowRequiredTools as WorkflowTemplateInput["required_tools"];
        const slots = Array.from({ length: workflowSlotCount }, (_, index) => ({
          name: field(`slot_${index}_name`),
          required_skill_ids: Array.from(data.getAll(`slot_${index}_skills`)),
        })) as WorkflowTemplateInput["agent_slots"];
        const params: WorkflowTemplateInput = {
          name: field("name"),
          version: field("version") || "1.0.0",
          description: field("description"),
          objective_prefix: field("objective_prefix"),
          agent_slots: slots,
          required_tools: tools,
          rounds: workflowRounds,
          max_model_calls: workflowMaxCalls,
          max_output_tokens: Number(field("max_output_tokens")),
          max_cost_microusd: Math.round(Number(field("max_cost_usd")) * 1_000_000),
        };
        result = await send({ method: "workflow.create", params });
      } else {
        const params: WorkspaceInput = {
          name: field("name"),
          path: field("path"),
        };
        result = await send({ method: "workspace.create", params });
      }
      setSnapshot(result);
      setModal(null);
      setNotice("Kayıt yerel veritabanına kaydedildi.");
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
    } finally {
      setLoading(false);
    }
  }
  const openModal = (value: Modal) => {
    setError("");
    setNotice("");
    if (value === "workflow") {
      setWorkflowSlotCount(2);
      setWorkflowRounds(1);
      setWorkflowRequiredTools([]);
      setWorkflowMaxCalls(3);
    }
    if (value === "connection") setConnectionProvider("ollama");
    setModal(value);
  };
  async function togglePermission(agentId: string, permission: Permission) {
    setLoading(true);
    setError("");
    const agent = snapshot?.agents.find((item) => item.id === agentId);
    const permissions = agent?.permissions.includes(permission)
      ? agent.permissions.filter((item) => item !== permission)
      : [...(agent?.permissions ?? []), permission];
    try {
      setSnapshot(
        await send({
          method: "agent.permissions.set",
          params: { agent_id: agentId, permissions: permissions as AgentPermissionsInput["permissions"] },
        }),
      );
      setNotice(
        permissions.includes(permission) ? "Ajan izni verildi." : "Ajan izni kaldırıldı.",
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }
  async function setConnectionTools(connectionId: string,
                                    supportsTools: ConnectionInput["supports_tools"]) {
    setLoading(true);
    setError("");
    try {
      setSnapshot(await send({ method: "connection.tools.set", params: {
        connection_id: connectionId, supports_tools: supportsTools,
      } }));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }
  async function setFallbacks(agentId: string, connectionIds: string[]) {
    setLoading(true);
    setError("");
    try {
      const params: AgentFallbacksInput = {
        agent_id: agentId,
        connection_ids: connectionIds as AgentFallbacksInput["connection_ids"],
      };
      setSnapshot(await send({ method: "agent.fallbacks.set", params }));
      setNotice("Fallback model sırası kaydedildi.");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }
  async function toggleSkill(agentId: string, skillId: string) {
    setLoading(true);
    setError("");
    const agent = snapshot?.agents.find((item) => item.id === agentId);
    const assigned = agent?.skill_ids.includes(skillId);
    try {
      const params: SkillAssignInput = { agent_id: agentId, skill_id: skillId };
      setSnapshot(
        await send({
          method: assigned ? "skill.unassign" : "skill.assign",
          params,
        }),
      );
      setNotice(assigned ? "Skill kaldırıldı." : "Skill atandı.");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }
  async function archiveWorkflow(workflowId: string) {
    setLoading(true);
    setError("");
    try {
      setSnapshot(await send({ method: "workflow.archive", params: { workflow_id: workflowId } }));
      setNotice("Workflow sürümü arşivlendi.");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }
  const counts = {
    agents: snapshot?.agents.length ?? 0,
    connections: snapshot?.connections.length ?? 0,
    workspaces: snapshot?.workspaces.length ?? 0,
    skills: snapshot?.skills?.length ?? 0,
    workflows: snapshot?.workflows.filter((workflow) => !workflow.archived).length ?? 0,
  };
  const primary = (label: string, target: Modal, disabled = false) => (
    <button
      className="button primary"
      disabled={!connected || disabled || loading}
      onClick={() => openModal(target)}
    >
      <Plus size={16} />
      {label}
    </button>
  );
  const connectionList = (
    <div className="list">
      {snapshot?.connections.map((connection) => (
        <div className="list-row connection-row" key={connection.id}>
          <div className="small-icon">
            <Cpu size={19} />
          </div>
          <div className="row-copy">
            <strong>{connection.name}</strong>
            <span>
              {providers[connection.provider]} · {connection.model_id}
            </span>
          </div>
          {["anthropic", "gemini", "openai"].includes(connection.provider) ? (
            <VaultControl connectionId={connection.id} />
          ) : (
            <span className="badge neutral">
              {["ollama", "lmstudio"].includes(connection.provider)
                ? "Yerel bağlantı"
                : "Adaptör bekleniyor"}
            </span>
          )}
          {(["openai", "lmstudio"] as string[]).includes(connection.provider) && (
            <ConnectionModelProbe connection={connection} />
          )}
          <label className="tool-capability">
            Araç çağırma
            <select value={connection.supports_tools} disabled={loading}
              onChange={(event) => void setConnectionTools(
                connection.id, event.target.value as ConnectionInput["supports_tools"])}>
              <option value="unknown">Otomatik dene</option>
              <option value="true">Native destekli</option>
              <option value="false">Fenced JSON</option>
            </select>
          </label>
        </div>
      ))}
    </div>
  );
  const agentList = (
    <div className="agent-grid">
      {snapshot?.agents.map((agent, index) => (
        <article className="agent-card" key={agent.id}>
          <div className={`agent-avatar tone-${index % 3}`}>
            <Bot size={24} />
          </div>
          <span className="badge neutral">Hazırlık</span>
          <h3>{agent.name}</h3>
          <p>{agent.role}</p>
          <div className="agent-model">
            <Cpu size={14} />
            {
              snapshot.connections.find((c) => c.id === agent.connection_id)
                ?.model_id
            }
          </div>
          <div className="fallback-editor">
            <strong>Model fallback sırası</strong>
            {agent.fallback_connection_ids.map((connectionId, fallbackIndex) => {
              const connection = snapshot.connections.find((item) => item.id === connectionId);
              return (
                <div className="fallback-row" key={connectionId}>
                  <span>{fallbackIndex + 1}. {connection?.name ?? connectionId}</span>
                  <div>
                    <button type="button" className="icon-button" disabled={loading || fallbackIndex === 0}
                      aria-label="Yukarı taşı" onClick={() => {
                        const next = [...agent.fallback_connection_ids];
                        [next[fallbackIndex - 1], next[fallbackIndex]] =
                          [next[fallbackIndex], next[fallbackIndex - 1]];
                        void setFallbacks(agent.id, next);
                      }}><ArrowUp size={13} /></button>
                    <button type="button" className="icon-button"
                      disabled={loading || fallbackIndex === agent.fallback_connection_ids.length - 1}
                      aria-label="Aşağı taşı" onClick={() => {
                        const next = [...agent.fallback_connection_ids];
                        [next[fallbackIndex], next[fallbackIndex + 1]] =
                          [next[fallbackIndex + 1], next[fallbackIndex]];
                        void setFallbacks(agent.id, next);
                      }}><ArrowDown size={13} /></button>
                    <button type="button" className="icon-button" disabled={loading}
                      aria-label="Fallback kaldır" onClick={() => void setFallbacks(
                        agent.id, agent.fallback_connection_ids.filter((id) => id !== connectionId),
                      )}><X size={13} /></button>
                  </div>
                </div>
              );
            })}
            {agent.fallback_connection_ids.length < 3 && (
              <select aria-label="Fallback model ekle" value="" disabled={loading}
                onChange={(event) => {
                  if (event.target.value) void setFallbacks(
                    agent.id, [...agent.fallback_connection_ids, event.target.value],
                  );
                }}>
                <option value="">Fallback ekle…</option>
                {snapshot.connections.filter((connection) =>
                  ["ollama", "lmstudio", "anthropic", "gemini", "openai"].includes(connection.provider) &&
                  connection.id !== agent.connection_id &&
                  !(agent.fallback_connection_ids as string[]).includes(connection.id),
                ).map((connection) => (
                  <option key={connection.id} value={connection.id}>
                    {connection.name} · {connection.model_id}
                  </option>
                ))}
              </select>
            )}
            <small>Aynı sağlayıcıda ucuz → güçlü model sırası kullanabilirsiniz.</small>
          </div>
          <footer>
            {(["workspace.read", "workspace.write", "terminal.execute"] as Permission[]).map(
              (permission) => (
                <button className="permission-button" disabled={loading} key={permission}
                  onClick={() => void togglePermission(agent.id, permission)}>
                  <ShieldCheck size={14} />
                  {permission === "workspace.read" ? "Okuma" : permission === "workspace.write" ? "Yazma" : "Terminal"}
                  {agent.permissions.includes(permission) ? " açık" : " kapalı"}
                </button>
              ),
            )}
            {(snapshot?.skills ?? []).map((skill) => (
              <button className="permission-button" disabled={loading} key={`skill-${skill.id}`}
                aria-pressed={agent.skill_ids.includes(skill.id)}
                onClick={() => void toggleSkill(agent.id, skill.id)}>
                <Package size={14} />
                {skill.name}
                {agent.skill_ids.includes(skill.id) ? " ✓" : ""}
              </button>
            ))}
          </footer>
        </article>
      ))}
    </div>
  );
  const workspaceList = (
    <div className="list">
      {snapshot?.workspaces.map((workspace) => (
        <div className="list-row" key={workspace.id}>
          <div className="small-icon">
            <Folder size={19} />
          </div>
          <div className="row-copy">
            <strong>{workspace.name}</strong>
            <span className="mono">{workspace.path}</span>
          </div>
          <span className="badge neutral">Kayıtlı</span>
        </div>
      ))}
    </div>
  );
  function empty(
    title: string,
    description: string,
    icon: "agent" | "folder" | "model" = "agent",
  ) {
    const Icon = icon === "agent" ? Bot : icon === "folder" ? Folder : Cpu;
    return (
      <div className="empty">
        <div className="empty-icon">
          <Icon size={28} strokeWidth={1.4} />
        </div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    );
  }
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a
          className="brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setPage("overview");
          }}
        >
          <span className="brand-mark">
            <GitBranch size={21} />
          </span>
          ZeroCost<span className="brand-dot">.</span>
        </a>
        <div className="workspace-switch">
          <span className="workspace-monogram">Z</span>
          <div>
            <strong>Kişisel ortam</strong>
            <span>Yerel çalışma alanı</span>
          </div>
          <span className="key-hint">⌘</span>
        </div>
        <div className="nav-label">KONTROL MERKEZİ</div>
        <nav>
          {navigation.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${page === item.id ? "active" : ""}`}
              onClick={() => setPage(item.id)}
            >
              <item.icon size={18} />
              {item.label}
              {item.id === "agents" && (
                <span className="nav-count">{counts.agents}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="local-note">
            <ShieldCheck size={18} />
            <strong>Önce yerel.</strong>
            <p>Yapılandırmalarınız bu cihazda saklanır.</p>
          </div>
          <button className="profile" onClick={() => setPage("system")}>
            <div className="profile-avatar">Z</div>
            <div>
              <strong>ZeroCost Desktop</strong>
              <span>v0.1.0 · Geliştirme</span>
            </div>
            <Settings2 size={16} />
          </button>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div>
            Kontrol merkezi
            <ChevronRight size={14} />
            <strong>
              {navigation.find((item) => item.id === page)?.label}
            </strong>
          </div>
          <div className="topbar-right">
            <span className={`status-dot ${connected ? "online" : ""}`} />
            {connected
              ? "Yerel çekirdek bağlı"
              : desktopAvailable
                ? "Bağlantı bekleniyor"
                : "Tarayıcı önizlemesi"}
            <span className="top-divider" />
            <button
              className="icon-button"
              aria-label="Durumu yenile"
              disabled={!desktopAvailable || loading}
              onClick={refresh}
            >
              <RefreshCw size={17} className={loading ? "spin" : ""} />
            </button>
          </div>
        </header>
        <main>
          {!desktopAvailable && (
            <div className="banner">
              <Unplug size={18} />
              <span>
                Arayüz önizlemesi. Yerel kayıt işlemleri için{" "}
                <code>npm run desktop</code> ile açın.
              </span>
            </div>
          )}
          {error && !modal && (
            <div className="banner error" role="alert">
              {error}
              <button onClick={refresh} disabled={loading}>
                Yeniden dene
              </button>
            </div>
          )}
          {notice && (
            <div className="banner success" role="status">
              <Check size={17} />
              {notice}
              <button
                aria-label="Bildirimi kapat"
                onClick={() => setNotice("")}
              >
                <X size={15} />
              </button>
            </div>
          )}
          <div hidden={page !== "chat"}>
            <Chat snapshot={snapshot} onSnapshot={setSnapshot} />
          </div>
          <div hidden={page !== "orchestration"}>
            <Orchestration snapshot={snapshot} />
          </div>
          {page === "knowledge" && <Knowledge workspaces={snapshot?.workspaces ?? []} />}
          {page === "chat" || page === "orchestration" || page === "knowledge" ? null : page === "skills" ? (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">AJAN YETENEKLERİ</div>
                  <h1>Skill paketleri</h1>
                  <p>
                    Ajanlarınıza atanabilir yetenek ve talimat paketleri tanımlayın.
                  </p>
                </div>
                {primary("Skill ekle", "skill")}
              </div>
              <section className="panel">
                {counts.skills ? (
                  <div className="agent-grid">
                    {snapshot?.skills?.map((skill) => (
                      <article className="agent-card" key={skill.id}>
                        <div className="agent-avatar tone-1">
                          <Package size={24} />
                        </div>
                        <span className="badge positive">v{skill.version}</span>
                        <h3>{skill.name}</h3>
                        <p>{skill.description}</p>
                        {skill.required_tools.length > 0 && (
                          <div className="agent-model">
                            <Cpu size={14} />
                            Araçlar: {skill.required_tools.join(", ")}
                          </div>
                        )}
                        {skill.required_permissions.length > 0 && (
                          <div className="agent-model">
                            <ShieldCheck size={14} />
                            İzinler: {skill.required_permissions.join(", ")}
                          </div>
                        )}
                        {skill.provider_hint && (
                          <div className="agent-model">
                            <GitBranch size={14} />
                            Önerilen: {skill.provider_hint}
                          </div>
                        )}
                        <footer>
                          <span className="badge neutral">
                            {snapshot?.agents.filter((a) => a.skill_ids.includes(skill.id)).length ?? 0} ajan
                          </span>
                        </footer>
                      </article>
                    ))}
                  </div>
                ) : (
                  empty(
                    "Henüz skill tanımlanmadı",
                    "Ajanlarınıza atanabilir yetenek paketleri oluşturun.",
                  )
                )}
              </section>
            </>
          ) : page === "workflows" ? (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">SABİT TOPOLOJİ · SÜRÜMLÜ TARİF</div>
                  <h1>Workflow tarifleri</h1>
                  <p>Tekrarlanan ajan görevlerini güvenli ve denetlenebilir tarifler olarak saklayın.</p>
                </div>
                {primary("Workflow ekle", "workflow")}
              </div>
              <section className="panel">
                {snapshot?.workflows.length ? (
                  <div className="agent-grid">
                    {snapshot.workflows.map((workflow) => (
                      <article className="agent-card" key={workflow.id}>
                        <div className="agent-avatar tone-2"><WorkflowIcon size={24} /></div>
                        <span className={`badge ${workflow.archived ? "neutral" : "positive"}`}>
                          v{workflow.version} · {workflow.archived ? "Arşiv" : "Etkin"}
                        </span>
                        <h3>{workflow.name}</h3>
                        <p>{workflow.description}</p>
                        <div className="agent-model"><Users size={14} />
                          {workflow.agent_slots.map((slot) => slot.name).join(" → ")}
                        </div>
                        {workflow.required_tools.length > 0 && (
                          <div className="agent-model"><Cpu size={14} />
                            Araçlar: {workflow.required_tools.join(", ")}
                          </div>
                        )}
                        <div className="agent-model"><Activity size={14} />
                          {workflow.rounds} tur · {workflow.max_model_calls} çağrı · ${
                            (workflow.max_cost_microusd / 1_000_000).toFixed(2)} üst sınır
                        </div>
                        <footer>
                          {!workflow.archived && (
                            <button className="permission-button" disabled={loading}
                              onClick={() => void archiveWorkflow(workflow.id)}>
                              Arşivle
                            </button>
                          )}
                        </footer>
                      </article>
                    ))}
                  </div>
                ) : empty("Henüz workflow yok", "İlk sabit topolojili ajan tarifinizi oluşturun.")}
              </section>
            </>
          ) : page === "overview" ? (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">YEREL YAPAY ZEKA ORKESTRASYONU</div>
                  <h1>Birlikte çalışan zekâ.</h1>
                  <p>
                    Modellerinizi bağlayın, ajanlarınızı tanımlayın, çalışma
                    alanınızı kurun.
                  </p>
                </div>
                {primary("Bağlantı ekle", "connection")}
              </div>
              <div className="stats-grid">
                {[
                  {
                    label: "Tanımlı ajan",
                    value: counts.agents,
                    icon: Bot,
                    note: "Roller ve talimatlar",
                  },
                  {
                    label: "Model bağlantısı",
                    value: counts.connections,
                    icon: GitBranch,
                    note: "Yerel ve bulut profilleri",
                  },
                  {
                    label: "Çalışma alanı",
                    value: counts.workspaces,
                    icon: Folder,
                    note: "Bu cihazdaki klasörler",
                  },
                  {
                    label: "Veri katmanı",
                    value: connected ? "Hazır" : "—",
                    icon: Database,
                    note: connected
                      ? `SQLite · Şema v${snapshot.database_version}`
                      : "Masaüstü bağlantısı gerekli",
                  },
                ].map((stat) => (
                  <div className="stat-card" key={stat.label}>
                    <div className="stat-top">
                      {stat.label}
                      <stat.icon size={18} />
                    </div>
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-note">{stat.note}</div>
                  </div>
                ))}
              </div>
              <div className="overview-grid">
                <section className="panel getting-started">
                  <div className="panel-heading">
                    <div>
                      <span className="eyebrow">İLK ADIMLAR</span>
                      <h2>Çalışma ortamınızı hazırlayın</h2>
                    </div>
                    <span className="step-count">
                      {Number(counts.connections > 0) +
                        Number(counts.agents > 0) +
                        Number(counts.workspaces > 0)}{" "}
                      / 3
                    </span>
                  </div>
                  <p className="panel-intro">
                    Her ajan bir rol, bir model bağlantısı ve açıkça tanımlanmış
                    yetkilerle başlar.
                  </p>
                  {[
                    {
                      number: "01",
                      title: "Bir model bağlantısı tanımlayın",
                      description:
                        "Ollama, LM Studio veya bulut sağlayıcı profili.",
                      done: counts.connections > 0,
                      modal: "connection" as Modal,
                    },
                    {
                      number: "02",
                      title: "İlk ajanınıza bir rol verin",
                      description:
                        "Modeli seçin; rolünü ve çalışma talimatlarını yazın.",
                      done: counts.agents > 0,
                      modal: "agent" as Modal,
                    },
                    {
                      number: "03",
                      title: "Çalışma klasörünüzü ekleyin",
                      description:
                        "Projeyi mevcut bir yerel klasörle ilişkilendirin.",
                      done: counts.workspaces > 0,
                      modal: "workspace" as Modal,
                    },
                  ].map((step) => (
                    <button
                      className="setup-step"
                      key={step.number}
                      disabled={
                        !connected ||
                        loading ||
                        (step.modal === "agent" && !counts.connections)
                      }
                      onClick={() => openModal(step.modal)}
                    >
                      <span
                        className={`step-number ${step.done ? "done" : ""}`}
                      >
                        {step.done ? <Check size={17} /> : step.number}
                      </span>
                      <span>
                        <strong>{step.title}</strong>
                        <small>{step.description}</small>
                      </span>
                      <ArrowRight size={17} />
                    </button>
                  ))}
                </section>
                <section className="foundation-panel">
                  <div className="foundation-icon">
                    <Sparkles size={24} />
                  </div>
                  <span className="eyebrow">FAZ 1 · TEMEL İSKELET</span>
                  <h2>
                    Kontrol sizde.
                    <br />
                    Veriler cihazınızda.
                  </h2>
                  <p>
                    Masaüstü arayüzü, Python çekirdeği ve yerel veritabanı tek
                    bir iletişim sözleşmesiyle bağlı.
                  </p>
                  <div className="foundation-tags">
                    <span>TAURI 2</span>
                    <span>PYTHON</span>
                    <span>SQLITE</span>
                  </div>
                  <button onClick={() => setPage("system")}>
                    Çekirdek durumunu incele <ArrowRight size={16} />
                  </button>
                </section>
              </div>
              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <h2>Ajan ekibiniz</h2>
                    <p>Her görev için doğru rol, her rol için doğru model.</p>
                  </div>
                  <button
                    className="text-button"
                    onClick={() => setPage("agents")}
                  >
                    Tüm ajanlar <ArrowRight size={15} />
                  </button>
                </div>
                {counts.agents
                  ? agentList
                  : empty(
                      "Ekibiniz burada şekillenecek",
                      "Bir model bağlantısı ekleyerek ilk ajanınızı tanımlayın.",
                    )}
              </section>
              <div className="development-note">
                <CircleHelp size={16} />
                <span>
                  LangGraph ajan masası; onaylı workspace okuma, atomik yazma
                  ve sınırlandırılmış terminal araçları hazır.
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">ÇALIŞMA ORTAMI</div>
                  <h1>{navigation.find((item) => item.id === page)?.label}</h1>
                  <p>
                    {page === "agents"
                      ? "Rolleri model hesaplarından bağımsız yönetin."
                      : page === "connections"
                        ? "Aynı sağlayıcı için birden fazla bağlantı profili tanımlayın."
                        : page === "workspaces"
                          ? "Projelerinizi bu cihazdaki mevcut klasörlerle ilişkilendirin."
                          : page === "system"
                            ? "Masaüstü uygulamasının gerçek bağlantı ve geliştirme durumu."
                            : ""}
                  </p>
                </div>
                {page === "agents"
                  ? primary("Ajan ekle", "agent", !counts.connections)
                  : page === "connections"
                    ? primary("Bağlantı ekle", "connection")
                    : page === "workspaces"
                      ? primary("Çalışma alanı ekle", "workspace")
                      : null}
              </div>
              {page === "agents" && (
                <section className="panel">
                  {counts.agents
                    ? agentList
                    : empty(
                        "Henüz ajan tanımlanmadı",
                        "Önce bir model bağlantısı oluşturun, ardından ajanınızı ekleyin.",
                      )}
                </section>
              )}
              {page === "connections" && (
                <>
                  <div className="banner">
                    <CircleHelp size={18} />
                    <span>
                      Claude, Gemini ve OpenAI anahtarlarını bağlantı bazında
                      OS kasasına kaydedin. Ardından bu bağlantıyla bir ajan
                      oluşturup Sohbet ekranından kullanın.
                    </span>
                  </div>
                  <section className="panel">
                    {counts.connections
                      ? connectionList
                      : empty(
                          "İlk model bağlantınızı ekleyin",
                          "Yerel veya bulut modeliniz için bir profil oluşturun.",
                          "model",
                        )}
                  </section>
                </>
              )}
              {page === "workspaces" && (
                <section className="panel">
                  {counts.workspaces
                    ? workspaceList
                    : empty(
                        "Projenize bir yer açın",
                        "Mevcut bir klasörü kaydedin. Bu işlem dosya erişim izni vermez.",
                        "folder",
                      )}
                </section>
              )}
              {page === "system" && (
                <section className="panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Çekirdek bileşenleri</h2>
                      <p>Faz 1 ilerleme durumu</p>
                    </div>
                    <Activity size={20} />
                  </div>
                  {[
                    {
                      title: "Masaüstü kabuğu",
                      note: "Tauri 2 · React · TypeScript",
                      ready: desktopAvailable,
                    },
                    {
                      title: "Python sidecar",
                      note: "Sürümlü JSON iletişimi · 10 saniye zaman aşımı",
                      ready: connected,
                    },
                    {
                      title: "SQLite veritabanı",
                      note: "Bağlantılar · Ajanlar · Çalışma alanları",
                      ready: connected,
                    },
                    {
                      title: "Şema sözleşmesi",
                      note: "Pydantic → TypeScript + JSON yanıt doğrulama",
                      ready: true,
                    },
                    {
                      title: "Bulut API ve anahtar kasası",
                      note: "Claude · Gemini · OS anahtar kasası",
                      ready: true,
                    },
                    {
                      title: "Çoklu ajan orkestrasyonu ve OS araçları",
                      note: "LangGraph · Salt okunur workspace sınırı",
                      ready: true,
                    },
                  ].map((item) => (
                    <div className="list-row" key={item.title}>
                      <div
                        className={`small-icon ${item.ready ? "ready" : ""}`}
                      >
                        {item.ready ? <Check size={18} /> : <Cpu size={18} />}
                      </div>
                      <div className="row-copy">
                        <strong>{item.title}</strong>
                        <span>{item.note}</span>
                      </div>
                      <span
                        className={`badge ${item.ready ? "positive" : "neutral"}`}
                      >
                        {item.ready ? "Hazır" : "Bekliyor"}
                      </span>
                    </div>
                  ))}
                </section>
              )}
            </>
          )}
          <footer className="page-footer">
            <span>
              ZeroCost <span className="subtle">/</span> Yerel yapay zekâ
              çalışma ortamı
            </span>
            <span>
              <span className="status-dot online" /> Yapılandırma verileri yerel
            </span>
          </footer>
        </main>
      </div>
      {modal && (
        <div className="modal-backdrop">
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onKeyDown={(e) => {
              if (e.key !== "Tab") return;
              const items = Array.from(
                e.currentTarget.querySelectorAll<HTMLElement>(
                  "button:not(:disabled), input, select, textarea",
                ),
              );
              const first = items[0],
                last = items[items.length - 1];
              if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last?.focus();
              } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first?.focus();
              }
            }}
          >
            <div className="modal-heading">
              <h2 id="modal-title">
                {modal === "connection"
                  ? "Model bağlantısı ekle"
                  : modal === "agent"
                    ? "Ajan tanımla"
                    : modal === "skill"
                      ? "Skill paketi oluştur"
                      : modal === "workflow"
                        ? "Workflow tarifi oluştur"
                        : "Çalışma alanı ekle"}
              </h2>
              <button
                className="icon-button"
                disabled={loading}
                onClick={() => setModal(null)}
                aria-label="Kapat"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={save}>
              <label>
                Ad
                <input
                  autoFocus
                  name="name"
                  required
                  maxLength={100}
                  placeholder={
                    modal === "agent"
                      ? "Örn. Kod incelemeci"
                      : modal === "connection"
                        ? "Örn. Yerel Qwen"
                        : modal === "skill"
                          ? "Örn. Code Review"
                          : modal === "workflow"
                            ? "Örn. Güvenli kod inceleme"
                            : "Örn. Ana projem"
                  }
                />
              </label>
              {modal === "connection" && (
                <>
                  <label>
                    Sağlayıcı
                    <select name="provider" value={connectionProvider}
                      onChange={(event) => setConnectionProvider(
                        event.target.value as ConnectionInput["provider"])}>
                      {Object.entries(providers).map(([id, name]) => (
                        <option value={id} key={id}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </label>
                  {connectionProvider === "lmstudio" && <label>
                    Yerel endpoint
                    <input name="base_url" type="url" maxLength={500}
                      defaultValue="http://127.0.0.1:1234/v1"
                      placeholder="http://127.0.0.1:1234/v1" />
                    <small>Yalnız localhost, 127.0.0.1 veya ::1 üzerindeki HTTP /v1 adresleri kabul edilir.</small>
                  </label>}
                  {connectionProvider === "openai" && <input type="hidden" name="base_url"
                    value="https://api.openai.com/v1" />}
                  <label>
                    Araç çağırma
                    <select name="supports_tools" defaultValue="unknown">
                      <option value="unknown">Otomatik dene</option>
                      <option value="true">Native destekli</option>
                      <option value="false">Fenced JSON kullan</option>
                    </select>
                    <small>Bilinmiyorsa native format denenir; model metin döndürürse güvenli JSON fallback'i korunur.</small>
                  </label>
                  <label>
                    Model kimliği
                    <input
                      name="model_id"
                      required
                      maxLength={100}
                      placeholder="Örn. qwen3:8b"
                    />
                  </label>
                  <p className="form-note">
                    Profili kaydettikten sonra bağlantı satırından API anahtarı
                    ekleyebilirsiniz. Model alanına sağlayıcınızın model
                    kimliğini yazın.
                  </p>
                </>
              )}
              {modal === "agent" && (
                <>
                  <label>
                    Rol
                    <input
                      name="role"
                      required
                      maxLength={100}
                      placeholder="Örn. Kod kalitesini incele"
                    />
                  </label>
                  <label>
                    Model bağlantısı
                    <select name="connection_id" required>
                      {snapshot?.connections.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} · {c.model_id}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Çalışma talimatları
                    <textarea
                      name="instructions"
                      maxLength={8000}
                      rows={4}
                      placeholder="Ajanın nasıl çalışmasını istediğinizi yazın…"
                    />
                  </label>
                  <p className="form-note">
                    Yeni ajanların dosya veya terminal yetkisi yoktur.
                  </p>
                </>
              )}
              {modal === "skill" && (
                <>
                  <label>
                    Sürüm
                    <input
                      name="version"
                      defaultValue="1.0.0"
                      maxLength={20}
                      placeholder="1.0.0"
                      pattern="\d+\.\d+\.\d+"
                    />
                  </label>
                  <label>
                    Açıklama
                    <input
                      name="description"
                      required
                      maxLength={500}
                      placeholder="Bu skill ne yapar?"
                    />
                  </label>
                  <label>
                    Talimatlar
                    <textarea
                      name="instructions"
                      maxLength={8000}
                      rows={4}
                      placeholder="Ajan bu skill etkinken nasıl davranmalı…"
                    />
                  </label>
                  <label>
                    Önerilen sağlayıcı
                    <select name="provider_hint" defaultValue="">
                      <option value="">Fark etmez</option>
                      <option value="ollama">Ollama</option>
                      <option value="lmstudio">LM Studio</option>
                      <option value="anthropic">Anthropic</option>
                      <option value="gemini">Gemini</option>
                      <option value="openai">OpenAI</option>
                    </select>
                  </label>
                  <fieldset>
                    <legend>Gerekli araçlar</legend>
                    {(["workspace.write", "terminal.execute", "knowledge.search"] as const).map(
                      (tool) => (
                        <label className="agent-choice" key={tool}>
                          <input type="checkbox" name="required_tools" value={tool} />
                          <span>{tool}</span>
                        </label>
                      ),
                    )}
                  </fieldset>
                  <fieldset>
                    <legend>Gerekli izinler</legend>
                    {(["workspace.read", "workspace.write", "terminal.execute"] as Permission[]).map(
                      (perm) => (
                        <label className="agent-choice" key={perm}>
                          <input type="checkbox" name="required_permissions" value={perm} />
                          <span>{perm}</span>
                        </label>
                      ),
                    )}
                  </fieldset>
                  <p className="form-note">
                    Yazma veya terminal aracı seçerseniz aynı adlı izni de seçin.
                    Gereksinimler görev başlarken yeniden kontrol edilir; talimatlar
                    ajan bağlamına otomatik eklenir.
                  </p>
                </>
              )}
              {modal === "workflow" && (
                <>
                  <label>
                    Sürüm
                    <input name="version" defaultValue="1.0.0" required maxLength={20}
                      pattern="\d+\.\d+\.\d+" />
                  </label>
                  <label>
                    Açıklama
                    <input name="description" required maxLength={500}
                      placeholder="Bu workflow hangi tekrarlanan görevi yürütür?" />
                  </label>
                  <label>
                    Sabit görev öneki
                    <textarea name="objective_prefix" maxLength={4000} rows={3}
                      placeholder="Örn. Değişikliği doğruluk, güvenlik ve test kapsamı açısından incele." />
                    <small>Placeholder işlenmez. Çalıştırma hedefi bu sabit metnin sonuna eklenir.</small>
                  </label>
                  <label>
                    Ajan yuvası sayısı
                    <select value={workflowSlotCount}
                      onChange={(event) => setWorkflowSlotCount(Number(event.target.value))}>
                      {[2, 3, 4].map((count) => <option key={count} value={count}>{count}</option>)}
                    </select>
                  </label>
                  {Array.from({ length: workflowSlotCount }, (_, index) => (
                    <fieldset key={index}>
                      <legend>{index + 1}. ajan yuvası</legend>
                      <label>
                        Yuva adı
                        <input name={`slot_${index}_name`} required maxLength={100}
                          placeholder={index === 0 ? "Birincil incelemeci" : "Karşı görüş"} />
                      </label>
                      {(snapshot?.skills ?? []).map((skill) => (
                        <label className="agent-choice" key={skill.id}>
                          <input type="checkbox" name={`slot_${index}_skills`} value={skill.id} />
                          <span><strong>{skill.name}</strong><small>v{skill.version}</small></span>
                        </label>
                      ))}
                      {snapshot?.skills.length === 0 && <small>Bu yuva için zorunlu skill yok.</small>}
                    </fieldset>
                  ))}
                  <fieldset>
                    <legend>Workflow araçları</legend>
                    {(["workspace.write", "terminal.execute", "knowledge.search"] as const).map((tool) => (
                      <label className="agent-choice" key={tool}>
                        <input type="checkbox" name="required_tools" value={tool}
                          checked={workflowRequiredTools.includes(tool)}
                          onChange={(event) => setWorkflowRequiredTools((current) =>
                            event.target.checked
                              ? [...current, tool]
                              : current.filter((item) => item !== tool))} />
                        <span>{tool}</span>
                      </label>
                    ))}
                  </fieldset>
                  <div className="budget-grid">
                    <label>Tartışma turu
                      <select name="rounds" value={workflowRounds}
                        onChange={(event) => setWorkflowRounds(Number(event.target.value))}>
                        {[1, 2, 3].map((value) => <option key={value} value={value}>{value}</option>)}
                      </select>
                    </label>
                    <label>Model çağrısı bütçesi
                      <input name="max_model_calls" type="number" min={workflowMinimumCalls}
                        max={14} value={workflowMaxCalls}
                        onChange={(event) => setWorkflowMaxCalls(Number(event.target.value))} />
                      <small>Bu tarif için en az {workflowMinimumCalls} çağrı gerekir.</small>
                    </label>
                    <label>Yanıt tokenı / çağrı
                      <select name="max_output_tokens" defaultValue="512">
                        {[256, 512, 1024, 2048, 4096].map((value) =>
                          <option key={value} value={value}>{value}</option>)}
                      </select>
                    </label>
                    <label>Azami maliyet · USD
                      <input name="max_cost_usd" type="number" min={0} max={1000}
                        step={0.01} defaultValue={5} />
                    </label>
                  </div>
                  <p className="form-note">
                    Slot sırası mevcut LangGraph sırasıdır. Workflow izin vermez;
                    ajan, görev kapsamı ve işlem onayları her çalıştırmada yeniden denetlenir.
                  </p>
                </>
              )}
              {modal === "workspace" && (
                <>
                  <label>
                    Mevcut klasörün tam yolu
                    <input
                      name="path"
                      required
                      maxLength={4096}
                      placeholder="/Users/kullanici/Projeler/projem"
                    />
                  </label>
                  <p className="form-note">
                    Klasörün varlığı doğrulanır; içeriği okunmaz veya
                    değiştirilmez.
                  </p>
                </>
              )}
              {error && (
                <div className="form-error" role="alert">
                  {error}
                </div>
              )}
              <div className="modal-actions">
                <button
                  type="button"
                  className="button secondary"
                  disabled={loading}
                  onClick={() => setModal(null)}
                >
                  Vazgeç
                </button>
                <button className="button primary" disabled={loading}>
                  {loading ? (
                    <LoaderCircle className="spin" size={16} />
                  ) : (
                    <Check size={16} />
                  )}
                  Kaydet
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
