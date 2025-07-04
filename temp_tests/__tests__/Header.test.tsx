import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Header', () => {
  test('ロゴとタイトルが正しく表示される', () => {
    renderWithRouter(<Header />);
    
    expect(screen.getByAltText('Himawari Project Logo')).toBeInTheDocument();
    expect(screen.getByText('H')).toBeInTheDocument();
    expect(screen.getByText('imawari')).toBeInTheDocument();
    expect(screen.getByText('P')).toBeInTheDocument();
    expect(screen.getByText('roject')).toBeInTheDocument();
  });

  test('ヘッダー全体がホームページへのリンクになっている', () => {
    renderWithRouter(<Header />);
    
    const headerLink = screen.getByRole('link');
    expect(headerLink).toHaveAttribute('href', '/');
  });

  test('ロゴ画像が正しいsrcを持っている', () => {
    renderWithRouter(<Header />);
    
    const logo = screen.getByAltText('Himawari Project Logo');
    expect(logo).toHaveAttribute('src', '/himawari.png');
  });
});
