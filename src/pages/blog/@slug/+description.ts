export default function description(pageContext: { data?: { description: string } }) {
  return pageContext?.data?.description || "";
}