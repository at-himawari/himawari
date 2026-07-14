import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AwsBeginnerCoursePage from "../views/blog/aws-beginner-course/+Page";

describe("AWS入門講座特設ページ", () => {
  it("講座記事のみを一覧表示する", () => {
    render(
      <AwsBeginnerCoursePage
        posts={[
          {
            slug: "aws-nyuumon-kouza-7",
            title: "AWS 入門講座 7",
            date: "2026-06-01",
            categories: ["Cloud"],
            tags: ["AWS"],
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "AWS入門講座", level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText("全1記事")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /AWS 入門講座 7/ }),
    ).toHaveAttribute("href", "/blog/aws-nyuumon-kouza-7");
  });
});
