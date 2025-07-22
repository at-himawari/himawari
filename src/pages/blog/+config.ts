import vikeReact from "vike-react/config";
import type { Config } from "vike/types";

export default {
  extends: [vikeReact], // ⬅️ この行を追加
  title: "ブログ - Himawari Project",
  description: "ときどき更新する技術ブログやら",
  prerender: true,
} satisfies Config;
