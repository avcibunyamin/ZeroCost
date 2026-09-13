import { useEffect, useState, type FormEvent } from "react";
import {
  Activity,
  MessageSquare,
  ArrowRight,
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
  SkillPackageInput,
  SkillAssignInput,
} from "./generated/contract";
import "./App.css";
import { Chat } from "./Chat";
import { VaultControl } from "./VaultControl";
import { Orchestration } from "./Orchestration";
import { Knowledge } from "./Knowledge";

type Page =
  | "chat"
  | "orchestration"
  | "knowledge"
  | "overview"
  | "agents"
  | "skills"
  | "connections"
  | "workspaces"
  | "system";
type Modal = "connection" | "agent" | "workspace" | "skill" | null;
const navigation = [
  { id: "overview", label: "Genel bakış", icon: LayoutDashboard },
  { id: "chat", label: "Sohbet", icon: MessageSquare },
  { id: "orchestration", label: "Ajan masası", icon: Users },
  { id: "knowledge", label: "Bilgi yönetimi", icon: BookOpen },
  { id: "agents", label: "Ajanlar", icon: Bot },
  { id: "skills", label: "Skill paketleri", icon: Package },
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

export default function App() {
  const [page, setPage] = useState<Page>("overview");
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [modal, setModal] = useState<Modal>(null);
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
  const counts = {
    agents: snapshot?.agents.length ?? 0,
    connections: snapshot?.connections.length ?? 0,
    workspaces: snapshot?.workspaces.length ?? 0,
    skills: snapshot?.skills?.length ?? 0,
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
          {["anthropic", "gemini"].includes(connection.provider) ? (
            <VaultControl connectionId={connection.id} />
          ) : (
            <span className="badge neutral">
              {connection.provider === "ollama"
                ? "Yerel bağlantı"
                : "Adaptör bekleniyor"}
            </span>
          )}
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
          ) : page ===
            "overview" ? (
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
                      Claude ve Gemini anahtarlarını bağlantı bazında OS
                      kasasına kaydedin. Ardından bu bağlantıyla bir ajan
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
                          : "Örn. Ana projem"
                  }
                />
              </label>
              {modal === "connection" && (
                <>
                  <label>
                    Sağlayıcı
                    <select name="provider">
                      {Object.entries(providers).map(([id, name]) => (
                        <option value={id} key={id}>
                          {name}
                        </option>
                      ))}
                    </select>
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
