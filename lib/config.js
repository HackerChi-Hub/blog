// lib/config.js

// 顶部菜单的静态配置（如果没有单独菜单数据库，就用这个）
export const TOP_MENUS = [
  {
    id: 'home',
    title: '首页',
    href: '/',
    isExternal: false,
  },
  {
    id: 'news',
    title: '新闻聚合',
    href: '/News',
    isExternal: false,
  },
  // 可以按需加更多
];

// 示例：其它全局配置
export const SOME_CONFIG = {
  siteName: '我的 Notion 博客',
};
