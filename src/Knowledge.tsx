import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { listen } from "@tauri-apps/api/event";
import { getCurrentWebview } from "@tauri-apps/api/webview";
import { open } from "@tauri-apps/plugin-dialog";
import {
  BookOpen,
  BrainCircuit,
  Check,
  Database,
  FileText,
  LoaderCircle,
  Plus,
  RefreshCw,
  UploadCloud,
  X,
} from "lucide-react";
import { desktopAvailable, rpc } from "./api";
import validateEvent from "./generated/validate-event.js";
import type {
  KnowledgeIngestionProgress,
  KnowledgeIngestionResult,
  KnowledgeSnapshot,
  Workspace,
} from "./generated/contract";

const emptySnapshot: KnowledgeSnapshot = {
  collections: [],
  embedding_models: [],
  embedding_error: "",
};

const documentExtensions = ["txt", "md", "markdown", "mdown", "mkd"];

function workspaceRelativePath(absolutePath: string, workspacePath: string): string {
  const candidate = absolutePath.replace(/\\/g, "/").replace(/\/$/, "");
  const root = workspacePath.replace(/\\/g, "/").replace(/\/$/, "");
  const windowsPath = /^[A-Za-z]:\//.test(root);
  const comparableCandidate = windowsPath ? candidate.toLocaleLowerCase("en-US") : candidate;
  const comparableRoot = windowsPath ? root.toLocaleLowerCase("en-US") : root;

  if (!comparableCandidate.startsWith(`${comparableRoot}/`)) {
    throw new Error("Seçilen dosya aktif çalışma alanının içinde olmalı.");
  }

  const relativePath = candidate.slice(root.length + 1);
  const parts = relativePath.split("/");
  if (!relativePath || parts.some((part) => !part || part.startsWith("."))) {
    throw new Error("Gizli dosya ve klasörler bilgi kaynağı olarak eklenemez.");
  }

  const extension = relativePath.split(".").pop()?.toLocaleLowerCase("en-US") ?? "";
  if (!documentExtensions.includes(extension)) {
    throw new Error("Yalnızca TXT ve Markdown belgeleri eklenebilir.");
  }
  return relativePath;
}

export function Knowledge({ workspaces }: { workspaces: Workspace[] }) {
  const [snapshot, setSnapshot] = useState<KnowledgeSnapshot>(emptySnapshot);
  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [workspaceId, setWorkspaceId] = useState("");
  const [queuedPaths, setQueuedPaths] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ingesting, setIngesting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [progress, setProgress] = useState<KnowledgeIngestionProgress | null>(null);
  const activeRequest = useRef<string | null>(null);

  const refresh = useCallback(async () => {
    if (!desktopAvailable) return;
    setLoading(true);
    setError("");
    try {
      const result = await rpc({ method: "knowledge.snapshot" });
      if (!("collections" in result)) throw new Error("Bilgi yanıtı geçersiz.");
      const knowledge = result as KnowledgeSnapshot;
      setSnapshot(knowledge);
      setModel((current) => current || knowledge.embedding_models[0]?.name || "");
      setCollectionId((current) =>
        knowledge.collections.some((collection) => collection.id === current)
          ? current
          : knowledge.collections[0]?.id ?? "",
      );
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => void refresh(), [refresh]);
  useEffect(() => {
    setWorkspaceId((current) =>
      workspaces.some((workspace) => workspace.id === current)
        ? current
        : workspaces[0]?.id ?? "",
    );
  }, [workspaces]);
  useEffect(() => setQueuedPaths([]), [workspaceId]);

  useEffect(() => {
    if (!desktopAvailable) return;
    let disposed = false;
    let unlisten: undefined | (() => void);
    listen<unknown>("chat_stream", ({ payload }) => {
      if (disposed) return;
      if (!validateEvent(payload)) {
        setError("İndeksleme olayı beklenen şemaya uymuyor.");
        return;
      }
      if (payload.type !== "knowledge_ingestion_progress") return;
      if (payload.request_id !== activeRequest.current) return;
      setProgress((current) =>
        current && current.request_id === payload.request_id && current.sequence >= payload.sequence
          ? current
          : payload,
      );
    })
      .then((stop) => {
        if (disposed) stop();
        else unlisten = stop;
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : String(reason)));
    return () => {
      disposed = true;
      unlisten?.();
    };
  }, []);

  const queueAbsolutePaths = useCallback((paths: string[]) => {
    const workspace = workspaces.find((item) => item.id === workspaceId);
    if (!workspace) throw new Error("Önce bir çalışma alanı seçin.");
    const relativePaths = paths.map((path) => workspaceRelativePath(path, workspace.path));
    const combined = [...new Set([...queuedPaths, ...relativePaths])];
    if (combined.length > 10) throw new Error("Tek seferde en fazla 10 belge eklenebilir.");
    setQueuedPaths(combined);
  }, [queuedPaths, workspaceId, workspaces]);

  useEffect(() => {
    if (!desktopAvailable) return;
    let disposed = false;
    let unlisten: undefined | (() => void);
    getCurrentWebview().onDragDropEvent((event) => {
      if (disposed || ingesting) return;
      if (event.payload.type === "over") {
        setDragging(true);
      } else if (event.payload.type === "drop") {
        setDragging(false);
        setError("");
        setNotice("");
        try {
          queueAbsolutePaths(event.payload.paths);
        } catch (reason) {
          setError(reason instanceof Error ? reason.message : String(reason));
        }
      } else {
        setDragging(false);
      }
    })
      .then((stop) => {
        if (disposed) stop();
        else unlisten = stop;
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : String(reason)));
    return () => {
      disposed = true;
      unlisten?.();
    };
  }, [ingesting, queueAbsolutePaths]);

  async function browseDocuments() {
    const workspace = workspaces.find((item) => item.id === workspaceId);
    if (!workspace || ingesting) return;
    setError("");
    setNotice("");
    try {
      const selection = await open({
        title: "Bilgi kaynağı seçin",
        defaultPath: workspace.path,
        multiple: true,
        directory: false,
        canCreateDirectories: false,
        filters: [{ name: "Metin ve Markdown", extensions: documentExtensions }],
      });
      if (!selection) return;
      queueAbsolutePaths(Array.isArray(selection) ? selection : [selection]);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    }
  }

  async function ingestSources(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!collectionId || !workspaceId || !queuedPaths.length) return;
    const paths = [...queuedPaths];
    let embedded = 0;
    let reused = 0;
    let unchanged = 0;
    setIngesting(true);
    setError("");
    setNotice("");

    try {
      for (const path of paths) {
        const requestId = crypto.randomUUID();
        activeRequest.current = requestId;
        setProgress(null);
        const result = await rpc({
          method: "knowledge.source.ingest",
          params: { collection_id: collectionId, workspace_id: workspaceId, path },
        }, requestId);
        if (!("status" in result) || !("embedded_count" in result)) {
          throw new Error("İndeksleme yanıtı geçersiz.");
        }
        const ingestion = result as KnowledgeIngestionResult;
        embedded += ingestion.embedded_count;
        reused += ingestion.reused_count;
        unchanged += ingestion.status === "unchanged" ? 1 : 0;
        setQueuedPaths((current) => current.filter((item) => item !== path));
      }
      setNotice(
        `${paths.length} belge işlendi · ${embedded} yeni embedding · ${reused} parça yeniden kullanıldı` +
        (unchanged ? ` · ${unchanged} belge değişmemiş` : ""),
      );
      await refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      activeRequest.current = null;
      setIngesting(false);
    }
  }

  async function createCollection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");
    try {
      const result = await rpc({
        method: "knowledge.collection.create",
        params: { name: name.trim(), embedding_provider: "ollama", embedding_model: model },
      });
      if (!("collections" in result)) throw new Error("Bilgi yanıtı geçersiz.");
      const knowledge = result as KnowledgeSnapshot;
      setSnapshot(knowledge);
      setCollectionId(knowledge.collections[knowledge.collections.length - 1]?.id ?? "");
      setName("");
      setNotice("Koleksiyon ve embedding boyutu yerel veritabanına kaydedildi.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setLoading(false);
    }
  }

  const selectedWorkspace = workspaces.find((workspace) => workspace.id === workspaceId);

  return (
    <div className="knowledge-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">FAZ 3 · YEREL UZUN SÜRELİ HAFIZA</div>
          <h1>Bilgi yönetimi</h1>
          <p>Belgeleri yerel embedding modelleriyle aranabilir koleksiyonlara hazırlayın.</p>
        </div>
        <button className="icon-button knowledge-refresh" aria-label="Bilgi durumunu yenile"
          disabled={loading || ingesting || !desktopAvailable} onClick={() => void refresh()}>
          <RefreshCw size={17} className={loading ? "spin" : ""} />
        </button>
      </div>

      {error && <div className="banner error" role="alert">{error}</div>}
      {notice && <div className="banner success" role="status"><Check size={17} />{notice}</div>}
      {snapshot.embedding_error && (
        <div className="banner"><BrainCircuit size={18} />
          <span>{snapshot.embedding_error} Ollama'yı başlatıp bir embedding modeli yükleyin.</span>
        </div>
      )}

      <section className="knowledge-progress" aria-live="polite">
        <div className="knowledge-progress-copy">
          <span className={`small-icon ${progress?.is_final ? "ready" : ""}`}>
            {progress && !progress.is_final
              ? <LoaderCircle className="spin" size={18} />
              : <Check size={18} />}
          </span>
          <div>
            <strong>{progress?.message ?? "İndeksleme kuyruğu hazır."}</strong>
            <span>{progress
              ? `${progress.path} · %${progress.progress_percent}`
              : "Bir kaynak eklendiğinde aşamalar burada gösterilecek."}</span>
          </div>
        </div>
        <progress max="100" value={progress?.progress_percent ?? 0}
          aria-label="Belge indeksleme ilerlemesi" />
      </section>

      <section className="panel knowledge-source-panel">
        <div className="panel-heading">
          <div><span className="eyebrow">KAYNAK EKLE</span><h2>Belgeleri yerel indekse aktarın</h2></div>
          <UploadCloud size={21} />
        </div>
        <p className="panel-intro">
          TXT ve Markdown dosyaları çalışma alanı sınırları içinde doğrulanır ve en fazla 10'lu kuyruklarla işlenir.
        </p>
        <form onSubmit={ingestSources}>
          <div className="knowledge-source-selectors">
            <label>Çalışma alanı<select value={workspaceId} onChange={(event) => setWorkspaceId(event.target.value)}
              disabled={ingesting || !workspaces.length} required>
              <option value="" disabled>Çalışma alanı seçin</option>
              {workspaces.map((workspace) => (
                <option key={workspace.id} value={workspace.id}>{workspace.name}</option>
              ))}
            </select></label>
            <label>Koleksiyon<select value={collectionId} onChange={(event) => setCollectionId(event.target.value)}
              disabled={ingesting || !snapshot.collections.length} required>
              <option value="" disabled>Koleksiyon seçin</option>
              {snapshot.collections.map((collection) => (
                <option key={collection.id} value={collection.id}>{collection.name}</option>
              ))}
            </select></label>
          </div>

          <button type="button" className={`knowledge-dropzone${dragging ? " dragging" : ""}`}
            disabled={ingesting || !workspaceId || !desktopAvailable} onClick={() => void browseDocuments()}>
            <UploadCloud size={27} />
            <strong>Belgeleri buraya sürükleyin</strong>
            <span>{selectedWorkspace
              ? `${selectedWorkspace.name} içinden dosya seçin`
              : "Önce bir çalışma alanı seçin"}</span>
            <span className="button secondary">Dosya seç</span>
          </button>

          {queuedPaths.length > 0 && <div className="knowledge-file-queue" aria-label="İndeksleme kuyruğu">
            {queuedPaths.map((path) => (
              <div key={path}>
                <FileText size={16} />
                <span title={path}>{path}</span>
                <button type="button" aria-label={`${path} dosyasını kuyruktan çıkar`}
                  disabled={ingesting} onClick={() => setQueuedPaths((current) => current.filter((item) => item !== path))}>
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>}

          <button className="button primary knowledge-ingest-button"
            disabled={ingesting || !queuedPaths.length || !collectionId || !workspaceId || !desktopAvailable}>
            {ingesting ? <LoaderCircle className="spin" size={16} /> : <Database size={16} />}
            {ingesting ? "İndeksleniyor…" : `${queuedPaths.length || ""} Belgeyi indeksle`.trim()}
          </button>
        </form>
      </section>

      <div className="knowledge-grid">
        <section className="panel knowledge-create">
          <div className="panel-heading">
            <div><span className="eyebrow">YENİ KOLEKSİYON</span><h2>Yerel indeks oluşturun</h2></div>
            <BrainCircuit size={21} />
          </div>
          <p className="panel-intro">Model ve vektör boyutu koleksiyon boyunca sabit tutulur.</p>
          <form onSubmit={createCollection}>
            <label>Koleksiyon adı<input value={name} onChange={(event) => setName(event.target.value)}
              maxLength={80} required placeholder="Örn. Proje belgeleri" /></label>
            <label>Embedding modeli<select value={model} onChange={(event) => setModel(event.target.value)} required>
              <option value="" disabled>Model seçin</option>
              {snapshot.embedding_models.map((item) => (
                <option key={item.name} value={item.name}>{item.name}</option>
              ))}
            </select></label>
            <button className="button primary" disabled={loading || ingesting || !model || !desktopAvailable}>
              {loading ? <LoaderCircle className="spin" size={16} /> : <Plus size={16} />}Koleksiyon oluştur
            </button>
          </form>
        </section>

        <section className="panel knowledge-list">
          <div className="panel-heading">
            <div><span className="eyebrow">YEREL KÜTÜPHANE</span><h2>Koleksiyonlar</h2></div>
            <span className="badge neutral">{snapshot.collections.length} koleksiyon</span>
          </div>
          {snapshot.collections.length ? snapshot.collections.map((collection) => (
            <article className="knowledge-card" key={collection.id}>
              <div className="small-icon ready"><BookOpen size={18} /></div>
              <div><strong>{collection.name}</strong><span>{collection.embedding_model} · {collection.dimensions} boyut</span></div>
              <div className="knowledge-counts"><strong>{collection.source_count}</strong><span>belge</span></div>
              <div className="knowledge-counts"><strong>{collection.chunk_count}</strong><span>parça</span></div>
            </article>
          )) : (
            <div className="empty knowledge-empty"><Database size={28} /><h3>Henüz koleksiyon yok</h3>
              <p>İlk yerel bilgi indeksiniz için soldaki formu kullanın.</p></div>
          )}
        </section>
      </div>

      <div className="development-note"><Database size={16} /><span>
        Kaynaklar yalnızca kayıtlı çalışma alanlarından okunur; ayrıştırma, embedding ve indeksleme cihazınızda kalır.
      </span></div>
    </div>
  );
}
