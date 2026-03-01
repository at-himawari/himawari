import Header from "../../components/Header";
import Footer from "../../components/Footer";
import VideoCard from "../../components/VideoCard";
import { usePageContext } from "vike-react/usePageContext";

// videoオブジェクトの型を定義します
interface Video {
  title: string;
  description: string;
  videoUrl: string;
}

export default function Page() {
  // pageContextからStrapiのデータを取得
  const pageContext = usePageContext();
  const { videoItems } = pageContext.data as { videoItems: Video[] };

  const videos = videoItems || [];
  return (
    <>
      <Header />
      {/* 既存のセクション */}
      <section id="video" className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-orange-600 mb-5">
            YouTube Channel
          </h2>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 max-w-3xl">
            <img
              src="https://dq7c5b6uxkdk2.cloudfront.net/posts/images/avatar.jpg"
              alt="Avatar"
              className="h-24 w-24"
              loading="lazy"
            />
            <div>
              <p className="text-xl font-bold text-gray-800 text-center md:text-left">
                羽ばたくエンジニア
              </p>
              <p className="mt-1 text-orange-500 flex items-center justify-center md:justify-start text-sm">
                @at_himawari
              </p>
              <p>
                雑談配信、AWS入門講座、飛行機の搭乗動画を撮ったり様々なジャンルでやってます。
              </p>
              <p>コラボ･出演者絶賛募集中です！</p>
              <p>依頼は以下のアドレスまで！</p>
              <p>info.youtube[@]at-himawari.com</p>
            </div>
          </div>
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
}
