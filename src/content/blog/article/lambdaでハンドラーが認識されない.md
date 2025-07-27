---
title: "Lambdaでハンドラーが認識されない"
date: 2024-06-22
categories:
  - "技術"
tags:
  - "技術"
  - "Lambda"
coverImage: "https://dq7c5b6uxkdk2.cloudfront.net/posts/images/Arch_AWS-Lambda_64@5x.png"
---

今回は、AWS Lambda でハンドラーが認識されないときの対処方法をご紹介します。

## 前提

- macOS 14.4(M2 MacBookAir)

- AWS CLI 環境

## 再現手順

- 1\. 作成したコードを、Zip 化する

![](https://dq7c5b6uxkdk2.cloudfront.net/posts/images/スクリーンショット-2024-06-22-14.25.14.png)

- 2\. Zip のあるフォルダで以下を実行

`aws s3 cp ./Zip化したコード s3://バケット名`

上記のコマンドで、s3 へ対象コードをアップロードします。  
バケットは事前に作成しておいてください。

- 3\. Lambda 関数を作成する

```
aws lambda create-function \
    --function-name Lambda関数の名前 \
    --runtime ランタイム(python3.11など) \
    --code S3Bucket=バケット名,S3Key=Zipのファイル名 \
    --handler lambda_function.lambda_handler \
    --role ロールのARN
```

- 4\. AWS のコンソールに行き Lambda のページを選択します。

- 5\. Lambda のページから作成した、関数を選択します。

- 6\. テストタブからテストを選択し、実行します。

以下のエラーが発生しました。

![](https://dq7c5b6uxkdk2.cloudfront.net/posts/images/スクリーンショット-2024-06-22-14.33.22-1024x172.png)

## 解決手順

Zip 化する際に、OS の GUI から圧縮を行う(手順 1)を行うと lambda_function を見つけられずエラーとなってしまうので、ターミナルから zip コマンドを利用して zip ファイルを作成します

```
zip -r scraping-rakuten-sec.zip *
```

上記で zip 化したコマンドを手順２の方法で s3 へ転送します。

コードソースから Amazon S3 の場所を選択し、指示に従って、zip 化したファイルの s3 リンクを貼り付けて Lambda 関数を更新します。

![](https://dq7c5b6uxkdk2.cloudfront.net/posts/images/スクリーンショット-2024-06-22-14.40.40-1024x210.png)

## まとめ

zip 化するときは、OS の圧縮機能を使わずに、zip コマンドを利用して zip 化しましょう。
