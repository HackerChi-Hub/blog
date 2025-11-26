// components/NotionRenderer.js
export default function NotionRenderer({ blocks, databasesData = {} }) {
  if (!blocks || !blocks.length) return null;

  const renderRichText = (richTexts = []) =>
    richTexts.map((t, i) => {
      const text = t.plain_text || '';
      const { bold, italic, underline, code, strikethrough } =
        t.annotations || {};
      const href = t.href;

      let content = text;
      if (code) content = <code>{content}</code>;
      if (bold) content = <strong>{content}</strong>;
      if (italic) content = <em>{content}</em>;
      if (underline) content = <u>{content}</u>;
      if (strikethrough) content = <s>{content}</s>;

      if (href) {
        content = (
          <a href={href} target="_blank" rel="noreferrer">
            {content}
          </a>
        );
      }

      return (
        <span key={i} className="notion-text-span">
          {content}
        </span>
      );
    });

  // 把 Notion 数据库的单元格值转为可读字符串
  function renderDatabaseProperty(propertySchema, value) {
    if (!propertySchema || !value) return '';

    const type = propertySchema.type;

    switch (type) {
      case 'title':
        return (
          value.title?.map((t) => t.plain_text).join('') ||
          value[value.type]?.[0]?.plain_text ||
          ''
        );

      case 'rich_text':
        return value.rich_text?.map((t) => t.plain_text).join('') || '';

      case 'number':
        return value.number ?? '';

      case 'select':
        return value.select?.name || '';

      case 'multi_select':
        return (value.multi_select || []).map((o) => o.name).join(', ');

      case 'date':
        return value.date?.start || '';

      case 'checkbox':
        return value.checkbox ? '✔' : '';

      case 'url':
        return value.url || '';

      case 'email':
        return value.email || '';

      case 'phone_number':
        return value.phone_number || '';

      default:
        return '';
    }
  }

  const renderBlocks = (blocksList) =>
    blocksList.map((block) => {
      const { id, type } = block;

      switch (type) {
        case 'heading_1':
          return (
            <h1 key={id} className="notion-h1">
              {renderRichText(block.heading_1.rich_text)}
            </h1>
          );

        case 'heading_2':
          return (
            <h2 key={id} className="notion-h2">
              {renderRichText(block.heading_2.rich_text)}
            </h2>
          );

        case 'heading_3':
          return (
            <h3 key={id} className="notion-h3">
              {renderRichText(block.heading_3.rich_text)}
            </h3>
          );

        case 'paragraph': {
          const r = block.paragraph.rich_text || [];
          if (!r.length) {
            return (
              <p key={id} className="notion-p notion-empty-line">
                &nbsp;
              </p>
            );
          }
          return (
            <p key={id} className="notion-p">
              {renderRichText(r)}
            </p>
          );
        }

        case 'bulleted_list_item':
          return (
            <ul key={id} className="notion-ul">
              <li>
                {renderRichText(block.bulleted_list_item.rich_text)}
                {block.children && block.children.length > 0 && (
                  <div className="notion-list-children">
                    {renderBlocks(block.children)}
                  </div>
                )}
              </li>
            </ul>
          );

        case 'numbered_list_item':
          return (
            <ol key={id} className="notion-ol">
              <li>
                {renderRichText(block.numbered_list_item.rich_text)}
                {block.children && block.children.length > 0 && (
                  <div className="notion-list-children">
                    {renderBlocks(block.children)}
                  </div>
                )}
              </li>
            </ol>
          );

        case 'to_do':
          return (
            <div key={id} className="notion-todo">
              <input
                type="checkbox"
                checked={block.to_do.checked}
                readOnly
                className="notion-todo-checkbox"
              />
              <span className="notion-todo-text">
                {renderRichText(block.to_do.rich_text)}
              </span>
            </div>
          );

        case 'quote':
          return (
            <blockquote key={id} className="notion-quote">
              {renderRichText(block.quote.rich_text)}
            </blockquote>
          );

        case 'code':
          return (
            <pre key={id} className="notion-code">
              <code>
                {block.code.rich_text.map((t) => t.plain_text).join('')}
              </code>
            </pre>
          );

        case 'divider':
          return <hr key={id} className="notion-divider" />;

        case 'callout':
          return (
            <div key={id} className="notion-callout">
              {block.callout.icon && (
                <span className="notion-callout-icon">
                  {block.callout.icon.emoji || ''}
                </span>
              )}
              <div className="notion-callout-text">
                {renderRichText(block.callout.rich_text)}
              </div>
            </div>
          );

        case 'toggle':
          return (
            <details key={id} className="notion-toggle">
              <summary>{renderRichText(block.toggle.rich_text)}</summary>
              {block.children && block.children.length > 0 && (
                <div className="notion-toggle-children">
                  {renderBlocks(block.children)}
                </div>
              )}
            </details>
          );

        case 'image': {
          const src =
            block.image.type === 'file'
              ? block.image.file.url
              : block.image.external.url;
          const caption = (block.image.caption || [])
            .map((t) => t.plain_text)
            .join('');
          return (
            <figure key={id} className="notion-image">
              <img src={src} alt={caption || 'image'} />
              {caption && <figcaption>{caption}</figcaption>}
            </figure>
          );
        }

        case 'table': {
          const hasColumnHeader = block.table.has_column_header;
          const hasRowHeader = block.table.has_row_header;
          const rows = block.children || []; // 子块为 table_row

          return (
            <table key={id} className="notion-table">
              <tbody>
                {rows.map((row, rowIndex) => {
                  if (row.type !== 'table_row') return null;
                  const cells = row.table_row.cells || [];
                  const isHeaderRow = hasColumnHeader && rowIndex === 0;
                  const BaseTag = isHeaderRow ? 'th' : 'td';
                  return (
                    <tr key={row.id}>
                      {cells.map((cell, cellIndex) => {
                        const isRowHeader = hasRowHeader && cellIndex === 0;
                        const FinalTag = isRowHeader ? 'th' : BaseTag;
                        return (
                          <FinalTag key={cellIndex}>
                            {cell.map((t, i) => (
                              <span key={i}>{t.plain_text}</span>
                            ))}
                          </FinalTag>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          );
        }

        case 'column_list':
          return (
            <div key={id} className="notion-column-list">
              {block.children &&
                block.children.map((col) => (
                  <div key={col.id} className="notion-column">
                    {col.children && renderBlocks(col.children)}
                  </div>
                ))}
            </div>
          );

        case 'synced_block':
          return (
            <div key={id} className="notion-synced-block">
              {block.children && renderBlocks(block.children)}
            </div>
          );

        case 'table_row':
          return null;

        // 目录：占位说明
        case 'table_of_contents':
          return (
            <div key={id} className="notion-toc">
              <div className="notion-toc-title">目录</div>
              <div className="notion-toc-desc">
                Notion 的 table_of_contents 在 API 中不会返回具体条目，
                当前只作为占位显示。如果需要真正可点击目录，可以在前端根据标题自动生成。
              </div>
            </div>
          );

        // 子数据库：使用 databasesData 渲染完整表格
        case 'child_database': {
          const dbKey = block.id; // 后端用 blockId 存的
          const dbData = databasesData[dbKey];

          if (!dbData) {
            // title 这里也要兼容数组 / 字符串
            const rawTitle = block.child_database?.title;
            let title = '';
            if (Array.isArray(rawTitle)) {
              title = rawTitle.map((t) => t.plain_text).join('');
            } else if (typeof rawTitle === 'string') {
              title = rawTitle;
            }

            return (
              <div key={id} className="notion-child-database">
                <div className="notion-child-database-title">
                  {title || '数据库'}
                </div>
                <div className="notion-child-database-desc">
                  （该数据库未配置映射，或加载失败）
                </div>
              </div>
            );
          }

          const { meta, rows, dbName } = dbData;
          const properties = meta.properties || {};
          const columnKeys = Object.keys(properties);

          return (
            <div key={id} className="notion-database-wrapper">
              <div className="notion-database-title">
                {dbName ||
                  meta.title?.[0]?.plain_text ||
                  (() => {
                    const rawTitle = block.child_database?.title;
                    if (Array.isArray(rawTitle)) {
                      return rawTitle.map((t) => t.plain_text).join('');
                    }
                    if (typeof rawTitle === 'string') {
                      return rawTitle;
                    }
                    return '数据库';
                  })()}
              </div>

              <table className="notion-database-table">
                <thead>
                  <tr>
                    {columnKeys.map((key) => (
                      <th key={key}>{properties[key].name || key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      {columnKeys.map((key) => (
                        <td key={key}>
                          {renderDatabaseProperty(
                            properties[key],
                            row.properties[key]
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        default:
          return (
            <div key={id} className="notion-unsupported">
              [未支持类型：{type}]
            </div>
          );
      }
    });

  return (
    <div className="notion-page">
      {renderBlocks(blocks)}

      <style jsx>{`
        .notion-page {
          line-height: 1.8;
          font-size: 15.5px;
          color: #111827;
        }

        .notion-h1,
        .notion-h2,
        .notion-h3 {
          list-style: none;
          margin-left: 0;
          padding-left: 0;
        }

        .notion-h1 {
          font-size: 24px;
          margin: 1.4em 0 0.7em;
          font-weight: 600;
        }

        .notion-h2 {
          font-size: 20px;
          margin: 1.6em 0 0.6em;
          font-weight: 600;
          border-bottom: 1px solid rgba(15, 23, 42, 0.06);
          padding-bottom: 0.25em;
        }

        .notion-h3 {
          font-size: 17px;
          margin: 1.2em 0 0.4em;
          font-weight: 600;
        }

        .notion-p {
          margin: 0.55em 0;
        }

        .notion-empty-line {
          min-height: 1.1em;
        }

        .notion-ul,
        .notion-ol {
          margin: 0.35em 0 0.35em 1.5em;
        }

        .notion-ul li,
        .notion-ol li {
          margin: 0.18em 0;
        }

        .notion-list-children {
          margin-left: 1.1em;
          margin-top: 0.18em;
        }

        .notion-quote {
          border-left: 3px solid rgba(55, 65, 81, 0.35);
          padding-left: 0.9em;
          color: rgba(55, 65, 81, 0.9);
          margin: 0.9em 0;
          font-size: 14px;
          background: rgba(249, 250, 251, 0.7);
        }

        .notion-code {
          background: #020617;
          color: #e5e7eb;
          padding: 12px 14px;
          border-radius: 8px;
          overflow-x: auto;
          font-size: 13px;
          margin: 1em 0;
        }

        .notion-divider {
          border: none;
          border-top: 1px solid rgba(15, 23, 42, 0.08);
          margin: 1.6em 0;
        }

        .notion-callout {
          display: flex;
          padding: 10px 12px;
          border-radius: 8px;
          background: rgba(239, 246, 255, 0.9);
          margin: 0.9em 0;
          border: 1px solid rgba(191, 219, 254, 0.9);
        }

        .notion-callout-icon {
          margin-right: 8px;
        }

        .notion-toggle {
          margin: 0.5em 0;
        }

        .notion-toggle summary {
          cursor: pointer;
          font-weight: 500;
        }

        .notion-toggle-children {
          margin-left: 1.2em;
          margin-top: 0.25em;
        }

        /* 图片尺寸 */
        .notion-image {
          margin: 1.6em 0;
          text-align: center;
        }

        .notion-page .notion-image img {
          display: block;
          margin: 0 auto;
          max-width: 300px;
          width: 100%;
          max-height: 200px;
          height: auto;
          object-fit: contain;
          border-radius: 10px;
          box-shadow: 0 14px 30px rgba(15, 23, 42, 0.16);
        }

        .notion-image figcaption {
          font-size: 12px;
          color: #6b7280;
          margin-top: 6px;
        }

        .notion-table {
          border-collapse: collapse;
          margin: 14px 0;
          width: 100%;
          font-size: 14px;
        }

        .notion-table th,
        .notion-table td {
          border: 1px solid rgba(148, 163, 184, 0.6);
          padding: 6px 8px;
          text-align: left;
        }

        .notion-table th {
          background: #f9fafb;
          font-weight: 600;
        }

        .notion-todo {
          display: flex;
          align-items: center;
          margin: 0.3em 0;
        }

        .notion-todo-checkbox {
          margin-right: 0.5em;
        }

        .notion-unsupported {
          color: #9ca3af;
          font-size: 13px;
          margin: 0.3em 0;
        }

        code {
          font-family: Menlo, Monaco, Consolas, 'Courier New', monospace;
          font-size: 0.95em;
          background: rgba(148, 163, 184, 0.18);
          padding: 0.1em 0.25em;
          border-radius: 4px;
        }

        .notion-column-list {
          display: flex;
          gap: 12px;
          margin: 0.9em 0;
        }

        .notion-column {
          flex: 1;
        }

        @media (max-width: 768px) {
          .notion-column-list {
            flex-direction: column;
          }

          .notion-page .notion-image img {
            max-width: 100%;
            max-height: 260px;
            box-shadow: 0 10px 24px rgba(15, 23, 42, 0.14);
          }
        }

        .notion-toc {
          margin: 16px 0;
          padding: 10px 12px;
          border-left: 4px solid #6b7280;
          background: #f9fafb;
          font-size: 14px;
        }

        .notion-toc-title {
          font-weight: 600;
          margin-bottom: 4px;
        }

        .notion-toc-desc {
          color: #6b7280;
        }

        .notion-child-database {
          margin: 20px 0;
          padding: 12px 14px;
          border-radius: 6px;
          border: 1px solid rgba(148, 163, 184, 0.7);
          background: #f9fafb;
          font-size: 14px;
        }

        .notion-child-database-title {
          font-weight: 600;
          margin-bottom: 6px;
        }

        .notion-child-database-desc {
          color: #6b7280;
        }

        .notion-database-wrapper {
          margin: 18px 0;
        }

        .notion-database-title {
          font-weight: 600;
          margin-bottom: 6px;
          font-size: 15px;
        }

        .notion-database-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .notion-database-table th,
        .notion-database-table td {
          border: 1px solid rgba(148, 163, 184, 0.7);
          padding: 6px 8px;
          text-align: left;
        }

        .notion-database-table th {
          background: #f9fafb;
        }
      `}</style>
    </div>
  );
}
