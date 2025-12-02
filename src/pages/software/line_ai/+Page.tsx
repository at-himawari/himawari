import React from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

// ※実際のQRコード画像のパスや、LINE公式アカウントのURLに置き換えてください
const LINE_ADD_URL = "https://lin.ee/45Fuxvc";
const QR_CODE_IMAGE =
  "https://dq7c5b6uxkdk2.cloudfront.net/line-qr-placeholder.jpg";

export default function Page() {
  return (
    <>
      <Header></Header>
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        {/* --- Hero Section (Card) --- */}
        <section className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 text-center animate-fade-in">
          <div className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-wider text-green-800 uppercase bg-green-100 rounded-full">
            New Release
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            あなたのとなりの
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">
              AI
            </span>
          </h1>
          <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            アプリの切り替えは不要。
            <br className="md:hidden" />
            いつものLINE画面が、最先端の知能への入り口です。
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {/* 追加ボタン */}
            <a
              href={LINE_ADD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-[#06C755] hover:bg-[#05b34c] text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all hover:shadow-green-200/50 hover:-translate-y-1 flex items-center gap-3"
            >
              <span className="text-lg">LINEで友だち追加</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 transition-transform group-hover:rotate-12"
              >
                <path d="M22 10.5c0-4.7-4.5-8.5-10-8.5S2 5.8 2 10.5c0 4.2 3.7 7.7 8.7 8.4v4.1l5.4-3.6c3.6-.9 5.9-4.2 5.9-8.9z" />
              </svg>
            </a>

            {/* QRコード (スマホ表示時は隠すなどの調整も可能ですが、ここでは常時表示) */}
            <div className="hidden md:flex flex-col items-center gap-2">
              <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                <img
                  src={QR_CODE_IMAGE}
                  alt="QR Code"
                  className="w-24 h-24 object-contain"
                />
              </div>
              <p className="text-[10px] text-gray-400 font-medium">SCAN ME</p>
            </div>
          </div>
        </section>

        {/* --- Features Grid --- */}
        {/* ここは個別のカードをグリッドで並べます */}
        <section
          className="grid md:grid-cols-3 gap-6 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <FeatureCard
            emoji="🤖"
            title="自然な会話"
            description="Google Gemini Pro搭載。日常の雑談から専門的な相談まで、文脈を汲んだ自然な返答。"
          />
          <FeatureCard
            emoji="📸"
            title="画像も「見る」"
            description="写真を送るだけでAIが解析。冷蔵庫の中身からレシピを提案したり、翻訳も可能です。"
          />
          <FeatureCard
            emoji="🛡️"
            title="安心設計"
            description="使いすぎ防止の制限機能付き。必要な分だけ使えるサブスクリプションにも対応。"
          />
        </section>

        {/* --- Tech Stack (Card) --- */}
        <section
          className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-10 animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Technical Spec</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div>
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Backend / AI
              </h3>
              <ul className="space-y-3 text-gray-600">
                <TechItem text="Node.js / TypeScript" />
                <TechItem text="AWS Lambda (Serverless)" />
                <TechItem text="Amazon DynamoDB" />
                <TechItem text="Google Gemini API" />
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                DevOps / Tools
              </h3>
              <ul className="space-y-3 text-gray-600">
                <TechItem text="AWS CDK (IaC)" />
                <TechItem text="GitHub Actions" />
                <TechItem text="Stripe Integration" />
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <a
              href="https://github.com/at-himawari/lineat-gpt-preview"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHubでソースコードを見る
            </a>
          </div>
        </section>

        {/* --- Usage / FAQ (Card) --- */}
        <section
          className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-10 animate-fade-in"
          style={{ animationDelay: "0.6s" }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            3ステップで開始
          </h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            <Step
              number={1}
              text="「友だち追加」ボタン、またはQRコードから登録"
            />
            <Step number={2} text="トーク画面で、AIに聞きたいことを送信" />
            <Step
              number={3}
              text="画像を送ると、その内容についてAIがコメント"
            />
          </div>
        </section>
      </div>
      <Footer></Footer>
    </>
  );
}

// --- サブコンポーネント ---

function FeatureCard({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl mb-6">
        {emoji}
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed text-sm">{description}</p>
    </div>
  );
}

function Step({ number, text }: { number: number; text: string }) {
  return (
    <div className="flex items-center gap-5 p-4 bg-gray-50 rounded-2xl border border-gray-100">
      <div className="flex-shrink-0 w-10 h-10 bg-white shadow-sm text-green-600 rounded-full flex items-center justify-center font-bold text-lg border border-green-100">
        {number}
      </div>
      <p className="text-gray-700 font-medium">{text}</p>
    </div>
  );
}

function TechItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2">
      <svg
        className="w-4 h-4 text-green-500 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      {text}
    </li>
  );
}
