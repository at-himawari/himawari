// 修正後
import { getPageContent } from "../../utils/getPages";

export async function data() {
  // Strapiでslugを "project" として登録したデータを取得
  const content = await getPageContent("project");
  return {
    content,
  };
}