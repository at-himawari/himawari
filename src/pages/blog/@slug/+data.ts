import { getAllPosts } from '../../../utils/blog';

export type Data = Awaited<ReturnType<typeof data>>;

export async function data(pageContext: { routeParams: { slug: string } }) {
  const { slug } = pageContext.routeParams;
  const posts = getAllPosts();
  const postData = posts.find(p => p.slug === slug);

  if (!postData) return undefined;

  const metaDescription = postData.content.substring(0, 120) + "...";
  const absoluteCoverImageUrl = postData.coverImage
    ? new URL(postData.coverImage, "https://at-himawari.com").href
    : "https://at-himawari.com/avatar.png";

  return {
    pageProps: {
      ...postData,
    },
    meta: {
      title: { value: `${postData.title} - Himawari Project` },
      description: { value: metaDescription },
      coverImage: { value: absoluteCoverImageUrl },
    },
  };
}