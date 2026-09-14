import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { rpc } from "./api";
import type { Connection } from "./generated/contract";

export function ConnectionModelProbe({ connection }: { connection: Connection }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function discover() {
    setBusy(true);
    setMessage("");
    try {
      const result = await rpc({
        method: "connection.models",
        params: { connection_id: connection.id },
      });
      if (!("models" in result)) throw new Error("Model listesi alınamadı.");
      const found = result.models.some((model) => model.name === connection.model_id);
      setMessage(found
        ? `${result.models.length} model bulundu · seçili model erişilebilir`
        : `${result.models.length} model bulundu · seçili model listede yok`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setBusy(false);
    }
  }
  return <div className="connection-probe">
    <button type="button" className="button secondary" disabled={busy}
      onClick={() => void discover()}>
      <RefreshCw size={13} className={busy ? "spin" : ""} />
      {busy ? "Keşfediliyor…" : "Modelleri denetle"}
    </button>
    {message && <small>{message}</small>}
  </div>;
}
