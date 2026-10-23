"use client";

import { useEffect, useState } from "react";
import { trackSelectContent } from "../utils/analytics";
import styles from "../views/index/HomePage.module.css";

type Product = {
  title: string;
  description: string;
  href: string;
  image?: string;
  badge: string;
};

/** プロダクトを一定間隔で紹介し、操作中は自動切り替えを止める。 */
export default function HeroProductSlideshow({ products }: { products: Product[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || hovered || reducedMotion || products.length < 2) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % products.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [paused, hovered, reducedMotion, products.length]);

  if (!products.length) return null;
  const index = active % products.length;
  const product = products[index];

  /** 手動で指定したカードに移動し、自動再生を停止する。 */
  function selectSlide(next: number) {
    setActive((next + products.length) % products.length);
    setPaused(true);
  }

  return (
    <div
      className={styles.heroShowcase}
      role="region"
      aria-roledescription="カルーセル"
      aria-label="プロダクトの紹介"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setPaused(true)}
    >
      <div className={styles.heroSlideStage} aria-live={paused || reducedMotion ? "polite" : "off"}>
        <a
          className={styles.heroProductCard}
          href={product.href}
          onClick={() => trackSelectContent("product", product.href, product.title)}
        >
          <div className={styles.heroCardHeader}>
            <span>{product.badge}</span>
            <span aria-hidden="true">↗</span>
          </div>
          <div className={styles.heroCardMedia}>
            {product.image ? (
              <img src={product.image} alt="" width={1200} height={630} />
            ) : (
              <div className={styles.heroCardPlaceholder} aria-hidden="true">LINE AI<span>あざらし君</span></div>
            )}
          </div>
          <div className={styles.heroCardBody}>
            <h3>{product.title}</h3>
            <p>{product.description}</p>
          </div>
        </a>
      </div>
      <div className={styles.heroSlideControls}>
        <button type="button" aria-label="前のプロダクト" onClick={() => selectSlide(index - 1)}>←</button>
        <div className={styles.heroSlideDots}>
          {products.map((item, position) => (
            <button
              key={item.href}
              type="button"
              aria-label={`${item.title}を表示`}
              aria-current={position === index ? "true" : undefined}
              onClick={() => selectSlide(position)}
            ><span /></button>
          ))}
        </div>
        <button type="button" aria-label="次のプロダクト" onClick={() => selectSlide(index + 1)}>→</button>
        {!reducedMotion && (
          <button type="button" className={styles.heroSlidePlayback} onClick={() => setPaused((current) => !current)}>
            {paused ? "再生" : "一時停止"}
          </button>
        )}
      </div>
    </div>
  );
}
