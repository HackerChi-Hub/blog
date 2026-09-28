/**
 * Shared utility functions used across pages and components.
 */

import { formatDateFor } from './blog-i18n.cjs';

/**
 * Format a date string for the page language (zh-CN default: YYYY/MM/DD).
 * @param {string} dateString
 * @param {string} [lang] - zh-CN / zh-TW / en
 * @returns {string}
 */
export const formatDate = (dateString, lang) => formatDateFor(dateString, lang);

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
