"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { FaXTwitter } from "react-icons/fa6";
import HomeHeader from "../../components/HomeHeader";
import HeroProductSlideshow from "../../components/HeroProductSlideshow";
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
        <HomeHeader />

        <section id="hero" className={styles.hero}>
          <div className={styles.heroLayout}>
            <div ref={heroCopyRef} className={styles.heroCopy}>
              <div className={styles.heroHeading}>
                <h2 className={styles.heroTitle}>
                  <span className={styles.heroTitleLine}>
                    <span className={styles.heroTitleRed}>ワ</span>ク<span className={styles.heroTitleBlue}>ワ</span>ク<span className={styles.heroTitleGreen}>ラ</span>ボ<span className={styles.heroTitlePlus}>＋</span>
                  </span>
                </h2>
                <p className={styles.heroEyebrow}>Himawari Project</p>
              </div>
              <p className={styles.heroDescription}>
                面白いことを楽しくやる
                <br className="hidden sm:block" />
                システム開発、Web制作、AIサービスの開発などを共に楽しくやっていきましょう
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

            <HeroProductSlideshow products={featuredProducts} />
            <a href="#products" className={styles.heroScroll}>プロダクトを見てみる <span aria-hidden="true">↓</span></a>
          </div>
        </section>

        {/* プロダクトセクション */}
        <section id="products" className={`${styles.products} relative overflow-hidden py-16 md:py-24`}>
          <div className="w-full pt-5 px-5 md:px-8">
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
            <header className={styles.profileHeading}>
              <p className={styles.profileHeadingEn}>Profile</p>
              <h2 id="profile-title" className={styles.profileHeadingJa}>
                プロフィール
              </h2>
            </header>
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
                <div className={styles.profileIdentity}>
                  <p className={styles.profileRole}>Full-stack engineer,<br />Creator</p>
                  <div>
                    <h3 className={styles.profileName}>羽ばたくエンジニア</h3>
                    <p className={styles.profileProject}>Himawari Project</p>
                  </div>
                  <a href="https://x.com/at_himawari" className={styles.profileSocial} aria-label="羽ばたくエンジニアのXアカウント">
                    <FaXTwitter aria-hidden="true" /><span>@at_himawari</span>
                  </a>
                </div>
                <div className={styles.profileBody}>
                  <p>とにかく面白いことを真面目にだけど楽しくやるがモットーです。</p>
                  <p>2022年に法政大学理工学部を卒業後、ITコンサルティング会社に入社。金融業・製造業・通信キャリア等の分野で、フロントエンドからバックエンド、クラウドまで、幅広い領域の開発を経験しています。</p>
                  <p>Himawari Projectでは、AIを活用したサービスやWebサイト、日々の作業を支えるツールを制作しています。React・Next.jsによるWeb制作や、Amazon Web Services・Google Cloud Platform・Microsoft Azureを活用したプロダクト開発に取り組んでいます。</p>
                  <p>何かを作ることが好きです。プロダクト開発以外にも、YouTube動画制作や一眼レフカメラでの撮影・現像なども行なっています。</p>
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
