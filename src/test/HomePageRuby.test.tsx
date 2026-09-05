import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "../views/index/+Page";

describe("HomePage", () => {
  it("トップページ全体をふりがな変換の対象外にする", () => {
    const { container } = render(
      <HomePage
        data={{
          latestPosts: [],
          featuredPosts: [],
          newsItems: [],
        }}
      />,
    );

    expect(container.firstElementChild).toHaveAttribute(
      "data-disable-rubyful",
      "true",
    );
    expect(container.firstElementChild).toHaveAttribute(
      "data-rubyful-ignore",
      "true",
    );
  });
});
