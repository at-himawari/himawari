export function Head() {
  const siteUrl = "https://at-himawari.com";
  const imageUrl = `${siteUrl}/avatar.jpg`;

  return (
    <>
      <meta property="og:image" content={imageUrl} />
      <meta property="og:type" content="article" />
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Himawari Project" />
      <meta name="twitter:description" content="のんびり仕事する" />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:site" content="@at_himawari" />
    </>
  );
}
