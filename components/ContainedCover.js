import Image from 'next/image';
import { useState } from 'react';

const normalizeSource = (source) =>
  typeof source === 'string' ? source : source?.url || source?.src || '';

/**
 * 封面统一展示组件。
 *
 * 卡片模式用一层柔化背景铺满容器，前景始终 contain，避免标题、人物和界面截图被裁掉。
 * natural 模式用于文章详情页，按照图片自身比例完整展开。
 */
export default function ContainedCover({
  src,
  alt = '',
  width = 1504,
  height = 640,
  priority = false,
  natural = false,
  className = '',
}) {
  const [failed, setFailed] = useState(false);
  const source = normalizeSource(src);
  if (!source || failed) return null;

  if (natural) {
    return (
      <img
        className={`contained-cover__natural ${className}`.trim()}
        src={source}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className={`contained-cover ${className}`.trim()}>
      <Image
        className="contained-cover__backdrop"
        src={source}
        alt=""
        aria-hidden="true"
        width={width}
        height={height}
        loading="lazy"
        unoptimized
      />
      <Image
        className="contained-cover__image"
        src={source}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        unoptimized
        onError={() => setFailed(true)}
      />
    </div>
  );
}
