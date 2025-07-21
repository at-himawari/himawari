/* eslint-disable @typescript-eslint/no-unused-vars */
import { getAllPosts } from '../../utils/blog';
import type { Post } from '../../utils/blog';

// `content`を除いた型を定義
export type PostInfo = Omit<Post, 'content'>;

export async function data() {
  // 記事一覧ページには全文は不要なので、contentを除外して渡す
  const posts: PostInfo[] = getAllPosts().map(({ content, ...rest }) => rest);
  
  return {
    pageProps: {
      posts,
    },
  };
}