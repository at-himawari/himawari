# データベースセットアップ

## さくらレンタルサーバーでのセットアップ手順

1. さくらレンタルサーバーのコントロールパネルにログイン
2. データベース設定からMySQLデータベースを作成
3. データベース名: 任意の名前（環境変数 `DB_NAME` で指定）
4. ユーザー名とパスワードを設定
5. `schema.sql` を実行してテーブルを作成

## 環境変数設定

さくらレンタルサーバーで以下の環境変数を設定してください：

```
DB_HOST=localhost
DB_NAME=your_database_name
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
ADMIN_PASSWORD=your_admin_password
```

## 初期データ

`schema.sql` には既存のニュースと動画データが含まれています。
データベース作成時に自動的に挿入されます。
