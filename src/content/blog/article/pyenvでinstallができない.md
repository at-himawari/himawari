---
title: "pyenvでinstallができない"
date: 2024-03-25
categories:
  - "技術"
tags:
  - "Python"
  - "プログラミング"
coverImage: "https://dq7c5b6uxkdk2.cloudfront.net/posts/images/スクリーンショット-2024-03-25-14.01.43.png"
---

pyenv で python をインストールしたときに、インストールに失敗していたので、原因調査をしたので記事にします。

## 前提

- MacBook Air(M2 プロセッサ)

- anyenv で pyenv をインストール

- brew を利用（PATH が通っている)

## エラー

anyenv で pyenv をインストールしたあと、pyenv install 3.11.8 を実行すると以下のエラーが発生してしまい、インストールができませんでした。

```
ld: symbol(s) not found for architecture arm64
ld: symbol(s) not found for architecture arm64
clang: clang: error: error: linker command failed with exit code 1 (use -v to see invocation)
```

## 原因調査

1. brew update, upgrade で更新プログラムがないか。  
   → こちらは更新したが、変化なし。

2. Apple Silicon に対応した、brew が入っているか。  
   →Intel 系のインストーラとの違いがなかった。

3. pyenv は、anyenv からインストールされているものが利用されているか  
   （brew 経由でインストールされたものが利用されていないか  
   → こちらは、anyenv から pyenv をアンインストールしたところで、pyenv コマンドが動いたため、brew でインストールしたものが使われてそう。(ここが怪しい。）

4. MacBook のデータ移行(Intel プロセッサ）を行った影響がないか  
   → こちらも、brew 関係でエラーを発生させそう。

どうやら 3 番,4 番が怪しそうという結果になりました。

## 解決策

- pyenv の削除  
   brew でインストールしたものを削除します。  
   `$ brew uninstall pyenv`

- anyenv の削除  
   anyenv をアンインストールします。  
   `$ brew uninstall anyenv`

- brew の削除  
   brew を削除します  
   `$ /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/uninstall.sh)"`

- brew をインストールします  
   `$ /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`

- anyenv をインストールします  
   `$ brew install anyenv`

- pyenv をインストールします  
   `$ anyenv install pyenv`

- python3.11.8 を試しにインストールします。  
   `$ pyenv install 3.11.8`

上記で完了ですお疲れ様です。  
IntelMac から Apple Silicon へ移行して、pyenv で新たにインストールできなくなった人は試してみるとよいかと思います。
