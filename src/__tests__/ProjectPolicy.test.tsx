import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ProjectPolicy from '../ProjectPolicy';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <HelmetProvider>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </HelmetProvider>
  );
};

describe('ProjectPolicy', () => {
  test('ページタイトルが正しく設定される', () => {
    renderWithProviders(<ProjectPolicy />);
    
    expect(document.title).toBe('Himawari Project - プロジェクトポリシー');
  });

  test('プロジェクトポリシーのタイトルが表示される', () => {
    renderWithProviders(<ProjectPolicy />);
    
    expect(screen.getByRole('heading', { name: 'プロジェクトポリシー' })).toBeInTheDocument();
  });

  test('特定商取引法に基づく表記が表示される', () => {
    renderWithProviders(<ProjectPolicy />);
    
    expect(screen.getByText('特定商取引法に基づく表記')).toBeInTheDocument();
    expect(screen.getByText('個人運営のため、契約締結前のお見積時に表示いたします。')).toBeInTheDocument();
  });

  test('カスタマーハラスメントセクションが表示される', () => {
    renderWithProviders(<ProjectPolicy />);
    
    expect(screen.getByText('カスタマーハラスメント')).toBeInTheDocument();
    expect(screen.getByText('カスタマーハラスメントには、厳格に対処いたします。')).toBeInTheDocument();
  });

  test('カスハラの具体例が表示される', () => {
    renderWithProviders(<ProjectPolicy />);
    
    expect(screen.getByText('･身体的な攻撃：暴行や傷害など')).toBeInTheDocument();
    expect(screen.getByText('･精神的な攻撃：脅迫、侮辱、ひどい暴言など')).toBeInTheDocument();
    expect(screen.getByText('･過度な要求：土下座の強要や過剰な謝罪の要求など')).toBeInTheDocument();
  });

  test('SNS利用規約セクションが表示される', () => {
    renderWithProviders(<ProjectPolicy />);
    
    expect(screen.getByText('SNS利用規約')).toBeInTheDocument();
  });

  test('厚生労働省のリンクが正しく設定される', () => {
    renderWithProviders(<ProjectPolicy />);
    
    const mhlwLink = screen.getByText('厚生労働省');
    expect(mhlwLink.closest('a')).toHaveAttribute('href', 'https://www.mhlw.go.jp/content/11921000/000894063.pdf');
  });

  test('禁止行為のリストが表示される', () => {
    renderWithProviders(<ProjectPolicy />);
    
    expect(screen.getByText(/当プロジェクト、他の利用者その他の第三者の権利・利益を侵害する行為/)).toBeInTheDocument();
    expect(screen.getByText(/公職選挙法に違反する行為/)).toBeInTheDocument();
  });
});
