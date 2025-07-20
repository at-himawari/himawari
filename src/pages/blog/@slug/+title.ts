export default function title(pageContext: { data?: { title: string } }) {
  return pageContext?.data?.title || "Blog Post";
}