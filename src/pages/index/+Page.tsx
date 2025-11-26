import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa"; // 虫眼鏡アイコン
import { FaXTwitter } from "react-icons/fa6";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import NewsSection from "../../components/NewsSection";
import BlogSection from "../../components/BlogSection";
import { usePageContext } from "vike-react/usePageContext";
import type { HomePageData } from "./+data";

// タイプライター風アニメーションのカスタムフック
const useTypewriter = (
  text: string,
  speed: number = 100,
  delay: number = 1000
) => {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    // 開始遅延
    const startTimeout = setTimeout(() => {
      setIsTyping(true);
      let currentIndex = 0;

      const typeChar = () => {
        if (currentIndex < text.length) {
          setDisplayText(text.substring(0, currentIndex + 1));
          currentIndex++;
          timeout = setTimeout(typeChar, speed);
        } else {
          setIsTyping(false);
        }
      };

      typeChar();
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(timeout);
    };
  }, [text, speed, delay]);

  return { displayText, isTyping };
};

function Page() {
  const pageContext = usePageContext();
  const { latestPosts, featuredPosts, error } =
    pageContext.data as HomePageData;

  // キャッチコピーを設定
  const catchphrase = "あなたのとなりで、つくる技術。";
  const { displayText, isTyping } = useTypewriter(catchphrase, 120, 500);

  // 検索ボタンクリック時にプロフィールセクションへスクロール
  const handleSearchClick = () => {
    const profileSection = document.getElementById("profile");
    if (profileSection) {
      profileSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <div className="font-sans overflow-x-hidden">
        <Header />

        {/* 検索ボックス風ヒーローセクション */}
        <section
          id="hero"
          className="relative h-[500px] flex items-center justify-center overflow-hidden bg-gray-100"
        >
          {/* 背景画像（お好みの画像に差し替えてください） */}
          <div
            className="absolute inset-0 z-0"
            style={{
              // カフェやデスクの画像など、温かみのある画像がおすすめです
              backgroundImage:
                "url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* 白のオーバーレイを強めにかけて、清潔感と検索バーの視認性を高める */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>
          </div>

          <div className="relative container mx-auto px-4 z-10 w-full max-w-3xl">
            <div className="text-center mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-700 mb-4 tracking-widest">
                Himawari Project
              </h2>
            </div>

            {/* 検索バー本体 */}
            <div className="bg-white rounded-full shadow-2xl p-2 flex items-center transform transition-all duration-300 hover:shadow-xl border border-gray-200">
              <div className="pl-4 pr-2 text-gray-400">
                <FaSearch size={20} />
              </div>
              <div className="flex-1 h-12 flex items-center px-2 overflow-hidden">
                <span className="text-xl md:text-2xl text-gray-800 font-medium whitespace-nowrap">
                  {displayText}
                  {/* 点滅するカーソル */}
                  <span
                    className={`inline-block w-[2px] h-6 bg-orange-500 ml-1 align-middle ${
                      isTyping ? "animate-pulse" : "animate-bounce"
                    }`}
                  ></span>
                </span>
              </div>
              <button
                onClick={handleSearchClick}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6 py-3 font-bold transition-colors duration-200 shadow-md hidden sm:block"
              >
                検索
              </button>
            </div>

            {/* サブコピー / タグライン */}
            <div
              className="text-center mt-8 animate-fade-in"
              style={{ animationDelay: "2s" }}
            >
              <p className="text-gray-700 font-medium md:text-lg text-left">
                映像制作とシステム開発の二刀流。
                <br className="sm:hidden" />
                相談しやすさ No.1 のエンジニアが、
                <br className="sm:hidden" />
                あなたの想いをカタチにします。
              </p>

              {/* アクションボタン群 */}
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a
                  href="/software"
                  className="bg-white text-gray-700 border border-gray-300 px-6 py-2 rounded-full hover:bg-gray-50 transition-colors text-sm font-bold"
                >
                  サービス一覧
                </a>
                <a
                  href="https://forms.gle/D8WSByjAnYGGtoGw9"
                  className="bg-gray-800 text-white px-6 py-2 rounded-full hover:bg-gray-700 transition-colors text-sm font-bold shadow-lg"
                >
                  相談してみる
                </a>
              </div>
            </div>
          </div>
        </section>

        <BlogSection
          latestPosts={latestPosts}
          featuredPosts={featuredPosts}
          error={error}
        />
        <NewsSection />
        <section id="profile" className="py-12">
          {/* プロフィールセクション（既存のコード） */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center font-bold text-gray-800 mb-3 sm:mb-4">
              プロフィール
            </h2>
            <div className="w-16 h-1 bg-orange-500 mx-auto mt-4 rounded-full"></div>
            <div className="mt-6 flex items-start justify-center">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 max-w-3xl">
                <img
                  src="https://dq7c5b6uxkdk2.cloudfront.net/posts/images/avatar.jpg"
                  alt="Avatar"
                  className="h-24 w-24"
                  loading="lazy"
                />
                <div>
                  <p className="text-xl font-bold text-gray-800 text-center md:text-left">
                    羽ばたくエンジニア
                  </p>
                  <p className="mt-1 text-orange-500 flex items-center justify-center md:justify-start text-sm">
                    <FaXTwitter className="mr-2" /> @at_himawari
                  </p>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    2022年法政大学理工学部卒。
                    <br />
                    学生時代にオープンキャンパススタッフとして、映像制作チームを牽引。
                    <br />
                    新卒で、某ITコンサルティング会社に入社。
                    <br />
                    VueやReactなどのフロントエンド技術の他に、PythonやJavaなどのバックエンド技術も扱うフルスタックエンジニア。
                    <br />
                    本プロジェクトでは、AWS, GCP,
                    Azureなどを使ったプロダクト開発や、Vikeとさくらのインターネットを使ったホームページ開発を行っている。
                  </p>
                  <p className="mt-2 text-gray-500 text-sm">
                    趣味：サカナクション、飛行機、カメラ
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
}

export default Page;
