// pages/[slug].js
import { getAllPosts, getPostBySlug, getMenus } from '../lib/notion';
import { NOTION_PROPERTY_NAME as N } from '../lib/config';
import NotionRenderer from '../components/NotionRenderer';

export async function getStaticPaths() {
  // 读取所有 Published 内容
  const posts = await getAllPosts(200);

  // 所有有 slug 的条目都生成路径：
  // 包括 type = Post / Notice / SubMenu（osint-tools / HackerNews / News）
  const validPosts = posts.filter((post) => post.slug && post.slug !== '');

  const paths = validPosts.map((post) => ({
    params: { slug: post.slug },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;

  const post = await getPostBySlug(slug);
  const menus = await getMenus();

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
      menus,
    },
    revalidate: 60,
  };
}

export default function PostPage({ post, menus }) {
  return (
    <div className="container">
      {/* 顶部菜单，与首页保持一致 */}
      <nav className="topnav">
        <a href="/">
          <b>首页</b>
        </a>
        {menus.map((menu) => (
          <a
            key={menu.id}
            href={menu.href}
            target={menu.isExternal ? '_blank' : '_self'}
            rel={menu.isExternal ? 'noopener noreferrer' : undefined}
          >
            {menu.title}
          </a>
        ))}
      </nav>

      <main>
        <header>
          <h1>{post.title}</h1>
          {post.date && <p>{post.date}</p>}
        </header>

        {/* 使用你已有的 NotionRenderer 渲染所有 blocks
           —— 包括数据库表格、图片、列表等 */}
        <article>
          <NotionRenderer blocks={post.blocks} />
        </article>
      </main>
    </div>
  );
}
