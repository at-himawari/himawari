import { render, screen, fireEvent } from '@testing-library/react';
import NewsSection from '../NewsSection';

describe('NewsSection', () => {
  test('ニュースセクションのタイトルが表示される', () => {
    render(<NewsSection />);
    
    expect(screen.getByText('ニュース')).toBeInTheDocument();
  });

  test('最初のページでニュースアイテムが表示される', () => {
    render(<NewsSection />);
    
    expect(screen.getByText('Webページリリース')).toBeInTheDocument();
    expect(screen.getByText('2025.1.26')).toBeInTheDocument();
  });

  test('ページネーションボタンが表示される', () => {
    render(<NewsSection />);
    
    const pageButtons = screen.getAllByRole('button');
    expect(pageButtons.length).toBeGreaterThan(0);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  test('ページネーションが正しく動作する', () => {
    render(<NewsSection />);
    
    const page2Button = screen.getByText('2');
    fireEvent.click(page2Button);
    
    expect(page2Button).toHaveClass('bg-orange-500', 'text-white');
  });

  test('アクティブなページボタンが正しいスタイルを持つ', () => {
    render(<NewsSection />);
    
    const page1Button = screen.getByText('1');
    expect(page1Button).toHaveClass('bg-orange-500', 'text-white');
  });

  test('非アクティブなページボタンが正しいスタイルを持つ', () => {
    render(<NewsSection />);
    
    const page2Button = screen.getByText('2');
    expect(page2Button).toHaveClass('bg-gray-200', 'text-gray-700');
  });
});
