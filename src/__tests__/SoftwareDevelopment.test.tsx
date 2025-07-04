import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import SoftwareDevelopment from '../SoftwareDevelopment';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <HelmetProvider>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </HelmetProvider>
  );
};

describe('SoftwareDevelopment', () => {
  test('ページタイトルが正しく設定される', () => {
    renderWithProviders(<SoftwareDevelopment />);
    
    expect(document.title).toBe('Himawari Project - ソフトウェア開発');
  });

  test('ソフトウェア開発セクションのタイトルが表示される', () => {
    renderWithProviders(<SoftwareDevelopment />);
    
    expect(screen.getByRole('heading', { name: 'ソフトウェア開発' })).toBeInTheDocument();
    expect(screen.getByText('Software Develop')).toBeInTheDocument();
  });

  test('サービス説明文が表示される', () => {
    renderWithProviders(<SoftwareDevelopment />);
    
    expect(screen.getByText(/オープンな開発/)).toBeInTheDocument();
    expect(screen.getByAltText('オープンソース＆エンジニアファースト')).toBeInTheDocument();
  });

  test('費用セクションが表示される', () => {
    renderWithProviders(<SoftwareDevelopment />);
    
    expect(screen.getByText('費用')).toBeInTheDocument();
    expect(screen.getByText('Cost')).toBeInTheDocument();
  });

  test('AI面接コーチの例が表示される', () => {
    renderWithProviders(<SoftwareDevelopment />);
    
    expect(screen.getByText('AI面接コーチ導入費用例')).toBeInTheDocument();
  });

  test('サービスコスト表が表示される', () => {
    renderWithProviders(<SoftwareDevelopment />);
    
    expect(screen.getByText('サービスコスト例')).toBeInTheDocument();
    expect(screen.getByText('Service Costs')).toBeInTheDocument();
    expect(screen.getByText('Google Cloud Run')).toBeInTheDocument();
    expect(screen.getByText('Azure OpenAI')).toBeInTheDocument();
    expect(screen.getByText('合計')).toBeInTheDocument();
    expect(screen.getByText('$195')).toBeInTheDocument();
  });

  test('お問い合わせセクションが表示される', () => {
    renderWithProviders(<SoftwareDevelopment />);
    
    expect(screen.getByRole('heading', { name: 'お問い合わせ' })).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  test('お問い合わせリンクが正しく設定される', () => {
    renderWithProviders(<SoftwareDevelopment />);
    
    const contactLink = screen.getByText('こちらからご依頼ください');
    expect(contactLink.closest('a')).toHaveAttribute('href', 'https://forms.gle/TCJRQaArJ2oMQU7NA');
  });
});
