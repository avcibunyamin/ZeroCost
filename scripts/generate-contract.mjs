import { spawnSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { compile } from "json-schema-to-typescript";
import Ajv from "ajv";
import standaloneCode from "ajv/dist/standalone/index.js";
import { python } from "./python.mjs";
import { build } from "esbuild";
const run = spawnSync(python, ["backend/export_schema.py"], {
  encoding: "utf8",
});
if (run.status !== 0)
  throw new Error(
    run.stderr || "Python ortamı eksik; README kurulum adımlarını izleyin.",
  );
const schema = JSON.parse(run.stdout);
const types = await compile(schema, "Contract", {
  bannerComment:
    "/* Generated from Pydantic. Do not edit. Run npm run schema:generate. */",
  unreachableDefinitions: true,
});
const files = {
  "src/generated/contract.ts": types,
  "src/generated/contract.schema.json": JSON.stringify(schema, null, 2) + "\n",
};
for (const [property, type] of [
  ["response", "Response"],
  ["event", "StreamEvent"],
]) {
  const ajv = new Ajv({ strict: false, code: { source: true, esm: true } });
  const validate = ajv.compile({
    ...schema.properties[property],
    $defs: schema.$defs,
  });
  const validator = standaloneCode.default
    ? standaloneCode.default(ajv, validate)
    : standaloneCode(ajv, validate);
  const bundled = await build({
    stdin: {
      contents: validator,
      resolveDir: process.cwd(),
      sourcefile: `validate-${property}.js`,
    },
    bundle: true,
    platform: "browser",
    format: "esm",
    write: false,
  });
  files[`src/generated/validate-${property}.js`] = bundled.outputFiles[0].text;
  files[`src/generated/validate-${property}.d.ts`] =
    `import type { ${type} } from "./contract";\ndeclare function validate(data: unknown): data is ${type};\nexport default validate;\n`;
}
for (const [path, content] of Object.entries(files)) {
  if (process.argv.includes("--check")) {
    const current = await readFile(path, "utf8").catch(() => "");
    if (current !== content)
      throw new Error(
        `${path} güncel değil. npm run schema:generate çalıştırın.`,
      );
  } else await writeFile(path, content);
}
console.log(
  process.argv.includes("--check")
    ? "IPC sözleşmesi güncel."
    : "Pydantic → TypeScript + çalışma zamanı doğrulayıcısı üretildi.",
);
