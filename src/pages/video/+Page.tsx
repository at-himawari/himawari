import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const VideoProduction: React.FC = () => (
  <>
    <Header></Header>
    <section id="video" className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-orange-500">映像制作</h2>
        <p className="text-gray-600 text-lg mt-2">Video Production</p>
        <p className="text-gray-700 mt-6">
          Himawari
          Project（以下、当プロジェクト）では、アマチュア映像制作を行っております。編集の一例はYouTubeにアップロードしておりますのでご参考ください。近年は生成AIが登場により文字起こしなどが手軽に行えるようになっています。単純な映像制作のご依頼だけでなく、ワークフローの高速化なども当プロジェクトのナレッジを活かしたご支援を行います。
        </p>
      </div>
    </section>
    <section id="videoCost" className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-orange-500">費用</h2>
        <p className="text-gray-600 text-lg mt-2">Cost</p>
        <img
          src="/video_img.jpg"
          alt="動画制作の例"
          className="mt-8 w-full h-auto rounded-lg shadow-lg mb-2"
        />
        <ul>
          <li>テロップ･カット･サムネイル動画：５分 5,000円~</li>
          <li>
            詳細についてはヒアリングの上で決定していきます。上記はあくまで一例です。
          </li>
          <li>一眼レフカメラ･スマホジンバル等は貸出可能です。</li>
          <li>出張費は実費で頂戴いたします。</li>
          <li>※スケジュール、リリース時期については要相談</li>
        </ul>
      </div>
    </section>
    <section id="videoCost" className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-orange-500">お問い合わせ</h2>
        <p className="text-gray-600 text-lg mt-2">Contact</p>
        <p>
          <a
            href="https://forms.gle/TCJRQaArJ2oMQU7NA"
            className="text-blue-600 underline"
          >
            こちらからご依頼ください
          </a>
        </p>
      </div>
    </section>
    <Footer></Footer>
  </>
);

export default VideoProduction;
