import type { Config } from "vike/types";

export default {
  title: "ブログ - Himawari Project",
  description: "ときどき更新する技術ブログやら",
  prerender: true,
  // postsデータをクライアントサイドに渡す設定
  passToClient: ["posts"],
} satisfies Config;