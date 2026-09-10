import { useCallback, useEffect, useState, type FormEvent } from "react";
import { listen } from "@tauri-apps/api/event";
import { BookOpen, BrainCircuit, Check, Database, LoaderCircle, Plus, RefreshCw } from "lucide-react";
import { desktopAvailable, rpc } from "./api";
import validateEvent from "./generated/validate-event.js";
import type { KnowledgeIngestionProgress, KnowledgeSnapshot } from "./generated/contract";

const emptySnapshot: KnowledgeSnapshot = {
  collections: [],
  embedding_models: [],
  embedding_error: "",
};

export function Knowledge() {
  const [snapshot, setSnapshot] = useState<KnowledgeSnapshot>(emptySnapshot);
  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [progress, setProgress] = useState<KnowledgeIngestionProgress | null>(null);

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
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => void refresh(), [refresh]);
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
      setSnapshot(result as KnowledgeSnapshot);
      setName("");
      setNotice("Koleksiyon ve embedding boyutu yerel veritabanına kaydedildi.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="knowledge-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">FAZ 3 · YEREL UZUN SÜRELİ HAFIZA</div>
          <h1>Bilgi yönetimi</h1>
          <p>Belgeleri yerel embedding modelleriyle aranabilir koleksiyonlara hazırlayın.</p>
        </div>
        <button className="icon-button knowledge-refresh" aria-label="Bilgi durumunu yenile"
          disabled={loading || !desktopAvailable} onClick={() => void refresh()}>
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
            <button className="button primary" disabled={loading || !model || !desktopAvailable}>
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
        SQLite FTS5 ve taşınabilir float32 vektör depolama hazır. Belge ekleme hattı sonraki dilimde açılacak.
      </span></div>
    </div>
  );
}
