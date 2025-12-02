import React from "react";
import Header from "../../../components/Header";

// ※実際のQRコード画像のパスや、LINE公式アカウントのURLに置き換えてください
const LINE_ADD_URL = "https://line.me/R/ti/p/@your_bot_id";
const QR_CODE_IMAGE =
  "https://dq7c5b6uxkdk2.cloudfront.net/line-qr-placeholder.jpg";

export default function Page() {
  return (
    <>
      <Header></Header>
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* --- Hero Section --- */}
        <section className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            あなたのとなりのAI
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            友だちにLINEする感覚で、最先端のAIと話そう。
            <br />
            アプリの切り替えは不要。いつものチャット画面が、知能への入り口です。
          </p>

          <div className="flex flex-col items-center justify-center gap-4">
            <a
              href={LINE_ADD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#06C755] hover:bg-[#05b34c] text-white font-bold py-4 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 flex items-center gap-2"
            >
              <span>LINEで友だち追加</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M22 10.5c0-4.7-4.5-8.5-10-8.5S2 5.8 2 10.5c0 4.2 3.7 7.7 8.7 8.4v4.1l5.4-3.6c3.6-.9 5.9-4.2 5.9-8.9z" />
              </svg>
            </a>
            <p className="text-sm text-gray-500 mt-2">
              ※QRコードからも追加できます
            </p>
            {/* QRコード表示エリア */}
            <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <img
                src={QR_CODE_IMAGE}
                alt="LINE友だち追加QRコード"
                className="w-32 h-32 object-contain"
              />
              <p className="text-xs text-gray-400">スキャンして追加</p>
            </div>
          </div>
        </section>

        {/* --- Features Section --- */}
        <section
          className="grid md:grid-cols-3 gap-8 mb-16 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <FeatureCard
            emoji="🤖"
            title="自然な会話"
            description="Google Gemini Proを搭載。日常会話からプログラミングの相談まで、文脈を理解した自然な返答が可能です。"
          />
          <FeatureCard
            emoji="📸"
            title="画像も「見る」"
            description="写真を送るだけでAIが内容を理解。冷蔵庫の中身からレシピを考えたり、風景の説明を受けたりできます。"
          />
          <FeatureCard
            emoji="🛡️"
            title="安心設計"
            description="メッセージ制限機能やStripe連携によるサブスクリプション管理を実装。使いすぎを防ぎながら利用できます。"
          />
        </section>

        {/* --- Tech Stack (Portfolio) --- */}
        <section
          className="bg-gray-50 rounded-2xl p-8 mb-16 animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
            Technical Architecture
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-2">Backend</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Node.js / TypeScript</li>
                <li>AWS Lambda (Serverless)</li>
                <li>Amazon EC2 </li>
                <li>Google Gemini API</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Infrastructure</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>AWS CDK (Infrastructure as Code)</li>
                <li>GitHub Actions (CI/CD)</li>
                <li>Stripe Integration (Billing)</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 text-center">
            <a
              href="https://github.com/at-himawari/lineat-gpt-preview"
              className="text-blue-600 hover:text-blue-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Source Code on GitHub
            </a>
          </div>
        </section>

        {/* --- FAQ / Usage --- */}
        <section
          className="mb-12 animate-fade-in"
          style={{ animationDelay: "0.6s" }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            使い方は簡単
          </h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            <Step number={1} text="上のボタンから「友だち追加」をします。" />
            <Step
              number={2}
              text="トーク画面で、話しかけたいことを送信します。"
            />
            <Step
              number={3}
              text="画像を送ると、AIがその画像についてコメントします。"
            />
          </div>
        </section>
      </div>
    </>
  );
}

// サブコンポーネント（同一ファイル内で定義）
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
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="text-4xl mb-4">{emoji}</div>
      <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function Step({ number, text }: { number: number; text: string }) {
  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-100">
      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
        {number}
      </div>
      <p className="text-gray-700">{text}</p>
    </div>
  );
}
