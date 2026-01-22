// components/SEO.js
import Head from 'next/head';
import { generateSEOMeta, generateStructuredData } from '../lib/seo';

/**
 * SEO 组件
 * 用于在页面中添加完整的 SEO meta 标签和结构化数据
 */
export default function SEO({
  title,
  description,
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  tags = [],
  author,
  noindex = false,
  nofollow = false,
}) {
  const meta = generateSEOMeta({
    title,
    description,
    image,
    url,
    type,
    publishedTime,
    modifiedTime,
    tags,
    author,
  });

  const structuredData = generateStructuredData({
    type: type === 'article' ? 'Article' : 'WebSite',
    title: title || meta.title,
    description: description || meta.description,
    url: url,
    image: image,
    publishedTime,
    modifiedTime,
    author,
  });

  const robotsContent = [];
  if (noindex) robotsContent.push('noindex');
  if (nofollow) robotsContent.push('nofollow');
  if (robotsContent.length === 0) robotsContent.push('index', 'follow');
  const robots = robotsContent.join(', ');

  return (
    <Head>
      {/* 基础 meta 标签 */}
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="keywords" content={meta.keywords} />
      <meta name="author" content={meta.openGraph.authors?.[0] || author} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={meta.openGraph.url} />

      {/* Open Graph 标签 */}
      <meta property="og:title" content={meta.openGraph.title} />
      <meta property="og:description" content={meta.openGraph.description} />
      <meta property="og:url" content={meta.openGraph.url} />
      <meta property="og:site_name" content={meta.openGraph.siteName} />
      <meta property="og:type" content={meta.openGraph.type} />
      <meta property="og:locale" content={meta.openGraph.locale} />
      <meta property="og:image" content={meta.openGraph.images[0].url} />
      <meta
        property="og:image:width"
        content={String(meta.openGraph.images[0].width)}
      />
      <meta
        property="og:image:height"
        content={String(meta.openGraph.images[0].height)}
      />
      <meta property="og:image:alt" content={meta.openGraph.images[0].alt} />

      {/* 文章特定标签 */}
      {meta.openGraph.type === 'article' && (
        <>
          {meta.openGraph.publishedTime && (
            <meta
              property="article:published_time"
              content={meta.openGraph.publishedTime}
            />
          )}
          {meta.openGraph.modifiedTime && (
            <meta
              property="article:modified_time"
              content={meta.openGraph.modifiedTime}
            />
          )}
          {meta.openGraph.tags &&
            meta.openGraph.tags.length > 0 &&
            meta.openGraph.tags.map((tag, index) => (
              <meta
                key={index}
                property="article:tag"
                content={typeof tag === 'string' ? tag : tag.name || tag}
              />
            ))}
          {meta.openGraph.authors &&
            meta.openGraph.authors.length > 0 &&
            meta.openGraph.authors.map((author, index) => (
              <meta
                key={index}
                property="article:author"
                content={author}
              />
            ))}
        </>
      )}

      {/* Twitter Card 标签 */}
      <meta name="twitter:card" content={meta.twitter.card} />
      <meta name="twitter:title" content={meta.twitter.title} />
      <meta name="twitter:description" content={meta.twitter.description} />
      <meta name="twitter:image" content={meta.twitter.image} />
      {meta.twitter.creator && (
        <meta name="twitter:creator" content={meta.twitter.creator} />
      )}
      {meta.twitter.site && (
        <meta name="twitter:site" content={meta.twitter.site} />
      )}

      {/* 结构化数据 (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </Head>
  );
}
