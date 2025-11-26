import Link from 'next/link';
import { getAllPosts, getPostBySlug, getMenus } from '../lib/notion';
import NotionRenderer from '../components/NotionRenderer';

////////// 静态路径 //////////
export async function getStaticPaths() {
  try {
    const posts = await getAllPosts(200);

    // 所有有 slug 的条目（Post / Notice / SubMenu）都生成路径
    const validPosts = posts.filter((post) => post.slug && post.slug !== '');

    const paths = validPosts.map((post) => ({
      params: { slug: post.slug },
    }));

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (e) {
    console.error('getStaticPaths 失败：', e);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}

////////// 静态数据 //////////
export async function getStaticProps({ params }) {
  const { slug } = params || {};

  if (!slug) {
    return { notFound: true };
  }

  try {
    const post = await getPostBySlug(slug);
    const menus = await getMenus();

    if (!post) {
      // getPostBySlug 查不到（未发布或 slug 不存在）
      return { notFound: true };
    }

    return {
      props: { post, menus },
      revalidate: 60,
    };
  } catch (e) {
    console.error('getStaticProps 失败：', e);
    // 这里返回 404，Next 会渲染 404 页面
    return { notFound: true };
  }
}

////////// 页面组件：现代排版 //////////
export default function PostPage({ post /* , menus */ }) {
  // 你如果要在顶部导航用到 menus，可以在组件里使用

  if (!post) {
    // 理论上不会执行（因为 getStaticProps 已经 notFound:true 了）
    return (
      <div className="container">
        <p>未找到文章。</p>
      </div>
    );
  }

  const title =
    post.title || post.properties?.Name?.title?.[0]?.plain_text || '';
  const date = post.date || post.properties?.Date?.date?.start || '';
  const tags =
    post.tags ||
    post.properties?.Tags?.multi_select?.map((t) => t.name) ||
    [];

  return (
    <div className="container">
      <header className="topnav">
        <div className="topnav-left">
          <div className="topnav-logo" />
          <div>
            <div className="topnav-title">我的笔记</div>
            <div className="topnav-subtitle">记录技术 · 思考 · 实验</div>
          </div>
        </div>
        <nav className="topnav-right">
          <Link href="/">首页</Link>
        </nav>
      </header>

      <main>
        <article>
          <header className="article-header">
            <h1 className="article-title">{title}</h1>
            <div className="article-meta">
              {date && (
                <span>
                  发布于 {new Date(date).toLocaleDateString('zh-CN')}
                </span>
              )}
              {tags && tags.length > 0 && (
                <span>标签：{tags.join(' / ')}</span>
              )}
            </div>
          </header>

          <NotionRenderer
            blocks={post.blocks || post.contentBlocks || []}
            databasesData={post.databasesData || {}}
          />
        </article>
      </main>

      <style jsx>{`
        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 32px 16px 80px;
        }

        .topnav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
        }

        .topnav-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .topnav-logo {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
        }

        .topnav-title {
          font-size: 18px;
          font-weight: 600;
        }

        .topnav-subtitle {
          font-size: 12px;
          color: #6b7280;
        }

        .topnav-right a {
          font-size: 14px;
          color: #111827;
          text-decoration: none;
        }

        .topnav-right a:hover {
          text-decoration: underline;
        }

        .article-header {
          margin-bottom: 22px;
        }

        .article-title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .article-meta {
          font-size: 13px;
          color: #6b7280;
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .container {
            padding: 20px 14px 72px;
          }

          .topnav {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .article-title {
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  );
}
