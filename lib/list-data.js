// lib/list-data.js
// 分页列表的构建期数据（只在 getStaticPaths / getStaticProps 里用）。
// 中文与改造前逐字段相同；英文把每篇换成它的英文版——列表页没有拿关键词匹配原文的逻辑，
// 所以可以在构建时直接换，不必像首页那样附一张对照表。

import { getPosts } from './content';
import { getEnglishMap } from './home-data';

export const LIST_PAGE_SIZE = 21;

export async function getListPaths() {
  try {
    const posts = await getPosts();
    const totalPages = Math.max(1, Math.ceil(posts.length / LIST_PAGE_SIZE));
    const paths = Array.from({ length: totalPages }, (_, idx) => ({
      params: { page: String(idx + 1) },
    }));
    return { paths, fallback: false };
  } catch (error) {
    console.error('[page/[page]] getStaticPaths failed:', error);
    return { paths: [], fallback: false };
  }
}

export async function buildListProps(lang, params) {
  const result = await buildChineseListProps(params);
  if (lang !== 'en' || result.notFound) return result;
  const en = await getEnglishMap();
  return {
    props: {
      ...result.props,
      posts: result.props.posts.map((post) => (en[post.slug] ? { ...post, ...en[post.slug] } : post)),
      lang: 'en',
      meta: { lang: 'en' },   // _document 据此写 <html lang="en">
    },
  };
}

async function buildChineseListProps(params) {
  try {
    const allPosts = await getPosts();
    const safePosts = Array.isArray(allPosts) ? allPosts : [];
    const totalPosts = safePosts.length;
    const totalPages = Math.max(1, Math.ceil(totalPosts / LIST_PAGE_SIZE));
    const currentPage = Number(params?.page) || 1;

    if (currentPage < 1 || currentPage > totalPages) {
      return { notFound: true };
    }

    const start = (currentPage - 1) * LIST_PAGE_SIZE;
    const end = Math.min(start + LIST_PAGE_SIZE, totalPosts); // 确保不超过总数
    const posts = safePosts.slice(start, end);

    // 验证获取的文章数量
    if (posts.length !== Math.min(LIST_PAGE_SIZE, totalPosts - start)) {
      console.warn(`[page/[page]] 文章数量不匹配: 期望 ${Math.min(LIST_PAGE_SIZE, totalPosts - start)}, 实际 ${posts.length}`);
    }

    return {
      props: {
        posts,
        currentPage,
        totalPages,
        errorMessage:
          posts.length === 0 ? '该分页暂无内容，请检查 Obsidian 内容库。' : '',
      },
    };
  } catch (error) {
    console.error('[page/[page]] getStaticProps failed:', error);
    return {
      props: {
        posts: [],
        currentPage: 1,
        totalPages: 1,
        errorMessage:
          error?.message ||
          '获取分页文章失败，请检查 Obsidian 内容库和发布快照。',
      },
    };
  }
}
