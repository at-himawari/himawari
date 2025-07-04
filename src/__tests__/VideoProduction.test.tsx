import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import VideoProduction from '../VideoProduction';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <HelmetProvider>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </HelmetProvider>
  );
};

describe('VideoProduction', () => {
  test('ページタイトルが正しく設定される', () => {
    renderWithProviders(<VideoProduction />);
    
    expect(document.title).toBe('Himawari Project - 映像制作');
  });

  test('映像制作セクションのタイトルが表示される', () => {
    renderWithProviders(<VideoProduction />);
    
    expect(screen.getByRole('heading', { name: '映像制作' })).toBeInTheDocument();
    expect(screen.getByText('Video Production')).toBeInTheDocument();
  });

  test('サービス説明文が表示される', () => {
    renderWithProviders(<VideoProduction />);
    
    expect(screen.getByText(/アマチュア映像制作を行っております/)).toBeInTheDocument();
  });

  test('費用セクションが表示される', () => {
    renderWithProviders(<VideoProduction />);
    
    expect(screen.getByText('費用')).toBeInTheDocument();
    expect(screen.getByText('Cost')).toBeInTheDocument();
  });

  test('料金情報が表示される', () => {
    renderWithProviders(<VideoProduction />);
    
    expect(screen.getByText('テロップ･カット･サムネイル動画：５分 5,000円~')).toBeInTheDocument();
    expect(screen.getByText('一眼レフカメラ･スマホジンバル等は貸出可能です。')).toBeInTheDocument();
  });

  test('お問い合わせセクションが表示される', () => {
    renderWithProviders(<VideoProduction />);
    
    expect(screen.getByRole('heading', { name: 'お問い合わせ' })).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  test('お問い合わせリンクが正しく設定される', () => {
    renderWithProviders(<VideoProduction />);
    
    const contactLink = screen.getByText('こちらからご依頼ください');
    expect(contactLink.closest('a')).toHaveAttribute('href', 'https://forms.gle/TCJRQaArJ2oMQU7NA');
  });
});
