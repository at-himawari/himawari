import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NewsSection, { type NewsItem } from "../components/NewsSection";

const createNewsItems = (): NewsItem[] =>
  [
    ...Array.from({ length: 6 }, (_, index) => ({
      title: `ニュース${index + 1}`,
      date: `2026-04-0${index + 1}`,
      content: `本文${index + 1}`,
    })),
    {
      title: "リッチテキストのお知らせ",
      date: "2026-04-07",
      content: [
        {
          type: "paragraph",
          children: [{ text: "Strapiのリッチテキスト本文" }],
        },
      ],
    },
  ] as unknown as NewsItem[];

describe("NewsSection", () => {
  it("2ページ目のリッチテキスト本文を文字列として表示する", () => {
    render(<NewsSection newsItems={createNewsItems()} />);

    expect(screen.getByText("ニュース1")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "2" }));

    expect(screen.getByText("リッチテキストのお知らせ")).toBeInTheDocument();
    expect(screen.getByText("Strapiのリッチテキスト本文")).toBeInTheDocument();
  });
});
