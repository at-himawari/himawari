import PrivacyPage from "../../views/privacy/+Page";
import { data } from "../../views/privacy/+data";

export default async function Page() {
  const { content } = await data();
  return <PrivacyPage content={content} />;
}
