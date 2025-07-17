---
title: "Lambdaでハンドラーが認識されない"
date: 2024-06-22
categories: 
  - "技術"
coverImage: "https://himawari-blog-bucket.s3.ap-northeast-1.amazonaws.com/posts/images/Arch_AWS-Lambda_64@5x.png"
---

今回は、AWS Lambdaでハンドラーが認識されないときの対処方法をご紹介します。

## 前提

- macOS 14.4(M2 MacBookAir)

- AWS CLI環境

## 再現手順

- 1\. 作成したコードを、Zip化する

![](https://himawari-blog-bucket.s3.ap-northeast-1.amazonaws.com/posts/images/スクリーンショット-2024-06-22-14.25.14.png)

- 2\. Zipのあるフォルダで以下を実行

`aws s3 cp ./Zip化したコード s3://バケット名`

上記のコマンドで、s3へ対象コードをアップロードします。  
バケットは事前に作成しておいてください。

- 3\. Lambda関数を作成する

```
aws lambda create-function \
    --function-name Lambda関数の名前 \
    --runtime ランタイム(python3.11など) \
    --code S3Bucket=バケット名,S3Key=Zipのファイル名 \
    --handler lambda_function.lambda_handler \
    --role ロールのARN
```

- 4\. AWSのコンソールに行きLambdaのページを選択します。

- 5\. Lambdaのページから作成した、関数を選択します。

- 6\. テストタブからテストを選択し、実行します。

以下のエラーが発生しました。

![](https://himawari-blog-bucket.s3.ap-northeast-1.amazonaws.com/posts/images/スクリーンショット-2024-06-22-14.33.22-1024x172.png)

## 解決手順

Zip化する際に、OSのGUIから圧縮を行う(手順1)を行うとlambda\_functionを見つけられずエラーとなってしまうので、ターミナルからzipコマンドを利用してzipファイルを作成します

```
zip -r scraping-rakuten-sec.zip *
```

上記でzip化したコマンドを手順２の方法でs3へ転送します。

コードソースからAmazon S3の場所を選択し、指示に従って、zip化したファイルのs3リンクを貼り付けてLambda関数を更新します。

![](https://himawari-blog-bucket.s3.ap-northeast-1.amazonaws.com/posts/images/スクリーンショット-2024-06-22-14.40.40-1024x210.png)

## まとめ

zip化するときは、OSの圧縮機能を使わずに、zipコマンドを利用してzip化しましょう。
