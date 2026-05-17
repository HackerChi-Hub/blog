// lib/related-posts.js
// 相关文章推荐算法

/**
 * 计算两个文章的相似度
 * @param {Object} post1 - 文章1
 * @param {Object} post2 - 文章2
 * @returns {number} 相似度分数（0-1）
 */
function calculateSimilarity(post1, post2) {
  let score = 0;
  let factors = 0;

  // 1. 分类相似度（权重：0.4）
  if (post1.categoryNames && post2.categoryNames) {
    const categories1 = new Set(post1.categoryNames);
    const categories2 = new Set(post2.categoryNames);
    const intersection = [...categories1].filter(cat => categories2.has(cat));
    const union = new Set([...categories1, ...categories2]);
    if (union.size > 0) {
      score += (intersection.length / union.size) * 0.4;
    }
    factors += 0.4;
  }

  // 2. 标签相似度（权重：0.3）
  const tags1 = post1.tags || [];
  const tags2 = post2.tags || [];
  if (tags1.length > 0 || tags2.length > 0) {
    const tagNames1 = new Set(tags1.map(t => typeof t === 'string' ? t : t.name || t));
    const tagNames2 = new Set(tags2.map(t => typeof t === 'string' ? t : t.name || t));
    const tagIntersection = [...tagNames1].filter(tag => tagNames2.has(tag));
    const tagUnion = new Set([...tagNames1, ...tagNames2]);
    if (tagUnion.size > 0) {
      score += (tagIntersection.length / tagUnion.size) * 0.3;
    }
    factors += 0.3;
  }

  // 3. 时间接近度（权重：0.2）- 越接近的文章越相关
  if (post1.date && post2.date) {
    const date1 = new Date(post1.date);
    const date2 = new Date(post2.date);
    const daysDiff = Math.abs(date1 - date2) / (1000 * 60 * 60 * 24);
    // 30天内：1.0，90天内：0.7，180天内：0.4，超过：0.1
    let timeScore = 0.1;
    if (daysDiff <= 30) timeScore = 1.0;
    else if (daysDiff <= 90) timeScore = 0.7;
    else if (daysDiff <= 180) timeScore = 0.4;
    score += timeScore * 0.2;
    factors += 0.2;
  }

  // 4. 标题关键词相似度（权重：0.1）
  if (post1.title && post2.title) {
    const words1 = post1.title.toLowerCase().split(/\s+/);
    const words2 = post2.title.toLowerCase().split(/\s+/);
    const commonWords = words1.filter(word => words2.includes(word) && word.length > 2);
    if (words1.length > 0 || words2.length > 0) {
      const allWords = new Set([...words1, ...words2]);
      if (allWords.size > 0) {
        score += (commonWords.length / allWords.size) * 0.1;
      }
    }
    factors += 0.1;
  }

  // 归一化分数
  return factors > 0 ? score / factors : 0;
}

/**
 * 获取相关文章
 * @param {Object} currentPost - 当前文章
 * @param {Array} allPosts - 所有文章列表
 * @param {number} limit - 返回数量限制
 * @returns {Array} 相关文章列表
 */
export function getRelatedPosts(currentPost, allPosts, limit = 3) {
  if (!currentPost || !allPosts || allPosts.length === 0) {
    return [];
  }

  // 排除当前文章
  const otherPosts = allPosts.filter(
    post => post.id !== currentPost.id && post.slug !== currentPost.slug
  );

  if (otherPosts.length === 0) {
    return [];
  }

  // 计算相似度并排序
  const postsWithScore = otherPosts.map(post => ({
    post,
    score: calculateSimilarity(currentPost, post),
  }));

  // 按相似度排序，取前 limit 个
  const related = postsWithScore
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);

  return related;
}
