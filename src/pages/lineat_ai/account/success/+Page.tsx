import { useEffect, useState } from "react";

export default function SuccessPage() {
  const [countdown, setCountdown] = useState(5);
  const lineUrl = "https://line.me/R/ti/p/@494seuly";

  useEffect(() => {
    // カウントダウンタイマー
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = lineUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          決済が完了しました
        </h1>
        <p className="text-lg text-gray-700 mb-4">ご利用ありがとうございます</p>
        <p className="text-md text-gray-600 mb-8">
          {countdown}秒後にLINEへ自動的に移動します...
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={lineUrl}
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            今すぐLINEへ移動
          </a>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            ホームページへ戻る
          </a>
        </div>
      </div>
    </div>
  );
}
