"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import { FaSearch } from "react-icons/fa"; // 虫眼鏡アイコン
import { FaXTwitter } from "react-icons/fa6";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import NewsSection from "../../components/NewsSection";
import BlogSection from "../../components/BlogSection";
import GoogleAd from "../../components/GoogleAd";
import type { HomePageData } from "./+data";
import { trackLead, trackSelectContent } from "../../utils/analytics";
import styles from "./HomePage.module.css";

const featuredProducts = [
  {
    title: "議事録メーカー",
    description:
      "会議メモをすばやく整理して、共有しやすい形にまとめる議事録作成支援ツールです。",
    href: "https://gijiroku-maker.at-himawari.com/",
    image: "https://gijiroku-maker.at-himawari.com/logo.png",
    badge: "Tool",
    accentClass: "from-amber-400 via-orange-500 to-rose-500",
    cta: "プロダクトを見る",
  },
  {
    title: "AI面接コーチ",
    description:
      "AIと対話して面接練習を行います。自身のレジュメをもとに、模擬面接やフィードバックを提供するサービスです。",
    href: "https://aimensetsu.at-himawari.com/",
    image: "https://aimensetsu.at-himawari.com/ogp.png",
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
    image: "https://pomodoro.at-himawari.com/og-image.jpg?v=3",
    badge: "Tool",
    accentClass: "from-rose-500 via-red-500 to-orange-500",
    cta: "プロダクトを見る",
  },
];

function GatheringProduct({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !window.IntersectionObserver) return;

    // Observe the stationary wrapper so the animated card cannot retrigger itself.
    const observer = new IntersectionObserver(
      ([entry]) => {
        container.dataset.gather = entry.isIntersecting ? "visible" : "pending";
      },
      { threshold: 0.12 },
    );
    container.dataset.gather = "pending";
    observer.observe(container);
    return () => {
      observer.disconnect();
      delete container.dataset.gather;
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.productEntrance}>
      <div className={styles.productMotion}>{children}</div>
    </div>
  );
}

function ProfileReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !window.IntersectionObserver) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        element.dataset.revealed = "true";
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    element.dataset.revealed = "false";
    observer.observe(element);
    return () => {
      observer.disconnect();
      delete element.dataset.revealed;
    };
  }, []);

  return <div ref={ref} className={styles.profileReveal}>{children}</div>;
}


function Page({ data }: { data: HomePageData }) {
  const { latestPosts, featuredPosts, newsItems, error } = data;
  const heroCopyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = heroCopyRef.current;
    if (!element) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    
    if (!window.IntersectionObserver) {
      element.dataset.visible = "true";
      return () => {
        delete element.dataset.visible;
      };
    }
    const observer = new IntersectionObserver(([entry]) => {
      element.dataset.visible = String(entry.isIntersecting);
    }, { threshold: 0.1 });
    observer.observe(element);
    return () => {
      observer.disconnect();
      delete element.dataset.visible;
    };
  }, []);


  return (
    <>
      <div
        className={`${styles.page} font-sans overflow-x-hidden`}
        data-disable-rubyful="true"
        data-rubyful-ignore="true"
      >
        <Header />

        <section id="hero" className={styles.hero}>
          <div className={styles.heroLayout}>
            <div ref={heroCopyRef} className={styles.heroCopy}>
              <p className={styles.heroEyebrow}>Himawari Project</p>
              <h2 className={styles.heroTitle}>
                <span className={styles.heroTitleLine}>アイデアを、</span>
                <span className={`${styles.heroTitleLine} ${styles.heroTitleAccent}`}>動くサービスに。</span>
              </h2>
              <p className={styles.heroDescription}>
                Webサイト、業務システム、AI活用まで。
                <br className="hidden sm:block" />
                企画から開発まで、一緒に伴奏します。
              </p>

              <div className={styles.heroActions}>
                <a
                  href="https://forms.gle/D8WSByjAnYGGtoGw9"
                  className={styles.heroPrimary}
                  onClick={() => trackLead("home_contact", "https://forms.gle/D8WSByjAnYGGtoGw9")}
                >
                  相談してみる <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>

            <div className={styles.heroShowcase} aria-label="プロダクトの紹介">
              <div className={styles.heroOrbit} aria-hidden="true" />
              <a
                href="https://aimensetsu.at-himawari.com/"
                className={`${styles.heroPreview} ${styles.heroPreviewAi}`}
                onClick={() => trackSelectContent("product", "https://aimensetsu.at-himawari.com/", "AI面接コーチ")}
              >
                <div className={styles.heroPreviewBar}><span>AI面接コーチ</span><span aria-hidden="true">↗</span></div>
                <img src="https://aimensetsu.at-himawari.com/ogp.png" alt="AIと対話する面接練習サービス" width={1200} height={630} />
              </a>
              <a
                href="https://pomodoro.at-himawari.com/"
                className={`${styles.heroPreview} ${styles.heroPreviewTimer}`}
                onClick={() => trackSelectContent("product", "https://pomodoro.at-himawari.com/", "ポモドーロタイマー")}
              >
                <div className={styles.heroPreviewBar}><span>毎日の集中をサポート</span><span aria-hidden="true">↗</span></div>
                <img src="https://pomodoro.at-himawari.com/og-image.jpg?v=3" alt="ポモドーロタイマー" width={1200} height={630} />
              </a>
            </div>
            <a href="#products" className={styles.heroScroll}>プロダクトを見てみる <span aria-hidden="true">↓</span></a>
          </div>
        </section>

        {/* プロダクトセクション */}
        <section id="products" className={`${styles.products} relative overflow-hidden py-16 md:py-24`}>
          <div className="w-full px-5 md:px-8">
            <div className="mb-12 flex flex-col gap-5 md:mb-16 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em]">Products</p>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">プロダクト</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-2 md:gap-y-20 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <GatheringProduct key={product.title}>
                  <a
                    href={product.href}
                    className={styles.productLink}
                    onClick={() =>
                      trackSelectContent("product", product.href, product.title)
                    }
                  >
                    <div className={styles.productVisual}>
                      {product.image ? (
                        <img
                          src={product.image}
                          alt=""
                          width={1200}
                          height={630}
                          loading="lazy"
                          className={styles.productImage}
                        />
                      ) : (
                        <div className={styles.linePreview} aria-hidden="true">
                          <span className={styles.lineLabel}>LINE AI</span>
                          <span className={styles.lineTitle}>あなたのとなりのAI</span>
                          <span className={styles.lineBubble}>アイデアを一緒に考えよう。</span>
                          <span className={styles.lineReply}>いつものLINEから、気軽に。</span>
                        </div>
                      )}
                      <span className={styles.productOverlay} aria-hidden="true">プロダクトを見る ↗</span>
                    </div>
                    <div className="mt-5 md:mt-6">
                      <p className="mb-2 text-xs tracking-wider"># {product.badge}</p>
                      <h3 className="text-lg font-semibold tracking-wide">{product.title}</h3>
                    </div>
                  </a>
                </GatheringProduct>
              ))}
            </div>
          </div>
        </section>

        <NewsSection newsItems={newsItems} />
        <BlogSection
          latestPosts={latestPosts}
          featuredPosts={featuredPosts}
          error={error}
        />
        <section id="profile" className={styles.profile} aria-labelledby="profile-title">
          <div className={styles.profileLayout}>
            <ProfileReveal>
              <div className={styles.profilePortrait}>
                <img
                  src="/images/profile.png"
                  alt="羽ばたくエンジニアのプロフィール写真"
                  width={400}
                  height={400}
                  loading="lazy"
                />
              </div>
            </ProfileReveal>
            <ProfileReveal>
              <div className={styles.profileStory}>
                <p className={styles.profileEyebrow}>プロフィール</p>
                <div className={styles.profileIdentity}>
                  <p className={styles.profileRole}>Full-stack engineer,<br />Creator</p>
                  <div>
                    <h2 id="profile-title" className={styles.profileName}>羽ばたくエンジニア</h2>
                    <p className={styles.profileProject}>Himawari Project</p>
                  </div>
                  <a href="https://x.com/at_himawari" className={styles.profileSocial} aria-label="羽ばたくエンジニアのXアカウント">
                    <FaXTwitter aria-hidden="true" /><span>@at_himawari</span>
                  </a>
                </div>
                <div className={styles.profileBody}>
                  <p>技術と対話で、想いをカタチにする。そんなものづくりに取り組む、フルスタックエンジニアです。</p>
                  <p>2022年に法政大学理工学部を卒業後、ITコンサルティング会社に新卒入社。フロントエンドからバックエンド、クラウドまで、幅広い領域を扱っています。</p>
                  <p>Himawari Projectでは、AIを活用したサービスやWebサイト、日々の作業を支えるツールを制作しています。React・Next.jsによるWeb制作や、AWS・GCP・Azureを活用したプロダクト開発に取り組んでいます。</p>
                  <p>大切にしているのは、つくりたいものの背景にある想いに耳を傾けること。技術と対話の両面から、課題の解決を支えたいと考えています。</p>
                  <p>好きなものは、飛行機、カメラ、旅行、映像編集。ものをつくることと同じくらい、知らない景色に出会うことにも惹かれます。</p>
                </div>
                <a
                  href="https://forms.gle/D8WSByjAnYGGtoGw9"
                  className={styles.profileContact}
                  onClick={() => trackLead("profile_contact", "https://forms.gle/D8WSByjAnYGGtoGw9")}
                >相談してみる <span aria-hidden="true">↗</span></a>
              </div>
            </ProfileReveal>
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
