// components/OptimizedImage.js
// 优化的图片组件，使用 Next.js Image

import Image from 'next/image';
import { useState } from 'react';

/**
 * 优化的图片组件
 * 支持错误处理和占位符
 */
export default function OptimizedImage({
  src,
  alt = '',
  width,
  height,
  fill = false,
  priority = false,
  className = '',
  style = {},
  onError,
  onLoad,
  ...props
}) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // 如果图片加载失败，显示占位符
  if (error) {
    return (
      <div
        style={{
          width: fill ? '100%' : width || '100%',
          height: fill ? '100%' : height || 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.05)',
          color: 'rgba(255, 255, 255, 0.4)',
          fontSize: '12px',
          ...style,
        }}
        className={className}
      >
        图片加载失败
      </div>
    );
  }

  const handleError = (e) => {
    setError(true);
    setLoading(false);
    if (onError) {
      onError(e);
    }
  };

  const handleLoad = (e) => {
    setLoading(false);
    if (onLoad) {
      onLoad(e);
    }
  };

  // 如果使用 fill，需要父容器有 position: relative
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        style={{
          objectFit: 'cover',
          ...style,
        }}
        className={className}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        onError={handleError}
        onLoad={handleLoad}
        unoptimized
        {...props}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width || 800}
      height={height || 600}
      style={{
        width: '100%',
        height: 'auto',
        ...style,
      }}
      className={className}
      priority={priority}
      loading={priority ? undefined : 'lazy'}
      onError={handleError}
      onLoad={handleLoad}
      unoptimized
      {...props}
    />
  );
}
