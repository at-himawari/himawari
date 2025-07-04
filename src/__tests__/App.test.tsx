import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import App from '../App';

describe('App', () => {
  test('アプリケーションが正常にレンダリングされる', () => {
    render(
      <HelmetProvider>
        <App />
      </HelmetProvider>
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('HelmetProviderでラップされている', () => {
    const { container } = render(
      <HelmetProvider>
        <App />
      </HelmetProvider>
    );
    
    expect(container.firstChild).toBeTruthy();
  });
});
