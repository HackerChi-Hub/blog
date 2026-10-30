import { getPosts } from './content';
import { getEnglishMap } from './home-data';

// 仅取已发布文章的标题和地址，不携带正文或私人留言进入页面数据。
export async function buildCommunityProps(lang = 'zh-CN') {
  const posts = await getPosts();
  const translations = lang === 'en' ? await getEnglishMap() : null;
  const articles = posts.flatMap(post => {
    const shown = translations ? translations[post.slug] : post;
    return shown ? [{ slug: shown.slug || post.slug, title: shown.title || post.title, originalSlug: post.slug }] : [];
  });
  return { props: { articles, lang } };
}
