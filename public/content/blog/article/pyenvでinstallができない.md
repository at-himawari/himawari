---
title: "pyenvでinstallができない"
date: 2024-03-25
categories: 
  - "技術"
coverImage: "スクリーンショット-2024-03-25-14.01.43.png"
---

pyenvでpythonをインストールしたときに、インストールに失敗していたので、原因調査をしたので記事にします。

## 前提

- MacBook Air(M2プロセッサ)

- anyenvでpyenvをインストール

- brewを利用（PATHが通っている)

## エラー

anyenvでpyenvをインストールしたあと、pyenv install 3.11.8を実行すると以下のエラーが発生してしまい、インストールができませんでした。

```
ld: symbol(s) not found for architecture arm64
ld: symbol(s) not found for architecture arm64
clang: clang: error: error: linker command failed with exit code 1 (use -v to see invocation)
```

## 原因調査

1. brew update, upgradeで更新プログラムがないか。  
    →こちらは更新したが、変化なし。

3. Apple Siliconに対応した、brewが入っているか。  
    →Intel系のインストーラとの違いがなかった。

5. pyenvは、anyenvからインストールされているものが利用されているか  
    （brew経由でインストールされたものが利用されていないか  
    →こちらは、anyenvからpyenvをアンインストールしたところで、pyenvコマンドが動いたため、brewでインストールしたものが使われてそう。(ここが怪しい。）

7. MacBookのデータ移行(Intelプロセッサ）を行った影響がないか  
    →こちらも、brew関係でエラーを発生させそう。

どうやら3番,4番が怪しそうという結果になりました。

## 解決策

- pyenvの削除  
    brewでインストールしたものを削除します。  
    `$ brew uninstall pyenv`

- anyenvの削除  
    anyenvをアンインストールします。  
    `$ brew uninstall anyenv`

- brewの削除  
    brewを削除します  
    `$ /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/uninstall.sh)"`

- brewをインストールします  
    `$ /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`

- anyenvをインストールします  
    `$ brew install anyenv`

- pyenvをインストールします  
    `$ anyenv install pyenv`

- python3.11.8を試しにインストールします。  
    `$ pyenv install 3.11.8`

上記で完了ですお疲れ様です。  
IntelMacからApple Siliconへ移行して、pyenvで新たにインストールできなくなった人は試してみるとよいかと思います。
