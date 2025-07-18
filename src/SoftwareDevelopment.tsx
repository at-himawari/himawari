import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Helmet } from "react-helmet-async";

const VideoProduction: React.FC = () => (
  <>
    <Helmet>
      <title>Himawari Project - ソフトウェア開発 </title>
      <meta property="og:title" content="ソフトウェア開発" />
      <meta
        property="og:description"
        content="Himawari Projectはエンジニアファーストな開発を行います。"
      />
      <meta property="og:image" content="https://at-himawari.com/avatar.jpg" />
      <meta property="og:url" content="https://at-himawari.com/software" />
      <meta property="og:type" content="website" />
    </Helmet>
    <Header></Header>
    <section id="video" className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-orange-500">ソフトウェア開発</h2>
        <p className="text-gray-600 text-lg mt-2">Software Develop</p>
        <p className="text-gray-700 mt-6">
          Himawari
          Projectでは「オープンな開発」を理念に掲げています。これは、オープンソースであることはもちろん、開発の過程や成果物を透明にし、誰でも参加できる環境を提供することを意味します。
          

        </p>
        <img
          src="/software_opensource_and_engineerfirst.png"
          alt="オープンソース＆エンジニアファースト"
          className="mt-8 w-full h-auto rounded-lg mb-2"
        />
      </div>
    </section>
    <section id="videoCost" className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-orange-500">費用</h2>
        <p className="text-gray-600 text-lg mt-2">Cost</p>
        <h3 className="text-3xl">AI面接コーチ導入費用例</h3>
        <p>
          当プロジェクトで作成したアーキテクチャの一例を示します。為替リスクは当プロジェクトでは負担いたしません。
        </p>
        <img
          src="/architecture.png"
          alt="アーキテクチャ"
          className="mt-8 w-full h-auto rounded-lg shadow-lg mb-2"
        />
        <div className="mt-12">
          <h3 className="text-xl font-bold text-orange-500">
            サービスコスト例
          </h3>
          <p className="text-gray-600 text-lg mt-2">Service Costs</p>
          <div className="overflow-x-auto mt-6">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    サービス
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    コスト（USD/月）
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    Google Cloud Run
                  </td>
                  <td className="border border-gray-300 px-4 py-2">$60</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    Google Compute Engine
                  </td>
                  <td className="border border-gray-300 px-4 py-2">$25</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    Cloudflare Pages
                  </td>
                  <td className="border border-gray-300 px-4 py-2">$0</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    Azure OpenAI
                  </td>
                  <td className="border border-gray-300 px-4 py-2">$50</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    Azure AI Search
                  </td>
                  <td className="border border-gray-300 px-4 py-2">$50</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    AWS Cognito
                  </td>
                  <td className="border border-gray-300 px-4 py-2">$10</td>
                </tr>
                <tr className="font-bold">
                  <td className="border border-gray-300 px-4 py-2">合計</td>
                  <td className="border border-gray-300 px-4 py-2">$195</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
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
