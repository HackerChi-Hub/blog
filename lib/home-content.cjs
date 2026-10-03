'use strict';

// 首页的展示常量：三条主线、AI 实验台、媒体频道。
//
// 单独放成纯 CommonJS 模块（不含 JSX），是为了让多语言闸门能直接 require 它们：
// 这些文字经 t(变量) 显示，闸门扫源码字面量看不见；手抄进闸门的登记表又会在改文案时
// 悄悄过期。从这里读，键和代码永远是同一份。
//
// 注意 keywords / featureKeywords / pattern 是拿中文原文做匹配用的，不显示、不翻译。

const CONTENT_PILLARS = [
  {
    id: 'local-ai',
    index: '01',
    title: '本地部署',
    subtitle: '把 AI 跑在自己的电脑上',
    description: 'Mac、MLX、Ollama 与消费级硬件的真实安装、速度和成本实测。',
    keywords: ['本地', 'MLX', 'Ollama', 'Apple Silicon', 'Mac'],
    featureKeywords: ['LocalBrain', '本地部署', 'MLX', 'Ollama', 'Apple Silicon', '本地'],
  },
  {
    id: 'free-ai',
    index: '02',
    title: '免费白嫖',
    subtitle: '把付费工作流换成免费方案',
    description: '免费额度、开源平替和省钱攻略，同时说清限制、门槛与代价。',
    keywords: ['免费', '白嫖', '开源', '限免', '省钱'],
    featureKeywords: ['免费', '白嫖', '0元', '限免', '省钱', '开源平替'],
  },
  {
    id: 'made-by-me',
    index: '03',
    title: '自制软件',
    subtitle: '从问题到产品，公开开发过程',
    description: '方寸智匣 LocalBrain、光影词库 ScreenLex、黑粉盒子 HyphenBox 与其他自制工具的发布、失败记录和版本迭代。',
    keywords: ['LocalBrain', 'ScreenLex', 'HyphenBox', '黑粉盒子', '自制', '工具', '开发'],
    featureKeywords: ['ScreenLex', 'LocalBrain', '自制', '我做的', '开发纪实', '版本发布'],
  },
];

const AI_LAB_TOOLS = [
  { href: '/ai-hardware-survey/', icon: '◫', title: 'AI 装机指南', desc: '本地 AI 设备全景对比' },
  { href: '/llm-guide/', icon: '⌘', title: '本地 LLM 指南', desc: 'Ollama · LM Studio · GGUF' },
  { href: '/mlx-model-test.html', icon: '△', title: 'MLX 模型测试', desc: 'M5 Pro 本地模型深度评测' },
  { href: '/radar/', icon: '◉', title: '发布雷达', desc: '盯住 48 小时内的重大发布' },
  { href: '/agent-comparison.html', icon: '≠', title: 'AI Agent 三国杀', desc: '三大 Agent 实战对比' },
];

const SIDE_TOOLS = [
  { href: '/wifi/', icon: '≋', title: 'WiFi Finder', desc: '全球公共 WiFi 密码查询' },
  { href: '/shortcuts/', icon: '⌨', title: '快捷键大全', desc: 'Windows / Mac 快捷键速查' },
  { href: '/games/', icon: '◇', title: '游戏中心', desc: '浏览器可玩像素小游戏' },
];

const MEDIA_CHANNELS = [
  {
    id: 'bilibili',
    name: 'B站',
    title: '完整实测',
    description: '长视频首发：安装、速度、成本和踩坑过程一次讲透。',
    action: '看完整视频',
    pattern: /B站|哔哩/i,
    fallbackUrl: 'https://space.bilibili.com/1846717524',
    accent: '#ffd34d',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    title: '海外同步',
    description: '完整视频同步上架，方便海外观众观看和收藏。',
    action: '看海外同步',
    pattern: /YouTube|油管/i,
    fallbackUrl: 'https://www.youtube.com/@hyphentech_top',
    accent: '#ff6b6b',
  },
  {
    id: 'channels',
    name: '视频号',
    title: '竖屏速看',
    description: '把关键步骤压进竖屏，等电梯也能刷完一个坑。',
    action: '微信搜黑粉科技',
    pattern: /视频号|微信视频/i,
    fallbackUrl: '#media-notice',
    accent: '#5ce1df',
  },
  {
    id: 'wechat',
    name: '公众号',
    title: '长文复盘',
    description: '完整教程、参数表和下载链接，适合收藏后真正动手。',
    action: '微信搜黑粉科技',
    pattern: /公众号|微信公众/i,
    fallbackUrl: '#media-notice',
    accent: '#69f0ae',
  },
];

module.exports = { CONTENT_PILLARS, AI_LAB_TOOLS, SIDE_TOOLS, MEDIA_CHANNELS };
