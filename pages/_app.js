import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';
import '../styles/globals.css';
import 'react-notion-x/src/styles.css';
import 'prismjs/themes/prism-tomorrow.css';
import '../styles/notion-overrides.css';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-PLLG23LT3H';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    const handleRouteChange = (url) => {
      window.gtag?.('config', GA_MEASUREMENT_ID, { page_path: url });
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [router.events]);

  // 禁用右键菜单和复制粘贴（代码区域除外）
  useEffect(() => {
    // 检查元素是否是代码区域
    const isCodeElement = (element) => {
      if (!element) return false;
      
      // 检查标签名
      const tagName = element.tagName?.toLowerCase();
      if (tagName === 'pre' || tagName === 'code') return true;
      
      // 检查类名
      const className = element.className || '';
      if (
        typeof className === 'string' &&
        (className.includes('language-') ||
          className.includes('notion-code') ||
          className.includes('prism') ||
          className.includes('highlight'))
      ) {
        return true;
      }
      
      // 检查父元素
      let parent = element.parentElement;
      while (parent) {
        const parentTagName = parent.tagName?.toLowerCase();
        const parentClassName = parent.className || '';
        if (
          parentTagName === 'pre' ||
          parentTagName === 'code' ||
          (typeof parentClassName === 'string' &&
            (parentClassName.includes('language-') ||
              parentClassName.includes('notion-code') ||
              parentClassName.includes('prism') ||
              parentClassName.includes('highlight')))
        ) {
          return true;
        }
        parent = parent.parentElement;
      }
      
      return false;
    };

    // 禁用右键菜单
    const handleContextMenu = (e) => {
      if (!isCodeElement(e.target)) {
        e.preventDefault();
        return false;
      }
    };

    // 禁用复制（代码区域除外）
    const handleCopy = (e) => {
      if (!isCodeElement(e.target)) {
        e.preventDefault();
        return false;
      }
    };

    // 禁用粘贴（代码区域除外）
    const handlePaste = (e) => {
      if (!isCodeElement(e.target)) {
        e.preventDefault();
        return false;
      }
    };

    // 禁用文本选择（代码区域除外）
    const handleSelectStart = (e) => {
      if (!isCodeElement(e.target)) {
        e.preventDefault();
        return false;
      }
    };

    // 禁用拖拽
    const handleDragStart = (e) => {
      if (!isCodeElement(e.target)) {
        e.preventDefault();
        return false;
      }
    };

    // 添加事件监听器
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('dragstart', handleDragStart);

    // 清理事件监听器
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  return (
    <>
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}
      <Component {...pageProps} />
    </>
  );
}
