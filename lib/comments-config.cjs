'use strict';

// 独立接口域名保留边缘服务；官网页面可以不经过网页代理。
const COMMENTS_API = 'https://comments.hyphentech.top/api/comments';
const COMMENTS_ALLOWED_ORIGINS = ['https://hyphentech.top', 'https://www.hyphentech.top'];

module.exports = { COMMENTS_API, COMMENTS_ALLOWED_ORIGINS };
