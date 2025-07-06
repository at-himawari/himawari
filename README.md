# Himawari - React + TypeScript + Vite

企業サイトとCMS機能を備えたReactアプリケーション。

## 開発環境のセットアップ

1. 依存関係のインストール:
```bash
npm install
```

2. 開発サーバーの起動:
```bash
npm run dev
```

3. ビルド:
```bash
npm run build
```

## サーバー設定（さくらレンタルサーバー）

### SPA ルーティング設定
AllowOverrideが無効化されている場合のフォールバック設定：

1. ドキュメントルートに`.htaccess`ファイルを配置（リポジトリから自動デプロイ）
2. `index.php`がSPAルーティングを処理
3. APIルート（`/api/`）は通常通り動作

### 環境変数設定
さくらレンタルサーバーでの環境変数設定方法：

1. **環境変数ファイルの作成**:
   - ファイル名: `at-himawari.com` (ドメイン名)
   - 配置場所: `/home/at-himawari/www/.env`
   - 内容:
   ```ini
   DB_HOST=localhost
   DB_NAME=your_database_name
   DB_USERNAME=your_db_username
   DB_PASSWORD=your_secure_password
   ADMIN_PASSWORD=your_admin_password
   ```

2. **ファイル権限設定**: `chmod 600 .env`

3. **データベース設定**: MySQLデータベースを作成し、`database/schema.sql`を実行

## 技術スタック

- React + TypeScript + Vite
- PHP + MySQL (バックエンド)
- さくらレンタルサーバー対応

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
