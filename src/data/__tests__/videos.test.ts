import { airVideos, Video } from '../videos';

describe('videos', () => {
  test('動画データが配列として定義されている', () => {
    expect(Array.isArray(airVideos)).toBe(true);
    expect(airVideos.length).toBeGreaterThan(0);
  });

  test('各動画アイテムが必要なプロパティを持っている', () => {
    airVideos.forEach((video: Video) => {
      expect(video).toHaveProperty('title');
      expect(video).toHaveProperty('description');
      expect(video).toHaveProperty('videoUrl');
      
      expect(typeof video.title).toBe('string');
      expect(typeof video.description).toBe('string');
      expect(typeof video.videoUrl).toBe('string');
    });
  });

  test('すべての動画URLがYouTubeのURLである', () => {
    airVideos.forEach((video: Video) => {
      expect(video.videoUrl).toMatch(/^https:\/\/(www\.)?youtu(\.be|be\.com)/);
    });
  });

  test('動画タイトルが空でない', () => {
    airVideos.forEach((video: Video) => {
      expect(video.title.trim()).not.toBe('');
    });
  });

  test('動画URLが有効な形式である', () => {
    airVideos.forEach((video: Video) => {
      expect(() => new URL(video.videoUrl.trim())).not.toThrow();
    });
  });

  test('飛行機関連の動画が含まれている', () => {
    const airportRelatedVideos = airVideos.filter(video => 
      video.title.includes('空港') || 
      video.title.includes('フライト') || 
      video.title.includes('離陸') || 
      video.title.includes('着陸')
    );
    
    expect(airportRelatedVideos.length).toBeGreaterThan(0);
  });
});
