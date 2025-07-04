import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../Footer';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Footer', () => {
  test('主要なナビゲーションリンクが表示される', () => {
    renderWithRouter(<Footer />);
    
    expect(screen.getByText('ソフトウェア開発')).toBeInTheDocument();
    expect(screen.getByText('映像制作')).toBeInTheDocument();
    expect(screen.getByText('YouTube')).toBeInTheDocument();
  });

  test('利用規約関連のリンクが表示される', () => {
    renderWithRouter(<Footer />);
    
    expect(screen.getByText('プライバシーポリシー')).toBeInTheDocument();
    expect(screen.getByText('ライセンス')).toBeInTheDocument();
    expect(screen.getByText('プロジェクトポリシー')).toBeInTheDocument();
  });

  test('SNSリンクが正しいURLを持っている', () => {
    renderWithRouter(<Footer />);
    
    const twitterLink = screen.getByLabelText('X');
    expect(twitterLink).toHaveAttribute('href', 'https://x.com/at_himawari');
    
    const githubLink = screen.getByLabelText('GitHub');
    expect(githubLink).toHaveAttribute('href', 'https://github.com/at-himawari');
    
    const youtubeLink = screen.getByLabelText('YouTube');
    expect(youtubeLink).toHaveAttribute('href', 'https://www.youtube.com/@at_himawari');
  });

  test('外部リンクが新しいタブで開く設定になっている', () => {
    renderWithRouter(<Footer />);
    
    const blogLink = screen.getByText('ブログ');
    expect(blogLink.closest('a')).toHaveAttribute('href', 'https://blog.at-himawari.com/cms/');
    
    const contactLink = screen.getByText('お問い合わせ');
    expect(contactLink.closest('a')).toHaveAttribute('href', 'https://forms.gle/D8WSByjAnYGGtoGw9');
  });

  test('コピーライト表示が正しい', () => {
    renderWithRouter(<Footer />);
    
    expect(screen.getByText('© 2024-2025 Himawari Project')).toBeInTheDocument();
  });
});
