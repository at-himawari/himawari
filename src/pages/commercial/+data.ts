// 修正後
import { getPageContent } from "../../utils/getPages";

export async function data() {
  // Strapiでslugを "commercial" として登録したデータを取得
  const content = await getPageContent("commercial");
  return {
    content,
  };
}
