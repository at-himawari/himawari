import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Helmet } from "react-helmet-async";

const ProjectPolicy: React.FC = () => (
  <>
    <Helmet>
      <title>Himawari Project - プロジェクトポリシー </title>
      <meta property="og:title" content="プライバシーポリシー" />
      <meta
        property="og:description"
        content="Himawari Projectのプロジェクトポリシーを説明します"
      />
      <meta property="og:image" content="https://at-himawari.com/avator.jpg" />
      <meta property="og:url" content="https://at-himawari.com/project" />
      <meta property="og:type" content="website" />
    </Helmet>
    <Header></Header>
    <section id="video" className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-orange-500">
          プロジェクトポリシー
        </h2>
        <div>
          <div className="mt-4">
            <h4 className="text-xl font-bold text-gray-800">
              特定商取引法に基づく表記
            </h4>
            <p className="text-gray-700 mt-4">
              個人運営のため、契約締結前のお見積時に表示いたします。
            </p>
          </div>
          <div className="mt-4">
            <h4 className="text-xl font-bold text-gray-800">
              カスタマーハラスメント
            </h4>
            <p className="text-gray-700 mt-4">
              カスタマーハラスメントには、厳格に対処いたします。
            </p>
            <p className="text-gray-700 mt-4">カスタマーハラスメントとは</p>
            <p className="text-gray-700 mt-4">
              顧客等からのクレーム・言動のうち、要求の内容の妥当性に照らして、その手段・態様が社会通念上不相当であり、労働者の就業環境を害するものを指します。
            </p>
            <p className="text-gray-700 mt-4">
              当プロジェクトでは、厚生労働省の企業対策マニュアルに準拠した対応を行います。
            </p>
            <p className="text-gray-700 mt-4">
              <a href="https://www.mhlw.go.jp/content/11921000/000894063.pdf">
                厚生労働省
              </a>
            </p>
            <p className="text-gray-700 mt-4">
              具体的には、以下のような行為がカスハラに該当します：
            </p>
            <ul>
              <li className="text-gray-700 mt-4">
                ･身体的な攻撃：暴行や傷害など
              </li>
              <li className="text-gray-700 mt-4">
                ･精神的な攻撃：脅迫、侮辱、ひどい暴言など
              </li>
              <li className="text-gray-700 mt-4">
                ･過度な要求：土下座の強要や過剰な謝罪の要求など
              </li>
              <li className="text-gray-700 mt-4">
                ･執拗な言動：繰り返しのクレームや長時間の拘束など
              </li>
              <li className="text-gray-700 mt-4">
                ･差別的な言動：性別や人種に基づく差別的発言など
              </li>
            </ul>
          </div>
          <div className="mt-4">
            <h4 className="text-xl font-bold text-gray-800">SNS利用規約</h4>
            <p className="text-gray-700 mt-4">
              1. 本規約は、Himawari
              Project（以下「当プロジェクト」とします）が運営するソーシャル・ネットワーキング・サービス若しくはソーシャル・ネットワーキング・サイト（以下「ＳＮＳ」とします）又は当プロジェクトが他社の運営するＳＮＳ内に開設するサイト（以下「本サービス」とします）を利用する際の規則を定めるものです。
            </p>
            <p className="text-gray-700 mt-4">
              2.
              本サービスの利用者は、利用に際し、以下の行為（そのおそれのある行為を含みます）を行わないものとします。
            </p>
            <ul className="list-disc ml-6 mt-4 text-gray-700">
              <li>
                (1)当プロジェクト、他の利用者その他の第三者の権利・利益を侵害する行為
              </li>
              <li>
                (2)当プロジェクト、他の利用者その他の第三者を誹謗中傷し、侮辱し、名誉、信用、プライバシー等を棄損し（当プロジェクト、他の利用者その他の第三者のメールアドレス、電話番号、住所等の個人の特定につながる情報を開示する行為を含む）、又は業務を妨害する行為
              </li>
              <li>(3)公職選挙法に違反する行為</li>
              <li>(4)宗教団体その他の団体・組織への加入を勧誘する行為</li>
              <li>
                (5)出資、寄付、資金提供または物品若しくはサービスの購入等を勧誘する行為
              </li>
              <li>
                (6)当プロジェクトが不適切と判断する他のウェブサイトを紹介し若しくはその閲覧を勧誘する行為又は本サービスをファイルのダウンロードとして利用する行為
              </li>
              <li>(7)本サービスを通じて得た情報を営利目的に流用する行為</li>
              <li>
                (8)本サービスを利用して当プロジェクト、他の利用者その他の第三者に対し、コンピューターのソフト・ハードの正常な機能を阻害するウィルス等の有害なプログラムまたはファイル等を発信する行為
              </li>
              <li>
                (9)本サイトに掲載する正当な権限を有しない情報・コンテンツを掲載する行為
              </li>
              <li>
                (10)当プロジェクト、他の利用者その他の第三者による本サービスの提供及び利用を阻害する行為
              </li>
              <li>
                (11)本サイトに対しハッキング等の不正行為によりアクセスする行為及び本サイトの全部又は一部を監視若しくは複製する行為
              </li>
              <li>
                (12)その他ＳＮＳの利用規約、公序良俗、法令若しくは刑罰法規に違反し、またはその他当プロジェクトが不適切と判断する行為
              </li>
            </ul>
            <p className="text-gray-700 mt-4">
              3.
              本サービスの利用者が本規約に違反した場合、当プロジェクトは、当該利用者により書き込みを削除し、又は当該利用者による本サービスの利用を制限することができ、利用者はこれに異議を唱えないものとします。
            </p>
            <p className="text-gray-700 mt-4">
              4.
              本サービスの利用者が本規約に違反し、又は本サービスの利用者が本サービスの利用に関連して当プロジェクト、他の利用者その他の第三者に有形無形の損害を与えた場合、当該利用者はこれを自己の責任と負担において賠償し、その他の解決をはかり、当プロジェクトに一切の負担を負わせ又は迷惑をかけないものとします。
            </p>
            <p className="text-gray-700 mt-4">
              5.
              当プロジェクトは、本サービスを通じて利用者により提供される情報について、その内容を保証または認可したものではありません。従って、その内容を信用したことにより利用者に損害等が生じた場合にも当プロジェクトは一切責任を負いません。
            </p>
            <p className="text-gray-700 mt-4">
              6.
              利用者が本サービスを通じて掲載した情報についての著作権（著作権法２７条及び２８条に規定する権利を含む）は全てHimawari
              Projectに帰属し、また利用者はこれについての著作者人格権を行使しないものとします。当該権利の帰属及び放棄について利用者には対価を請求する権利はありません。
            </p>
            <p className="text-gray-700 mt-4">
              7.
              当プロジェクトは本サービスの利用者の同意を得ることなく本利用規約の内容を変更することできます。この場合、変更後の本規約は当プロジェクトがウェブサイトへの掲載その他の方法により公表した時点で当然に効力が生じ、以降本サービスの利用者変更後の本規約の適用を受けるものとします。
            </p>
          </div>
        </div>
      </div>
    </section>
    <Footer></Footer>
  </>
);

export default ProjectPolicy;
