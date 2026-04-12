import ProjectPage from "../../views/project/+Page";
import { data } from "../../views/project/+data";

export default async function Page() {
  const { content } = await data();
  return <ProjectPage content={content} />;
}
