import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import YouTube from '../YouTube';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <HelmetProvider>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </HelmetProvider>
  );
};

describe('YouTube', () => {
  test('ページタイトルが正しく設定される', () => {
    renderWithProviders(<YouTube />);
    
    expect(document.title).toBe('Himawari Project - YouTube');
  });

  test('YouTubeセクションのタイトルが表示される', () => {
    renderWithProviders(<YouTube />);
    
    expect(screen.getByRole('heading', { name: 'YouTube' })).toBeInTheDocument();
    expect(screen.getByText('羽ばたくエンジニア @at_himawari')).toBeInTheDocument();
  });

  test('説明文が表示される', () => {
    renderWithProviders(<YouTube />);
    
    expect(screen.getByText('ライブ配信したり、飛行機の搭乗動画を撮ったり様々なジャンルでやってます。')).toBeInTheDocument();
    expect(screen.getByText('コラボ･出演者絶賛募集中です！')).toBeInTheDocument();
  });

  test('連絡先情報が表示される', () => {
    renderWithProviders(<YouTube />);
    
    expect(screen.getByText('info.youtube[@]at-himawari.com')).toBeInTheDocument();
  });

  test('飛行機動画セクションのタイトルが表示される', () => {
    renderWithProviders(<YouTube />);
    
    expect(screen.getByText('YouTube 飛行機動画')).toBeInTheDocument();
  });

  test('動画カードが表示される', () => {
    renderWithProviders(<YouTube />);
    
    const videoCards = screen.getAllByText('動画を見る');
    expect(videoCards.length).toBeGreaterThan(0);
  });
});
