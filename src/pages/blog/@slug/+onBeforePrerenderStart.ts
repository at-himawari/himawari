// このファイルが、ビルド時にプリレンダリングする全ページのURLリストをVikeに提供します。
import posts from "../../../content/blog/posts.json";

export default function onBeforePrerenderStart() {
  // ブログ記事のURLリストを生成
  const blogUrls = posts.map((post) => `/blog/${post.slug}`);

  // 静的なページと、動的に生成したブログページのURLをすべて返す
  return blogUrls;
  
}
