// pages/[slug].js
import Link from 'next/link';
import { getAllPosts, getMenus, getPostBySlug } from '../lib/notion';
import NotionRenderer from '../components/NotionRenderer';

export async function getStaticPaths() {
  const { pinPosts = [], normalPosts = [] } = await getAllPosts() || {};
  const all = [...pinPosts, ...normalPosts];
  return {
    paths: all.filter(post => post && post.slug).map(post => ({ params: { slug: post.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const menus = await getMenus();
  const post = await getPostBySlug(params.slug);
  return { props: { menus, post } };
}

export default function Article({ menus, post }) {
  if (!post) return <div>文章不存在</div>;
  return (
    <div className="container">
      <nav className="topnav">
        <Link href="/"><b>首页</b></Link>
        {menus.map(menu => (
          <Link key={menu.slug} href={`/page/${menu.slug}`}>{menu.title}</Link>
        ))}
      </nav>
      <h1>{post.title}</h1>
      <div className="meta">
        {post.category.map(c => <span key={c} className="cat">{c}</span>)}
        <span className="date">{post.date}</span>
      </div>
      <NotionRenderer blocks={post.blocks} />
      <style jsx>{`
        .container { max-width: 880px; margin: 0 auto; }
        .topnav { display: flex; gap: 18px; padding: 18px 0; border-bottom: 1px solid #eee;}
        .meta { margin-bottom: 16px;}
        .cat { margin-right: 8px; color: #b27aff;}
        .date { color: #aaa;}
      `}</style>
    </div>
  );
}
