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

});
