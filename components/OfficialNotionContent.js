import React from 'react';


const COLOR_MAP = {
  gray: '#a7a7a7', brown: '#c99a75', orange: '#ffad66', yellow: '#ffd666',
  green: '#6fe7b7', blue: '#75bfff', purple: '#caa7ff', pink: '#ff9bd2', red: '#ff8c8c',
};

const plainText = (richText = []) =>
  richText.map((item) => item?.plain_text || item?.text?.content || '').join('');

function RichText({ value = [] }) {
  return value.map((item, index) => {
    const annotations = item.annotations || {};
    const text = item.type === 'equation'
      ? item.equation?.expression || ''
      : item.plain_text || item.text?.content || '';
    let node = text;

    if (annotations.code) node = <code>{node}</code>;
    if (annotations.bold) node = <strong>{node}</strong>;
    if (annotations.italic) node = <em>{node}</em>;
    if (annotations.underline) node = <u>{node}</u>;
    if (annotations.strikethrough) node = <s>{node}</s>;

    const href = item.href || item.text?.link?.url;
    if (href) {
      node = (
        <a href={href} target="_blank" rel="noreferrer noopener">
          {node}
        </a>
      );
    }

    const color = annotations.color || 'default';
    const isBackground = color.endsWith('_background');
    const baseColor = color.replace('_background', '');
    const style = isBackground
      ? { backgroundColor: `${COLOR_MAP[baseColor] || '#ffffff'}22`, borderRadius: 4, padding: '0 3px' }
      : baseColor !== 'default' ? { color: COLOR_MAP[baseColor] || undefined } : undefined;

    return <span key={`${index}-${text.slice(0, 12)}`} style={style}>{node}</span>;
  });
}

const fileUrl = (block) => {
  const payload = block?.[block?.type];
  const data = payload?.[payload?.type];
  return data?.url || '';
};

const iconNode = (icon) => {
  if (!icon) return null;
  if (icon.type === 'emoji') return <span className="official-notion-icon">{icon.emoji}</span>;
  const url = icon[icon.type]?.url;
  return url ? <img className="official-notion-icon-image" src={url} alt="" /> : null;
};

function BlockChildren({ blocks = [], hiddenBlockId }) {
  const rendered = [];
  for (let index = 0; index < blocks.length;) {
    const block = blocks[index];
    if (block?.type === 'bulleted_list_item' || block?.type === 'numbered_list_item') {
      const type = block.type;
      const items = [];
      while (index < blocks.length && blocks[index]?.type === type) {
        items.push(blocks[index]);
        index += 1;
      }
      const Tag = type === 'numbered_list_item' ? 'ol' : 'ul';
      rendered.push(
        <Tag key={`${type}-${items[0]?.id}`} className="official-notion-list">
          {items.map((item) => (
            <li key={item.id}>
              <RichText value={item[type]?.rich_text || []} />
              {!!item.children?.length && (
                <BlockChildren blocks={item.children} hiddenBlockId={hiddenBlockId} />
              )}
            </li>
          ))}
        </Tag>
      );
      continue;
    }
    rendered.push(
      <OfficialBlock key={block?.id || index} block={block} hiddenBlockId={hiddenBlockId} />
    );
    index += 1;
  }
  return rendered;
}

function OfficialBlock({ block, hiddenBlockId }) {
  if (!block || block.id === hiddenBlockId) return null;
  const type = block.type;
  const payload = block[type] || {};
  const children = block.children || [];
  const nested = children.length
    ? <BlockChildren blocks={children} hiddenBlockId={hiddenBlockId} />
    : null;

  switch (type) {
    case 'paragraph':
      return (
        <div className="official-notion-block">
          {payload.rich_text?.length ? <p><RichText value={payload.rich_text} /></p> : <p>&nbsp;</p>}
          {nested}
        </div>
      );
    case 'heading_1':
      return <><h2><RichText value={payload.rich_text} /></h2>{nested}</>;
    case 'heading_2':
      return <><h3><RichText value={payload.rich_text} /></h3>{nested}</>;
    case 'heading_3':
      return <><h4><RichText value={payload.rich_text} /></h4>{nested}</>;
    case 'quote':
      return <><blockquote><RichText value={payload.rich_text} /></blockquote>{nested}</>;
    case 'callout':
      return (
        <div className="official-notion-callout">
          {iconNode(payload.icon)}
          <div><RichText value={payload.rich_text} />{nested}</div>
        </div>
      );
    case 'divider':
      return <hr />;
    case 'image': {
      const url = fileUrl(block);
      if (!url) return null;
      const caption = payload.caption || [];
      return (
        <figure className="official-notion-figure">
          <img src={url} alt={plainText(caption) || '文章配图'} loading="lazy" />
          {!!caption.length && <figcaption><RichText value={caption} /></figcaption>}
        </figure>
      );
    }
    case 'code':
      return (
        <figure className="official-notion-code">
          <pre><code className={`language-${payload.language || 'text'}`}>
            {plainText(payload.rich_text || [])}
          </code></pre>
          {!!payload.caption?.length && <figcaption><RichText value={payload.caption} /></figcaption>}
        </figure>
      );
    case 'to_do':
      return (
        <div className="official-notion-todo">
          <input type="checkbox" checked={!!payload.checked} readOnly />
          <span><RichText value={payload.rich_text} /></span>
          {nested}
        </div>
      );
    case 'toggle':
      return (
        <details className="official-notion-toggle">
          <summary><RichText value={payload.rich_text} /></summary>
          {nested}
        </details>
      );
    case 'table': {
      const rows = children.filter((child) => child.type === 'table_row');
      return (
        <div className="official-notion-table-wrap">
          <table>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={row.id}>
                  {(row.table_row?.cells || []).map((cell, cellIndex) => {
                    const HeaderTag =
                      (payload.has_column_header && rowIndex === 0) ||
                      (payload.has_row_header && cellIndex === 0) ? 'th' : 'td';
                    return <HeaderTag key={`${row.id}-${cellIndex}`}><RichText value={cell} /></HeaderTag>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    case 'column_list':
      return <div className="official-notion-columns">{nested}</div>;
    case 'column':
      return <div className="official-notion-column">{nested}</div>;
    case 'bookmark':
    case 'link_preview':
    case 'embed': {
      const url = payload.url || '';
      return url ? (
        <a className="official-notion-bookmark" href={url} target="_blank" rel="noreferrer noopener">
          <span>{plainText(payload.caption || []) || url}</span>
          <small>{url}</small>
        </a>
      ) : null;
    }
    case 'video': {
      const url = fileUrl(block);
      if (!url) return null;
      if (/youtu\.be|youtube\.com|bilibili\.com/i.test(url)) {
        return <iframe className="official-notion-video" src={url} title="嵌入视频" loading="lazy" allowFullScreen />;
      }
      return <video className="official-notion-video" src={url} controls preload="metadata" />;
    }
    case 'audio': {
      const url = fileUrl(block);
      return url ? <audio className="official-notion-audio" src={url} controls preload="metadata" /> : null;
    }
    case 'file':
    case 'pdf': {
      const url = fileUrl(block);
      const name = payload.name || plainText(payload.caption || []) || (type === 'pdf' ? '查看 PDF' : '下载附件');
      return url ? <a className="official-notion-file" href={url} target="_blank" rel="noreferrer noopener">{name}</a> : null;
    }
    case 'equation':
      return <div className="official-notion-equation">{payload.expression}</div>;
    case 'child_page':
      return <div className="official-notion-child-page">📄 {payload.title || '子页面'}</div>;
    case 'synced_block':
    case 'template':
      return <div className="official-notion-block">{nested}</div>;
    case 'table_row':
      return null;
    default:
      return nested ? <div className="official-notion-block">{nested}</div> : null;
  }
}

export default function OfficialNotionContent({ blocks = [], hiddenBlockId = null }) {
  return (
    <div className="official-notion-content">
      <BlockChildren blocks={blocks} hiddenBlockId={hiddenBlockId} />
    </div>
  );
}

