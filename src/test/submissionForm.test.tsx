import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { useEffect } from "react";

vi.hoisted(() => {
  process.env.NEXT_PUBLIC_SUBMISSION_API_URL = "https://api.example.com";
  process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY = "site-key";
});
vi.mock("next/script", () => ({ default: function Script({ onReady }: { onReady: () => void }) { useEffect(onReady, []); return null; } }));
import SubmissionForm from "../app/submit/SubmissionForm";
let captchaCallback: (token: string) => void;
const fetchMock = vi.fn();
beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  vi.stubGlobal("hcaptcha", { render: vi.fn((_element, options) => { captchaCallback = options.callback; return "widget"; }), remove: vi.fn(), reset: vi.fn() });
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

/** 必須項目と認証を入力する。 */
function fill() {
  fireEvent.change(screen.getByLabelText(/ラジオネーム/), { target: { value: "読者" } });
  fireEvent.change(screen.getByLabelText(/^内容.*必須/), { target: { value: "新しい提案" } });
  fireEvent.change(screen.getByLabelText(/メールアドレス（非公開）/), { target: { value: "reader@example.com" } });
  fireEvent.click(screen.getByRole("checkbox"));
  act(() => captchaCallback("verified-token"));
}
test("CAPTCHA未認証時は送信不可で、本文の上限超過も送信を止める", () => {
  render(<SubmissionForm />);
  expect(screen.getByRole("button", { name: "送信する" })).toBeDisabled();
  fill();
  expect(screen.getByRole("button", { name: "送信する" })).toBeEnabled();
  fireEvent.change(screen.getByLabelText(/^内容.*必須/), { target: { value: "🌻".repeat(2001) } });
  expect(screen.getByText("2001 / 2000文字")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "送信する" })).toBeDisabled();
});
test("正常送信時に専用APIへ送信し、完了表示に切り替える", async () => {
  fetchMock.mockResolvedValue({ ok: true, json: async () => ({ message: "ok" }) });
  render(<SubmissionForm />); fill();
  fireEvent.submit(screen.getByRole("button", { name: "送信する" }).closest("form")!);
  await screen.findByText("投稿を受け付けました");
  const [url, request] = fetchMock.mock.calls[0];
  expect(url).toBe("https://api.example.com/submissions");
  expect(JSON.parse(request.body)).toMatchObject({ radioName: "読者", content: "新しい提案", captchaToken: "verified-token" });
});
test("API失敗時は入力を保持し、認証をリセットする", async () => {
  fetchMock.mockResolvedValue({ ok: false, json: async () => ({ message: "連続投稿はできません。" }) });
  render(<SubmissionForm />); fill();
  fireEvent.submit(screen.getByRole("button", { name: "送信する" }).closest("form")!);
  await screen.findByRole("alert");
  expect(screen.getByLabelText(/^内容.*必須/)).toHaveValue("新しい提案");
  await waitFor(() => expect(screen.getByRole("button", { name: "送信する" })).toBeDisabled());
});

test("種別ごとに名前欄を切り替え、表示する名前とメールを必須とする", () => {
  render(<SubmissionForm />);
  expect(screen.getByLabelText(/メールアドレス（非公開）/)).toBeRequired();
  expect(screen.getByLabelText(/ラジオネーム/)).toBeRequired();
  expect(screen.queryByLabelText(/氏名（非公開）/)).not.toBeInTheDocument();
  for (const name of ["業務委託等", "サイトに対する意見"]) {
    fireEvent.click(screen.getByRole("radio", { name }));
    expect(screen.getByLabelText(/氏名（非公開）/)).toBeRequired();
    expect(screen.queryByLabelText(/ラジオネーム/)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/メールアドレス（非公開）/)).toBeRequired();
  }
  fireEvent.click(screen.getByRole("radio", { name: "ネタ投稿" }));
  expect(screen.getByLabelText(/ラジオネーム/)).toBeRequired();
  expect(screen.queryByLabelText(/氏名（非公開）/)).not.toBeInTheDocument();
});

test.each(["サイトに対する意見", "業務委託等"])("%sでは氏名を送りラジオネームを送らない", async (name) => {
  fetchMock.mockResolvedValue({ ok: true, json: async () => ({ message: "ok" }) });
  render(<SubmissionForm />);
  fill();
  fireEvent.click(screen.getByRole("radio", { name }));
  fireEvent.change(screen.getByLabelText(/氏名（非公開）/), { target: { value: "担当者" } });
  fireEvent.submit(screen.getByRole("button", { name: "送信する" }).closest("form")!);
  await screen.findByText("投稿を受け付けました");
  const body = JSON.parse(fetchMock.mock.calls[0][1].body);
  expect(body.name).toBe("担当者");
  expect(body).not.toHaveProperty("radioName");
});
