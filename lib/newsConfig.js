// lib/newsConfig.js

/**
 * Notion 中 child_database 块的「数据库名称」
 * => 映射到真实数据库 + 分类字段。
 *
 * key 必须与 Notion 里这个 linked database / 视图的名称完全一致。
 */

export const DB_VIEW_TO_SOURCE = {
    // —— 新闻聚合数据库里的几类新闻 ——
    社会热点: {
      databaseEnv: 'NOTION_DB_NEWS', // env 里配置的 新闻聚合 数据库 ID
      categoryProperty: '分类',       // 新闻聚合数据库里的 分类 字段名（select）
      categoryValue: '社会热点',
    },
    国际新闻: {
      databaseEnv: 'NOTION_DB_NEWS',
      categoryProperty: '分类',
      categoryValue: '国际新闻',
    },
    科技新闻: {
      databaseEnv: 'NOTION_DB_NEWS',
      categoryProperty: '分类',
      categoryValue: '科技新闻',
    },
    财经新闻: {
      databaseEnv: 'NOTION_DB_NEWS',
      categoryProperty: '分类',
      categoryValue: '财经新闻',
    },
    游戏新闻: {
      databaseEnv: 'NOTION_DB_NEWS',
      categoryProperty: '分类',
      categoryValue: '游戏新闻',
    },
  
    // —— 网安专项数据库里的几类内容 ——
    网安新闻: {
      databaseEnv: 'NOTION_DB_NETSEC', // env 里配置的 网安专项 数据库 ID
      categoryProperty: '分类',
      categoryValue: '网安新闻',
    },
    威胁情报: {
      databaseEnv: 'NOTION_DB_NETSEC',
      categoryProperty: '分类',
      categoryValue: '威胁情报',
    },
    漏洞分析: {
      databaseEnv: 'NOTION_DB_NETSEC',
      categoryProperty: '分类',
      categoryValue: '漏洞分析',
    },
    网安博客: {
      databaseEnv: 'NOTION_DB_NETSEC',
      categoryProperty: '分类',
      categoryValue: '网安博客',
    },
    企业安全: {
      databaseEnv: 'NOTION_DB_NETSEC',
      categoryProperty: '分类',
      categoryValue: '企业安全',
    },
  };
