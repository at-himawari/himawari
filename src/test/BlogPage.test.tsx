import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import BlogPage from "../views/blog/+Page";

const posts = [
  {
    slug: "aws-nyuumon-kouza-7",
    title: "AWS 入門講座 7",
    date: "2026-06-01",
    categories: ["Cloud"],
    tags: ["AWS"],
  },
  {
    slug: "nextjs-strapi-local-dev",
    title: "Next.js と Strapi のローカル検証",
    date: "2026-06-02",
    categories: ["Development"],
    tags: ["Next.js"],
  },
];

describe("記事一覧ページ", () => {
  it("AWS入門講座を特設ページへの案内として表示する", () => {
    render(<BlogPage posts={posts} />);

    const courseSection = screen.getByRole("region", { name: "AWS入門講座" });
    const otherSection = screen.getByRole("region", { name: "記事一覧" });

    expect(
      within(courseSection).getByRole("heading", { name: "注目", level: 2 }),
    ).toBeInTheDocument();
    expect(
      within(courseSection).getByRole("link", {
        name: "AWS入門講座の特設ページへ、全1記事",
      }),
    ).toHaveAttribute("href", "/blog/aws-beginner-course");
    expect(
      within(otherSection).getByRole("link", {
        name: /Next\.js と Strapi のローカル検証/,
      }),
    ).toHaveAttribute("href", "/blog/nextjs-strapi-local-dev");
    expect(screen.queryByRole("link", { name: /AWS 入門講座 7/ })).toBeNull();
  });
});
