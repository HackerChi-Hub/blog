// lib/reading-time.js
// 文章阅读时间估算

/**
 * 计算阅读时间（分钟）
 * @param {string} text - 文本内容
 * @param {number} wordsPerMinute - 每分钟阅读字数（中文约 300-500 字/分钟，英文约 200-250 词/分钟）
 * @returns {number} 阅读时间（分钟）
 */
function calculateReadingTime(text, wordsPerMinute = 300) {
  if (!text || text.trim().length === 0) {
    return 1; // 至少 1 分钟
  }

  // 计算中文字符数（中文字符通常占用更多阅读时间）
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  // 计算英文单词数
  const englishWords = text
    .replace(/[\u4e00-\u9fa5]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  // 中文字符按 1 个字符 = 1 个字计算
  // 英文单词按 1 个单词计算
  const totalWords = chineseChars + englishWords;

  // 计算阅读时间（向上取整，至少 1 分钟）
  const minutes = Math.max(1, Math.ceil(totalWords / wordsPerMinute));

  return minutes;
}

/**
 * 从文章数据估算阅读时间
 * @param {Object} post - Obsidian 文章对象
 * @returns {number} 阅读时间（分钟）
 */
export function estimateReadingTime(post) {
  if (!post) {
    return 1;
  }

  let text = '';

  // 1. 从标题和摘要提取
  if (post.meta?.title) {
    text += post.meta.title + ' ';
  }

  // 2. 从摘要提取
  if (post.meta?.summary) {
    const summary = post.meta.summary;
    if (typeof summary === 'string') {
      text += summary + ' ';
    } else if (Array.isArray(summary)) {
      text += summary
        .map((item) => {
          if (typeof item === 'string') return item;
          if (item?.plain_text) return item.plain_text;
          if (item?.text?.content) return item.text.content;
          return '';
        })
        .filter(Boolean)
        .join(' ') + ' ';
    }
  }

  // Obsidian Markdown 在构建时已经渲染成 HTML。
  if (post.markdownHtml) {
    text += String(post.markdownHtml)
      .replace(/<pre[\s\S]*?<\/pre>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;|&amp;|&lt;|&gt;|&quot;|&#39;/g, ' ');
  }

  return calculateReadingTime(text);
}

/**
 * 格式化阅读时间显示
 * @param {number} minutes - 阅读时间（分钟）
 * @returns {string} 格式化后的文本
 */
export function formatReadingTime(minutes) {
  if (minutes < 1) {
    return '不到 1 分钟';
  } else if (minutes === 1) {
    return '1 分钟';
  } else if (minutes < 60) {
    return `${minutes} 分钟`;
  } else {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) {
      return `${hours} 小时`;
    } else {
      return `${hours} 小时 ${mins} 分钟`;
    }
  }
}
