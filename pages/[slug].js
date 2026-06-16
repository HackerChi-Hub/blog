import Head from 'next/head';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Component } from 'react';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { getAllSlugs, getPostBySlug, getPosts } from '../lib/notion';
import SEO from '../components/SEO';
import ShareButtons from '../components/ShareButtons';
import RelatedPosts from '../components/RelatedPosts';
import { getRelatedPosts } from '../lib/related-posts';
import { estimateReadingTime, formatReadingTime } from '../lib/reading-time';
import { SITE_CONFIG } from '../lib/seo';
import 'react-notion-x/src/styles.css';

// 构建时下载 Notion 文件附件到 public/downloads/
async function downloadNotionFiles(recordMap, slug) {
  if (!recordMap?.block) return recordMap;

  const downloadDir = path.join(process.cwd(), 'public', 'downloads');
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }

  const getPlainProperty = (property) => {
    if (!Array.isArray(property)) return '';
    return property
      .map((part) => part?.[0] || '')
      .join('')
      .trim();
  };

  const decodeFileName = (name) => {
    try {
      return decodeURIComponent(name);
    } catch {
      return name;
    }
  };

  const fileNameFromAttachment = (source) => {
    if (!source || typeof source !== 'string') return '';
    const match = source.match(/^attachment:[^:]+:(.+)$/);
    return match ? decodeFileName(match[1]) : '';
  };

  const fileNameFromUrl = (url) => {
    try {
      const urlPath = new URL(url).pathname;
      const parts = urlPath.split('/').filter(Boolean);
      return decodeFileName(parts[parts.length - 1] || '');
    } catch {
      return '';
    }
  };

  const makeSafeDownloadName = (fileName, blockId) => {
    const fallback = `notion-file-${blockId}`;
    const rawName = decodeFileName(fileName || fallback);
    return `${slug}-${rawName}`
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9._\-\u4e00-\u9fa5]/g, '_');
  };

  const getSignedUrl = (blockId, source) => {
    const signed = recordMap.signed_urls || {};
    const direct = signed[blockId] || signed[source];
    if (direct && /^https?:\/\//i.test(direct)) return direct;

    // notion-client sometimes stores the signed URL under a derived key.
    // Match by decoded attachment filename as a last resort.
    const fileName = fileNameFromAttachment(source);
    if (fileName) {
      const encoded = encodeURIComponent(fileName);
      for (const value of Object.values(signed)) {
        if (
          typeof value === 'string' &&
          /^https?:\/\//i.test(value) &&
          (value.includes(fileName) || value.includes(encoded))
        ) {
          return value;
        }
      }
    }
    return '';
  };

  const downloadFile = async (url, localPath, redirects = 0) => {
    const client = url.startsWith('http://') ? http : https;
    await new Promise((resolve, reject) => {
      const file = fs.createWriteStream(localPath);
      const req = client.get(url, (res) => {
        const location = res.headers.location;
        if (res.statusCode >= 300 && res.statusCode < 400 && location && redirects < 5) {
          file.close(() => fs.rmSync(localPath, { force: true }));
          const nextUrl = new URL(location, url).toString();
          downloadFile(nextUrl, localPath, redirects + 1).then(resolve).catch(reject);
          return;
        }

        if (res.statusCode !== 200) {
          file.close(() => fs.rmSync(localPath, { force: true }));
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }

        res.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      });
      req.on('error', (err) => {
        file.close(() => fs.rmSync(localPath, { force: true }));
        reject(err);
      });
    });
  };

  const replaceDeep = (value, replacements) => {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i += 1) {
        if (typeof value[i] === 'string' && replacements.has(value[i])) {
          value[i] = replacements.get(value[i]);
        } else {
          replaceDeep(value[i], replacements);
        }
      }
      return;
    }
    for (const key of Object.keys(value)) {
      if (typeof value[key] === 'string' && replacements.has(value[key])) {
        value[key] = replacements.get(value[key]);
      } else {
        replaceDeep(value[key], replacements);
      }
    }
  };

  for (const [blockId, blockData] of Object.entries(recordMap.block)) {
    const block = blockData?.value?.value || blockData?.value;
    // 正文里的图片块（image）和文件块（file/pdf/video）都可能携带会过期的签名 URL，统一本地化
    if (!block || !['file', 'image', 'pdf', 'video'].includes(block.type)) continue;

    const source = getPlainProperty(block.properties?.source) || block.format?.display_source || '';
    const displaySource = block.format?.display_source || '';
    const signedUrl = getSignedUrl(blockId, source);
    const fileUrl =
      signedUrl ||
      (/^https?:\/\//i.test(source) ? source : '') ||
      (/^https?:\/\//i.test(displaySource) ? displaySource : '');

    if (!fileUrl) {
      console.warn(
        `[downloadNotionFiles] No signed URL for Notion attachment block ${blockId}: ${source || '(empty source)'}`
      );
      continue;
    }

    const fileName =
      fileNameFromAttachment(source) ||
      fileNameFromUrl(displaySource) ||
      fileNameFromUrl(fileUrl) ||
      `notion-file-${blockId}`;
    const safeName = makeSafeDownloadName(fileName, blockId);
    const localPath = path.join(downloadDir, safeName);
    const publicUrl = `/downloads/${safeName}`;

    // 下载文件（如果尚未存在）
    if (!fs.existsSync(localPath)) {
      try {
        await downloadFile(fileUrl, localPath);
        console.log(`[downloadNotionFiles] Downloaded: ${fileName} -> ${publicUrl}`);
      } catch (err) {
        console.warn(`[downloadNotionFiles] Failed to download ${fileName}:`, err.message);
        continue;
      }
    }

    // 替换 recordMap 中的 URL / attachment 引用为本地稳定路径
    const replacements = new Map(
      [source, displaySource, signedUrl, fileUrl].filter(Boolean).map((oldUrl) => [oldUrl, publicUrl])
    );
    replaceDeep(block, replacements);
    if (recordMap.signed_urls) {
      recordMap.signed_urls[blockId] = publicUrl;
      if (source) recordMap.signed_urls[source] = publicUrl;
    }
  }

  return recordMap;
}

const loadPrismLanguages = async () => {
  if (typeof window === 'undefined') return;
  await Promise.all([
    import('prismjs/components/prism-javascript'),
    import('prismjs/components/prism-typescript'),
    import('prismjs/components/prism-jsx'),
    import('prismjs/components/prism-tsx'),
    import('prismjs/components/prism-bash'),
    import('prismjs/components/prism-json'),
    import('prismjs/components/prism-markdown'),
    import('prismjs/components/prism-css'),
    import('prismjs/components/prism-scss'),
    import('prismjs/components/prism-python'),
    import('prismjs/components/prism-diff'),
    import('prismjs/components/prism-yaml'),
  ]);
};

const Code = dynamic(
  async () => {
    const m = await import('react-notion-x/build/third-party/code');
    // Load Prism languages only in browser (SSR renders without syntax highlighting)
    await loadPrismLanguages();
    return m.Code;
  },
  { ssr: true }
);

const Collection = dynamic(
  () =>
    import('react-notion-x/build/third-party/collection.js').then(
      (m) => m.Collection
    ),
  { ssr: true }
);

const NotionRenderer = dynamic(
  () =>
    import('react-notion-x').then(
      (m) => m.NotionRenderer
    ),
  { ssr: true }
);

class NotionErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error('[NotionRenderer] Render error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: '#888' }}>
          <p>Content rendering failed. Please try refreshing the page.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export async function getStaticPaths() {
  try {
    const slugs = await getAllSlugs();

    console.log('[getStaticPaths] slugs:', slugs);

    return {
      paths: slugs.map((slug) => ({
        params: { slug },
      })),
      fallback: false,
    };
  } catch (error) {
    console.error('[getStaticPaths] failed:', error?.message || error);
    return {
      paths: [],
      fallback: false,
    };
  }
}

export async function getStaticProps({ params }) {
  const { slug } = params;

  console.log('[getStaticProps] slug:', slug);

  try {
    const [post, allPosts] = await Promise.all([
      getPostBySlug(slug),
      getPosts(),
    ]);

    if (!post) {
      console.warn('[getStaticProps] NOT FOUND slug:', slug);
      return { notFound: true };
    }

    // 构建时下载文件附件到本地（recordMap 已在 getPostBySlug 中修复了嵌套问题）
    const recordMap = await downloadNotionFiles(post.recordMap, slug);

    // 获取相关文章
    const relatedPosts = getRelatedPosts(post.meta, allPosts, 3);

    return {
      props: {
        meta: post.meta,
        recordMap,
        relatedPosts,
      },
    };
  } catch (error) {
    console.error(`[getStaticProps] FAILED for slug: ${slug}`, error?.message || error);
    return { notFound: true };
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
};

export default function PostPage({ meta, recordMap, relatedPosts = [] }) {
  const router = useRouter();
  const slug = router.query.slug;
  
  if (!recordMap) {
    return (
      <>
        <SEO
          title={meta?.title || '文章加载失败'}
          description="无法加载 Notion 内容，请检查服务器日志。"
          url={`/${slug}/`}
          type="article"
        />
        <main
          style={{
            maxWidth: '720px',
            margin: '40px auto',
            padding: '0 16px',
            fontFamily:
              'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          <h1>{meta?.title || '文章加载失败'}</h1>
          <p>无法加载 Notion 内容，请检查服务器日志。</p>
        </main>
      </>
    );
  }

  const categories = Array.isArray(meta.categories) ? meta.categories : [];
  const tags = Array.isArray(meta.tags) ? meta.tags : [];
  
  // 提取摘要文本
  const normalizeSummary = (summary) => {
    if (!summary) return '';
    if (typeof summary === 'string') return summary;
    if (Array.isArray(summary)) {
      return summary
        .map((item) => {
          if (typeof item === 'string') return item;
          if (typeof item === 'object' && item?.plain_text) return item.plain_text;
          if (item?.text?.content) return item.text.content;
          return '';
        })
        .filter(Boolean)
        .join('');
    }
    if (typeof summary === 'object') {
      if (summary.plain_text) return summary.plain_text;
      if (summary.text?.content) return summary.text.content;
      return JSON.stringify(summary);
    }
    return String(summary);
  };
  
  const description = normalizeSummary(meta.summary) || `${meta.title} - ${SITE_CONFIG.name}`;
  const tagNames = tags.map(tag => typeof tag === 'string' ? tag : tag.name || tag).filter(Boolean);
  const articleUrl = `/${meta.slug || slug}/`;
  const publishedTime = meta.date ? new Date(meta.date).toISOString() : null;
  
  // 计算阅读时间
  const readingTime = estimateReadingTime({ meta, recordMap });
  const readingTimeText = formatReadingTime(readingTime);

  return (
    <>
      <SEO
        title={meta.title}
        description={description}
        image={meta.image || '/favicon-512x512.png'}
        url={articleUrl}
        type="article"
        publishedTime={publishedTime}
        modifiedTime={publishedTime}
        tags={tagNames}
        author={SITE_CONFIG.author}
      />

      <main className="page">
        {/* 封面图（使用文章中的第一张图片） */}
        {meta.image && (
          <div
            style={{
              width: '100%',
              borderRadius: '40px 40px 0 0',
              overflow: 'hidden',
              lineHeight: 0,
              border: '1px solid var(--border-color)',
              borderBottom: 'none',
            }}
          >
            <Image
              src={meta.image}
              alt={meta.title}
              width={1600}
              height={900}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
                aspectRatio: '16 / 9',
              }}
              priority
              unoptimized
            />
          </div>
        )}

        <section
          style={{
            width: '100%',
            padding: '2.4rem 2rem 1.6rem',
            borderRadius: meta.image ? '0 0 40px 40px' : '40px',
            border: '1px solid var(--border-color)',
            borderTop: meta.image ? 'none' : undefined,
            background:
              'linear-gradient(135deg, rgba(3, 48, 54, 0.98), rgba(3, 70, 76, 0.95))',
            boxShadow: 'var(--shadow-soft)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
              opacity: 0.4,
              pointerEvents: 'none',
            }}
          />
          <div style={{ position: 'relative' }}>
            <h1
              style={{
                fontSize: 'clamp(2.0rem, 3.6vw, 2.6rem)',
                margin: 0,
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: '#ffffff',
              }}
            >
              {meta.title}
            </h1>

            <div
              style={{
                marginTop: '1.1rem',
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                flexWrap: 'wrap',
                fontSize: '0.95rem',
                color: 'var(--text-secondary)',
              }}
            >
              {meta.date && (
                <span style={{ letterSpacing: '0.18em' }}>
                  {formatDate(meta.date)}
                </span>
              )}
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: 'rgba(105, 240, 174, 0.1)',
                  border: '1px solid rgba(105, 240, 174, 0.2)',
                  color: 'var(--accent-green)',
                  fontSize: '0.9rem',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {readingTimeText}
              </span>
            </div>

            {(categories.length || tags.length) > 0 && (
              <section
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  marginTop: '1.6rem',
                  fontSize: '0.95rem',
                  color: 'var(--text-secondary)',
                }}
              >
                {categories.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      分类：
                    </span>
                    {categories.map((cat) => (
                      <span
                        key={cat.id || cat.name}
                        style={{
                          padding: '4px 14px',
                          borderRadius: '999px',
                          border: '1px solid rgba(255,255,255,0.35)',
                          background: 'rgba(255,255,255,0.09)',
                          color: 'var(--text-secondary)',
                          fontWeight: 500,
                        }}
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                )}

                {tags.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      标签：
                    </span>
                    {tags.map((tag) => (
                      <span
                        key={tag.id || tag.name}
                        style={{
                          padding: '3px 12px',
                          borderRadius: '999px',
                          border: '1px solid rgba(255,255,255,0.28)',
                          background: 'rgba(255,255,255,0.06)',
                          color: 'var(--text-secondary)',
                          fontSize: '0.9rem',
                        }}
                      >
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        </section>

        {/* 如果有封面图，隐藏 Notion 内容中的第一张图片避免重复 */}
        {meta.coverBlockId && (
          <style>{`
            .notion-block-${meta.coverBlockId} { display: none !important; }
          `}</style>
        )}

        <section className="notion">
          <NotionErrorBoundary>
            <NotionRenderer
              className="notion-only-body"
              recordMap={recordMap}
              fullPage={false}
              disableHeader
              darkMode
              mapImageUrl={(url) => {
                // 已本地化(/downloads/)、data URL、绝对外链都原样使用；
                // 仅 Notion 内置相对路径(/images、/icons)补全域名。默认 mapImageUrl 会把 /downloads/ 误转成代理 URL，故覆盖。
                if (!url) return url;
                if (url.startsWith('/downloads/') || url.startsWith('data:') || /^https?:\/\//.test(url)) return url;
                if (url.startsWith('/')) return `https://www.notion.so${url}`;
                return url;
              }}
              components={{
                Code,
                Collection,
              }}
            />
          </NotionErrorBoundary>

          {/* 分享按钮 - 融入文章区域末尾 */}
          <div
            style={{
              marginTop: '48px',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(255, 255, 255, 0.02)',
            }}
          >
            <ShareButtons
              title={meta.title}
              url={articleUrl}
              description={description}
            />
          </div>

          {/* 相关文章 - 融入文章区域末尾 */}
          <div style={{ marginTop: '32px' }}>
            <RelatedPosts posts={relatedPosts} />
          </div>
        </section>

        {/* 返回首页按钮 */}
        <div
          style={{
            marginTop: '40px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '12px',
              border: '1px solid rgba(105, 240, 174, 0.3)',
              background: 'rgba(105, 240, 174, 0.1)',
              color: 'var(--accent-green)',
              fontSize: '0.95rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(105, 240, 174, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(105, 240, 174, 0.5)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(105, 240, 174, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(105, 240, 174, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(105, 240, 174, 0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            返回首页
          </Link>
        </div>
      </main>
    </>
  );
}
