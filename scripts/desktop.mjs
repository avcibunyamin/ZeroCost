import { spawn, spawnSync } from "node:child_process";
import { homedir } from "node:os";
import { delimiter, join } from "node:path";
const env = {
  ...process.env,
  PATH: `${join(homedir(), ".cargo", "bin")}${delimiter}${process.env.PATH}`,
};
const args = process.argv.slice(2);
if (args[0] === "build") {
  const result = spawnSync(process.execPath, ["scripts/build-sidecar.mjs"], {
    stdio: "inherit",
    env,
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
  args.push("--config", "src-tauri/tauri.release.conf.json");
}
const child = spawn(
  process.platform === "win32"
    ? "node_modules/.bin/tauri.cmd"
    : "node_modules/.bin/tauri",
  args,
  { stdio: "inherit", env },
);
child.on("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
child.on("exit", (code) => {
  process.exitCode = code ?? 1;
});
