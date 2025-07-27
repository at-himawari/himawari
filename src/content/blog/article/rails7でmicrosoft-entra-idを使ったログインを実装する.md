---
title: "Rails7でMicrosoft Entra IDを使ったログインを実装する"
date: 2024-06-21
categories:
  - "技術"
tags:
  - "Ruby on Rails7"
  - "EntraID"
coverImage: "https://dq7c5b6uxkdk2.cloudfront.net/posts/images/Microsoft_Azure.svg_.png"
---

今回は、Ruby on Rails の Devise を使って、Microsoft Entra ID でログインできるようにします。

##

前提

### [](https://qiita.com/himawari_project/items/8ec59a8cb6d2abce4221#%E6%9D%A1%E4%BB%B6)条件

- Azure アカウントを作成済みである

- Azure Portal へログインできる

### 環境

- ruby 3.3.1

- Rails 7.1.3.4

## Microsoft Entra ID(旧 Azure AD)とは？

クラウドベースの ID 管理とアクセス管理のサービスを提供します。(Microsoft 認定資格試験テキスト AZ900:Micosoft Azure Fundamentals 改訂第２版　須屋聡史/富岡洋/佐藤雅信）  
今回は、認証･認可サーバを Entra ID に担わせて Rails 側でその情報を受け取る実装にしていきます。

## プロジェクトの作成

- プロジェクトの作成をします  
   `$ rails new entraid`(entraid)は適当で OK

- `$ cd entraid`でプロジェクトフォルダに移動します

## Gem の追加

Gemfile に必要な Gem を追加します

Gemfile

```
gem 'devise'
gem "omniauth"
gem "omniauth-rails_csrf_protection"
gem 'omniauth-azure-activedirectory-v2'
gem 'dotenv-rails', groups: [:development, :test]
```

- `$ bundle install`を実行します

## Devise のセットアップ

Devise をセットアップします

```
$ rails generate devise:install
$ rails generate devise User
$ rails db:migrate
```

### Omniauth の設定を追加する

config/initializers/devise.rb ファイルに、Azure AD の設定を追加します。

config/initializers/devise.rb

```
Devise.setup do |config|
  # 他の設定
  config.omniauth :azure_activedirectory_v2,
                  client_id:     ENV['AZURE_CLIENT_ID'],
                  client_secret: ENV['AZURE_CLIENT_SECRET'],
                  tenant_id:     ENV['AZURE_TENANT_ID']
end
```

## User モデルに Omniauth の設定を追加する

app/models/user.rb ファイルに以下を追加します。

app/models/user.rb

```
class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :omniauthable, omniauth_providers: [:azure_activedirectory_v2]

  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.password = Devise.friendly_token[0, 20]
      # ユーザーの追加情報を必要に応じて設定
    end
  end
end
```

## コントローラに Omniauth のコールバックを追加する

app/controllers/users/omniauth_callbacks_controller.rb ファイルを作成し、以下を追加します。

app/controllers/users/omniauth_callbacks_controller.rb

```
class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def azure_activedirectory_v2
    @user = User.from_omniauth(request.env["omniauth.auth"])

    if @user.persisted?
      sign_in_and_redirect @user, event: :authentication
      set_flash_message(:notice, :success, kind: "Azure") if is_navigational_format?
    else
      session["devise.azure_data"] = request.env["omniauth.auth"]
      redirect_to new_user_registration_url
    end
  end

  def failure
    redirect_to root_path
  end
end

```

## ルーティングの設定をする

config/routes.rb ファイルに以下を追記します。

config/routes.rb

```
Rails.application.routes.draw do
  devise_for :users, controllers: {
    omniauth_callbacks: 'users/omniauth_callbacks'
  }

  # 他のルート
  # ルートパスの設定
  root to: 'home#index'
end
```

## ホームページの作成

ホームページのコントローラとアクションを作成します。

bash

```
$ rails generate controller home index
```

これで、app/controllers/home_controller.rb と app/views/home/index.html.erb が作成されます。

## ビューをカスタマイズする

ログインボタンを追加するために、ビューをカスタマイズします。例えば、app/views/devise/sessions/new.html.erb に以下を追加します。

app/views/devise/sessions/new.html.erb

```
<h2>Log in</h2>
<%= render "devise/shared/links" %>
```

## Azure ポータルでアプリケーションを登録する

1. Azure ポータルにサインインし、「Azure Entra ID」に移動します。  
   ![](https://dq7c5b6uxkdk2.cloudfront.net/posts/images/EntraID1.png)  
   [](https://camo.qiitausercontent.com/b0f2098fea31d927464be63b143921ec84ea498e/68747470733a2f2f71696974612d696d6167652d73746f72652e73332e61702d6e6f727468656173742d312e616d617a6f6e6177732e636f6d2f302f3539363633302f36353130633766322d326230642d613063382d333233632d6535363437373537643738372e706e67)

2. 「アプリの登録」をクリックし、新しい登録を作成します。  
   ![](https://dq7c5b6uxkdk2.cloudfront.net/posts/images/EntraID2.png)  
   [](https://camo.qiitausercontent.com/c4b1ed75c47c85cea79e4629547f0580cd357b3a/68747470733a2f2f71696974612d696d6167652d73746f72652e73332e61702d6e6f727468656173742d312e616d617a6f6e6177732e636f6d2f302f3539363633302f65623262656636642d653565662d303935332d393336622d3731356466656333366131622e706e67)

3. 新規登録をクリックします  
   ![](https://dq7c5b6uxkdk2.cloudfront.net/posts/images/EntraID3.png)  
   [](https://camo.qiitausercontent.com/ef9fca10f40a913c937af95b91820683439ab681/68747470733a2f2f71696974612d696d6167652d73746f72652e73332e61702d6e6f727468656173742d312e616d617a6f6e6177732e636f6d2f302f3539363633302f32623137663434642d633232362d613134332d663933622d6338343737643331313635332e706e67)

4. 必要な情報を入力し、リダイレクト URI として[http://localhost:3000/users/auth/azure_activedirectory_v2/callback を追加します。](http://localhost:3000/users/auth/azure_activedirectory_v2/callback%E3%82%92%E8%BF%BD%E5%8A%A0%E3%81%97%E3%81%BE%E3%81%99%E3%80%82)  
   ![](https://dq7c5b6uxkdk2.cloudfront.net/posts/images/EntraID4.png)  
   [](https://camo.qiitausercontent.com/837a3e8885223639cb69bbc1af3f8acf2621de52/68747470733a2f2f71696974612d696d6167652d73746f72652e73332e61702d6e6f727468656173742d312e616d617a6f6e6177732e636f6d2f302f3539363633302f33656533393037342d373763332d663063642d393932342d3561646232613463633135642e706e67)

5. 「証明書とシークレット」セクションで、新しいクライアントシークレットを作成します。このシークレットは後で使います。  
   [](https://camo.qiitausercontent.com/027a94fb40ef7d50a53f9c925cee8097021744a8/68747470733a2f2f71696974612d696d6167652d73746f72652e73332e61702d6e6f727468656173742d312e616d617a6f6e6177732e636f6d2f302f3539363633302f33633036636162382d303161362d323866372d663131302d6539303962666138316661352e706e67)![](https://dq7c5b6uxkdk2.cloudfront.net/posts/images/EntraID5.png)  
   ![](https://dq7c5b6uxkdk2.cloudfront.net/posts/images/EntraID6.png)  
   ![](https://dq7c5b6uxkdk2.cloudfront.net/posts/images/EntraID7.png)  
   ![](https://dq7c5b6uxkdk2.cloudfront.net/posts/images/EntraID8.png)  
   [](https://camo.qiitausercontent.com/8bd6cf67ff864de6a8d2c9d5430d0007322c40e4/68747470733a2f2f71696974612d696d6167652d73746f72652e73332e61702d6e6f727468656173742d312e616d617a6f6e6177732e636f6d2f302f3539363633302f30656133353436612d323538352d336538662d363531382d6233356663613239356330352e706e67)![](https://dq7c5b6uxkdk2.cloudfront.net/posts/images/EntraID9.png)  
   [](https://camo.qiitausercontent.com/35d4a50daa2eba81bf09adb8f9d827c995498b5b/68747470733a2f2f71696974612d696d6167652d73746f72652e73332e61702d6e6f727468656173742d312e616d617a6f6e6177732e636f6d2f302f3539363633302f30623939633666662d626539622d396331312d666534372d3735613361323831353235632e706e67)  
   [](https://camo.qiitausercontent.com/b3abe743904638ccc31847bb36b93f94b3a195d1/68747470733a2f2f71696974612d696d6167652d73746f72652e73332e61702d6e6f727468656173742d312e616d617a6f6e6177732e636f6d2f302f3539363633302f35623231353431612d653431342d393238632d326434352d3466653161346239626534652e706e67)

6. .env ファイルを作成します。  
   AZURE_CLIENT_ID,AZURE_TENANT_ID は、以下の画像の欄からコピーします。  
   AZURE_CLIENT_SEACRET は手順５で取得したシークレット値を利用します。
   [](https://camo.qiitausercontent.com/7c1fa8b9b01a479018c03984b0286c44d1bb74e8/68747470733a2f2f71696974612d696d6167652d73746f72652e73332e61702d6e6f727468656173742d312e616d617a6f6e6177732e636f6d2f302f3539363633302f38656338663462362d666232612d653731652d383432342d3435393638333461636666312e706e67)

.env

```
AZURE_CLIENT_ID=your_client_id
AZURE_CLIENT_SECRET=your_client_secret
AZURE_TENANT_ID=your_tenant_id
```

7.Rails を再起動します。

bash

```
$ rails s
```

## [](https://qiita.com/himawari_project/items/8ec59a8cb6d2abce4221#azure%E3%83%9D%E3%83%BC%E3%82%BF%E3%83%AB%E3%81%A7%E3%82%A2%E3%83%97%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%82%92%E7%99%BB%E9%8C%B2%E3%81%99%E3%82%8B)

## [](https://qiita.com/himawari_project/items/8ec59a8cb6d2abce4221#%E3%83%93%E3%83%A5%E3%83%BC%E3%82%92%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%9E%E3%82%A4%E3%82%BA%E3%81%99%E3%82%8B)

## [](https://qiita.com/himawari_project/items/8ec59a8cb6d2abce4221#%E3%83%AB%E3%83%BC%E3%83%86%E3%82%A3%E3%83%B3%E3%82%B0%E3%81%AE%E8%A8%AD%E5%AE%9A%E3%82%92%E3%81%99%E3%82%8B)
