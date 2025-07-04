import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import PrivacyPolicy from '../PrivacyPolicy';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <HelmetProvider>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </HelmetProvider>
  );
};

describe('PrivacyPolicy', () => {
  test('ページタイトルが正しく設定される', () => {
    renderWithProviders(<PrivacyPolicy />);
    
    expect(document.title).toBe('Himawari Project - プライバシーポリシー');
  });

  test('プライバシーポリシーのタイトルが表示される', () => {
    renderWithProviders(<PrivacyPolicy />);
    
    expect(screen.getByRole('heading', { name: 'プライバシーポリシー' })).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
  });

  test('主要なセクションが表示される', () => {
    renderWithProviders(<PrivacyPolicy />);
    
    expect(screen.getByText('1. 基本的考え方')).toBeInTheDocument();
    expect(screen.getByText('2. 収集する情報の範囲')).toBeInTheDocument();
    expect(screen.getByText('3. 利用目的')).toBeInTheDocument();
    expect(screen.getByText('4. 利用及び提供の制限')).toBeInTheDocument();
    expect(screen.getByText('5. 安全確保の措置')).toBeInTheDocument();
    expect(screen.getByText('6. 適用範囲')).toBeInTheDocument();
    expect(screen.getByText('7. クッキーの使用')).toBeInTheDocument();
    expect(screen.getByText('8. その他')).toBeInTheDocument();
  });

  test('基本的考え方の内容が表示される', () => {
    renderWithProviders(<PrivacyPolicy />);
    
    expect(screen.getByText(/当プロジェクトのウェブサイト/)).toBeInTheDocument();
    expect(screen.getByText(/at-himawari.comドメイン/)).toBeInTheDocument();
  });

  test('外部リンクが正しく設定される', () => {
    renderWithProviders(<PrivacyPolicy />);
    
    const ppcLink = screen.getByText('https://www.ppc.go.jp/news/careful_information/sns_button_life/');
    expect(ppcLink.closest('a')).toHaveAttribute('href', 'https://www.ppc.go.jp/news/careful_information/sns_button_life/');
    
    const googleLink = screen.getByText('https://policies.google.com/privacy');
    expect(googleLink.closest('a')).toHaveAttribute('href', 'https://policies.google.com/privacy');
  });
});
