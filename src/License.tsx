import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

const VideoProduction: React.FC = () => (
  <>
    <Header></Header>
    <section id="video" className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-orange-500">ライセンス</h2>
        <p className="text-gray-600 text-lg mt-2">License</p>
        <p className="text-gray-700 mt-4">
          1. 当サイトのライセンス Himawari
          Project(以下、当プロジェクト）では、当プロジェクトのウェブサイト（サブドメインを含むat-himawari.comドメイン配下のウェブサイト。以下特に記載がない限り同じです。以下「当ウェブサイト」といいます。）において提供するサービスでは
          Creative Commons CC BY-SA 4.0が適用されます。 詳しくは、Creative
          Commonsのリーガル･コードをご覧ください。
          <a
            href="https://creativecommons.org/licenses/by-sa/4.0/legalcode.ja"
            className="text-blue-500 hover:underline"
            target="_blank"
          >
            https://creativecommons.org/licenses/by-sa/4.0/legalcode.ja
          </a>
        </p>
        <p className="text-gray-700 mt-4">
          2. ソースコードのライセンス
          GitHubの各リポジトリLICENSEファイルをご覧ください。LICENSEファイルがない場合は、MITライセンスに従います。
        </p>
        <p className="text-gray-700 mt-4">MIT License</p>
        <p className="text-gray-700 mt-4">
          Copyright (c) 2024 Himawari Project
        </p>
        <p className="text-gray-700 mt-4">
          Permission is hereby granted, free of charge, to any person obtaining
          a copy of this software and associated documentation files (the
          "Software"), to deal in the Software without restriction, including
          without limitation the rights to use, copy, modify, merge, publish,
          distribute, sublicense, and/or sell copies of the Software, and to
          permit persons to whom the Software is furnished to do so, subject to
          the following conditions:
        </p>
        <p className="text-gray-700 mt-4">
          The above copyright notice and this permission notice shall be
          included in all copies or substantial portions of the Software.
        </p>
        <p className="text-gray-700 mt-4">
          THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
          EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
          IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
          CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
          TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
          SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
        </p>
      </div>
    </section>

    <Footer></Footer>
  </>
);

export default VideoProduction;
