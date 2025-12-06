// pages/index.js
import Link from 'next/link';
import { getAllPosts, getMenus } from '../lib/notion';

export async function getStaticProps() {
  const { pinPosts, normalPosts } = await getAllPosts();
  const menus = await getMenus();
  return { props: { pinPosts, normalPosts, menus } };
}

export default function Home({ pinPosts, normalPosts, menus }) {
  return (
    <div className="container">
      {/* 顶部菜单 */}
      <nav className="topnav">
        <Link href="/"><b>首页</b></Link>
        {menus.map(menu => (
          <Link key={menu.slug} href={`/page/${menu.slug}`}>{menu.title}</Link>
        ))}
      </nav>

      <h2>置顶文章</h2>
      <ul>
        {pinPosts.map(post => (
          <li key={post.slug}>
            <Link href={`/page/${post.slug}`}>{post.title}</Link>
            <span className="cat">{post.category.join(', ')}</span>
            <span className="date">{post.date}</span>
          </li>
        ))}
      </ul>
      <h2>全部文章</h2>
      <ul>
        {normalPosts.map(post => (
          <li key={post.slug}>
            <Link href={`/page/${post.slug}`}>{post.title}</Link>
            <span className="cat">{post.category.join(', ')}</span>
            <span className="date">{post.date}</span>
          </li>
        ))}
      </ul>
      <style jsx>{`
        .container { max-width: 880px; margin: 0 auto; }
        .topnav { display: flex; gap: 18px; padding: 18px 0; border-bottom: 1px solid #eee;}
        ul { padding-left: 0; }
        li { list-style: none; margin-bottom: 6px;}
        .cat { margin-left: 10px; color: #b27aff;}
        .date { margin-left: 10px; color: #aaa;}
      `}</style>
    </div>
  );
}
