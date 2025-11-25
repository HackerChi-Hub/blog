// components/NotionRenderer.js
export default function NotionRenderer({ blocks }) {
  if (!blocks) return null;
  return (
    <div>
      {blocks.map(block => {
        switch (block.type) {
          case 'heading_1':
            return <h1 key={block.id}>{block.heading_1.rich_text[0]?.plain_text}</h1>;
          case 'heading_2':
            return <h2 key={block.id}>{block.heading_2.rich_text[0]?.plain_text}</h2>;
          case 'heading_3':
            return <h3 key={block.id}>{block.heading_3.rich_text[0]?.plain_text}</h3>;
          case 'paragraph':
            return <p key={block.id}>{block.paragraph.rich_text.map((t, i) => <span key={i}>{t.plain_text}</span>)}</p>;
          case 'bulleted_list_item':
            return <li key={block.id}>{block.bulleted_list_item.rich_text.map((t, i) => <span key={i}>{t.plain_text}</span>)}</li>;
          case 'numbered_list_item':
            return <li key={block.id}>{block.numbered_list_item.rich_text.map((t, i) => <span key={i}>{t.plain_text}</span>)}</li>;
          case 'to_do':
            return (
              <div key={block.id}>
                <input type="checkbox" checked={block.to_do.checked} readOnly />
                {block.to_do.rich_text.map((t, i) => <span key={i}>{t.plain_text}</span>)}
              </div>
            );
          case 'code':
            return (
              <pre key={block.id}>
                <code>{block.code.rich_text.map((t, i) => t.plain_text).join('')}</code>
              </pre>
            );
          case 'table':
            return (
              <table key={block.id} border="1" cellPadding="6">
                <tbody>
                  {block.table.rows.map((row, i) => (
                    <tr key={i}>
                      {row.cells.map((cell, j) => (
                        <td key={j}>{cell.map(t => t.plain_text).join(' ')}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          // 可扩展更多类型
          default:
            return <div key={block.id}>[未支持类型：{block.type}]</div>;
        }
      })}
      <style jsx>{`
        table { border-collapse: collapse; margin: 14px 0;}
        th, td { border: 1px solid #ddd; padding: 6px;}
        pre { background: #222; color: #fff; padding: 10px; border-radius: 4px;}
      `}</style>
    </div>
  );
}
