import { useState } from "react";
import { rpc } from "./api";

export function VaultControl({ connectionId }: { connectionId: string }) {
  const [open, setOpen] = useState(false);
  const [secret, setSecret] = useState("");
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function act(action: "status" | "save" | "delete") {
    setBusy(true);
    setError("");
    const value = action === "save" ? secret : "";
    setSecret("");
    try {
      const result = await rpc({
        method: "vault",
        params: { connection_id: connectionId, action, secret: value },
      });
      if (!("has_key" in result) || result.connection_id !== connectionId)
        throw new Error("Kasa yanıtı geçersiz.");
      setHasKey(result.has_key);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="vault-control">
      <button
        className="button secondary"
        onClick={() => {
          setOpen(!open);
          setSecret("");
          if (!open) void act("status");
        }}
        disabled={busy}
      >
        API anahtarı
      </button>
      {open && (
        <div className="vault-editor">
          <small>
            {hasKey === null
              ? "Kasa durumu bilinmiyor"
              : hasKey
                ? "OS kasasında kayıtlı · API erişimi doğrulanmadı"
                : "Anahtar eklenmedi"}
          </small>
          <input
            type="password"
            aria-label="API anahtarı"
            autoComplete="off"
            spellCheck={false}
            maxLength={4096}
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="API anahtarını yapıştırın"
            disabled={busy}
          />
          <button
            className="button primary"
            disabled={busy || !secret.trim()}
            onClick={() => void act("save")}
          >
            {hasKey ? "Anahtarı değiştir" : "Kasaya kaydet"}
          </button>
          {hasKey && (
            <button
              className="button secondary"
              disabled={busy}
              onClick={() => void act("delete")}
            >
              Anahtarı sil
            </button>
          )}
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
