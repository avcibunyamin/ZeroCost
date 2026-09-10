import { invoke, isTauri } from "@tauri-apps/api/core";
import type { Request, Snapshot } from "./generated/contract";
import validateResponse from "./generated/validate-response.js";

export const desktopAvailable = isTauri();
type Command = Request extends infer R
  ? R extends Request
    ? Omit<R, "request_id" | "protocol_version">
    : never
  : never;

export async function rpc(command: Command, requestId = crypto.randomUUID()) {
  if (!desktopAvailable)
    throw new Error(
      "Yerel backend için npm run desktop ile masaüstü uygulamasını açın.",
    );
  const request: Request = {
    ...command,
    request_id: requestId,
    protocol_version: 1,
  };
  const response: unknown = await invoke("backend_request", { request });
  if (!validateResponse(response))
    throw new Error("Backend yanıtı beklenen şemaya uymuyor.");
  if (response.request_id !== request.request_id)
    throw new Error("Yanıt kimliği uyuşmuyor.");
  if (!response.ok) throw new Error(response.message);
  return response.result;
}

export async function send(command: Command): Promise<Snapshot> {
  const result = await rpc(command);
  if (!("connections" in result))
    throw new Error("Beklenmeyen yapılandırma yanıtı.");
  return result;
}
