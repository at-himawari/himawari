import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

const VideoProduction: React.FC = () => (
  <>
    <Header></Header>
    <section id="video" className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-orange-500">ソフトウェア開発</h2>
        <p className="text-gray-600 text-lg mt-2">Software Develop</p>
        <p className="text-gray-700 mt-6">
          Himawari
          Project（以下、当プロジェクト）では「オープンな開発」を理念に掲げ、機密情報を除いたソースコードを世界中に公開しています。この透明性により、グローバルなエンジニアコミュニティと共にプロジェクトを進化させることが可能です。
          当プロジェクトは情熱溢れるエンジニアが一名のみのため、大規模かつ迅速な開発は難しいものの、クラウドサービスと連携した独自性の高いサービスをお客様と共に創り上げることができます。
          法人組織ではない当プロジェクトは、利益追求よりも開発の楽しさと創造性を最優先に考えています。ご利用いただく料金は、各クラウドサービスの従量課金と、実費に準じた少額の手数料（ご相談可能）となります。
          もちろん、無理な契約は迫りません。お見積りの段階でお断りいただいても構いません。
          ぜひ、Himawari
          Projectと一緒に、新しい価値を創造する旅に出かけましょう！
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
