import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

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
  fallback = null,
}) {
  const [failed, setFailed] = useState(false);
  const naturalImage = useRef(null);
  const source = normalizeSource(src);

  useEffect(() => {
    const image = naturalImage.current;
    // 原生图片可能在 React 接管前已经失败；仍要显示替代内容，不能留下空白框。
    if (image?.complete && !image.naturalWidth) setFailed(true);
  }, [source, natural]);

  if (!source || failed) return fallback;

  if (natural) {
    return (
      <img
        ref={naturalImage}
        className={`contained-cover__natural ${className}`.trim()}
        src={source}
        alt={alt}
        width={width}
        height={height}
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
