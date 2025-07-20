import fs from 'fs';
import path from 'path';

// ビルドが始まる前に実行される関数
export function onBeforePrerenderStart() {
  // ブログ記事の一覧が書かれたJSONファイルを読み込む
  const blogIndex = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'public', 'content', 'blog', 'index.json'), 'utf-8')
  );

  // JSONの情報から、各記事のURLのリストを作成する
  const prerenderUrls = blogIndex.map((post: { slug: string }) => `/blog/${post.slug}`);

  // Vikeに、これらのURLのページをプリレンダリングするように指示する
  return prerenderUrls;
}