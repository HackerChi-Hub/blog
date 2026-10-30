'use strict';

const BOARD_SLUG = 'teahouse';
const TOPICS = [
  { id: 'deploy', label: '部署求助' },
  { id: 'results', label: '实测晒单' },
  { id: 'feedback', label: '工具反馈' },
  { id: 'ideas', label: '选题许愿' },
];
const GUIDE_GROUPS = [
  { id: 'device', title: '先看设备', question: '我的电脑能跑什么？', slugs: ['localbrain-local-ai-box', 'mlx-local-ai-test-m5pro'] },
  { id: 'models', title: '再选模型', question: '本地模型怎么用、怎么测？', slugs: ['qwen38-flash-next-atomic-m64-localbrain', 'localbrain-security-howto'] },
  { id: 'free', title: '免费有数', question: '免费接口的额度和限制怎么看？', slugs: ['free-ai-api-radar-2026-09-23', 'hyphenbox-free-api-radar', 'free-api-radar'] },
  { id: 'tools', title: '工具上手', question: '软件从哪里下，遇到问题去哪问？', slugs: ['hyphenscreen-local-screen-recorder', 'deepseek-harness-mobile-remote', 'screenlex-watch-and-learn'] },
];
const communityHref = (lang) => lang === 'en' ? '/en/teahouse/' : '/teahouse/';
const guidesHref = (lang) => lang === 'en' ? '/en/guides/' : '/guides/';
const validSlug = (value) => typeof value === 'string' && /^[a-z0-9][a-z0-9-]{0,120}$/.test(value);
function discussionHref(slug, lang) {
  return communityHref(lang) + (validSlug(slug) ? `?from=${encodeURIComponent(slug)}` : '');
}
function encodeBoardMessage(content, category, contextSlug) {
  const topic = TOPICS.find(item => item.id === category) || TOPICS[0];
  const source = validSlug(contextSlug) ? `\n关联文章：/${contextSlug}/` : '';
  return `【${topic.label}】${source}\n\n${String(content).trim()}`;
}
function decodeBoardMessage(content) {
  const text = String(content || '');
  const match = text.match(/^【([^】\n]+)】(?:\n关联文章：\/([a-z0-9-]+)\/)?\n\n/);
  const topic = match && TOPICS.find(item => item.label === match[1]);
  if (!topic) return { text, category: null, sourceSlug: null };
  return { text: text.slice(match[0].length), category: topic.id, sourceSlug: validSlug(match[2]) ? match[2] : null };
}
// 所有层级回复归到可见根节点，避免原两层组件丢掉“回复的回复”；循环和孤儿也不丢。
function groupComments(list) {
  const byId = new Map(list.map(item => [item.id, item]));
  const groups = new Map();
  for (const item of list) {
    let root = item;
    const seen = new Set([item.id]);
    while (root.parent_id && byId.has(root.parent_id) && !seen.has(root.parent_id)) {
      seen.add(root.parent_id);
      root = byId.get(root.parent_id);
    }
    if (seen.has(root.parent_id)) root = item;
    if (!groups.has(root.id)) groups.set(root.id, { ...root, replies: [] });
    if (item.id !== root.id) groups.get(root.id).replies.push(item);
  }
  return [...groups.values()].sort((a, b) => a.created_at - b.created_at || a.id - b.id)
    .map(root => ({ ...root, replies: root.replies.sort((a, b) => a.created_at - b.created_at || a.id - b.id) }));
}
module.exports = { BOARD_SLUG, TOPICS, GUIDE_GROUPS, communityHref, guidesHref, discussionHref, encodeBoardMessage, decodeBoardMessage, groupComments };
