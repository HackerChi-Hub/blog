#!/usr/bin/env node
'use strict';
// 读取留言管理命令的JSON；只输出问题分组、公开来源和数量，不复制昵称/IP/完整留言。
// 不写文章、不改published状态、不自动发布，也不调用写作模型。
const { decodeBoardMessage } = require('../lib/community.cjs');
const RULES = [
  { id:'intel-mac', title:'Intel Mac兼容与安装包选择', pattern:/intel|英特尔/i, destination:'/localbrain-local-ai-box/' },
  { id:'issue-followup', title:'问题反馈与跟进方式', pattern:/issues?\s*\/\s*prs?|timely response|反馈.*跟进|问题.*回复/i, destination:'/guides/#reader-questions' },
  { id:'model-tools', title:'模型工具调用失败', pattern:/不.*调用.*工具|tool.call.*fail|工具调用.*失败/i, destination:'/guides/#models' },
  { id:'api-quota', title:'免费接口额度与不可用', pattern:/额度|429|quota|免费.*(?:失效|不可用)/i, destination:'/guides/#free' },
];
function summarize(input) {
  const list = Array.isArray(input) ? input : input.comments || [];
  const visible = list.filter(item => item.status !== 'hidden' && item.author_verified !== 1 && item.nickname !== '黑粉科技');
  const topics = RULES.flatMap(rule => {
    const unique = new Map();
    for (const item of visible) {
      const text = decodeBoardMessage(item.content).text.trim();
      if (!rule.pattern.test(text) || !Number.isSafeInteger(item.id) || !/^[a-z0-9][a-z0-9-]{0,120}$/.test(item.slug || '')) continue;
      const key = text.toLowerCase().replace(/\s+/g,' ');
      if (!unique.has(key)) unique.set(key, { id:item.id, url:`https://hyphentech.top/${item.slug === 'teahouse' ? 'teahouse' : item.slug}/#comment-${item.id}` });
    }
    const sources = [...unique.values()];
    return sources.length ? [{ id:rule.id, title:rule.title, distinctMessages:sources.length, status:sources.length >= 3 ? '待人工核验频次' : '单次问题，非高频', destination:rule.destination, sources }] : [];
  });
  return { schemaVersion:1, sourceWindow:'输入的可见留言样本，不代表全历史', publishing:'仅编辑候选，不自动发布；正式文章需核实事实与标题确认', topics };
}
if (require.main === module) {
  let raw='';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', chunk => { raw+=chunk; if(raw.length>2_000_000) { console.error('输入过大'); process.exit(1); } });
  process.stdin.on('end', () => { try { console.log(JSON.stringify(summarize(JSON.parse(raw)),null,2)); } catch { console.error('请输入留言列表JSON，不包含口令'); process.exitCode=1; } });
}
module.exports={summarize};
