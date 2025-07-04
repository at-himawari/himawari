import { render, screen } from '@testing-library/react';
import VideoCard from '../VideoCard';

const mockVideoProps = {
  title: 'テスト動画タイトル',
  description: 'テスト動画の説明',
  videoUrl: 'https://youtu.be/testVideoId'
};

describe('VideoCard', () => {
  test('動画タイトルが表示される', () => {
    render(<VideoCard {...mockVideoProps} />);
    
    expect(screen.getByText('テスト動画タイトル')).toBeInTheDocument();
  });

  test('動画説明が表示される', () => {
    render(<VideoCard {...mockVideoProps} />);
    
    expect(screen.getByText('テスト動画の説明')).toBeInTheDocument();
  });

  test('動画リンクが正しく設定される', () => {
    render(<VideoCard {...mockVideoProps} />);
    
    const videoLinks = screen.getAllByRole('link');
    videoLinks.forEach((link: HTMLElement) => {
      expect(link).toHaveAttribute('href', 'https://youtu.be/testVideoId');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  test('サムネイル画像が表示される', () => {
    render(<VideoCard {...mockVideoProps} />);
    
    const thumbnail = screen.getByAltText('テスト動画タイトル');
    expect(thumbnail).toBeInTheDocument();
    expect(thumbnail).toHaveAttribute('src', 'http://img.youtube.com/vi/testVideoId/hqdefault.jpg');
  });

  test('動画を見るリンクが表示される', () => {
    render(<VideoCard {...mockVideoProps} />);
    
    expect(screen.getByText('動画を見る')).toBeInTheDocument();
  });
});
