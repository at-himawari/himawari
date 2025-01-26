// src/utils/youtube.ts

/**
 * YouTubeの動画URLから動画IDを抽出し、サムネイルURLを生成する関数
 * @param videoUrl YouTubeの動画URL
 * @returns サムネイルURL
 */
export const getThumbnailUrl = (videoUrl: string): string => {
    try {
      const url = new URL(videoUrl);
      let videoId = '';
  
      // URLのパスから動画IDを抽出
      if (url.hostname.includes('youtu.be')) {
        // 短縮URL形式: https://youtu.be/CaZ6wF4fIEw
        videoId = url.pathname.slice(1);
      } else if (url.pathname.startsWith('/live/')) {
        // ライブURL形式: https://youtube.com/live/CaZ6wF4fIEw
        videoId = url.pathname.split('/')[2];
      } else {
        // 標準的なURL形式: https://www.youtube.com/watch?v=CaZ6wF4fIEw
        videoId = url.searchParams.get('v') || '';
      }
  
      if (!videoId) {
        throw new Error('動画IDが取得できませんでした。');
      }
  
      return `http://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    } catch (error) {
      console.error('サムネイルURLの生成に失敗しました:', error);
      // デフォルトのサムネイル画像URLを返す（必要に応じて変更）
      return '/default-thumbnail.jpg';
    }
  };
  