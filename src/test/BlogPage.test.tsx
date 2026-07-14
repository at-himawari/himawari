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
  it("AWS入門講座とその他の記事を別枠に表示する", () => {
    render(<BlogPage posts={posts} />);

    const courseSection = screen.getByRole("region", { name: "AWS入門講座" });
    const otherSection = screen.getByRole("region", { name: "その他の記事" });

    expect(
      within(courseSection).getByRole("link", { name: /AWS 入門講座 7/ }),
    ).toHaveAttribute("href", "/blog/aws-nyuumon-kouza-7");
    expect(
      within(otherSection).getByRole("link", {
        name: /Next\.js と Strapi のローカル検証/,
      }),
    ).toHaveAttribute("href", "/blog/nextjs-strapi-local-dev");
    expect(within(courseSection).queryByText(/Next\.js と Strapi/)).toBeNull();
    expect(within(otherSection).queryByText(/AWS 入門講座 7/)).toBeNull();
  });
});
