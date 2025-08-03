import { PageContextPost } from "../../../types/pageContextPost";

export default function title(pageContext: { data: PageContextPost }) {
  return pageContext?.data?.post?.title +" Himawari Project" || "Himawari Project";
}
