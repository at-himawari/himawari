import { getPosts } from '../../utils/getPosts';

export function data() {
  const posts = getPosts();
  // 全記事のデータを返す
  return posts;
}