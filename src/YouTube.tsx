// src/Bcafe.tsx
import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import VideoCard from "./components/VideoCard";
import { Helmet } from "react-helmet-async";

// videoオブジェクトの型を定義します
interface Video {
  title: string;
  description: string;
  videoUrl: string;
}

const Youtube: React.FC = () => {
  // 動画データを格納するためのstateを定義します
  const [videos, setVideos] = useState<Video[]>([]);

  // コンポーネントがマウントされた時にJSONファイルを読み込みます
  useEffect(() => {
    fetch("/content/videos.json")
      .then((res) => res.json())
      .then((data) => setVideos(data.videoItems))
      .catch((error) => console.error("Error fetching videos:", error));
  }, []);

  return (
    <>
      <Helmet>
        <title>Himawari Project - YouTube </title>
        <meta property="og:title" content="YouTube" />
        <meta
          property="og:description"
          content="ライブ配信したり、飛行機の搭乗動画を撮ったり様々なジャンルでやってます。"
        />
        <meta
          property="og:image"
          content="https://at-himawari.com/avatar.jpg"
        />
        <meta property="og:url" content="https://at-himawari.com/youtube" />
        <meta property="og:type" content="website" />
      </Helmet>
      <Header />

      {/* 既存のセクション */}
      <section id="video" className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-black">YouTube</h2>
          <p className="text-gray-600 text-lg mt-2">
            羽ばたくエンジニア @at_himawari
          </p>
          <p className="text-gray-700 mt-6">
            <p>
              ライブ配信したり、飛行機の搭乗動画を撮ったり様々なジャンルでやってます。
            </p>
            <p>コラボ･出演者絶賛募集中です！</p>
            <p>依頼は以下のアドレスまで！</p>
            <p>info.youtube[@]at-himawari.com</p>
          </p>
        </div>
      </section>

      {/* YouTube動画カードセクション */}
      <section id="youtube-content" className="py-12 bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-6">
            YouTube 飛行機動画
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {videos.map((video, index) => (
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
};

export default Youtube;
