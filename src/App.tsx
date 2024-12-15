import React, { useState, useEffect } from "react";
import { FaXTwitter, FaGithub, FaInstagram, FaYoutube } from "react-icons/fa6";
import { FaBook } from "react-icons/fa";

const App: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      image: "/software.png",
      title: "ソフトウェア開発",
      text: "自社パッケージ導入・新規システム開発",
      link: "#software"
    },
    {
      image: "/video.jpg",
      title: "映像制作",
      text: "YouTube用動画編集/イベント動画制作",
      link: "#video"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-sans overflow-x-hidden">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto flex justify-between items-center py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <img src="/himawari.png" alt="Himawari Project Logo" className="h-8 mr-3" />
            <h1 className="text-2xl font-bold text-orange-500">Himawari Project</h1>
          </div>
        </div>
      </header>

      {/* Hero Section - Slideshow */}
      <section id="software" className="relative h-96 overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
            style={{ backgroundImage: `url(${slide.image})`, backgroundSize: "cover", backgroundPosition: "center" }}
          >
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative container mx-auto h-full flex flex-col justify-center items-start px-4 sm:px-6 lg:px-8">
              <h2 className="text-white text-3xl font-bold">{slide.title}</h2>
              <p className="text-white mt-2">{slide.text}</p>
              <a
                href={slide.link}
                className="mt-4 bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
              >
                詳しく見る
              </a>
            </div>
          </div>
        ))}
      </section>

      {/* News Section */}
      <section id="news" className="py-12 bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-800">ニュース</h3>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <p className="text-orange-500 font-bold">お知らせ</p>
              <p className="text-gray-700 mt-2">2024.10.20</p>
              <p className="mt-4 text-gray-600">議事録メーカーを開発しました。当プロジェクトとしてリリースする予定は未定ですが、導入支援は承ります。</p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <p className="text-orange-500 font-bold">お知らせ</p>
              <p className="text-gray-700 mt-2">2024.10.20</p>
              <p className="mt-4 text-gray-600">Xにて公式マークを取得しました。</p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <p className="text-orange-500 font-bold">お知らせ</p>
              <p className="text-gray-700 mt-2">2024.10.20</p>
              <p className="mt-4 text-gray-600">Webサイトを開設しました。</p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <p className="text-orange-500 font-bold">お知らせ</p>
              <p className="text-gray-700 mt-2">2024.10.20</p>
              <p className="mt-4 text-gray-600">AI面接コーチをリリースしました。</p>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Section */}
      <section id="profile" className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-800">プロフィール</h3>
          <div className="mt-6 flex items-center">
            <img src="/avatar.png" alt="Avatar" className="h-16 w-16 rounded-full mr-4" />
            <div>
              <p className="text-gray-600">羽ばたくエンジニア</p>
              <p className="mt-2 text-gray-500 flex items-center">
                <FaXTwitter className="mr-2" /> @at_himawari
              </p>
              <p className="mt-2 text-gray-600">北海道出身のITコンサルタント。クラウドを得意とし基板設計や開発環境整備等の職務に従事してきた。</p>

            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-12 text-white">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-8">
          <div>
            <h4 className="text-lg font-bold">Himawari Project</h4>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="hover:underline">ソフトウェア開発</a></li>
              <li><a href="#" className="hover:underline">映像制作</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold">プロダクト</h4>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="hover:underline">AI面接コーチ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold">利用規約</h4>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="hover:underline">プライバシーポリシー</a></li>
              <li><a href="#" className="hover:underline">ライセンス</a></li>
              <li><a href="#" className="hover:underline">プロジェクトポリシー</a></li>
            </ul>
          </div>
        </div>
        {/* SNS Links */}
        <div className="mt-8 flex justify-center space-x-6 text-2xl">
          <a href="#" className="hover:text-gray-400" aria-label="X">
            <FaXTwitter />
          </a>
          <a href="#" className="hover:text-gray-400" aria-label="GitHub">
            <FaGithub />
          </a>
          <a href="#" className="hover:text-gray-400" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href="#" className="hover:text-gray-400" aria-label="YouTube">
            <FaYoutube />
          </a>
          <a href="https://qiita.com/at_himawari" className="hover:text-gray-400" aria-label="Qiita">
  <img src="/qiita-icon.png" width="25px" height="25px"/>
</a>
        </div>
        <div className="mt-8 text-center text-sm text-gray-400">
          © 2024 Himawari Project
        </div>
      </footer>
    </div>
  );
};

export default App;
