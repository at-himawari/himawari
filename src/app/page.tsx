import HomePage from "../views/index/+Page";
import { data } from "../views/index/+data";

export default async function Page() {
  const pageData = await data();
  return <HomePage data={pageData} />;
}
