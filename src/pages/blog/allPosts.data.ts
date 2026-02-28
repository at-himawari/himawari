import { getPosts } from '../../utils/getPosts';

export async function data() {
  const posts = await getPosts();
  // 全記事のデータを返す
  return posts;
}