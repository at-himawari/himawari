"use client";

import { useEffect, useRef, useState } from "react";
import { trackLead } from "../utils/analytics";
import styles from "./HomeHeader.module.css";

const contactUrl = "https://forms.gle/D8WSByjAnYGGtoGw9";
const sections = [
  ["products", "プロダクト"],
  ["news", "お知らせ"],
  ["home-blog", "ブログ"],
  ["profile", "プロフィール"],
] as const;

/** トップページ専用の固定ヘッダーとセクション移動を表示する。 */
export default function HomeHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const header = headerRef.current;
    const page = header?.parentElement?.parentElement;
    if (!header || !page) return;
    let frame: number | null = null;
    const targets = sections.map(([id]) => document.getElementById(id));

    /** 固定ヘッダー直下を通過しているセクションを現在位置とする。 */
    const updateActiveSection = () => {
      frame = null;
      const boundary = header.getBoundingClientRect().bottom + 17;
      const current = targets.find((target) => {
        if (!target) return false;
        const bounds = target.getBoundingClientRect();
        return bounds.top <= boundary && bounds.bottom > boundary;
      });
      setActiveSection(current?.id ?? null);
    };

    /** スクロール中の位置判定を描画フレームごとにまとめる。 */
    const scheduleUpdate = () => {
      if (frame === null) frame = window.requestAnimationFrame(updateActiveSection);
    };

    /** 文字拡大や折り返し後の実寸を移動先の余白に反映する。 */
    const updateHeight = () => {
      page.style.setProperty("--home-header-height", `${header.getBoundingClientRect().height}px`);
      scheduleUpdate();
    };
    updateHeight();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(updateHeight);
    observer?.observe(header);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame !== null) window.cancelAnimationFrame(frame);
      observer?.disconnect();
      page.style.removeProperty("--home-header-height");
    };
  }, []);

  return (
    <div className={styles.spacer}>
      <header ref={headerRef} className={styles.header}>
        <div className={styles.inner}>
          <a href="#hero" className={styles.brand} aria-label="Himawari Project トップへ戻る">
            <img src="https://dq7c5b6uxkdk2.cloudfront.net/posts/images/himawari.png" alt="" width={32} height={32} />
            <h1><span>H</span>imawari <span>P</span>roject</h1>
          </a>
          <nav className={styles.navigation} aria-label="ページ内メニュー">
            {sections.map(([id, label]) => (
              <a key={id} href={`#${id}`} aria-current={activeSection === id ? "location" : undefined}>{label}</a>
            ))}
          </nav>
          <a href={contactUrl} className={styles.contact} onClick={() => trackLead("home_header_contact", contactUrl)}>
            ネタを投稿する <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>
    </div>
  );
}
