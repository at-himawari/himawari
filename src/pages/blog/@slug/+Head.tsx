import React from "react";
import { usePageContext } from "vike-react/usePageContext";
import { PageContextPost } from "../../../types/pageContextPost";

export function Head() {
  const pageContext = usePageContext() as { data: PageContextPost };
  const { post } = pageContext.data;

  // 投稿データがない場合は何も表示しない
  if (!post) {
    return null;
  }

  const { title, content, coverImage } = post;
  const postUrl = `https://あなたのドメイン.com/blog/${post.slug}`; // 完全なURLに書き換えてください
  const description = content.substring(0, 30).replace(/\n/g, " ") + "...";

  return (
    <>
      {/* Vikeが自動で設定してくれるもの以外のメタタグを記述 */}
      <meta name="description" content={description} />

      {/* OGP Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={coverImage} />
      <meta property="og:url" content={postUrl} />
      <meta property="og:type" content="article" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={coverImage} />
      <meta name="twitter:site" content="@at_himawari" />
    </>
  );
}
