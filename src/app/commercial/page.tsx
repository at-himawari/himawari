import CommercialPage from "../../views/commercial/+Page";
import { data } from "../../views/commercial/+data";

export default async function Page() {
  const { content } = await data();
  return <CommercialPage content={content} />;
}
