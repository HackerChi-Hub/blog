// pages/index.js
import Link from 'next/link';
import { getAllPosts, getMenus } from '../lib/notion';
import { NOTION_PROPERTY_NAME as N } from '../lib/config';

export async function getStaticProps() {
  const posts = await getAllPosts(200);
  const menus = await getMenus();

  // 调试：看一下拿到的 slug / type
  console.log(
    'DEBUG posts:',
    posts.map((p) => ({ title: p.title, slug: p.slug, type: p.type }))
  );

  return {
    props: {
      posts,
      menus,
    },
    revalidate: 60,
  };
}

export default function Home({ posts, menus }) {
  // 只把 type = Post 的条目当作普通文章
  const articlePosts = posts.filter((post) => post.type === N.type_post);

  // 如果用 Notice 做置顶，可以这样筛
  const pinnedPosts = posts.filter((post) => post.type === N.type_notice);
  const pinnedIds = new Set(pinnedPosts.map((p) => p.id));

  const normalPosts = articlePosts.filter((p) => !pinnedIds.has(p.id));

  return (
    <div className="container">
      {/* 顶部菜单：包含 osint-tools / HackerNews / News */}
      <nav className="topnav">
        <Link href="/">
          <b>首页</b>
        </Link>
        {menus.map((menu) => (
          <Link
            key={menu.id}
            href={menu.href}
            target={menu.isExternal ? '_blank' : '_self'}
            rel={menu.isExternal ? 'noopener noreferrer' : undefined}
          >
            {menu.title}
          </Link>
        ))}
      </nav>

      <main>
        {/* 置顶区（可选） */}
        {pinnedPosts.length > 0 && (
          <section>
            <h2>置顶文章</h2>
            <ul>
              {pinnedPosts.map((post) => (
                <li key={post.id}>
                  {/* 这里一定要用 slug */}
                  <Link href={`/${post.slug}`}>{post.title}</Link>
                  {post.date && <span>　{post.date}</span>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 普通文章列表：只显示 type=Post，且链接用 slug */}
        <section>
          <h2>全部文章</h2>
          <ul>
            {normalPosts.map((post) => (
              <li key={post.id}>
                {/* 关键：用 slug，而不是 id */}
                <Link href={`/${post.slug}`}>{post.title}</Link>
                {post.date && <span>　{post.date}</span>}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
