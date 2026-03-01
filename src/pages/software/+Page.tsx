import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const VideoProduction: React.FC = () => (
  <>
    <Header></Header>
    <section id="video" className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-orange-500">ソフトウェア開発</h2>
        <p className="text-gray-600 text-lg mt-2">Software Develop</p>
        <p className="text-gray-700 mt-6">
          Himawari
          Projectでは「オープンな開発」を理念に掲げています。これは、オープンソースであることはもちろん、開発の過程や成果物を透明にし、誰でも参加できる環境を提供することを意味します。
          原則として、開発に使用するソフトウェアはオープンソースであり、GitHubなどのプラットフォームを通じてコードを公開しています。また、開発の進捗や課題も定期的に共有し、コミュニティからのフィードバックを受け入れています。
          しかし、秘匿性の高いアプリケーションを取り扱う場合は、セキュリティやプライバシーの観点から、必要に応じて非公開のリポジトリを使用することもあります。
        </p>
      </div>
    </section>
    <section id="videoCost" className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-orange-500">費用</h2>
        <p className="text-gray-600 text-lg mt-2">Cost</p>
        <h3 className="text-3xl">LINE@ AI bot</h3>
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
                <td className="border border-gray-300 px-4 py-2">AWS Lambda</td>
                <td className="border border-gray-300 px-4 py-2">$0.20</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  Google Gemini 3 Pro
                </td>
                <td className="border border-gray-300 px-4 py-2">$14</td>
              </tr>
              <tr className="font-bold">
                <td className="border border-gray-300 px-4 py-2">合計</td>
                <td className="border border-gray-300 px-4 py-2">$14.20</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="my-6"></p>

        <h3 className="text-3xl">AI面接コーチ導入費用例</h3>
        <p>
          当プロジェクトで作成したアーキテクチャの一例を示します。為替リスクは当プロジェクトでは負担いたしません。
        </p>
        <img
          src="https://dq7c5b6uxkdk2.cloudfront.net/posts/images/architecture.png"
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
        <p>
          ※全ての料金は、概算料金であり、実際のコストは環境や使用量によって異なります。
        </p>
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
