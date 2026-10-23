"use client";

import Script from "next/script";
import { useEffect, useRef, useState, type FormEvent } from "react";

type Captcha = { render: (element: HTMLElement, options: Record<string, unknown>) => string; reset: (id: string) => void; remove: (id: string) => void };
const apiUrl = process.env.NEXT_PUBLIC_SUBMISSION_API_URL;
const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;
const inputClass = "mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500";

/** CAPTCHA付きフォームを表示し、受付成功後に完了状態へ切り替える。 */
export default function SubmissionForm() {
  const captchaElement = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const captcha = useRef<Captcha | null>(null);
  const inFlight = useRef(false);
  const [token, setToken] = useState("");
  const [type, setType] = useState("idea");
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready || !siteKey || !captchaElement.current) return;
    const client = (window as Window & { hcaptcha?: Captcha }).hcaptcha;
    if (!client) return;
    captcha.current = client;
    widget.current = client.render(captchaElement.current, {
      sitekey: siteKey, hl: "ja", size: "compact",
      callback: (value: string) => { setToken(value); setError(""); },
      "expired-callback": () => setToken(""),
      "error-callback": () => { setToken(""); setError("認証を読み込めませんでした。ページを再読み込みしてください。"); },
    });
    return () => { if (widget.current !== null) client.remove(widget.current); widget.current = null; };
  }, [ready]);

  /** 入力を送信し、失敗時は入力内容を保持して認証をリセットする。 */
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || !token || !apiUrl) return;
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    if (Array.from(content).length > 2000) { setError("内容は2000文字以内で入力してください。"); return; }
    inFlight.current = true;
    setBusy(true); setError("");
    try {
      const response = await fetch(`${apiUrl.replace(/\/$/, "")}/submissions`, {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, captchaToken: token }), signal: AbortSignal.timeout(20000),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "送信できませんでした。");
      setDone(true); setContent(""); form.reset();
    } catch (failure) {
      setError(failure instanceof Error && failure.name === "Error" ? failure.message : "送信結果を確認できませんでした。受付済みの可能性があります。時間をおいてご確認ください。");
    } finally {
      inFlight.current = false; setBusy(false); setToken("");
      if (widget.current !== null) captcha.current?.reset(widget.current);
    }
  }

  if (done) return <section className="mt-8 rounded-2xl border border-amber-200 bg-white p-8" role="status"><h2 className="text-xl font-bold">投稿を受け付けました</h2><p className="mt-4">お寄せいただき、ありがとうございます。すべての投稿への返信をお約束するものではありません。</p><a className="mt-6 inline-block underline" href="/">トップページへ戻る</a></section>;
  return <form onSubmit={submit} className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8" aria-busy={busy}>
    {siteKey && <Script src="https://js.hcaptcha.com/1/api.js?render=explicit" onReady={() => setReady(true)} onError={() => setError("認証を読み込めませんでした。ページを再読み込みしてください。")} />}
    {(!apiUrl || !siteKey) && <p role="status" className="rounded-lg bg-amber-50 p-4">現在、投稿受付の準備中です。</p>}
    <fieldset disabled={busy} className="space-y-6">
      <legend className="font-bold">投稿の種類 <span className="text-sm text-rose-700">必須</span></legend>
      <div className="flex flex-wrap gap-4">{[["idea", "ネタ投稿"], ["feedback", "サイトに対する意見"], ["business", "業務委託等"]].map(([value, label]) => <label key={value} className="flex items-center gap-2"><input type="radio" name="type" value={value} checked={type === value} onChange={() => setType(value)} required className="accent-amber-600" />{label}</label>)}</div>
      {type === "idea" && <label className="block font-medium">ラジオネーム（公開） <span className="text-sm text-rose-700">必須</span><input className={inputClass} name="radioName" required maxLength={80} autoComplete="nickname" /><span className="mt-1 block text-sm font-normal text-slate-600">投稿を紹介する際に使用します。</span></label>}
      {type !== "idea" && <label className="block font-medium">氏名（非公開） <span className="text-sm text-rose-700">必須</span><input className={inputClass} name="name" required maxLength={100} autoComplete="name" /></label>}
      <label className="block font-medium">メールアドレス（非公開） <span className="text-sm text-rose-700">必須</span><input className={inputClass} name="email" required type="email" maxLength={254} autoComplete="email" /><span className="mt-1 block text-sm font-normal text-slate-600">ご連絡が必要な場合に使用します。</span></label>
      <label className="block font-medium">内容 <span className="text-sm text-rose-700">必須</span><textarea className={inputClass} name="content" rows={9} required value={content} onChange={(event) => setContent(event.target.value)} aria-describedby="content-count" /><span id="content-count" className={`mt-1 block text-right text-sm ${Array.from(content).length > 2000 ? "text-rose-700" : "text-slate-600"}`}>{Array.from(content).length} / 2000文字</span></label>
      <div aria-hidden="true" className="hidden"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <p className="text-sm leading-6 text-slate-600">氏名とメールアドレスは公開しません。投稿内容は確認・返信のために保存し、管理者へメールで通知します。ネタ投稿はラジオネームと内容をサイトや配信等で紹介する場合があります。</p>
      <label className="flex items-start gap-2 text-sm leading-6"><input type="checkbox" required className="mt-1" /> <span>上記の利用目的と<a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-amber-800 underline">プライバシーポリシー（別タブ）</a>を確認しました。 <span className="text-sm text-rose-700">必須</span></span></label>
      <div ref={captchaElement} />
      <p className="text-xs text-slate-500">スパム対策にhCaptchaを利用します。<a href="https://www.hcaptcha.com/privacy" className="underline">プライバシーポリシー</a>・<a href="https://www.hcaptcha.com/terms" className="underline">利用規約</a></p>
      {error && <p role="alert" className="rounded-lg bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
      <button type="submit" disabled={busy || !token || !apiUrl || Array.from(content).length > 2000} className="w-full rounded-xl bg-amber-500 px-5 py-3 font-bold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50">{busy ? "送信中…" : "送信する"}</button>
    </fieldset>
  </form>;
}
