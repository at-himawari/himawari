import vikeReact from "vike-react/config";
import { Layout } from "./Layout";

export default {
  Layout: Layout,
  lang: "ja",
  extends: vikeReact,
  prerender: true,
  passToClient: ["content"],
  favicon:"https://dq7c5b6uxkdk2.cloudfront.net/posts/images/himawari.png",
};
