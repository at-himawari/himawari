const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const articlesDir = path.join(__dirname, '../public/content/blog/article');
const outputIndexFile = path.join(__dirname, '../public/content/blog/index.json');

try {
  // 記事ファイルの一覧を取得
  const filenames = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));

  const posts = filenames.map(filename => {
    // ファイルを読み込み、frontmatterを解析
    const filePath = path.join(articlesDir, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);

    return {
      slug: filename.replace(/\.md$/, ''),
      title: data.title,
      date: data.date,
      tags: data.tags || [],
      categories: data.categories || [],
    };
  });

  // 日付の降順で記事をソート
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // JSONファイルとして書き出し
  fs.writeFileSync(outputIndexFile, JSON.stringify(posts, null, 2));

  console.log('Blog index generated successfully!');

} catch (error) {
  console.error('Error generating blog index:', error);
}