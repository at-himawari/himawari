import Link from "next/link";
import BlogPostGrid from "../../../components/BlogPostGrid";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import type { Post } from "../../../types/Post";

type PostForList = Omit<Post, "content">;

export default function AwsBeginnerCoursePage({
  posts,
}: {
  posts: PostForList[];
}) {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Link
          href="/blog"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition-colors hover:text-orange-600"
        >
          <span aria-hidden="true">←</span> 記事一覧に戻る
        </Link>

        <header className="mb-10 rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white px-6 py-8 sm:px-10 sm:py-10">
          <p className="mb-2 text-sm font-semibold tracking-widest text-orange-600">
            AWS BEGINNER COURSE
          </p>
          <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            AWS入門講座
          </h1>
          <p className="max-w-2xl leading-7 text-gray-600">
            AWSの基礎から実践的な使い方まで、初心者向けに順を追って学べる講座です。
          </p>
          <p className="mt-4 text-sm font-semibold text-orange-700">
            全{posts.length}記事
          </p>
        </header>

        {posts.length > 0 ? (
          <section aria-labelledby="course-articles-heading">
            <h2
              id="course-articles-heading"
              className="mb-6 text-2xl font-bold text-gray-800"
            >
              講座一覧
            </h2>
            <BlogPostGrid posts={posts} />
          </section>
        ) : (
          <p className="py-12 text-center text-gray-600">
            講座記事は現在準備中です。
          </p>
        )}
      </main>
      <Footer />
    </>
  );
}
