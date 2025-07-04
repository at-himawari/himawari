# データベースセットアップ

## さくらレンタルサーバーでのセットアップ手順

1. さくらレンタルサーバーのコントロールパネルにログイン
2. データベース設定からMySQLデータベースを作成
3. データベース名: `himawari_cms`
4. ユーザー名とパスワードを設定
5. `schema.sql` を実行してテーブルを作成

## 環境変数設定

さくらレンタルサーバーで以下の環境変数を設定してください：

```
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
VITE_ADMIN_PASSWORD=himawari-admin-2025
```

## 初期データ

`schema.sql` には既存のニュースと動画データが含まれています。
データベース作成時に自動的に挿入されます。
