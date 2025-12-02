import { ogImageUrl, postUrl } from "../../../const/pageConstants";

export function Head() {
  return (
    <>
      {/* OGP Tags */}
      <meta property="og:title" content="あざらし君@AI LINE公式アカウント" />
      <meta property="og:description" content="あなたのとなりのAI" />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:url" content={postUrl + "/software/line_ai"} />
      {/* Twitter Card Tags */}
      <meta name="twitter:title" content="あざらし君@AI LINE公式アカウント" />
      <meta name="twitter:description" content="あなたのとなりのAI" />
      <meta name="twitter:image" content={ogImageUrl} />
    </>
  );
}
