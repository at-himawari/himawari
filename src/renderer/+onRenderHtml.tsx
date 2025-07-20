import { renderToString } from 'react-dom/server';
import { escapeInject, dangerouslySkipEscape } from 'vike/server';
import type { OnRenderHtmlAsync } from 'vike/types';
import { PageShell } from './PageShell';

const onRenderHtml: OnRenderHtmlAsync = async (pageContext): ReturnType<OnRenderHtmlAsync> => {
  const { Page, pageProps } = pageContext.exports;
  // 型アサーションでPageをReactコンポーネントとして扱う
  const PageComponent = Page as React.ComponentType<Record<string, unknown>>;
  const pageHtml = renderToString(
    <PageShell pageContext={pageContext}>
      <PageComponent {...(pageProps as Record<string, unknown>)} />
    </PageShell>
  );

  // metaの型を明示的にanyでなくRecord<string, string>にする
  const meta = (pageContext.exports.meta ?? {}) as Record<string, { value: string }>;
  const { title, description, coverImage } = meta;

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/himawari.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV" crossorigin="anonymous">
        
        <title>${title?.value || 'Himawari Project'}</title>
        <meta name="description" content="${description?.value || '映像とITの融合領域にチャレンジするプロジェクト'}" />
        
        {/* OGP & Twitter Card */}
        <meta property="og:title" content="${title?.value || 'Himawari Project'}" />
        <meta property="og:description" content="${description?.value || '映像とITの融合領域にチャレンジするプロジェクト'}" />
        <meta property="og:image" content="${coverImage?.value || 'https://at-himawari.com/avatar.png'}" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@at_himawari" />
        <meta name="twitter:image" content="${coverImage?.value || 'https://at-himawari.com/avatar.png'}" />
      </head>
      <body>
        <div id="root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;


  return { documentHtml };
}

export { onRenderHtml };
