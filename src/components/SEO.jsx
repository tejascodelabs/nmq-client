import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://nashikmisalqueue.com';
const BRAND_NAME = 'Nashik Misal Queue';
const DEFAULT_DESCRIPTION ='Book your token online and skip the waiting queue.';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`; // 1200x630px image in /public

const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords,
  canonicalUrl,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noIndex = false,
  schema, 
}) => {
  const fullTitle = title ? `${title} | ${BRAND_NAME}` : BRAND_NAME;

  // Fallback strips ?query and #hash so UTM parameters don't pollute canonical URLs
  const cleanCurrentUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}`
      : SITE_URL;

  const finalUrl = canonicalUrl || cleanCurrentUrl;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta
        name="robots"
        content={noIndex ? 'noindex, nofollow' : 'index, follow'}
      />
      <link rel="canonical" href={finalUrl} />

      {/* Open Graph (Facebook, WhatsApp, LinkedIn) */}
      <meta property="og:site_name" content={BRAND_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter / X Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Optional JSON-LD Structured Data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;