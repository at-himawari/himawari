"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./NewsSection.module.css";

export interface NewsItem {
  title: string;
  date: string;
  content: string;
  link?: string;
}
interface NewsSectionProps {
  newsItems: NewsItem[];
}

function toDisplayText(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map(toDisplayText).filter(Boolean).join("\n");
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;

    if (typeof record.text === "string") {
      return record.text;
    }

    if (Array.isArray(record.children)) {
      return toDisplayText(record.children);
    }

    if (Array.isArray(record.content)) {
      return toDisplayText(record.content);
    }
  }

  return "";
}

function getNewsItemKey(item: NewsItem, absoluteIndex: number): string {
  return [
    toDisplayText(item.date),
    toDisplayText(item.title),
    toDisplayText(item.content),
    toDisplayText(item.link),
    absoluteIndex,
  ].join("|");
}

const NewsSection: React.FC<NewsSectionProps> = ({ newsItems = [] }) => {
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);
  const items = newsItems || [];
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const page = Math.min(currentPage, Math.max(1, totalPages));
  const startIndex = (page - 1) * itemsPerPage;
  const displayedItems = items.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !window.IntersectionObserver) return;
    const observer = new IntersectionObserver(([entry]) => {
      section.dataset.visible = String(entry.isIntersecting);
    }, { threshold: 0.18 });
    observer.observe(section);
    return () => {
      observer.disconnect();
      delete section.dataset.visible;
    };
  }, []);

  return (
    <section ref={sectionRef} id="news" className={styles.section} aria-labelledby="news-title">
      <div className={styles.layout}>
        <header className={styles.heading}>
          <p>News</p>
          <h2 id="news-title">お知らせ</h2>
          <span>Himawari Projectの最新情報。</span>
        </header>
        <div className={styles.content}>
          {displayedItems.length ? (
            <ul key={page} className={styles.list}>
              {displayedItems.map((item, index) => {
                const title = toDisplayText(item.title) || "お知らせ";
                const date = toDisplayText(item.date);
                const content = toDisplayText(item.content);
                const link = toDisplayText(item.link);
                const body = (
                  <>
                    <span className={styles.date}>{date}</span>
                    <div className={styles.copy}>
                      <h3>{title}</h3>
                      <p>{content}</p>
                    </div>
                    {link && <span className={styles.arrow} aria-hidden="true">↗</span>}
                  </>
                );
                return (
                  <li key={getNewsItemKey(item, startIndex + index)} className={styles.item}>
                    {link ? (
                      <a href={link} target="_blank" rel="noopener noreferrer" className={styles.row}>{body}</a>
                    ) : <div className={styles.row}>{body}</div>}
                  </li>
                );
              })}
            </ul>
          ) : <p className={styles.empty}>現在、お知らせはありません。</p>}
          {totalPages > 1 && (
            <nav className={styles.pagination} aria-label="ニュースのページ切り替え">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentPage(index + 1)}
                  aria-current={page === index + 1 ? "page" : undefined}
                >{index + 1}</button>
              ))}
            </nav>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
