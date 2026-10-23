import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import HeroProductSlideshow from "../components/HeroProductSlideshow";

const products = [
  { title: "プロダクトA", description: "説明A", href: "/a", badge: "Tool" },
  { title: "プロダクトB", description: "説明B", href: "/b", badge: "AI" },
];

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("HeroProductSlideshow", () => {
  it("自動で切り替わり、手動選択後は停止し、再生操作で再開する", () => {
    vi.useFakeTimers();
    render(<HeroProductSlideshow products={products} />);
    act(() => vi.advanceTimersByTime(6000));
    expect(screen.getByRole("heading", { name: "プロダクトB" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "次のプロダクト" }));
    act(() => vi.advanceTimersByTime(6000));
    expect(screen.getByRole("heading", { name: "プロダクトA" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "再生" }));
    act(() => vi.advanceTimersByTime(6000));
    expect(screen.getByRole("heading", { name: "プロダクトB" })).toBeInTheDocument();
  });

  it("カードにフォーカスがある間は自動切り替えを止める", () => {
    vi.useFakeTimers();
    render(<HeroProductSlideshow products={products} />);
    fireEvent.focus(screen.getByRole("link"));
    act(() => vi.advanceTimersByTime(12000));
    expect(screen.getByRole("heading", { name: "プロダクトA" })).toBeInTheDocument();
  });
});
