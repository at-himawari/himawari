import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from '../Home';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <HelmetProvider>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </HelmetProvider>
  );
};

describe('Home', () => {
  test('ページタイトルが正しく設定される', () => {
    renderWithProviders(<Home />);
    
    expect(document.title).toBe('Himawari Project');
  });

  test('スライドショーのコンテンツが表示される', () => {
    renderWithProviders(<Home />);
    
    expect(screen.getAllByText('詳しく見る')[0]).toBeInTheDocument();
  });

  test('プロフィールセクションが表示される', () => {
    renderWithProviders(<Home />);
    
    expect(screen.getByText('プロフィール')).toBeInTheDocument();
    expect(screen.getByText(/^@/)).toBeInTheDocument();
  });

  test('プロフィール画像が表示される', () => {
    renderWithProviders(<Home />);
    
    const avatar = screen.getByAltText('Avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', '/avatar.jpg');
  });

  test('プロフィール説明文が表示される', () => {
    renderWithProviders(<Home />);
    
    const profileSection = screen.getByText('プロフィール').closest('section');
    expect(profileSection).toBeInTheDocument();
  });
});
