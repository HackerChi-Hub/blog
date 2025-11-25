// pages/page/[page].js
import Link from 'next/link';
import { getMenus, getPostBySlug } from '../../lib/notion';
import NotionRenderer from '../../components/NotionRenderer';

export async function getStaticPaths() {
  const menus = await getMenus();
  return {
    paths: menus.map(menu => ({ params: { page: menu.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const menus = await getMenus();
  const post = await getPostBySlug(params.page);
  return { props: { menus, post } };
}

export default function Page({ menus, post }) {
  if (!post) return <div>页面不存在</div>;
  return (
    <div className="container">
      <nav className="topnav">
        <Link href="/"><b>首页</b></Link>
        {menus.map(menu => (
          <Link key={menu.slug} href={`/page/${menu.slug}`}>{menu.title}</Link>
        ))}
      </nav>
      <h1>{post.title}</h1>
      <NotionRenderer blocks={post.blocks} />
      <style jsx>{`
        .container { max-width: 880px; margin: 0 auto; }
        .topnav { display: flex; gap: 18px; padding: 18px 0; border-bottom: 1px solid #eee;}
      `}</style>
    </div>
  );
}
