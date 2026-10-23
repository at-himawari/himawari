# Dependabot 対応記録（2026-10-23）

## 確認結果

GitHub API で取得した未解決アラートは49件（Critical 2件、High 18件、Medium 22件、Low 7件）である。取得時点の各アラートの vulnerable_version_range と更新後の宣言・ロックファイルを semver で照合し、該当バージョンが残っていないことを確認した。

GitHub 上の解決状態は、既定ブランチへの反映と Dependabot の再解析後に確認する必要がある。この作業では push・マージ・デプロイは実施していない。

## 変更内容

- Next.js 16.4.2、OpenNext 1.20.13、KaTeX 0.19.0、Vite 8.3.5、Vitest 5.0.5 を宣言し、既存ロックファイルの修正版と整合させた。
- Vitest のカバレッジ機能を5.0.5に統一した。
- OpenNext の peer dependency を満たすため Wrangler を4.148.0に更新した。
- AWS CDK を2.274.0に更新し、同梱 brace-expansion を5.0.6から5.0.12に更新した。

## 対象アラート

| ファイル | パッケージ | アラート |
| --- | --- | --- |
| `infra/aws/engagement-api/package-lock.json` | `brace-expansion` | [#95](https://github.com/at-himawari/himawari/security/dependabot/95), [#94](https://github.com/at-himawari/himawari/security/dependabot/94), [#93](https://github.com/at-himawari/himawari/security/dependabot/93), [#67](https://github.com/at-himawari/himawari/security/dependabot/67), [#65](https://github.com/at-himawari/himawari/security/dependabot/65), [#43](https://github.com/at-himawari/himawari/security/dependabot/43) |
| `package.json` | `@opennextjs/cloudflare` | [#90](https://github.com/at-himawari/himawari/security/dependabot/90) |
| `package.json` | `katex` | [#96](https://github.com/at-himawari/himawari/security/dependabot/96) |
| `pnpm-lock.yaml` | `@opennextjs/cloudflare` | [#132](https://github.com/at-himawari/himawari/security/dependabot/132) |
| `pnpm-lock.yaml` | `@vitest/mocker` | [#138](https://github.com/at-himawari/himawari/security/dependabot/138), [#103](https://github.com/at-himawari/himawari/security/dependabot/103) |
| `pnpm-lock.yaml` | `brace-expansion` | [#118](https://github.com/at-himawari/himawari/security/dependabot/118), [#117](https://github.com/at-himawari/himawari/security/dependabot/117), [#116](https://github.com/at-himawari/himawari/security/dependabot/116) |
| `pnpm-lock.yaml` | `katex` | [#124](https://github.com/at-himawari/himawari/security/dependabot/124) |
| `pnpm-lock.yaml` | `next` | [#131](https://github.com/at-himawari/himawari/security/dependabot/131), [#130](https://github.com/at-himawari/himawari/security/dependabot/130), [#129](https://github.com/at-himawari/himawari/security/dependabot/129), [#128](https://github.com/at-himawari/himawari/security/dependabot/128), [#127](https://github.com/at-himawari/himawari/security/dependabot/127), [#126](https://github.com/at-himawari/himawari/security/dependabot/126), [#119](https://github.com/at-himawari/himawari/security/dependabot/119) |
| `pnpm-lock.yaml` | `postcss-selector-parser` | [#121](https://github.com/at-himawari/himawari/security/dependabot/121) |
| `pnpm-lock.yaml` | `proxy-addr` | [#122](https://github.com/at-himawari/himawari/security/dependabot/122) |
| `pnpm-lock.yaml` | `sharp` | [#125](https://github.com/at-himawari/himawari/security/dependabot/125), [#105](https://github.com/at-himawari/himawari/security/dependabot/105), [#97](https://github.com/at-himawari/himawari/security/dependabot/97) |
| `pnpm-lock.yaml` | `source-map-js` | [#123](https://github.com/at-himawari/himawari/security/dependabot/123) |
| `pnpm-lock.yaml` | `undici` | [#115](https://github.com/at-himawari/himawari/security/dependabot/115), [#114](https://github.com/at-himawari/himawari/security/dependabot/114), [#113](https://github.com/at-himawari/himawari/security/dependabot/113), [#112](https://github.com/at-himawari/himawari/security/dependabot/112), [#111](https://github.com/at-himawari/himawari/security/dependabot/111), [#110](https://github.com/at-himawari/himawari/security/dependabot/110), [#109](https://github.com/at-himawari/himawari/security/dependabot/109), [#108](https://github.com/at-himawari/himawari/security/dependabot/108), [#107](https://github.com/at-himawari/himawari/security/dependabot/107), [#106](https://github.com/at-himawari/himawari/security/dependabot/106), [#102](https://github.com/at-himawari/himawari/security/dependabot/102), [#101](https://github.com/at-himawari/himawari/security/dependabot/101), [#100](https://github.com/at-himawari/himawari/security/dependabot/100), [#99](https://github.com/at-himawari/himawari/security/dependabot/99), [#98](https://github.com/at-himawari/himawari/security/dependabot/98) |
| `pnpm-lock.yaml` | `vite` | [#137](https://github.com/at-himawari/himawari/security/dependabot/137), [#136](https://github.com/at-himawari/himawari/security/dependabot/136), [#135](https://github.com/at-himawari/himawari/security/dependabot/135), [#134](https://github.com/at-himawari/himawari/security/dependabot/134), [#133](https://github.com/at-himawari/himawari/security/dependabot/133) |
| `pnpm-lock.yaml` | `vitest` | [#104](https://github.com/at-himawari/himawari/security/dependabot/104) |

## 残存事項

追加の pnpm audit で `tailwindcss > chokidar > braces@3.0.3` の High 1件が検出された。取得時点のアドバイザリには修正版がなく、既存の49件とは別の残存脆弱性である。Tailwind のメジャー更新や独自パッチは本変更に含めていない。

<出典 [GitHub Advisory GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)、GitHub Dependabot API、pnpm audit>

## 検証

- フロントエンド: 21ファイル・207テスト成功。
- Lambda: 11テストと14テストが成功。
- ESLint と AWS CDK の TypeScript 型チェックが成功。
- 固定CMSデータを使う `pnpm build:ci` が成功。静的ページの生成を確認した。
- 更新後の AWS CDK の npm audit は脆弱性0件。ルートの pnpm audit は上記 braces の High 1件のみ。
- ブラウザー表示と Cloudflare 本番環境での動作は未検証。
