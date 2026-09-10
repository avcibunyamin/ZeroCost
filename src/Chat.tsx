import { useEffect, useRef, useState, type FormEvent } from "react";
import { listen } from "@tauri-apps/api/event";
import {
  Bot,
  Cpu,
  Send,
  Square,
  RefreshCw,
  MessageSquare,
  LoaderCircle,
} from "lucide-react";
import { desktopAvailable, rpc, send } from "./api";
import validateEvent from "./generated/validate-event.js";
import type { ChatTurn, OllamaModel, Snapshot } from "./generated/contract";

export function Chat({
  snapshot,
  onSnapshot,
}: {
  snapshot: Snapshot | null;
  onSnapshot: (snapshot: Snapshot) => void;
}) {
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [model, setModel] = useState("");
  const [agentId, setAgentId] = useState("");
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [draft, setDraft] = useState("");
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState("");
  const [stopping, setStopping] = useState(false);
  const run = useRef<string | null>(null);
  const sequence = useRef(0);
  const scrollEnd = useRef<HTMLDivElement>(null);
  const installed = new Set(models.map((item) => item.name));
  const agents =
    snapshot?.agents.filter((agent) => {
      const connection = snapshot.connections.find(
        (item) => item.id === agent.connection_id,
      );
      return (
        connection &&
        (["anthropic", "gemini"].includes(connection.provider) ||
          (connection.provider === "ollama" &&
            installed.has(connection.model_id)))
      );
    }) ?? [];

  async function discover() {
    setLoading(true);
    setError("");
    try {
      const result = await rpc({ method: "ollama.models" });
      if (!("models" in result)) throw new Error("Model listesi alınamadı.");
      setModels(result.models);
      setModel((current) =>
        result.models.some((m) => m.name === current)
          ? current
          : (result.models[0]?.name ?? ""),
      );
    } catch (e) {
      setModels([]);
      setError(String(e instanceof Error ? e.message : e));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (desktopAvailable) void discover();
  }, []);
  useEffect(() => {
    if (agents.length && !agents.some((agent) => agent.id === agentId)) {
      setAgentId(agents[0].id);
    }
  }, [agentId, snapshot, models]);
  useEffect(() => {
    if (!agentId) return;
    let current = true;
    setHistoryLoading(true);
    setTurns([]);
    rpc({ method: "chat.history", params: { agent_id: agentId } })
      .then((result) => {
        if (current && "turns" in result) {
          setTurns(result.turns);
          const pending = result.turns.find((t) => t.status === "running");
          if (pending) {
            run.current = pending.run_id;
            sequence.current = 0;
            setActive(true);
          }
        }
      })
      .catch((e) => {
        if (current) setError(String(e));
      })
      .finally(() => {
        if (current) setHistoryLoading(false);
      });
    return () => {
      current = false;
    };
  }, [agentId]);
  useEffect(() => {
    if (!desktopAvailable) return;
    let disposed = false;
    let unlisten: undefined | (() => void);
    listen<unknown>("chat_stream", ({ payload }) => {
      if (disposed) return;
      if (!validateEvent(payload)) {
        setError("Akış olayı şemaya uymuyor.");
        return;
      }
      if (payload.type === "transport_error") {
        setError(payload.message);
        setTurns((previous) =>
          previous.map((t) =>
            t.run_id === run.current
              ? { ...t, status: "interrupted", error: payload.message }
              : t,
          ),
        );
        run.current = null;
        setActive(false);
        setStopping(false);
        return;
      }
      if (payload.type === "knowledge_ingestion_progress") return;
      if (
        payload.run_id !== run.current ||
        payload.sequence <= sequence.current
      )
        return;
      sequence.current = payload.sequence;
      setTurns((previous) =>
        previous.map((t) =>
          t.run_id !== payload.run_id
            ? t
            : payload.type === "stream_chunk"
              ? { ...t, content: t.content + payload.token }
              : {
                  ...t,
                  content: payload.full_content,
                  status:
                    payload.type === "stream_end" ? payload.status : "failed",
                  error: payload.type === "stream_error" ? payload.message : "",
                },
        ),
      );
      if (payload.is_final) {
        run.current = null;
        setActive(false);
        setStopping(false);
      }
    })
      .then((stop) => {
        if (disposed) stop();
        else {
          unlisten = stop;
          setReady(true);
        }
      })
      .catch((e) => setError(String(e)));
    return () => {
      disposed = true;
      unlisten?.();
    };
  }, []);
  useEffect(() => {
    scrollEnd.current?.scrollIntoView({ block: "nearest" });
  }, [turns]);

  async function createAgent() {
    if (!model || !snapshot) return;
    setLoading(true);
    setError("");
    try {
      let current = snapshot;
      let connection = current.connections.find(
        (c) => c.provider === "ollama" && c.model_id === model,
      );
      if (!connection) {
        current = await send({
          method: "connection.create",
          params: {
            name: `Ollama · ${model}`.slice(0, 100),
            provider: "ollama",
            model_id: model,
          },
        });
        onSnapshot(current);
        connection = current.connections.find(
          (c) => c.provider === "ollama" && c.model_id === model,
        );
      }
      if (!connection) throw new Error("Model bağlantısı oluşturulamadı.");
      let agent = current.agents.find((a) => a.connection_id === connection.id);
      if (!agent) {
        current = await send({
          method: "agent.create",
          params: {
            name: `Yerel sohbet · ${model}`.slice(0, 100),
            role: "Yardımcı",
            instructions: "Kullanıcının dilinde, açık ve kısa yanıt ver.",
            connection_id: connection.id,
          },
        });
        onSnapshot(current);
        agent = current.agents.find((a) => a.connection_id === connection.id);
      }
      if (agent) setAgentId(agent.id);
    } catch (e) {
      setError(String(e instanceof Error ? e.message : e));
    } finally {
      setLoading(false);
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft.trim() || !agentId || active || !ready) return;
    const id = crypto.randomUUID();
    const prompt = draft.trim();
    run.current = id;
    sequence.current = 0;
    setActive(true);
    setError("");
    setDraft("");
    setTurns((previous) => [
      ...previous,
      {
        run_id: id,
        agent_id: agentId,
        prompt,
        content: "",
        status: "running",
        error: "",
      },
    ]);
    try {
      await rpc({
        method: "chat.start",
        params: { run_id: id, agent_id: agentId, message: prompt },
      });
    } catch (e) {
      if (run.current !== id) return;
      const message = String(e instanceof Error ? e.message : e);
      // A timeout may have accepted the run. Reconcile with persisted state before allowing retry.
      try {
        const history = await rpc({
          method: "chat.history",
          params: { agent_id: agentId },
        });
        if ("turns" in history && history.turns.some((t) => t.run_id === id)) {
          setTurns(history.turns);
          if (history.turns.find((t) => t.run_id === id)?.status === "running")
            return;
        } else
          setTurns((previous) =>
            previous.map((t) =>
              t.run_id === id ? { ...t, status: "failed", error: message } : t,
            ),
          );
      } catch {
        setError(message);
      }
      run.current = null;
      setActive(false);
    }
  }
  async function cancel() {
    if (!run.current) return;
    setStopping(true);
    try {
      await rpc({ method: "chat.cancel", params: { run_id: run.current } });
    } catch (e) {
      setError(String(e));
    } finally {
      setStopping(false);
    }
  }
  const selected = agents.find((a) => a.id === agentId);
  const selectedModel = snapshot?.connections.find(
    (c) => c.id === selected?.connection_id,
  )?.model_id;
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">OLLAMA · CLAUDE · GEMINI</div>
          <h1>Fikirden yanıta.</h1>
          <p>
            Yanıtları oluşurken izleyin. Sohbet geçmişiniz bu cihazda saklanır.
          </p>
        </div>
        <span className="badge positive">Akışlı sohbet</span>
      </div>
      {error && (
        <div className="banner error" role="alert">
          {error}
        </div>
      )}
      <section className="panel model-discovery">
        <Cpu size={21} />
        <div>
          <strong>Kurulu sohbet modelleri</strong>
          <p>Embedding modelleri bu listede gösterilmez.</p>
        </div>
        <select
          aria-label="Kurulu model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          disabled={loading || active}
        >
          <option value="">
            {loading ? "Modeller aranıyor…" : "Model seçin"}
          </option>
          {models.map((m) => (
            <option key={m.name} value={m.name}>
              {m.name} · {(m.size / 1e9).toFixed(1)} GB
            </option>
          ))}
        </select>
        <button
          className="icon-button"
          aria-label="Modelleri yenile"
          onClick={discover}
          disabled={loading || !desktopAvailable}
        >
          <RefreshCw size={17} className={loading ? "spin" : ""} />
        </button>
        <button
          className="button secondary"
          onClick={createAgent}
          disabled={!model || loading || active || !snapshot}
        >
          Bu modelle sohbet et
        </button>
      </section>
      <section className="panel chat-panel">
        <div className="chat-header">
          <Bot size={21} />
          <select
            aria-label="Sohbet ajanı"
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
            disabled={active || historyLoading}
          >
            <option value="">Ajan seçin</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          <span className="badge neutral">
            {selectedModel ?? "Bir sohbet ajanı seçin"}
          </span>
        </div>
        <div className="chat-messages" aria-label="Sohbet geçmişi">
          {!turns.length && (
            <div className="empty">
              <div className="empty-icon">
                <MessageSquare size={27} />
              </div>
              <h3>
                {historyLoading ? "Geçmiş yükleniyor…" : "İlk mesajınızı yazın"}
              </h3>
              <p>
                Bir kurulu model seçerek başlayın. Dosyalarınız otomatik olarak
                bağlama eklenmez.
              </p>
            </div>
          )}
          {turns.map((t) => (
            <div className="chat-turn" key={t.run_id}>
              <div className="chat-bubble user-bubble">
                <span>SİZ</span>
                <p>{t.prompt}</p>
              </div>
              <div className="chat-bubble assistant-bubble">
                <span>
                  <Bot size={13} />
                  {selected?.name ?? "Asistan"}{" "}
                  {t.status === "running" && (
                    <LoaderCircle size={13} className="spin" />
                  )}
                </span>
                <p>
                  {t.content ||
                    (t.status === "running"
                      ? "Model yanıtı hazırlanıyor…"
                      : "Yanıt üretilmedi.")}
                </p>
                {t.status !== "running" && (
                  <small>
                    {
                      (
                        {
                          completed: "Tamamlandı",
                          cancelled: "Durduruldu",
                          failed: "Başarısız",
                          interrupted: "Bağlantı kesildi",
                        } as const
                      )[t.status]
                    }
                  </small>
                )}
                {t.error && <div className="form-error">{t.error}</div>}
              </div>
            </div>
          ))}
          <div ref={scrollEnd} />
        </div>
        <form className="chat-composer" onSubmit={submit}>
          <textarea
            aria-label="Mesajınız"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={12000}
            rows={3}
            placeholder="Bir soru sorun veya bir fikir paylaşın…"
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey &&
                !e.nativeEvent.isComposing
              ) {
                e.preventDefault();
                e.currentTarget.form?.requestSubmit();
              }
            }}
          />
          <div>
            <span>Enter ile gönder · Shift + Enter ile yeni satır</span>
            {active ? (
              <button
                className="button secondary"
                type="button"
                onClick={cancel}
                disabled={stopping}
              >
                <Square size={14} />
                {stopping ? "Durduruluyor…" : "Durdur"}
              </button>
            ) : (
              <button
                className="button primary"
                disabled={
                  !ready ||
                  !agentId ||
                  !draft.trim() ||
                  historyLoading ||
                  loading
                }
              >
                <Send size={15} />
                Gönder
              </button>
            )}
          </div>
        </form>
      </section>
      <p className="development-note">
        Bulut ajanlarında mesajlar ve ilgili sohbet bağlamı seçilen sağlayıcıya
        gönderilir. Son 50 tur gösterilir. Modele en fazla 20 tamamlanmış tur,
        karakter sınırıyla gönderilir. Üretim sınırı: 512 token / 180 saniye.
      </p>
    </>
  );
}
