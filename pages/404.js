// pages/404.js
import Head from 'next/head';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="page-shell not-found">
      <Head>
        <title>404 · 页面未找到</title>
      </Head>
      <h1>糟糕，这个页面走丢了。</h1>
      <p>可能是链接失效，或文章尚未发布。请返回首页继续探索。</p>
      <Link href="/" className="btn btn--primary">
        返回首页
      </Link>
    </main>
  );
}
