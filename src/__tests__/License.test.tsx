import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import License from '../License';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <HelmetProvider>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </HelmetProvider>
  );
};

describe('License', () => {
  test('ページタイトルが正しく設定される', () => {
    renderWithProviders(<License />);
    
    expect(document.title).toBe('Himawari Project - License');
  });

  test('ライセンスのタイトルが表示される', () => {
    renderWithProviders(<License />);
    
    expect(screen.getByRole('heading', { name: 'ライセンス' })).toBeInTheDocument();
    expect(screen.getByText('License')).toBeInTheDocument();
  });

  test('Creative Commonsライセンスの説明が表示される', () => {
    renderWithProviders(<License />);
    
    expect(screen.getByText(/Creative Commons CC BY-SA 4.0が適用されます/)).toBeInTheDocument();
  });

  test('Creative Commonsのリンクが正しく設定される', () => {
    renderWithProviders(<License />);
    
    const ccLink = screen.getByText('https://creativecommons.org/licenses/by-sa/4.0/legalcode.ja');
    expect(ccLink.closest('a')).toHaveAttribute('href', 'https://creativecommons.org/licenses/by-sa/4.0/legalcode.ja');
    expect(ccLink.closest('a')).toHaveAttribute('target', '_blank');
  });

  test('MITライセンスの内容が表示される', () => {
    renderWithProviders(<License />);
    
    expect(screen.getByText('MIT License')).toBeInTheDocument();
    expect(screen.getByText('Copyright (c) 2024 Himawari Project')).toBeInTheDocument();
    expect(screen.getByText(/Permission is hereby granted/)).toBeInTheDocument();
  });

  test('ソースコードライセンスの説明が表示される', () => {
    renderWithProviders(<License />);
    
    expect(screen.getByText(/ソースコードのライセンス/)).toBeInTheDocument();
    expect(screen.getByText(/GitHubの各リポジトリLICENSEファイル/)).toBeInTheDocument();
  });
});
