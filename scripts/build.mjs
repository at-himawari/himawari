import { rm } from "node:fs/promises";
import { spawn } from "node:child_process";
import { once } from "node:events";

/** 前回のCMSキャッシュを破棄し、最新データで静的ページを生成する。 */
async function main() {
  await rm(new URL("../.next/cache/fetch-cache/", import.meta.url), { recursive: true, force: true });
  const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "build", "--webpack"], {
    stdio: "inherit",
    env: process.env,
  });
  const [code] = await once(child, "exit");
  process.exitCode = code ?? 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
