import { FaHouse, FaPenNib } from "react-icons/fa6";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-gray-800">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-orange-50 via-white to-gray-50">
        <section className="container mx-auto flex min-h-[68vh] items-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-3xl">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-orange-500">
                Page Missing
              </p>
              <h1 className="mt-4 text-3xl font-bold leading-tight text-gray-900 sm:text-5xl">
                お探しのページが
                <br className="hidden sm:block" />
                見つかりませんでした
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
                URLが変更されたか、ページが移動した可能性があります。
                トップページへ戻るか、ブログから目的のページを探してみてください。
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 transition-colors hover:bg-orange-600"
                >
                  <FaHouse aria-hidden="true" />
                  トップへ戻る
                </a>
                <a
                  href="/blog"
                  className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <FaPenNib aria-hidden="true" />
                  記事を探す
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
