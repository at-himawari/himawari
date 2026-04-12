import LicensePage from "../../views/license/+Page";
import { data } from "../../views/license/+data";

export default async function Page() {
  const { content } = await data();
  return <LicensePage content={content} />;
}
