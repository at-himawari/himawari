// src/Bcafe.tsx
import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import VideoCard from "./components/VideoCard";
import { liveVideos, nextLive } from "./data/videos";
import { Helmet } from "react-helmet-async";

const Bcafe: React.FC = () => (
  <>
    <Helmet>
      <title>Himawari Project - βcafè </title>
      <meta property="og:title" content="βcafè" />
      <meta
        property="og:description"
        content="疲れたあなたとともに、会話をしていきます。毎週金曜日よる９時〜"
      />
      <meta property="og:image" content="https://at-himawari.com/bcafe.jpg" />
      <meta property="og:url" content="https://at-himawari.com/bcafe" />
      <meta property="og:type" content="website" />
    </Helmet>
    <Header />

    {/* 既存のセクション */}
    <section id="video" className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-black">β Cafè</h2>
        <p className="text-gray-600 text-lg mt-2">YouTube Channel</p>
        <p className="text-gray-700 mt-6">
          <p className="text-xl mb-3">毎週金曜日 よる９時〜</p>
          <p>疲れたあなたとともに、会話をしていきます。</p>
          <p>コメント欄に悩み事や相談事を書いてください。</p>

          <p>
            マシュマロ（匿名コメント）
            <a href="https://marshmallow-qa.com/p96pjo894y8k0o5">
              https://marshmallow-qa.com/p96pjo894y8k0o5
            </a>
          </p>
        </p>
      </div>
    </section>

    {/* YouTube動画カードセクション */}
    <section id="youtube-live" className="py-12 bg-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-red-600 mb-6">次回の放送</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {nextLive.videoUrl ? (
            <VideoCard
              key="next"
              title={nextLive.title}
              description={nextLive.description}
              videoUrl={nextLive.videoUrl}
            />
          ) : (
            <p>次回の放送は未定です</p>
          )}
        </div>
      </div>
    </section>

    {/* YouTube動画カードセクション */}
    <section id="youtube-live" className="py-12 bg-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-red-600 mb-6">過去の放送</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {liveVideos.map((video, index) => (
            <VideoCard
              key={index}
              title={video.title}
              description={video.description}
              videoUrl={video.videoUrl}
            />
          ))}
        </div>
      </div>
    </section>

    <Footer />
  </>
);

export default Bcafe;
