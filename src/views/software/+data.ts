import { getPageContent } from "../../utils/getPages";

export async function data() {
  // Strapiで slug を "software" として登録したデータを取得
  const content = await getPageContent("software");
  return {
    content,
  };
}