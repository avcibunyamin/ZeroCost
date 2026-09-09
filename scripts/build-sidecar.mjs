import { spawnSync } from "node:child_process";
import { mkdir, copyFile } from "node:fs/promises";
import { python } from "./python.mjs";
const rust = spawnSync("rustc", ["-vV"], { encoding: "utf8" });
if (rust.status !== 0) throw new Error("Rust araç zinciri bulunamadı.");
const target = rust.stdout.match(/^host: (.+)$/m)?.[1];
if (!target) throw new Error("Rust hedef platformu belirlenemedi.");
const result = spawnSync(
  python,
  [
    "-m",
    "PyInstaller",
    "--noconfirm",
    "--clean",
    "--onefile",
    "--name",
    "zerocost-sidecar",
    "--paths",
    "backend",
    "--distpath",
    ".sidecar-build/dist",
    "--workpath",
    ".sidecar-build/work",
    "--specpath",
    ".sidecar-build",
    "backend/entrypoint.py",
  ],
  { stdio: "inherit" },
);
if (result.status !== 0)
  throw new Error("Sidecar paketlenemedi. Python dev bağımlılıklarını kurun.");
await mkdir("src-tauri/binaries", { recursive: true });
const extension = process.platform === "win32" ? ".exe" : "";
await copyFile(
  `.sidecar-build/dist/zerocost-sidecar${extension}`,
  `src-tauri/binaries/zerocost-sidecar-${target}${extension}`,
);
console.log(`Python sidecar hazır: ${target}`);
