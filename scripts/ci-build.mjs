import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:http";

const articles = [
  {
    id: 1,
    slug: "aws-nyuumon-kouza-1",
    title: "AWS 入門講座 1",
    date: "2026-01-01",
    content: "# CI用の記事\n\nビルド検証用の固定データです。",
    categories: ["AWS"],
    tags: ["AWS"],
  },
  {
    id: 2,
    slug: "ci-web-development",
    title: "Web開発のビルド検証",
    date: "2026-01-02",
    content: "CI用の通常記事です。",
    categories: ["Web開発"],
    tags: ["Next.js"],
  },
];
const unknownEndpoints = new Set();

/** CI専用の固定データをStrapiのレスポンス形式で返す。 */
const server = createServer((request, response) => {
  const url = new URL(request.url, "http://localhost");
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  switch (url.pathname) {
    case "/api/articles":
      response.end(JSON.stringify({
        data: articles,
        meta: { pagination: { page: 1, pageSize: 100, pageCount: 1, total: articles.length } },
      }));
      return;
    case "/api/news-items":
      response.end(JSON.stringify({ data: [{ title: "CI用のお知らせ", date: "2026-01-02", content: "ビルド検証用の固定データです。" }] }));
      return;
    case "/api/fixed-pages":
      response.end(JSON.stringify({ data: [{ content: "CI用の固定ページです。" }] }));
      return;
    case "/api/video-items":
      response.end(JSON.stringify({ data: [] }));
      return;
    default:
      unknownEndpoints.add(url.pathname);
      response.writeHead(404);
      response.end(JSON.stringify({ error: "Unknown CI fixture endpoint" }));
  }
});

/** 外部CMSに依存せず通常の本番ビルドを検証し、終了時にサーバーを停止する。 */
async function main() {
  const packageManager = process.env.npm_execpath;
  if (!packageManager) throw new Error("pnpm run build:ci から実行してください。");

  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  try {
    const origin = `http://127.0.0.1:${server.address().port}`;
    console.info("CI用CMSの固定データを使用してビルドを検証します。");
    const child = spawn(process.execPath, [packageManager, "run", "build"], {
      stdio: "inherit",
      env: { ...process.env, NEXT_PUBLIC_STRAPI_URL: origin, VITE_STRAPI_URL: origin },
    });
    const [code] = await once(child, "exit");
    process.exitCode = code ?? 1;
    if (unknownEndpoints.size > 0) {
      console.error("CI用CMSに未定義のエンドポイントがあります:", [...unknownEndpoints]);
      process.exitCode = 1;
    }
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
      server.closeAllConnections();
    });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
