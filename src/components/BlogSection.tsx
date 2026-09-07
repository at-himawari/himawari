"use client";

import { memo, useState } from "react";
import type { Post } from "../types/Post";
import { trackSelectContent } from "../utils/analytics";
import styles from "./BlogSection.module.css";

interface BlogSectionProps {
  latestPosts: Omit<Post, "content">[];
  featuredPosts: Omit<Post, "content">[];
  error?: string;
}

function ArticleImage({ post }: { post: Omit<Post, "content"> }) {
  const [failedSource, setFailedSource] = useState<string>();
  return (
    <div className={styles.paper}>
      {post.coverImage && failedSource !== post.coverImage ? (
        <img
          src={post.coverImage}
          alt=""
          width={1200}
          height={800}
          loading="lazy"
          onError={() => setFailedSource(post.coverImage)}
        />
      ) : (
        <div className={styles.paperFallback} aria-hidden="true">
          <span>HIMAWARI JOURNAL</span>
          <strong>{post.title}</strong>
          <span>技術と日々の記録</span>
        </div>
      )}
    </div>
  );
}

const BlogSection = memo(function BlogSection({
  latestPosts,
  featuredPosts,
  error,
}: BlogSectionProps) {
  const posts = latestPosts.length ? latestPosts : featuredPosts;

  return (
    <section
      id="home-blog"
      className={styles.section}
      aria-labelledby="home-blog-title"
    >
      <div className={styles.inner}>
        <header className={styles.heading}>
          <h2 id="home-blog-title">ブログ</h2>
          <span>技術のこと、日々のこと。</span>
        </header>

        {error ? (
          <div className={styles.message} role="status">
            <p>記事を読み込めませんでした。</p>
            <button type="button" onClick={() => window.location.reload()}>
              再読み込み
            </button>
          </div>
        ) : posts.length ? (
          <div className={styles.grid}>
            {posts.map((post) => (
              <article key={post.slug} className={styles.article}>
                <a
                  href={`/blog/${post.slug}`}
                  className={styles.link}
                  onClick={() =>
                    trackSelectContent("article", post.slug, post.title)
                  }
                >
                  <div className={styles.visual}>
                    {post.date && (
                      <time className={styles.date} dateTime={post.date}>
                        {post.date.split("T")[0].replace(/-/g, ".")}
                      </time>
                    )}
                    <ArticleImage post={post} />
                  </div>
                  <h3>{post.title}</h3>
                  <div className={styles.meta}>
                    <span>{post.categories?.join(" / ") || "ブログ"}</span>
                    <span aria-hidden="true">読む ↗</span>
                  </div>
                </a>
              </article>
            ))}
          </div>
        ) : (
          <p className={styles.message}>
            記事がまだありません。新しい記事の公開をお待ちください。
          </p>
        )}

        <div className={styles.footer}>
          <a href="/blog">
            すべての記事を見る <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
});

export default BlogSection;
