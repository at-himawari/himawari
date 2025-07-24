---
title: "S3+CloudFront+Route53を使ってリダイレクトを実現する"
date: 2024-03-08
categories:
  - "技術"
tags:
  - "AWS"
coverImage: "https://himawari-blog-bucket.s3.ap-northeast-1.amazonaws.com/posts/images/スクリーンショット-2024-02-11-20.13.00.jpg"
---

## 何をしたいのか

- Google AdSense でドメイン（トップレベルドメイン）を登録したい。

- 上記を実現するために、blog.domain.com で運用しているサイトを domain.com からリダイレクトされるようにしたい。

この方法を以下で解説していきます。

## 復習

**Amazon Route 53**

AWS が提供するドメインネームシステム (DNS) サービスで、ドメイン名の登録、ドメイン名と IP アドレスの関連付け、ドメイン名の高可用性化など、DNS に関連する機能を提供します。また、自動リクエストをインターネット経由でウェブサーバーなどのリソースに送信して、そのリソースが到達可能、使用可能、機能中であることを確認します。

**Amazon S3**

「Amazon Simple Storage Service」の略称で、AWS のサービスの一つです。オブジェクトストレージサービスの一種であり、データ容量を気にすることなく保存することができます。オブジェクトのファイル単位での出し入れが可能なので、その場に応じて自由な使い道が想定され、より柔軟なデータ保存が実行できます。

**Amazon CloudFront**

AWS が提供するグローバルなコンテンツ配信ネットワーク (CDN) サービスです。データやビデオ、アプリケーションといった静的/動的コンテンツを高速かつ安全に配信します。世界中にエッジサーバがあるため、あらゆる場所からのアクセスを改善することができます。また、CloudFront は、コンテンツを最良の方法で供給できるエッジロケーションに各ユーザーリクエストを AWS バックボーンネットワーク経由でルーティングすることで、コンテンツの配信を高速化します。

これらのサービスは、ウェブサイトやウェブアプリケーションの運用において、高速なコンテンツ配信、大量のデータ保存、安定したドメイン管理といった重要な役割を果たします。それぞれが異なる機能を持ちながらも、一緒に使用することで相乗効果を発揮します。

## S3 の設定

サービスから S3 を押下し、S3 のバケットを作成します。

![](https://himawari-blog-bucket.s3.ap-northeast-1.amazonaws.com/posts/images/01-1024x540-1.jpg)

バケット名にトップレベルドメインを指定します。（Google Adsence の設定にはトップレベルドメインしかできない）

![](https://himawari-blog-bucket.s3.ap-northeast-1.amazonaws.com/posts/images/02-1-1024x804-1.jpg)

パブリックアクセスを有効にして、バケットを作成します。

![](https://himawari-blog-bucket.s3.ap-northeast-1.amazonaws.com/posts/images/03-748x1024-1.jpg)

作成したバケットを選択して、プロパティを選択します。

![](https://himawari-blog-bucket.s3.ap-northeast-1.amazonaws.com/posts/images/04-1024x483-1.jpg)

｢静的ウェブホスティング｣の編集を押下します

![](https://himawari-blog-bucket.s3.ap-northeast-1.amazonaws.com/posts/images/05-1024x538-1.jpg)

以下の設定をします

![](https://himawari-blog-bucket.s3.ap-northeast-1.amazonaws.com/posts/images/06-1024x533-1.jpg)

## CloudFront の設定

CloudFront のページに移動し、｢ディストリビューションを作成｣を押下します

![](https://himawari-blog-bucket.s3.ap-northeast-1.amazonaws.com/posts/images/07-1024x539-1.png)

Origin domain から先程作成したバケットのエンドポイントを選択します。

選択後、｢Web サイトのエンドポイントを使用｣のボタンが表示されるので押下します。

![](https://himawari-blog-bucket.s3.ap-northeast-1.amazonaws.com/posts/images/08-1024x733-1.jpg)

下方にスクロールして、｢セキュリティ保護を有効にしないでください｣を選択します。（こちらを選択しないと、プラスで課金されます）

![](https://himawari-blog-bucket.s3.ap-northeast-1.amazonaws.com/posts/images/09-1024x554-1.jpg)

下方にスクロールして、代替ドメイン名（CNAME）の項目追加を選択します。

![](https://himawari-blog-bucket.s3.ap-northeast-1.amazonaws.com/posts/images/10-1024x725-1.jpg)

ここに、トップレベルドメイン（リクエスト元）を入力します

![](https://himawari-blog-bucket.s3.ap-northeast-1.amazonaws.com/posts/images/11-1024x668-1.jpg)

証明書をリクエストを押下します

![](https://himawari-blog-bucket.s3.ap-northeast-1.amazonaws.com/posts/images/12-1024x928-1.jpg)

ACM のページにジャンプします。証明書タイプで、｢パブリック証明書をリクエスト｣を選択して、｢次へ｣を押下します。

![](https://himawari-blog-bucket.s3.ap-northeast-1.amazonaws.com/posts/images/13-1024x391-1.png)

完全修飾ドメイン名にトップレベルドメイン（リダイレクト元）のドメインを入力します

![](https://himawari-blog-bucket.s3.ap-northeast-1.amazonaws.com/posts/images/14-1024x585-1.jpg)

｢リクエスト｣を押下します

![](https://himawari-blog-bucket.s3.ap-northeast-1.amazonaws.com/posts/images/15-1024x500-1.jpg)

CloudFront のページに戻ります。

カスタム SSL 証明書の｢証明書を選択｣を選択して、候補からトップレベルドメイン（リクエスト元ドメイン）を選択します。

![](https://himawari-blog-bucket.s3.ap-northeast-1.amazonaws.com/posts/images/16-1024x928-1.jpg)

｢ディストリビューションを作成｣を押下します

![](https://himawari-blog-bucket.s3.ap-northeast-1.amazonaws.com/posts/images/17-1024x667-1.jpg)

## Route53 の設定

Route53 のページに移動します。ホストゾーンを選択します。

![](https://himawari-blog-bucket.s3.ap-northeast-1.amazonaws.com/posts/images/18-1024x500-1.jpg)

ホストゾーンからトップレベルドメインのホストゾーン名を選択します

![](https://himawari-blog-bucket.s3.ap-northeast-1.amazonaws.com/posts/images/19-1024x498-1.jpg)

レコード作成を押下

![](https://himawari-blog-bucket.s3.ap-northeast-1.amazonaws.com/posts/images/20-1024x348-1.jpg)

以下の項目を設定して、｢レコード作成｣を押下する

![](https://himawari-blog-bucket.s3.ap-northeast-1.amazonaws.com/posts/images/21-1024x624-1.jpg)

お疲れ様でした。上記で設定は、完了です。

トップレベルドメインから転送先に転送されることを確認してみてください。
