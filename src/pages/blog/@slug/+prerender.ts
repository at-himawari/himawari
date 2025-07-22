import fs from 'node:fs';
import path from 'node:path';
import { generateHash } from '../../../utils/hash';

// このファイル内で完結するように、記事のslug（ハッシュ）を取得する関数を定義
async function getPostSlugs() {
  const postsDirectory = path.join(process.cwd(), 'src/content/blog/article');
  const filenames = fs.readdirSync(postsDirectory);

  const slugsPromises = filenames
    .filter((filename) => filename.endsWith('.md'))
    .map(async (filename) => {
      const filePath = path.join(postsDirectory, filename);
      const rawContent = fs.readFileSync(filePath, 'utf8');
      const slug = await generateHash(rawContent);
      return `/blog/${slug}`;
    });

  return Promise.all(slugsPromises);
}

// prerender関数はgetPostSlugsを呼び出す
export default async function prerender() {
  const urls = await getPostSlugs();
  return urls;
}