import { usePageContext } from "vike-react/usePageContext";
import { PageContextPost } from "../../types/pageContextPost";

export function Head() {
  const pageContext = usePageContext() as {
    data: PageContextPost;
    urlOriginal: string;
  };

  const post = pageContext.data?.post;

  // URL デコード用のヘルパー関数
  const safeDecodeURI = (url: string | undefined): string | undefined => {
    if (!url) return undefined;

    try {
      // %エンコードが含まれている場合のみデコード
      return url.includes("%") ? decodeURIComponent(url) : url;
    } catch (error) {
      console.warn("Failed to decode URI:", url, error);
      return url;
    }
  };

  // ブログ一覧ページの場合（postがない場合）
  if (!post) {
    return (
      <>
        <title>Blog | Himawari Project</title>
        <meta name="description" content="のんびり仕事するブログ記事一覧" />

        {/* OGP Tags */}
        <meta property="og:title" content="Blog | Himawari Project" />
        <meta
          property="og:description"
          content="のんびり仕事するブログ記事一覧"
        />
        <meta
          property="og:image"
          content={safeDecodeURI(
            "https://dq7c5b6uxkdk2.cloudfront.net/posts/images/avatar.jpg"
          )}
        />
        <meta
          property="og:url"
          content={`https://at-himawari.com${pageContext.urlOriginal}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Himawari Project" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Blog | Himawari Project" />
        <meta
          name="twitter:description"
          content="のんびり仕事するブログ記事一覧"
        />
        <meta
          name="twitter:image"
          content={safeDecodeURI(
            "https://dq7c5b6uxkdk2.cloudfront.net/posts/images/avatar.jpg"
          )}
        />
        <meta name="twitter:site" content="@at_himawari" />

        {/* Scripts */}
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

  // 個別記事ページの場合
  const { title, date, tags, coverImage, content } = post;

  // 記事の冒頭120文字を説明文として抽出
  const description =
    content?.substring(0, 120).replace(/\n/g, " ").replace("#", "") + "...";
  const ogImageUrl =
    safeDecodeURI(coverImage) ||
    "https://dq7c5b6uxkdk2.cloudfront.net/posts/images/avatar.jpg";
  const postUrl = `https://at-himawari.com${pageContext.urlOriginal}`;

  return (
    <>
      <title>{title} | Himawari Project</title>
      <meta name="description" content={description} />

      {/* OGP Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:url" content={postUrl} />
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content="Himawari Project" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta name="twitter:site" content="@at_himawari" />

      {/* Article specific meta tags */}
      <meta
        property="article:published_time"
        content={new Date(date).toISOString()}
      />
      {tags &&
        tags.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

      {/* Scripts */}
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
