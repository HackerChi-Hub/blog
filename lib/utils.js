/**
 * Shared utility functions used across pages and components.
 */

/**
 * Format a date string to zh-CN locale (YYYY/MM/DD).
 * @param {string} dateString
 * @returns {string}
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
};

/**
 * Normalize an article summary value to a plain string.
 * Handles string, array (rich text), and object formats.
 * @param {string|string[]|object} summary
 * @returns {string}
 */
export const normalizeSummary = (summary) => {
  if (!summary) return '';
  if (typeof summary === 'string') return summary;
  if (Array.isArray(summary)) {
    return summary
      .map((item) => {
        if (typeof item === 'string') return item;
        if (typeof item === 'object' && item?.plain_text) return item.plain_text;
        if (item?.text?.content) return item.text.content;
        return '';
      })
      .filter(Boolean)
      .join('');
  }
  if (typeof summary === 'object') {
    if (summary.plain_text) return summary.plain_text;
    if (summary.text?.content) return summary.text.content;
    return JSON.stringify(summary);
  }
  return String(summary);
};
