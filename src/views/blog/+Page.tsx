"use client";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import BlogPostGrid from "../../components/BlogPostGrid";
import { useState, useMemo, useEffect } from "react";
import { Post } from "../../types/Post";
import {
  AWS_BEGINNER_COURSE_PATH,
  isAwsBeginnerCoursePost,
} from "../../utils/awsBeginnerCourse";

type PostForList = Omit<Post, "content">;

export default function Page({ posts: initialPosts }: { posts: PostForList[] }) {

  // `posts` は content を含むようになる
  const posts = initialPosts;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [allPosts, setAllPosts] = useState<Post[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // 検索入力があった場合に、全文データを非同期で読み込む
  useEffect(() => {
    if (searchQuery && !allPosts) {
      setIsLoading(true);
      // 動的importの代わりに、作成したデータエンドポイントをfetchする
      fetch("/blog/allPosts.data.json")
        .then((response) => response.json())
        .then((data) => {
          setAllPosts(data);
        })
        .catch(() => setIsLoading(false));
    }
  }, [searchQuery, allPosts, isLoading]);

  const categories = useMemo(() => {
    if (!initialPosts) return [];
    const allCategories = initialPosts.flatMap((post) => post.categories || []);
    return [...new Set(allCategories)];
  }, [initialPosts]);

  const filteredPosts = useMemo(() => {
    const lowercasedQuery = searchQuery.toLowerCase();

    if (searchQuery && allPosts) {
      return allPosts.filter((post) => {
        const matchesSearch =
          post.title.toLowerCase().includes(lowercasedQuery) ||
          (post.content &&
            post.content.toLowerCase().includes(lowercasedQuery));
        const matchesCategory = selectedCategory
          ? post.categories?.includes(selectedCategory)
          : true;
        return matchesSearch && matchesCategory;
      });
    }
    // 上記以外の場合（検索していない、または全文データ読み込み中）は、
    // initialPosts（本文なし）をフィルタリングする
    return initialPosts.filter((post) => {
      const matchesSearch = searchQuery
        ? post.title.toLowerCase().includes(lowercasedQuery)
        : true;
      const matchesCategory = selectedCategory
        ? post.categories?.includes(selectedCategory)
        : true;
      return matchesSearch && matchesCategory;
    });
  }, [initialPosts, allPosts, searchQuery, selectedCategory]);

  const awsBeginnerCoursePosts = useMemo(
    () => filteredPosts.filter(isAwsBeginnerCoursePost),
    [filteredPosts],
  );
  const otherPosts = useMemo(
    () => filteredPosts.filter((post) => !isAwsBeginnerCoursePost(post)),
    [filteredPosts],
  );

  if (!posts) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p>記事を読み込んでいます...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-left text-orange-600 title-ja">
          ブログ
        </h1>
        <h2 className="text-2xl font-bold mb-8 text-left text-gray-800 section-h2">
          Blog
        </h2>

        {/* 検索フォームとカテゴリフィルター */}
        <div className="mb-2 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="記事を検索..."
            className="border p-2 rounded-md w-full md:w-1/2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`py-1 px-3 rounded-full text-sm ${
              selectedCategory === null
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            すべて
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`py-1 px-3 rounded-full text-sm ${
                selectedCategory === category
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {awsBeginnerCoursePosts.length > 0 && (
          <section aria-label="AWS入門講座" className="mb-8">
            <h2 className="mb-2 inline-flex items-center gap-2 text-base font-extrabold tracking-wide text-orange-700 before:h-4 before:w-0.5 before:-rotate-[18deg] before:rounded-full before:bg-current before:content-[''] after:h-4 after:w-0.5 after:rotate-[18deg] after:rounded-full after:bg-current after:content-['']">
              注目
            </h2>
            <a
              href={AWS_BEGINNER_COURSE_PATH}
              className="group flex max-w-xl items-center justify-between gap-4 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 transition-all hover:border-orange-300 hover:bg-orange-100/70 hover:shadow-md"
              aria-label={`AWS入門講座の特設ページへ、全${awsBeginnerCoursePosts.length}記事`}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500 text-xs font-bold text-white"
                >
                  AWS
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold tracking-wider text-orange-600">
                    SERIES
                  </span>
                  <span className="block truncate text-base font-bold text-gray-800 sm:text-lg">
                    AWS入門講座
                  </span>
                </span>
              </span>
              <span className="shrink-0 text-sm font-semibold text-orange-700 transition-transform group-hover:translate-x-1">
                全{awsBeginnerCoursePosts.length}記事 <span aria-hidden="true">→</span>
              </span>
            </a>
          </section>
        )}

        {otherPosts.length > 0 && (
          <section aria-label="記事一覧">
            <BlogPostGrid posts={otherPosts} />
          </section>
        )}

        {filteredPosts.length === 0 && (
          <p className="py-12 text-center text-gray-600">
            条件に一致する記事はありません。
          </p>
        )}
      </div>
      <Footer />
    </>
  );
}
