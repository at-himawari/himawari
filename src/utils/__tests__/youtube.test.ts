import { getThumbnailUrl } from '../youtube';

describe('getThumbnailUrl', () => {
  test('youtu.be形式のURLからサムネイルURLを生成する', () => {
    const videoUrl = 'https://youtu.be/testVideoId';
    const result = getThumbnailUrl(videoUrl);
    
    expect(result).toBe('http://img.youtube.com/vi/testVideoId/hqdefault.jpg');
  });

  test('youtube.com/watch形式のURLからサムネイルURLを生成する', () => {
    const videoUrl = 'https://www.youtube.com/watch?v=testVideoId';
    const result = getThumbnailUrl(videoUrl);
    
    expect(result).toBe('http://img.youtube.com/vi/testVideoId/hqdefault.jpg');
  });

  test('youtube.com/live形式のURLからサムネイルURLを生成する', () => {
    const videoUrl = 'https://youtube.com/live/testVideoId';
    const result = getThumbnailUrl(videoUrl);
    
    expect(result).toBe('http://img.youtube.com/vi/testVideoId/hqdefault.jpg');
  });

  test('パラメータ付きのURLからサムネイルURLを生成する', () => {
    const videoUrl = 'https://www.youtube.com/watch?v=testVideoId&t=123s';
    const result = getThumbnailUrl(videoUrl);
    
    expect(result).toBe('http://img.youtube.com/vi/testVideoId/hqdefault.jpg');
  });

  test('無効なURLの場合はデフォルトサムネイルを返す', () => {
    const videoUrl = 'invalid-url';
    const result = getThumbnailUrl(videoUrl);
    
    expect(result).toBe('/default-thumbnail.jpg');
  });

  test('動画IDが取得できない場合はデフォルトサムネイルを返す', () => {
    const videoUrl = 'https://www.youtube.com/watch';
    const result = getThumbnailUrl(videoUrl);
    
    expect(result).toBe('/default-thumbnail.jpg');
  });

  test('空白を含むURLでも正しく処理する', () => {
    const videoUrl = ' https://youtu.be/lBIDTBDlncA';
    const result = getThumbnailUrl(videoUrl);
    
    expect(result).toBe('http://img.youtube.com/vi/lBIDTBDlncA/hqdefault.jpg');
  });
});
