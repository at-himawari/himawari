import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Helmet } from "react-helmet-async";

const PrivacyPolicy: React.FC = () => (
  <>
    <Helmet>
      <title>Himawari Project - プライバシーポリシー </title>
      <meta property="og:title" content="プライバシーポリシー" />
      <meta
        property="og:description"
        content="Himawari Projectのプライバシーポリシーを説明します"
      />
      <meta property="og:image" content="https://at-himawari.com/avatar.jpg" />
      <meta property="og:url" content="https://at-himawari.com/privacy" />
      <meta property="og:type" content="website" />
    </Helmet>
    <Header></Header>
    <section id="video" className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-orange-500">
          プライバシーポリシー
        </h2>
        <p className="text-gray-600 text-lg mt-2">Privacy Policy</p>
        <div>
          <div className="mt-4">
            <h4 className="text-xl font-bold text-gray-800">1. 基本的考え方</h4>
            <p className="text-gray-700 mt-4">
              Himawari
              Project（以下、当プロジェクト）では、当プロジェクトのウェブサイト（サブドメインを含むat-himawari.comドメイン全てのウェブサイト。以下「当ウェブサイト」といいます。）において提供するサービスにおける情報提供、各種ご意見の受付等の円滑な運営に必要な範囲で、当ウェブサイトの利用者の情報を収集しています。収集した情報は、利用目的の範囲内で適切に取り扱います。
            </p>
          </div>
          <div className="mt-4">
            <h4 className="text-xl font-bold text-gray-800">
              2. 収集する情報の範囲
            </h4>
            <p className="text-gray-700 mt-4">
              <ol>
                <li>
                  1.当ウェブサイトに関するご意見やご要望は「ご意見・ご要望」フォームを通じて受け付けています。このフォームのご利用に当たっては、お問合せの種別、お名前、内容、メールアドレスの記入をお願いしています。
                </li>
                <li>
                  2.当ウェブサイトでは、閲覧されたページにて目的の情報を得られたかどうかについて、ご意見を任意でお願いしています。閲覧されたページについてご意見をお寄せいただいた場合、これらに関する情報を収集します。なお、ご意見には特定の個人を識別する情報を記入いただかないようにお願いしております。
                </li>
                <li>
                  3.当ウェブサイトでは、参照元のサイトドメイン名（リファラー）、IPアドレス、当ウェブサイトの閲覧状況等の情報を自動的に収集します。
                </li>
              </ol>
            </p>
          </div>
          <div className="mt-4">
            <h4 className="text-xl font-bold text-gray-800">3. 利用目的</h4>
            <p className="text-gray-700 mt-4">
              <ol>
                <li>
                  1.「2.
                  収集する情報の範囲」の1において収集した情報は、当ウェブサイトが提供するサービスを円滑に運営するための参考として利用します。「ご意見・ご要望」フォームを通じて収集した「お問合せの種別」及び「内容」については、今後の政策立案等の参考とさせていただきます。「お名前」及び「メールアドレス」については、返信用の宛先として利用します。なお、これらの情報は、その内容に応じ、関係府省等に転送します。
                </li>
                <li>
                  2.「2.
                  収集する情報の範囲」の2において収集した情報は、当ウェブサイトが提供する情報の内容やデザイン等を改善するための参考として利用いたします。利用に際して、User
                  Insightで取得する情報と組み合わせて分析する場合があります。
                </li>
                <li>
                  3.「2.
                  収集する情報の範囲」の3において収集した情報は、当ウェブサイトにおいて安全かつ円滑にサービスを提供、運営するために利用します。
                </li>
              </ol>
            </p>
          </div>
          <div className="mt-4">
            <h4 className="text-xl font-bold text-gray-800">
              4. 利用及び提供の制限
            </h4>
            <p className="text-gray-700 mt-4">
              当プロジェクトでは、法令に基づく開示要請があった場合、不正アクセス、脅迫等の違法行為があった場合その他特別の理由のある場合を除き、収集した情報を3の利用目的以外の目的のために自ら利用し、又は第三者に提供いたしません。ただし、お寄せいただいた「ご意見・ご要望」の総数等、匿名化された情報については、公表することがあります。
            </p>
          </div>
          <div className="mt-4">
            <h4 className="text-xl font-bold text-gray-800">
              5. 安全確保の措置
            </h4>
            <p className="text-gray-700 mt-4">
              当プロジェクトは、収集した情報の漏えい、滅失又はき損の防止その他収集した情報の適切な管理のために必要な措置を講じます。また、当ウェブサイトの運用の外部への委託に伴い、収集した情報の取扱いについても委託する場合があります。その場合には、委託先においても収集した情報の漏えい、滅失又はき損の防止その他の収集した情報の適切な管理がなされるよう、必要な措置を講じます。
            </p>
          </div>
          <div className="mt-4">
            <h4 className="text-xl font-bold text-gray-800">6. 適用範囲</h4>
            <p className="text-gray-700 mt-4">
              本ポリシーは、当ウェブサイトにおいてのみ適用されます。
            </p>
          </div>
          <div className="mt-4">
            <h4 className="text-xl font-bold text-gray-800">
              7. クッキーの使用
            </h4>
            <p className="text-gray-700 mt-4">
              クッキーとは、ウェブサイトを訪問した際にご利用の端末に生成、記録されるファイルを指し、ウェブサイトの訪問に関連する情報が蓄積されます。当ウェブサイトでは、下記の目的に限りクッキーを使用します。
            </p>
          </div>
          <p className="text-gray-700 mt-4 font-bold">利用状況の把握</p>
          <p className="text-gray-700 mt-4">
            当ウェブサイトでは、当ウェブサイトの利用者数や各ページの滞在時間など、利用者がどのように当ウェブサイトを利用しているかについての情報を把握するためにクッキーを使用します。提供するコンテンツの検討やページ構成の見直しなどにこれらの情報を利用します。
            なお利用者は、利用するブラウザの設定から、クッキーを無効化することや、利用者の端末に既に保存されているクッキーを削除することができます。
          </p>
        </div>
        <div className="mt-4">
          <h4 className="text-xl font-bold text-gray-800">8. その他</h4>
          <p className="text-gray-700 mt-4 font-bold">
            ソーシャルボタンについて
          </p>
          <p className="text-gray-700 mt-4">
            一部のソーシャルネットワーキングサービス（SNS）は、当該SNSの「ボタン」等が設置されたウェブサイトを閲覧した場合、当該「ボタン」等を押さなくとも、当該ウェブサイトからSNSに対し、ユーザーID・アクセスしているサイト等の情報が自動で送信されていることがあります。詳しくは下記の『SNSの利用者のみなさまへの留意事項』（個人情報保護委員会HP）をご覧ください。なお、当ウェブサイトで利用しているソーシャルメディア等のサービスのプライバシーポリシー等は、各事業者のサイト等でご確認ください。本ポリシーを改訂する場合は、当ウェブサイトでお知らせします。
          </p>
          <p>SNSの利用者のみなさまへの留意事項（個人情報保護委員会HP）</p>
          <p>
            <a href="https://www.ppc.go.jp/news/careful_information/sns_button_life/">
              https://www.ppc.go.jp/news/careful_information/sns_button_life/
            </a>
          </p>
          <p>Facebook社のデータに関するポリシー</p>
          <p>
            <a href="https://www.facebook.com/privacy/explanation">
              https://www.facebook.com/privacy/explanation
            </a>
          </p>
          <p>X（旧Twitter）社のプライバシーポリシー</p>
          <p>
            <a href="https://twitter.com/privacy?lang=ja">
              https://twitter.com/privacy?lang=ja
            </a>
          </p>
          <p className="text-gray-700 mt-4 font-bold">動画の埋め込みについて</p>
          <p>
            当ウェブサイトでは動画形式でコンテンツを掲載するため、Google
            LLCが提供するYouTubeの動画を埋め込んでいます。YouTubeの動画コンテンツが埋め込まれているページを閲覧すると、利用するブラウザからGoogle社に対し、IPアドレスや閲覧したサイトのURL、ブラウザの情報等が自動的に送信されます。詳細はGoogle社のプライバシーポリシーをご確認ください。
          </p>
          <p>
            <a href="https://policies.google.com/privacy">
              https://policies.google.com/privacy
            </a>
          </p>
        </div>
      </div>
    </section>
    <Footer></Footer>
  </>
);

export default PrivacyPolicy;
