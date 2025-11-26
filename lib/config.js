// lib/config.js

// 如果你有多数据库索引需求可以用这个；暂时保留，不影响功能
export const NOTION_INDEX = 0;

/**
 * 这里统一定义 Notion 数据库里的字段名和一些枚举取值。
 * 不再从 .env 读取，而是完全写死在这里。
 *
 * 如果你在 Notion 里用的是中文列名，例如：
 *  - 状态列叫「状态」
 *  - 发布时间列叫「日期」
 *  - slug 列叫「别名」
 * 只需要把下面对应的字符串改成你的实际列名即可。
 */
export const NOTION_PROPERTY_NAME = {
  // 密码列（如果你有加密文章的话，没有可以忽略）
  password: 'password',

  // 类型列：一个 Select 类型，用来区分 Post / Page / Notice / Menu / SubMenu
  type: 'type',
  type_post: 'Post',
  type_page: 'Page',
  type_notice: 'Notice',
  type_menu: 'Menu',
  type_sub_menu: 'SubMenu',

  // 标题（Notion 的 Title 属性列名）
  title: 'title',

  // 状态列：一个 Select 类型，例如 Published / Invisible
  // 如果你在 Notion 里列名叫「状态」，且发布值叫「已发布」，可以改成：
  // status: '状态',
  // status_publish: '已发布',
  // status_invisible: '隐藏',
  status: 'status',
  status_publish: 'Published',
  status_invisible: 'Invisible',

  // 摘要/简介
  summary: 'summary',

  // slug（富文本，作为 URL 路径）
  slug: 'slug',

  // 分类、标签（multi-select）
  category: 'category',
  date: 'date',
  tags: 'tags',

  // 图标、扩展字段（如果你有用到）
  icon: 'icon',
  ext: 'ext',
};
