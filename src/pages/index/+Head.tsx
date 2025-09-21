import { description, ogImageUrl, postUrl, title } from "../../const/pageConstants";

export function Head() {
    return (
        <>
        {/* OGP Tags */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:url" content={postUrl} />
        {/* Twitter Card Tags */}
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImageUrl} />
        </>
    )
}