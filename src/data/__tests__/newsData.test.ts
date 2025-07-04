import { newsItems, NewsItem } from '../newsData';

describe('newsData', () => {
  test('ニュースアイテムが配列として定義されている', () => {
    expect(Array.isArray(newsItems)).toBe(true);
    expect(newsItems.length).toBeGreaterThan(0);
  });

  test('各ニュースアイテムが必要なプロパティを持っている', () => {
    newsItems.forEach((item: NewsItem) => {
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('date');
      expect(item).toHaveProperty('content');
      
      expect(typeof item.title).toBe('string');
      expect(typeof item.date).toBe('string');
      expect(typeof item.content).toBe('string');
    });
  });

  test('最新のニュースアイテムが適切な構造を持っている', () => {
    const latestNews = newsItems[0];
    
    expect(latestNews.title).toBeTruthy();
    expect(latestNews.date).toMatch(/^\d{4}\.\d{1,2}\.\d{1,2}$/);
    expect(latestNews.content).toBeTruthy();
  });

  test('日付形式が一貫している', () => {
    newsItems.forEach((item: NewsItem) => {
      expect(item.date).toMatch(/^\d{4}\.\d{1,2}\.\d{1,2}$/);
    });
  });

  test('タイトルと内容が空でない', () => {
    newsItems.forEach((item: NewsItem) => {
      expect(item.title.trim()).not.toBe('');
      expect(item.content.trim()).not.toBe('');
    });
  });
});
