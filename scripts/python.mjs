import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
export const python = fileURLToPath(
  new URL(
    process.platform === "win32"
      ? "../.venv/Scripts/python.exe"
      : "../.venv/bin/python",
    import.meta.url,
  ),
);
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = spawnSync(python, process.argv.slice(2), {
    stdio: "inherit",
    env: { ...process.env, PYTHONPATH: "backend" },
  });
  if (result.error)
    console.error(
      "Python ortamı bulunamadı. README kurulum adımlarını izleyin.",
      result.error.message,
    );
  process.exit(result.status ?? 1);
}
