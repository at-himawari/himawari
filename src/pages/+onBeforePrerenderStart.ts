import { getAllPosts } from "../utils/blog";

// ビルド時にプリレンダリングするページのリストをVikeに教える
export function onBeforePrerenderStart() {
  const posts = getAllPosts();

  // 全ての記事のURL（例: /blog/xxxx, /blog/yyyy）を生成して返す

  const prerenderUrls = posts.map((post) => {
    console.log(post.slug);
    return `/blog/${post.slug}`;
  });

  // トップページやブログ一覧ページなども含める
  return prerenderUrls;
}
