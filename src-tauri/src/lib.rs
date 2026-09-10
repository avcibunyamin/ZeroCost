use serde_json::{json, Value};
use std::{
    collections::HashMap,
    io::{BufRead, BufReader, Read, Write},
    path::PathBuf,
    process::{Child, ChildStdin, Command, Stdio},
    sync::{
        atomic::{AtomicBool, Ordering},
        mpsc, Arc, Mutex,
    },
    time::Duration,
};
use tauri::{Emitter, Manager};

type Pending = Arc<Mutex<HashMap<String, mpsc::SyncSender<Result<Value, String>>>>>;
type EventSink = Arc<dyn Fn(Value) + Send + Sync>;

fn response_timeout_seconds(request: &Value, ready: bool) -> u64 {
    if request["method"].as_str() == Some("knowledge.source.ingest") {
        305
    } else if ready {
        15
    } else {
        45
    }
}

fn allowed_event_type(kind: &str) -> bool {
    matches!(
        kind,
        "stream_chunk"
            | "stream_end"
            | "stream_error"
            | "orchestration_chunk"
            | "orchestration_message_end"
            | "orchestration_end"
            | "orchestration_error"
            | "orchestration_route"
            | "orchestration_approval_required"
            | "orchestration_usage"
            | "orchestration_tool_result"
            | "knowledge_ingestion_progress"
    )
}

struct Sidecar {
    child: Mutex<Child>,
    stdin: Mutex<ChildStdin>,
    pending: Pending,
    alive: Arc<AtomicBool>,
    ready: AtomicBool,
}

impl Drop for Sidecar {
    fn drop(&mut self) {
        self.alive.store(false, Ordering::SeqCst);
        if let Ok(child) = self.child.get_mut() {
            // PyInstaller onefile has a parent and worker. Kill our private process group.
            #[cfg(unix)]
            unsafe {
                libc::kill(-(child.id() as i32), libc::SIGKILL);
            }
            let _ = child.kill();
            let _ = child.wait();
        }
    }
}

impl Sidecar {
    fn start(database: PathBuf, events: EventSink) -> Result<Self, String> {
        let mut command;
        if cfg!(debug_assertions) {
            let root = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("..");
            command = Command::new(root.join(if cfg!(windows) {
                ".venv/Scripts/python.exe"
            } else {
                ".venv/bin/python"
            }));
            command
                .args(["-m", "zerocost.sidecar"])
                .env("PYTHONPATH", root.join("backend"));
        } else {
            let dir = std::env::current_exe()
                .map_err(|e| e.to_string())?
                .parent()
                .ok_or("Uygulama klasörü bulunamadı")?
                .to_owned();
            command = Command::new(dir.join(if cfg!(windows) {
                "zerocost-sidecar.exe"
            } else {
                "zerocost-sidecar"
            }));
        }
        #[cfg(unix)]
        {
            use std::os::unix::process::CommandExt;
            command.process_group(0);
        }
        let mut child = command
            .env("PYTHONUNBUFFERED", "1")
            .arg("--database")
            .arg(database)
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::inherit())
            .spawn()
            .map_err(|e| format!("Python sidecar başlatılamadı: {e}"))?;
        let stdin = child.stdin.take().ok_or("Sidecar stdin eksik")?;
        let stdout = child.stdout.take().ok_or("Sidecar stdout eksik")?;
        let pending: Pending = Arc::new(Mutex::new(HashMap::new()));
        let reader_pending = pending.clone();
        let alive = Arc::new(AtomicBool::new(true));
        let reader_alive = alive.clone();
        std::thread::spawn(move || {
            let mut reader = BufReader::new(stdout);
            loop {
                let mut line = String::new();
                match reader
                    .by_ref()
                    .take(4 * 1024 * 1024 + 1)
                    .read_line(&mut line)
                {
                    Ok(n) if n > 0 && n <= 4 * 1024 * 1024 && line.ends_with('\n') => {}
                    _ => break,
                }
                let frame: Value = match serde_json::from_str(&line) {
                    Ok(value) => value,
                    Err(_) => break,
                };
                if frame["protocol_version"] != 1 {
                    break;
                }
                if let Some(kind) = frame["type"].as_str() {
                    if !allowed_event_type(kind) {
                        break;
                    }
                    events(frame);
                } else if let Some(id) = frame["request_id"].as_str() {
                    if let Ok(mut waiting) = reader_pending.lock() {
                        if let Some(sender) = waiting.remove(id) {
                            let _ = sender.send(Ok(frame));
                        }
                    }
                } else {
                    break;
                }
            }
            reader_alive.store(false, Ordering::SeqCst);
            if let Ok(mut waiting) = reader_pending.lock() {
                for (_, sender) in waiting.drain() {
                    let _ = sender.send(Err("Sidecar bağlantısı kesildi.".into()));
                }
            }
            events(
                json!({"protocol_version":1,"type":"transport_error","message":"Yerel çekirdek bağlantısı kesildi. Durumu yenileyin."}),
            );
        });
        Ok(Self {
            child: Mutex::new(child),
            stdin: Mutex::new(stdin),
            pending,
            alive,
            ready: AtomicBool::new(false),
        })
    }

    fn exchange(&self, request: &Value) -> Result<Value, String> {
        let encoded = serde_json::to_vec(request).map_err(|e| e.to_string())?;
        if encoded.len() + 1 > 64 * 1024 {
            return Err("İstek çok büyük".into());
        }
        let id = request["request_id"]
            .as_str()
            .ok_or("İstek kimliği eksik")?
            .to_owned();
        let (tx, rx) = mpsc::sync_channel(1);
        {
            let mut waiting = self.pending.lock().map_err(|_| "İstek kilidi açılamadı")?;
            if !self.alive.load(Ordering::SeqCst) {
                return Err("Sidecar bağlantısı kapalı".into());
            }
            if waiting.len() >= 32 || waiting.contains_key(&id) {
                return Err("İstek kuyruğu dolu veya kimlik tekrarlandı".into());
            }
            waiting.insert(id.clone(), tx);
        }
        let written = self
            .stdin
            .lock()
            .map_err(|_| "Yazma kilidi açılamadı".to_string())
            .and_then(|mut stdin| {
                stdin
                    .write_all(&encoded)
                    .and_then(|_| stdin.write_all(b"\n"))
                    .and_then(|_| stdin.flush())
                    .map_err(|_| "Sidecar'a yazılamadı".into())
            });
        if let Err(error) = written {
            if let Ok(mut waiting) = self.pending.lock() {
                waiting.remove(&id);
            }
            return Err(error);
        }
        let timeout = response_timeout_seconds(request, self.ready.load(Ordering::SeqCst));
        let result = rx
            .recv_timeout(Duration::from_secs(timeout))
            .map_err(|_| "Sidecar yanıt vermedi; kaydın durumunu yenileyin.".to_string());
        if let Ok(mut waiting) = self.pending.lock() {
            waiting.remove(&id);
        }
        let response = result??;
        self.ready.store(true, Ordering::SeqCst);
        Ok(response)
    }
}

#[derive(Clone)]
struct Backend(Arc<Mutex<Option<Arc<Sidecar>>>>);

#[derive(serde::Deserialize)]
#[serde(deny_unknown_fields)]
struct VaultParams {
    connection_id: String,
    action: String,
    #[serde(default)]
    secret: String,
}

fn route_request(client: &Sidecar, mut request: Value) -> Result<Value, String> {
    let object = request.as_object().ok_or("Geçersiz istek")?;
    if object.keys().any(|key| {
        !matches!(
            key.as_str(),
            "method" | "params" | "request_id" | "protocol_version"
        )
    }) {
        return Err("İstek izin verilmeyen alan içeriyor.".into());
    }
    let method = request["method"].as_str().unwrap_or("").to_owned();
    if !matches!(
        method.as_str(),
        "vault" | "chat.start" | "orchestration.start" | "orchestration.approve"
    ) {
        return client.exchange(&request);
    }
    if request["protocol_version"] != 1 || request["request_id"].as_str().is_none() {
        return Err("Geçersiz iletişim zarfı.".into());
    }
    // Resolve identity from the backend; renderer-provided credential references are never accepted.
    let snapshot = client.exchange(&json!({"method":"snapshot", "protocol_version":1,
        "request_id":format!("vault-{}", request["request_id"].as_str().unwrap())}))?;
    let connections = snapshot["result"]["connections"]
        .as_array()
        .ok_or("Bağlantılar alınamadı")?;
    let params = if method == "vault" {
        Some(
            serde_json::from_value::<VaultParams>(request["params"].clone())
                .map_err(|_| "Geçersiz kasa isteği")?,
        )
    } else {
        None
    };
    let agent_connection = |agent_id: &str| -> Result<&str, String> {
        snapshot["result"]["agents"]
            .as_array()
            .ok_or("Ajanlar alınamadı".to_string())?
            .iter()
            .find(|a| a["id"] == agent_id)
            .and_then(|a| a["connection_id"].as_str())
            .ok_or("Ajan bulunamadı".to_string())
    };
    let connection_ids: Vec<String> = if let Some(ref p) = params {
        vec![p.connection_id.clone()]
    } else if method == "chat.start" {
        let agent_id = request["params"]["agent_id"]
            .as_str()
            .ok_or("Ajan kimliği eksik")?;
        vec![agent_connection(agent_id)?.to_owned()]
    } else if method == "orchestration.approve" {
        let history = client.exchange(&json!({"method":"orchestration.history",
            "protocol_version":1,
            "request_id":format!("history-{}", request["request_id"].as_str().unwrap())}))?;
        let run_id = request["params"]["run_id"]
            .as_str()
            .ok_or("Görev kimliği eksik")?;
        history["result"]["runs"]
            .as_array()
            .ok_or("Görev geçmişi alınamadı")?
            .iter()
            .find(|run| run["run_id"] == run_id)
            .and_then(|run| run["agent_ids"].as_array())
            .ok_or("Görev bulunamadı")?
            .iter()
            .map(|id| {
                id.as_str()
                    .ok_or("Ajan kimliği geçersiz".to_string())
                    .map(str::to_owned)
            })
            .collect::<Result<Vec<_>, _>>()?
    } else {
        request["params"]["agent_ids"]
            .as_array()
            .ok_or("Ajan listesi eksik")?
            .iter()
            .map(|id| {
                id.as_str()
                    .ok_or("Ajan kimliği geçersiz".to_string())
                    .and_then(agent_connection)
                    .map(str::to_owned)
            })
            .collect::<Result<Vec<_>, _>>()?
    };
    let resolved = connection_ids
        .iter()
        .map(|id| {
            connections
                .iter()
                .find(|c| c["id"] == id.as_str())
                .ok_or("Bağlantı bulunamadı")
        })
        .collect::<Result<Vec<_>, _>>()?;
    let uses_vault = resolved.iter().any(|connection| {
        matches!(
            connection["provider"].as_str(),
            Some("anthropic" | "gemini")
        )
    });
    if !uses_vault {
        return if method == "vault" {
            Err("Bu sağlayıcı kasa kullanmıyor.".into())
        } else {
            client.exchange(&request)
        };
    }
    let connection_id = &connection_ids[0];
    let entry = keyring::Entry::new("dev.zerocost.desktop", connection_id)
        .map_err(|_| "OS anahtar kasası açılamadı")?;
    if let Some(ref p) = params {
        let has_key = match p.action.as_str() {
            "save" => {
                if p.secret.trim().is_empty()
                    || p.secret.len() > 4096
                    || p.secret.chars().any(char::is_whitespace)
                {
                    return Err("API anahtarı boş olamaz ve boşluk içeremez.".into());
                }
                entry
                    .set_password(&p.secret)
                    .map_err(|_| "Anahtar OS kasasına kaydedilemedi")?;
                true
            }
            "delete" => {
                match entry.delete_credential() {
                    Ok(()) | Err(keyring::Error::NoEntry) => {}
                    Err(_) => return Err("Anahtar kasadan silinemedi".into()),
                }
                false
            }
            "status" => match entry.get_password() {
                Ok(_) => true,
                Err(keyring::Error::NoEntry) => false,
                Err(_) => return Err("OS anahtar kasasına erişilemiyor".into()),
            },
            _ => return Err("Geçersiz kasa işlemi".into()),
        };
        return Ok(
            json!({"protocol_version":1,"request_id":request["request_id"],"ok":true,
            "result":{"connection_id":connection_id,"has_key":has_key}}),
        );
    }
    if method == "chat.start" {
        let secret = entry.get_password().map_err(|_| {
            "API anahtarı okunamadı. Model bağlantıları ekranından anahtar ekleyin."
        })?;
        request["_auth"] = json!({"connection_id":connection_id,"secret":secret});
    } else {
        let mut credentials = serde_json::Map::new();
        for (id, connection) in connection_ids.iter().zip(resolved.iter()) {
            if matches!(
                connection["provider"].as_str(),
                Some("anthropic" | "gemini")
            ) && !credentials.contains_key(id)
            {
                let value = keyring::Entry::new("dev.zerocost.desktop", id)
                    .and_then(|entry| entry.get_password())
                    .map_err(|_| "Bir veya daha fazla ajan için API anahtarı okunamadı.")?;
                credentials.insert(id.to_owned(), Value::String(value));
            }
        }
        request["_auth"] = json!({"credentials":credentials});
    }
    client.exchange(&request)
}

#[tauri::command]
async fn backend_request(
    app: tauri::AppHandle,
    state: tauri::State<'_, Backend>,
    request: Value,
) -> Result<Value, String> {
    let backend = state.inner().clone();
    let database = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?
        .join("zerocost.sqlite3");
    tauri::async_runtime::spawn_blocking(move || {
        let client = {
            let mut slot = backend.0.lock().map_err(|_| "Backend kilidi açılamadı")?;
            if slot
                .as_ref()
                .is_some_and(|client| !client.alive.load(Ordering::SeqCst))
            {
                slot.take();
            }
            if slot.is_none() {
                let sink = Arc::new(move |event| {
                    let _ = app.emit_to("main", "chat_stream", event);
                });
                *slot = Some(Arc::new(Sidecar::start(database, sink)?));
            }
            slot.as_ref().ok_or("Backend hazır değil")?.clone()
        };
        // No backend mutex is held while waiting: cancellation can pass during generation.
        route_request(&client, request)
    })
    .await
    .map_err(|e| e.to_string())?
}

pub fn run() {
    let backend = Backend(Arc::new(Mutex::new(None)));
    let cleanup = backend.clone();
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .manage(backend)
        .invoke_handler(tauri::generate_handler![backend_request])
        .build(tauri::generate_context!())
        .expect("ZeroCost başlatılamadı")
        .run(move |_app, event| {
            if matches!(event, tauri::RunEvent::Exit) {
                if let Ok(mut slot) = cleanup.0.lock() {
                    slot.take();
                }
            }
        });
}
#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn ingestion_bridge_allows_bounded_long_running_embedding() {
        assert!(allowed_event_type("knowledge_ingestion_progress"));
        assert!(!allowed_event_type("unknown_progress"));
        assert_eq!(
            response_timeout_seconds(&json!({"method":"knowledge.source.ingest"}), true),
            305
        );
        assert_eq!(
            response_timeout_seconds(&json!({"method":"snapshot"}), true),
            15
        );
        assert_eq!(
            response_timeout_seconds(&json!({"method":"snapshot"}), false),
            45
        );
    }

    #[test]
    #[ignore = "Writes synthetic test credentials to the native OS vault, then deletes them"]
    fn native_vault_roundtrip_and_renderer_injection_rejection() {
        let unique = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        let directory = std::env::temp_dir().join(format!("zerocost-vault-{unique}"));
        let sidecar = Sidecar::start(directory.join("test.sqlite3"), Arc::new(|_| {})).unwrap();
        let snapshot = sidecar
            .exchange(
                &json!({"protocol_version":1,"request_id":"create","method":"connection.create",
            "params":{"name":"Synthetic vault test","provider":"gemini","model_id":"test"}}),
            )
            .unwrap();
        let id = snapshot["result"]["connections"][0]["id"].as_str().unwrap();
        let entry = keyring::Entry::new("dev.zerocost.desktop", id).unwrap();
        struct Cleanup(keyring::Entry);
        impl Drop for Cleanup {
            fn drop(&mut self) {
                let _ = self.0.delete_credential();
            }
        }
        let _cleanup = Cleanup(entry);
        let call = |action: &str, secret: &str| {
            route_request(
                &sidecar,
                json!({"protocol_version":1,"request_id":action,"method":"vault",
            "params":{"connection_id":id,"action":action,"secret":secret}}),
            )
        };
        assert_eq!(call("status", "").unwrap()["result"]["has_key"], false);
        let saved = call("save", "synthetic-vault-test-only").unwrap();
        assert_eq!(saved["result"]["has_key"], true);
        assert!(!saved.to_string().contains("synthetic-vault-test-only"));
        assert_eq!(call("status", "").unwrap()["result"]["has_key"], true);
        assert!(route_request(
            &sidecar,
            json!({"method":"chat.start","_auth":{"secret":"injected"}})
        )
        .is_err());
        assert_eq!(call("delete", "").unwrap()["result"]["has_key"], false);
        assert_eq!(call("status", "").unwrap()["result"]["has_key"], false);
        drop(sidecar);
        std::fs::remove_dir_all(directory).unwrap();
    }

    #[test]
    fn python_bridge_persists_profiles_across_process_restart() {
        let unique = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        let directory = std::env::temp_dir().join(format!("zerocost-bridge-{unique}"));
        let database = directory.join("test.sqlite3");
        {
            let sidecar = Sidecar::start(database.clone(), Arc::new(|_| {})).unwrap();
            let response = sidecar.exchange(&json!({
                "request_id": "create", "protocol_version": 1,
                "method": "connection.create",
                "params": {"name": "Bridge test", "provider": "ollama", "model_id": "test-model"}
            })).unwrap();
            assert_eq!(response["ok"], true);
            assert_eq!(response["result"]["connections"][0]["name"], "Bridge test");
        }
        {
            let sidecar = Sidecar::start(database, Arc::new(|_| {})).unwrap();
            let response = sidecar
                .exchange(&json!({
                    "request_id": "restart", "protocol_version": 1, "method": "snapshot"
                }))
                .unwrap();
            assert_eq!(
                response["result"]["connections"].as_array().unwrap().len(),
                1
            );
            let rejected = sidecar
                .exchange(&json!({
                    "request_id": "denied", "protocol_version": 1, "method": "shell.execute"
                }))
                .unwrap();
            assert_eq!(rejected["ok"], false);
            assert_eq!(rejected["code"], "invalid_request");
        }
        std::fs::remove_dir_all(directory).unwrap();
    }
}
