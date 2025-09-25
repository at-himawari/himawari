import { usePageContext } from "vike-react/usePageContext";

export function Head() {
  const pageContext = usePageContext();
  const imageUrl = `https://dq7c5b6uxkdk2.cloudfront.net/posts/images/avatar.jpg`;

  // ブログページの場合は、ブログ専用のHeadコンポーネントに任せる
  if (pageContext.urlOriginal?.startsWith("/blog/")) {
    return (
      <>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6651283997191475"
          crossOrigin="anonymous"
        ></script>
        {/* RubyfulV2ライブラリの読み込み */}
        <script src="https://rubyful-v2.s3.ap-northeast-1.amazonaws.com/v2/rubyful.js?t=20250507022654"></script>
        {/* RubyfulV2の初期化スクリプト */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('load', () => {
                if (typeof RubyfulV2 !== 'undefined') {
                  RubyfulV2.init({
                    selector: 'p, li',
                    defaultDisplay: true
                  });
                }
              });
            `,
          }}
        />
      </>
    );
  }

  return (
    <>
      {/** Microsoft Clarity */}
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `
          (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "tg68brif3l");
        `,
        }}
      />
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6651283997191475"
        crossOrigin="anonymous"
      ></script>
      <meta property="og:image" content={imageUrl} />
      <meta property="og:type" content="article" />
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content="Himawari Project" />
      <meta name="twitter:description" content="のんびり仕事する" />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:site" content="@at_himawari" />
      {/* RubyfulV2ライブラリの読み込み */}
      <script src="https://rubyful-v2.s3.ap-northeast-1.amazonaws.com/v2/rubyful.js?t=20250507022654"></script>
      {/* RubyfulV2の初期化スクリプト */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener('load', () => {
              if (typeof RubyfulV2 !== 'undefined') {
                RubyfulV2.init({
                  selector: 'p, li',
                  defaultDisplay: true
                });
              }
            });
          `,
        }}
      />
    </>
  );
}
