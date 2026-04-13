import type { Metadata } from "next";
import Script from "next/script";
import "../styles/index.css";
import {
  description,
  favicon,
  ogImageUrl,
  postUrl,
  selector,
  title,
  twitterSite,
} from "../const/pageConstants";

export const metadata: Metadata = {
  metadataBase: new URL(postUrl),
  title,
  description,
  icons: {
    icon: favicon,
  },
  openGraph: {
    title,
    description,
    url: postUrl,
    siteName: title,
    images: [ogImageUrl],
    type: "website",
  },
  twitter: {
    card: "summary",
    title,
    description,
    images: [ogImageUrl],
    site: twitterSite,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6651283997191475"
          crossOrigin="anonymous"
        ></script>
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-KSRLPFZ9');
            `,
          }}
        />
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KSRLPFZ9"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        <Script
          id="clarity"
          strategy="afterInteractive"
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
        <Script
          src="https://rubyful-v2.s3.ap-northeast-1.amazonaws.com/v2/rubyful.js?t=20250507022654"
          strategy="afterInteractive"
        />
        <Script
          id="rubyful"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('load', () => {
                if (typeof RubyfulV2 !== 'undefined') {
                  RubyfulV2.init({
                    selector: '${selector}',
                    defaultDisplay: true
                  });
                }
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
