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
import GoogleAnalytics from "../components/GoogleAnalytics";
import { absoluteUrl } from "../utils/seo";

const siteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: title,
  url: absoluteUrl("/"),
  description,
  inLanguage: "ja",
  publisher: {
    "@type": "Organization",
    name: title,
    url: absoluteUrl("/"),
    logo: favicon,
    sameAs: [`https://x.com/${twitterSite.replace("@", "")}`],
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(postUrl),
  title: {
    default: title,
    template: `%s | ${title}`,
  },
  description,
  applicationName: title,
  authors: [{ name: title, url: postUrl }],
  creator: title,
  publisher: title,
  keywords: [
    "Himawari Project",
    "技術ブログ",
    "AI",
    "ソフトウェア開発",
    "Web制作",
  ],
  alternates: {
    canonical: absoluteUrl("/"),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
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
    locale: "ja_JP",
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
          id="site-json-ld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteJsonLd),
          }}
        />
      </head>
      <body>
        <GoogleAnalytics />
        {children}
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
