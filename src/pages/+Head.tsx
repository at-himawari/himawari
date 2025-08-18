export function Head() {
  const imageUrl = `https://dq7c5b6uxkdk2.cloudfront.net/posts/images/avatar.jpg`;

  return (
    <>
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
