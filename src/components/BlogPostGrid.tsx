import Link from "next/link";
import type { Post } from "../types/Post";

type PostForList = Omit<Post, "content">;

export default function BlogPostGrid({ posts }: { posts: PostForList[] }) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="group block overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="h-48 overflow-hidden">
            <img
              src={
                post.coverImage ||
                "https://dq7c5b6uxkdk2.cloudfront.net/posts/images/himawari.png"
              }
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="p-6">
            <p className="mb-2 text-sm text-gray-500">
              {post.date ? post.date.split("T")[0].replace(/-/g, "/") : ""}
            </p>
            <h3 className="text-xl font-bold text-gray-800 transition-colors duration-300 group-hover:text-orange-500">
              {post.title}
            </h3>
            <div className="mt-4">
              {post.tags?.map((tag) => (
                <span
                  key={tag}
                  className="mr-2 mb-2 inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-800"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
