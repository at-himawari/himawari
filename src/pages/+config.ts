import vikeReact from "vike-react/config";
import { Layout } from "./Layout";
import favicon from "../../public/himawari.png";
import HimawariIcon from "../../public/himawari.png";

export default {
  Layout: Layout,
  lang: "ja",
  extends: vikeReact,
  prerender: true,
  passToClient: ["content"],
  favicon,
};
