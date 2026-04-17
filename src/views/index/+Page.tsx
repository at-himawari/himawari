"use client";

import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa"; // 虫眼鏡アイコン
import { FaXTwitter } from "react-icons/fa6";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import NewsSection from "../../components/NewsSection";
import BlogSection from "../../components/BlogSection";
import GoogleAd from "../../components/GoogleAd";
import type { HomePageData } from "./+data";

const featuredProducts = [
  {
    title: "議事録メーカー",
    description:
      "会議メモをすばやく整理して、共有しやすい形にまとめる議事録作成支援ツールです。",
    href: "https://gijiroku-maker.at-himawari.com/",
    badge: "Tool",
    accentClass: "from-amber-400 via-orange-500 to-rose-500",
    cta: "プロダクトを見る",
  },
  {
    title: "AI面接コーチ",
    description: "面接練習のサポートを行います。近々大幅アップデート予定",
    href: "https://aimensetsu.at-himawari.com/",
    badge: "Career",
    accentClass: "from-sky-500 via-cyan-500 to-emerald-500",
    cta: "プロダクトを見る",
  },
  {
    title: "あざらし君@AI",
    description:
      "LINEからそのまま使えるAIアシスタント。日常の相談やアイデア出しを身近にサポートします。",
    href: "/software/line_ai",
    badge: "LINE AI",
    accentClass: "from-lime-400 via-green-500 to-emerald-600",
    cta: "詳細を見る",
  },
  {
    title: "ポモドーロタイマー",
    description:
      " 集中力を高めるためのタイマーツール。集中力を維持し、効率的な作業をサポートします。",
    href: "https://pomodoro.at-himawari.com/",
    badge: "Tool",
    accentClass: "from-rose-500 via-red-500 to-orange-500",
    cta: "プロダクトを見る",
  },
];

const INITIAL_VISIBLE_PRODUCTS = 3;

// タイプライター風アニメーションのカスタムフック
const useTypewriter = (
  text: string,
  speed: number = 100,
  delay: number = 1000,
) => {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const characters = Array.from(text);
    let timeout: number | undefined;

    // 開始遅延
    const startTimeout = window.setTimeout(() => {
      setIsTyping(true);

      const typeChar = (currentIndex: number) => {
        if (currentIndex < characters.length) {
          setDisplayText(characters.slice(0, currentIndex + 1).join(""));
          timeout = window.setTimeout(() => typeChar(currentIndex + 1), speed);
        } else {
          setIsTyping(false);
        }
      };

      typeChar(0);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [text, speed, delay]);

  return { displayText, isTyping };
};

function Page({ data }: { data: HomePageData }) {
  const { latestPosts, featuredPosts, newsItems, error } = data;
  const [showAllProducts, setShowAllProducts] = useState(false);

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

  const visibleProducts = showAllProducts
    ? featuredProducts
    : featuredProducts.slice(0, INITIAL_VISIBLE_PRODUCTS);

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
                <span
                  className="text-xl md:text-2xl text-gray-800 font-medium whitespace-nowrap"
                  data-rubyful-ignore="true"
                >
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
              ></button>
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

        {/* プロダクトセクション */}
        <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 via-orange-50/50 to-white py-16">
          <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.15),transparent_60%)]"></div>
          <div className="container relative mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <div className="mx-auto mb-10 max-w-3xl text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
                  Products
                </p>
                <h2 className="mt-4 text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
                  課題に寄り添うプロダクトを、
                  <br className="hidden sm:block" />
                  <span className="sm:hidden"> </span>
                  すぐ試せる形で。
                </h2>
                <p className="mt-4 text-base leading-relaxed text-gray-600 md:text-lg">
                  Himawari
                  Projectが手がける代表的なプロダクトです。業務効率化からAI活用まで、相談しやすく使いやすい体験を目指して制作しています。
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {visibleProducts.map((product) => (
                  <a
                    key={product.title}
                    href={product.href}
                    className="group flex h-full flex-col rounded-3xl border border-white/70 bg-white p-7 shadow-lg shadow-orange-100/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                  >
                    <div
                      className={`mb-6 h-2 w-24 rounded-full bg-gradient-to-r ${product.accentClass}`}
                    ></div>
                    <div className="mb-4 inline-flex w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                      {product.badge}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {product.title}
                    </h3>
                    <p className="mt-4 flex-1 text-sm leading-7 text-gray-600">
                      {product.description}
                    </p>
                    <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-5 text-sm font-semibold text-orange-500">
                      <span>{product.cta}</span>
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </a>
                ))}
              </div>

              {featuredProducts.length > INITIAL_VISIBLE_PRODUCTS && (
                <div className="mt-10 text-center">
                  <button
                    type="button"
                    onClick={() => setShowAllProducts((current) => !current)}
                    className="inline-flex items-center gap-3 rounded-full border border-orange-200 bg-white px-6 py-3 text-sm font-bold text-orange-500 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md"
                  >
                    <span>
                      {showAllProducts ? "表示を減らす" : "もっとみる"}
                    </span>
                    <span
                      className={`transition-transform duration-300 ${
                        showAllProducts ? "rotate-180" : ""
                      }`}
                    >
                      ↓
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <NewsSection newsItems={newsItems} />
        <BlogSection
          latestPosts={latestPosts}
          featuredPosts={featuredPosts}
          error={error}
        />
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
                    2022年に法政大学理工学部を卒業後、ITコンサルティング会社に新卒入社。
                    <br />
                    フロントエンドからバックエンド、クラウドまで幅広く扱い、技術と対話の両面から課題解決を支えるフルスタックエンジニアです。
                    <br />
                    Himawari
                    Projectでは、AWS・GCP・Azureを活用したプロダクト開発や、React+VikeによるWebサイト制作に取り組んでいます。
                  </p>
                  <p className="mt-2 text-gray-500 text-sm">
                    趣味：飛行機、カメラ、旅行、映像編集
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <MainPageAd compact />
        <Footer />
      </div>
    </>
  );
}

export default Page;

function MainPageAd({ compact = false }: { compact?: boolean }) {
  return (
    <section
      className={`bg-white ${compact ? "py-6" : "py-8"}`}
      aria-label="広告"
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto min-h-[120px] max-w-5xl">
          <p className="text-sm text-gray-500 mb-4">スポンサーリンク</p>
          <GoogleAd slot="4759075102" format="auto" fullWidthResponsive />
        </div>
      </div>
    </section>
  );
}
