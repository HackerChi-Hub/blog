// lib/config.js
export const NOTION_INDEX = Number(process.env.NEXT_PUBLIC_NOTION_INDEX || 0);

export const NOTION_PROPERTY_NAME = {
  password: process.env.NEXT_PUBLIC_NOTION_PROPERTY_PASSWORD || 'password',
  type: process.env.NEXT_PUBLIC_NOTION_PROPERTY_TYPE || 'type',
  type_post: process.env.NEXT_PUBLIC_NOTION_PROPERTY_TYPE_POST || 'Post',
  type_page: process.env.NEXT_PUBLIC_NOTION_PROPERTY_TYPE_PAGE || 'Page',
  type_notice:
    process.env.NEXT_PUBLIC_NOTION_PROPERTY_TYPE_NOTICE || 'Notice',
  type_menu:
    process.env.NEXT_PUBLIC_NOTION_PROPERTY_TYPE_MENU || 'Menu',
  type_sub_menu:
    process.env.NEXT_PUBLIC_NOTION_PROPERTY_TYPE_SUB_MENU || 'SubMenu',
  title: process.env.NEXT_PUBLIC_NOTION_PROPERTY_TITLE || 'title',
  status: process.env.NEXT_PUBLIC_NOTION_PROPERTY_STATUS || 'status',
  status_publish:
    process.env.NEXT_PUBLIC_NOTION_PROPERTY_STATUS_PUBLISH || 'Published',
  status_invisible:
    process.env.NEXT_PUBLIC_NOTION_PROPERTY_STATUS_INVISIBLE || 'Invisible',
  summary: process.env.NEXT_PUBLIC_NOTION_PROPERTY_SUMMARY || 'summary',
  slug: process.env.NEXT_PUBLIC_NOTION_PROPERTY_SLUG || 'slug',
  category: process.env.NEXT_PUBLIC_NOTION_PROPERTY_CATEGORY || 'category',
  date: process.env.NEXT_PUBLIC_NOTION_PROPERTY_DATE || 'date',
  tags: process.env.NEXT_PUBLIC_NOTION_PROPERTY_TAGS || 'tags',
  icon: process.env.NEXT_PUBLIC_NOTION_PROPERTY_ICON || 'icon',
  ext: process.env.NEXT_PUBLIC_NOTION_PROPERTY_EXT || 'ext'
};
