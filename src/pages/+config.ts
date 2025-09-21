import vikeReact from "vike-react/config";
import { Layout } from "./+Layout";
import { description, favicon, title } from "../const/pageConstants";
import { Config } from "vike/types";

export default {
  Layout,
  lang: "ja",
  extends: vikeReact,
  prerender: true,
  favicon,
  title,
  description,
} satisfies Config;
