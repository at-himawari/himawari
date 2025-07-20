import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import type { OnRenderClientAsync } from 'vike/types';
import { PageShell } from './PageShell';

const onRenderClient: OnRenderClientAsync = async (pageContext): ReturnType<OnRenderClientAsync> => {
  const { Page, pageProps } = pageContext.exports as { Page: React.ComponentType; pageProps: Record<string, unknown> };
  const container = document.getElementById('root')!;
  const page = (
    <PageShell pageContext={pageContext}>
      <Page {...pageProps} />
    </PageShell>
  );
  if (pageContext.isHydration) {
    hydrateRoot(container, page);
  } else {
    createRoot(container).render(page);
  }
}

export { onRenderClient };
