import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  author = "Goldbeam Schools",
  publishedTime,
  modifiedTime,
  tags = [],
}) => {
  const siteTitle = "Goldbeam Schools";
  const siteDescription =
    "A leading citadel of learning nurturing academic excellence, discipline, and future leaders since 2005.";
  // MUST match the live canonical domain (no www)
  const siteUrl = "https://goldbeamschools.com";
  const defaultImage = `${siteUrl}/images/og-image.jpg`;

  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const metaDescription = description || siteDescription;

  // Absolute image URL for OG/Twitter
  const metaImage = image
    ? image.startsWith("http")
      ? image
      : `${siteUrl}${image.startsWith("/") ? image : `/${image}`}`
    : defaultImage;

  // url prop should be path only, e.g. "/contact" or "/admissions"
  const path = url
    ? url.startsWith("http")
      ? url
      : `${siteUrl}${url.startsWith("/") ? url : `/${url}`}`
    : siteUrl;
  const canonicalUrl = path;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content="en_NG" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      <link rel="canonical" href={canonicalUrl} />

      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: fullTitle,
          description: metaDescription,
          url: canonicalUrl,
          inLanguage: "en-NG",
          isPartOf: {
            "@type": "WebSite",
            name: siteTitle,
            url: siteUrl,
          },
          ...(tags.length > 0 && { keywords: tags.join(", ") }),
        })}
      </script>
    </Helmet>
  );
};

export default SEO;