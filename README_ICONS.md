# 图标文件说明

## 已创建的图标文件

- `favicon.svg` - SVG格式的favicon（现代浏览器支持，可缩放）

## 需要添加的图标文件（可选）

为了更好的浏览器兼容性，建议添加以下图标文件：

### 1. favicon.ico
- 尺寸：16x16, 32x32, 48x48（多尺寸ICO文件）
- 用途：传统浏览器兼容
- 生成方式：
  - 使用在线工具：https://favicon.io/favicon-converter/
  - 或使用 ImageMagick：`convert favicon.svg -resize 16x16 favicon.ico`

### 2. favicon-16x16.png
- 尺寸：16x16
- 用途：小尺寸图标

### 3. favicon-32x32.png
- 尺寸：32x32
- 用途：标准尺寸图标

### 4. apple-touch-icon.png
- 尺寸：180x180
- 用途：iOS设备主屏幕图标

### 5. favicon-192x192.png 和 favicon-512x512.png
- 尺寸：192x192 和 512x512
- 用途：PWA应用图标（已在site.webmanifest中配置）

## 快速生成所有图标

你可以使用以下在线工具快速生成所有尺寸的图标：

1. **Favicon.io**: https://favicon.io/favicon-converter/
   - 上传你的favicon.svg或图片
   - 自动生成所有尺寸的图标

2. **RealFaviconGenerator**: https://realfavicongenerator.net/
   - 上传图片
   - 自定义各种平台的图标
   - 下载完整的图标包

## 当前配置

所有图标链接已在 `pages/_app.js` 中配置，添加图标文件后即可自动生效。
