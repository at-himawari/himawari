import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import ScrollToTop from '../ScrollToTop';

const mockScrollTo = vi.fn();
Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true,
});

describe('ScrollToTop', () => {
  beforeEach(() => {
    mockScrollTo.mockClear();
  });

  test('コンポーネントがレンダリングされる（何も表示しない）', () => {
    const { container } = render(
      <BrowserRouter>
        <ScrollToTop />
      </BrowserRouter>
    );
    
    expect(container.firstChild).toBeNull();
  });

  test('初期レンダリング時にscrollToが呼ばれる', () => {
    render(
      <BrowserRouter>
        <ScrollToTop />
      </BrowserRouter>
    );
    
    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });
});
