import SoftwarePage from "../../views/software/+Page";
import { data } from "../../views/software/+data";

export default async function Page() {
  const { content } = await data();
  return <SoftwarePage content={content} />;
}
