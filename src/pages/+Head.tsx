import HimawariIcon from "../../public/himawari.png";
export function Head() {
  return (
    <>
      <meta property="og:type" content="article" />
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Himawari Project" />
      <meta name="twitter:description" content="ときどき仕事して、休んで" />
      <meta name="twitter:image" content={HimawariIcon} />
      <meta name="twitter:site" content="@at_himawari" />
    </>
  );
}
