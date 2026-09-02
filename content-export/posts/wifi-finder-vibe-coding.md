---
title: 我用AI做了个全球公共WiFi密码查询器
slug: wifi-finder-vibe-coding
status: published
date: 2026-03-31
updated: 2026-03-31
summary: 用 Vibe Coding 花 30 分钟做了一个覆盖 15+ 国家、150+ 热点的离线公共 WiFi 密码查询器
categories:
  - 技术分享
tags:
  - AI
  - wifi
  - 工具
  - 教程
  - html
  - 前端
cover: https://hyphentech.top/obsidian-assets/wifi-finder-vibe-coding/image-01-cf0f87a731.png
legacy_paths: []
---

![文章配图 1](https://hyphentech.top/obsidian-assets/wifi-finder-vibe-coding/image-01-cf0f87a731.png)

> 出差、旅行到处找 WiFi 密码？我花了 30 分钟，用 Vibe Coding 搞定了一个覆盖 15+ 国家、150+ 热点的离线查询神器。

---

### 痛点：到处问"WiFi 密码多少？"

相信每个人都经历过这种场景——

走进一家星巴克、瑞幸或者机场候机厅，掏出手机连 WiFi，然后开始四处张望，寻找贴在墙上、桌角或者收银台后面的那张小纸条。有时候你得排队问店员，有时候纸条早就被撕掉了，有时候密码换了但贴纸没换。

出国旅行更痛苦。到了东京成田机场，你不知道免费 WiFi 叫什么名字；在曼谷素万那普机场，你不确定要不要注册才能用；更别说那些贵宾室的 WiFi 密码——明明花了钱进去，还得到处找信号。

我自己就被这个问题折磨了很久。直到有一天我想：**这种重复性的信息检索问题，不就是 AI 最擅长解决的吗？**

![文章配图 2](https://hyphentech.top/obsidian-assets/wifi-finder-vibe-coding/image-02-5d93d994d9.jpg)

### 解决方案：WiFi Finder

于是我用 Vibe Coding 的方式，让 AI 帮我造了一个「全球公共 WiFi 密码查询器」——**WiFi Finder**。

它是一个纯前端的单 HTML 文件，不需要服务器、不需要安装、不需要注册。你把这个文件保存到手机或电脑上，随时打开浏览器就能查。

**核心功能一览：**

- **150+ 条 WiFi 数据**，涵盖中国、日本、韩国、新加坡、泰国、美国、英国、法国、德国、澳大利亚等 15+ 个国家和地区

- **智能分类筛选**：按场所类型（咖啡厅、快餐、机场、地铁、酒店、商场、公共设施）和地区双维度过滤

- **全文搜索**：输入品牌名、SSID、城市、密码关键词即可秒查

- **一键复制密码**：找到密码后点击复制按钮，直接去 WiFi 设置粘贴

- **用户贡献系统**：发现了新的 WiFi？可以自己添加进去，数据保存在本地

- **导入导出**：支持 JSON 格式的数据备份和分享

- **暗色 / 亮色主题切换**

- **完全离线可用**：没网的时候照样能查（这不就是你最需要它的时候吗）

### 数据覆盖了什么？

给大家感受一下这个数据库的实用程度：

**中国大陆**——瑞幸、喜茶、奈雪、霸王茶姬、蜜雪冰城、古茗、库迪、茶百道、星巴克、麦当劳、肯德基、海底捞、全国主要机场（北上广深成重杭宁武等 20+ 座）、高铁 WiFi、北京/上海/广州地铁、万达/大悦城/万象城等商场，甚至连"88888888"和"12345678"这种万能密码都收录了。

**港台地区**——香港机场、港铁、太平洋咖啡、GovWiFi、国泰/环亚贵宾室，以及台湾的 iTaiwan、台北捷运、路易莎咖啡等。

**日本**——成田/羽田/关西机场、JR 东日本、新干线、东京地铁、7-SPOT、罗森、星巴克日本。

**韩国**——首尔公共 WiFi、仁川机场、KT 的默认密码（1234567890，别问我怎么知道的）。

**东南亚**——新加坡樟宜机场、Wireless@SG、泰国素万那普机场、马来西亚 KLIA、越南 Highlands Coffee。

**欧美**——Starbucks、McDonald's、Walmart、各大机场及航空公司贵宾室密码（Delta Sky Club 的密码是 "faster"，British Airways 希思罗的是 "vancouver"，这些冷知识 AI 都帮我挖出来了）。

![文章配图 3](https://hyphentech.top/obsidian-assets/wifi-finder-vibe-coding/image-03-cc660629ac.png)

### Vibe Coding 实战：我是怎么做的

整个项目我没有手写一行代码。流程是这样的：

**第一步：描述需求**

我直接用中文告诉 AI：

> "帮我做一个全球公共 WiFi 密码查询器，单 HTML 文件，赛博朋克风格，支持按国家/场所分类筛选、搜索、密码一键复制、用户自定义添加、数据导入导出。内置一个尽可能全的全球公共 WiFi 数据库。"

**第二步：迭代优化**

AI 给出第一版后，我开始 "Vibe" 起来——不看代码，只看效果，然后继续用自然语言提需求：

- "加个暗色模式切换"

- "手机端底部加导航栏"

- "密码复制成功后给个震动反馈"

- "数据库补充一下日本和韩国的"

- "加上贵宾室的 WiFi 密码，这个很有价值"

每一轮迭代大概只需要一两句话，AI 就能理解并实现。从需求描述到最终成品，整个过程大约 **30 分钟**。

**第三步：验证和使用**

最终产出的是一个 959 行的单 HTML 文件。我把它保存到手机浏览器书签里，出门在外随时打开就能用。

### Vibe Coding 的核心体验

很多人问我：Vibe Coding 和传统写代码到底有什么区别？

我的感受是：**传统编程是"我知道怎么实现"，Vibe Coding 是"我知道我要什么"。** 你不需要知道 CSS Grid 怎么写、localStorage API 怎么调用、事件委托怎么处理——你只需要清楚地描述你想要的最终效果。

这对非程序员来说是一个巨大的解放。但即使你是程序员，Vibe Coding 也能让你把精力集中在产品设计和用户体验上，而不是纠结于语法和调试。

当然，Vibe Coding 也有它的边界。这个项目之所以适合 Vibe Coding，是因为它满足几个条件：纯前端、单文件、逻辑相对简单、不涉及后端服务。如果你要做一个需要用户系统、数据库、支付的复杂应用，纯 Vibe Coding 目前还不够。

### 📥下载使用

我把完整的 HTML 文件放在这里了，你可以直接下载保存到手机或电脑上使用：

[wifi-finder.html](https://hyphentech.top/obsidian-assets/wifi-finder-vibe-coding/file-01-wifi-finder-68d9c86c73.html)

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"
    />
    <meta name="theme-color" content="#0a0a14" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta
      name="apple-mobile-web-app-status-bar-style"
      content="black-translucent"
    />
    <title>WiFi Finder - Global Public WiFi Database | HyphenTech</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      :root{
      --bg:#0a0a14;--bg2:#12121f;--bg3:#1a1a2e;--bg4:#22223a;
      --cyan:#00f0ff;--purple:#b44aff;--pink:#ff2d95;--green:#00ff88;--yellow:#ffd000;
      --text:#e0e0f0;--text2:#8888aa;--text3:#555570;
      --glow-cyan:0 0 20px rgba(0,240,255,.3);
      --glow-purple:0 0 20px rgba(180,74,255,.3);
      --radius:12px;
      }
      body{background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Microsoft YaHei',sans-serif;min-height:100vh;overflow-x:hidden}
      body.light{--bg:#f0f2f8;--bg2:#fff;--bg3:#e8eaf0;--bg4:#d8dae0;--text:#1a1a2e;--text2:#666;--text3:#999;--glow-cyan:0 0 10px rgba(0,180,200,.15);--glow-purple:0 0 10px rgba(140,60,200,.15)}

      /* Scrollbar */
      ::-webkit-scrollbar{width:6px}
      ::-webkit-scrollbar-track{background:var(--bg)}
      ::-webkit-scrollbar-thumb{background:var(--bg4);border-radius:3px}

      /* Scan line overlay */
      body::after{content:'';position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;
      background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.03) 2px,rgba(0,0,0,.03) 4px);opacity:.5}
      body.light::after{opacity:.15}

      /* Header */
      .header{position:sticky;top:0;z-index:100;background:rgba(10,10,20,.85);backdrop-filter:blur(20px);border-bottom:1px solid rgba(0,240,255,.1);padding:12px 16px}
      body.light .header{background:rgba(240,242,248,.9);border-bottom-color:rgba(0,180,200,.15)}
      .header-inner{max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:12px;flex-wrap:wrap}
      .logo{display:flex;align-items:center;gap:8px;font-size:20px;font-weight:700;white-space:nowrap}
      .logo-icon{width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,var(--cyan),var(--purple));display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:var(--glow-cyan)}
      .logo span{background:linear-gradient(90deg,var(--cyan),var(--purple));-webkit-background-clip:text;-webkit-text-fill-color:transparent}

      /* Search */
      .search-wrap{flex:1;min-width:200px;position:relative}
      .search-wrap input{width:100%;padding:10px 16px 10px 40px;border-radius:24px;border:1px solid var(--bg4);background:var(--bg2);color:var(--text);font-size:15px;outline:none;transition:.3s}
      .search-wrap input:focus{border-color:var(--cyan);box-shadow:var(--glow-cyan)}
      .search-wrap .icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--text3);font-size:16px}

      /* Header buttons */
      .hdr-btns{display:flex;gap:8px}
      .hdr-btn{width:36px;height:36px;border-radius:10px;border:1px solid var(--bg4);background:var(--bg2);color:var(--text2);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;transition:.2s}
      .hdr-btn:hover{border-color:var(--cyan);color:var(--cyan)}
      .hdr-btn.active{background:var(--cyan);color:var(--bg);border-color:var(--cyan)}

      /* Stats bar */
      .stats-bar{max-width:1200px;margin:12px auto 0;padding:0 16px;display:flex;gap:16px;flex-wrap:wrap;font-size:13px;color:var(--text2)}
      .stat{display:flex;align-items:center;gap:4px}
      .stat b{color:var(--cyan);font-weight:600}

      /* Tabs / Filters */
      .filters{max-width:1200px;margin:12px auto 0;padding:0 16px;display:flex;gap:8px;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none}
      .filters::-webkit-scrollbar{display:none}
      .tab{padding:6px 14px;border-radius:20px;border:1px solid var(--bg4);background:var(--bg2);color:var(--text2);cursor:pointer;font-size:13px;white-space:nowrap;transition:.2s;user-select:none}
      .tab:hover{border-color:var(--cyan);color:var(--text)}
      .tab.active{background:linear-gradient(135deg,var(--cyan),var(--purple));color:#fff;border-color:transparent;font-weight:600}

      /* Region filter */
      .region-bar{max-width:1200px;margin:8px auto 0;padding:0 16px;display:flex;gap:6px;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none}
      .region-bar::-webkit-scrollbar{display:none}
      .rtab{padding:4px 10px;border-radius:14px;border:1px solid var(--bg4);background:transparent;color:var(--text3);cursor:pointer;font-size:12px;white-space:nowrap;transition:.2s}
      .rtab:hover{color:var(--text2);border-color:var(--text3)}
      .rtab.active{background:var(--bg4);color:var(--text);border-color:var(--text2)}

      /* Card Grid */
      .grid{max-width:1200px;margin:16px auto;padding:0 16px;display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:12px}
      @media(max-width:400px){.grid{grid-template-columns:1fr}}

      /* Card */
      .card{background:var(--bg2);border:1px solid var(--bg4);border-radius:var(--radius);padding:16px;cursor:pointer;transition:.25s;position:relative;overflow:hidden}
      .card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--cyan),var(--purple));opacity:0;transition:.3s}
      .card:hover{border-color:rgba(0,240,255,.3);transform:translateY(-2px);box-shadow:var(--glow-cyan)}
      .card:hover::before{opacity:1}
      .card-head{display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:10px}
      .card-brand{font-size:15px;font-weight:600;line-height:1.3}
      .card-brand small{font-weight:400;color:var(--text2);font-size:12px;display:block;margin-top:2px}
      .card-badge{padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600;white-space:nowrap;flex-shrink:0}
      .badge-password{background:rgba(0,255,136,.12);color:var(--green)}
      .badge-portal{background:rgba(255,208,0,.12);color:var(--yellow)}
      .badge-open{background:rgba(0,240,255,.12);color:var(--cyan)}
      .badge-sms{background:rgba(255,45,149,.12);color:var(--pink)}

      .card-row{display:flex;align-items:center;gap:8px;margin-bottom:6px;font-size:13px}
      .card-row .label{color:var(--text3);min-width:44px;flex-shrink:0}
      .card-row .val{color:var(--text);word-break:break-all}

      .ssid-val{font-family:'SF Mono','Fira Code','Cascadia Code',monospace;color:var(--cyan)!important;font-size:13px}
      .pwd-wrap{display:flex;align-items:center;gap:6px;flex:1;min-width:0}
      .pwd-val{font-family:'SF Mono','Fira Code','Cascadia Code',monospace;color:var(--green)!important;font-size:14px;font-weight:600;letter-spacing:.5px}
      .copy-btn{width:28px;height:28px;border-radius:8px;border:1px solid var(--bg4);background:var(--bg3);color:var(--text2);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;transition:.2s}
      .copy-btn:hover{border-color:var(--green);color:var(--green)}
      .copy-btn.copied{background:var(--green);color:var(--bg);border-color:var(--green)}

      .card-tips{font-size:12px;color:var(--text2);margin-top:8px;padding-top:8px;border-top:1px solid var(--bg3);line-height:1.5}
      .card-region{position:absolute;top:14px;right:14px;font-size:18px}
      .card-meta{display:flex;gap:12px;margin-top:8px;font-size:11px;color:var(--text3)}

      /* Empty state */
      .empty{text-align:center;padding:60px 20px;color:var(--text3)}
      .empty .icon{font-size:48px;margin-bottom:12px}
      .empty p{font-size:14px}

      /* Modal */
      .modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.6);backdrop-filter:blur(4px);z-index:200;display:none;align-items:center;justify-content:center;padding:16px}
      .modal-overlay.show{display:flex}
      .modal{background:var(--bg2);border:1px solid var(--bg4);border-radius:16px;padding:24px;max-width:500px;width:100%;max-height:85vh;overflow-y:auto;position:relative}
      .modal h3{font-size:18px;margin-bottom:16px;display:flex;align-items:center;gap:8px}
      .modal-close{position:absolute;top:16px;right:16px;width:32px;height:32px;border-radius:8px;border:none;background:var(--bg3);color:var(--text2);cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center}
      .modal-close:hover{color:var(--text)}

      /* Form */
      .form-group{margin-bottom:14px}
      .form-group label{display:block;font-size:13px;color:var(--text2);margin-bottom:4px}
      .form-group input,.form-group select,.form-group textarea{width:100%;padding:8px 12px;border-radius:8px;border:1px solid var(--bg4);background:var(--bg3);color:var(--text);font-size:14px;outline:none}
      .form-group input:focus,.form-group select:focus,.form-group textarea:focus{border-color:var(--cyan)}
      .form-group textarea{resize:vertical;min-height:60px}
      .form-actions{display:flex;gap:8px;margin-top:16px}
      .btn{padding:10px 20px;border-radius:10px;border:none;font-size:14px;font-weight:600;cursor:pointer;transition:.2s}
      .btn-primary{background:linear-gradient(135deg,var(--cyan),var(--purple));color:#fff}
      .btn-primary:hover{opacity:.9;transform:scale(1.02)}
      .btn-ghost{background:var(--bg3);color:var(--text2);border:1px solid var(--bg4)}
      .btn-ghost:hover{border-color:var(--text3);color:var(--text)}

      /* Toast */
      .toast{position:fixed;bottom:80px;left:50%;transform:translateX(-50%) translateY(100px);background:var(--green);color:#000;padding:10px 20px;border-radius:10px;font-size:14px;font-weight:600;z-index:300;opacity:0;transition:.3s;pointer-events:none}
      .toast.show{transform:translateX(-50%) translateY(0);opacity:1}

      /* Footer nav (mobile) */
      .footer-nav{position:fixed;bottom:0;left:0;right:0;background:rgba(10,10,20,.95);backdrop-filter:blur(20px);border-top:1px solid var(--bg4);display:none;z-index:100;padding-bottom:env(safe-area-inset-bottom)}
      body.light .footer-nav{background:rgba(240,242,248,.95)}
      @media(max-width:768px){.footer-nav{display:flex}.grid{margin-bottom:80px}}
      .footer-nav button{flex:1;padding:10px 0 8px;border:none;background:none;color:var(--text3);font-size:10px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px;transition:.2s}
      .footer-nav button .fi{font-size:20px}
      .footer-nav button.active{color:var(--cyan)}

      /* Import/Export modal */
      .ie-area{width:100%;min-height:120px;padding:10px;border-radius:8px;border:1px solid var(--bg4);background:var(--bg3);color:var(--text);font-family:monospace;font-size:12px;resize:vertical}

      /* Animations */
      @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
      .card{animation:fadeIn .3s ease both}
      .card:nth-child(2){animation-delay:.03s}
      .card:nth-child(3){animation-delay:.06s}
      .card:nth-child(4){animation-delay:.09s}
      .card:nth-child(5){animation-delay:.12s}
      .card:nth-child(6){animation-delay:.15s}

      @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
      .scanning{animation:pulse 1.5s infinite}

      /* Copyright footer */
      .copyright{max-width:1200px;margin:32px auto 16px;padding:0 16px;text-align:center;font-size:12px;color:var(--text3);line-height:1.8}
      .copyright a{color:var(--cyan);text-decoration:none;opacity:.7;transition:.2s}
      .copyright a:hover{opacity:1;text-decoration:underline}
      @media(max-width:768px){.copyright{margin-bottom:80px}}

      /* Print */
      @media print{.header,.footer-nav,.modal-overlay,.copyright{display:none!important}.card{break-inside:avoid}}
    </style>
  </head>
  <body>
    <!-- Header -->
    <div class="header">
      <div class="header-inner">
        <div class="logo">
          <div class="logo-icon">&#x1F4F6;</div>
          <span>WiFi Finder</span>
        </div>
        <div class="search-wrap">
          <span class="icon">&#x1F50D;</span>
          <input
            id="searchInput"
            type="text"
            placeholder="Search brand, SSID, city, password..."
          />
        </div>
        <div class="hdr-btns">
          <button
            class="hdr-btn"
            onclick="toggleTheme()"
            title="Toggle theme"
            id="themeBtn"
          >
            &#x1F319;
          </button>
          <button
            class="hdr-btn"
            onclick="showModal('contribute')"
            title="Contribute WiFi"
          >
            &#x2795;
          </button>
          <button
            class="hdr-btn"
            onclick="showModal('importexport')"
            title="Import/Export"
          >
            &#x1F4BE;
          </button>
        </div>
      </div>
      <div class="stats-bar">
        <span class="stat"
          >&#x1F4CA; <b id="totalCount">0</b>&nbsp;entries</span
        >
        <span class="stat"
          >&#x1F30D; <b id="regionCount">0</b>&nbsp;regions</span
        >
        <span class="stat"
          >&#x1F512; <b id="pwdCount">0</b>&nbsp;passwords</span
        >
        <span class="stat"
          >&#x1F465; <b id="userCount">0</b>&nbsp;user-added</span
        >
      </div>
    </div>

    <!-- Category tabs -->
    <div class="filters" id="categoryTabs"></div>
    <!-- Region tabs -->
    <div class="region-bar" id="regionTabs"></div>

    <!-- Card grid -->
    <div class="grid" id="grid"></div>

    <!-- Empty state -->
    <div class="empty" id="empty" style="display:none">
      <div class="icon">&#x1F50D;</div>
      <p>No results found. Try a different search or filter.</p>
    </div>

    <!-- Contribute Modal -->
    <div class="modal-overlay" id="modal-contribute">
      <div class="modal">
        <button class="modal-close" onclick="hideModal('contribute')">
          &#x2715;
        </button>
        <h3>&#x2795; Contribute WiFi</h3>
        <div class="form-group">
          <label>Brand / Place *</label
          ><input id="f-brand" placeholder="e.g. Starbucks" />
        </div>
        <div class="form-group">
          <label>SSID *</label
          ><input id="f-ssid" placeholder="WiFi network name" />
        </div>
        <div class="form-group">
          <label>Password</label
          ><input id="f-pwd" placeholder="Leave empty if open/portal" />
        </div>
        <div class="form-group">
          <label>Auth Type</label>
          <select id="f-auth">
            <option value="password">Password</option>
            <option value="open">Open (no password)</option>
            <option value="portal">Portal (web login)</option>
            <option value="sms">SMS verification</option>
          </select>
        </div>
        <div class="form-group">
          <label>Category</label>
          <select id="f-cat">
            <option value="cafe">Cafe / Coffee</option>
            <option value="fastfood">Fast Food</option>
            <option value="restaurant">Restaurant</option>
            <option value="hotel">Hotel</option>
            <option value="airport">Airport</option>
            <option value="transit">Transit</option>
            <option value="mall">Mall / Retail</option>
            <option value="public">Public Facility</option>
            <option value="cowork">Coworking</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="form-group">
          <label>Region</label>
          <select id="f-region">
            <option value="CN">China</option>
            <option value="HK">Hong Kong</option>
            <option value="JP">Japan</option>
            <option value="KR">Korea</option>
            <option value="SG">Singapore</option>
            <option value="TH">Thailand</option>
            <option value="MY">Malaysia</option>
            <option value="VN">Vietnam</option>
            <option value="IN">India</option>
            <option value="US">USA</option>
            <option value="CA">Canada</option>
            <option value="GB">UK</option>
            <option value="FR">France</option>
            <option value="DE">Germany</option>
            <option value="AU">Australia</option>
            <option value="AE">UAE</option>
            <option value="GLOBAL">Global / Multiple</option>
          </select>
        </div>
        <div class="form-group">
          <label>City</label
          ><input id="f-city" placeholder="* for nationwide" />
        </div>
        <div class="form-group">
          <label>Tips / Notes</label
          ><textarea id="f-tips" placeholder="Any useful info..."></textarea>
        </div>
        <div class="form-actions">
          <button class="btn btn-primary" onclick="submitContrib()">
            Save
          </button>
          <button class="btn btn-ghost" onclick="hideModal('contribute')">
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Import/Export Modal -->
    <div class="modal-overlay" id="modal-importexport">
      <div class="modal">
        <button class="modal-close" onclick="hideModal('importexport')">
          &#x2715;
        </button>
        <h3>&#x1F4BE; Import / Export Data</h3>
        <div class="form-actions" style="margin-top:0;margin-bottom:14px">
          <button class="btn btn-primary" onclick="exportData()">
            Export All
          </button>
          <button class="btn btn-ghost" onclick="exportUserData()">
            Export User Data
          </button>
          <button class="btn btn-ghost" onclick="importData()">Import</button>
        </div>
        <textarea
          class="ie-area"
          id="ie-data"
          placeholder="Paste JSON here to import, or click Export to see data..."
        ></textarea>
      </div>
    </div>

    <!-- Copyright -->
    <div class="copyright">
      &copy; 2026
      <a href="https://hyphentech.top" target="_blank" rel="noopener"
        >hyphentech.top</a
      >
      | All Rights Reserved<br />
    </div>

    <!-- Toast -->
    <div class="toast" id="toast"></div>

    <!-- Footer nav -->
    <div class="footer-nav">
      <button class="active" onclick="setView('all',this)">
        <span class="fi">&#x1F4F6;</span>All
      </button>
      <button onclick="setView('password',this)">
        <span class="fi">&#x1F511;</span>Passwords
      </button>
      <button onclick="showModal('contribute')">
        <span class="fi">&#x2795;</span>Add
      </button>
      <button onclick="setView('user',this)">
        <span class="fi">&#x1F465;</span>Mine
      </button>
      <button onclick="showModal('importexport')">
        <span class="fi">&#x1F4BE;</span>Data
      </button>
    </div>

    <script>
      // ==================== WIFI DATABASE ====================
      const WIFI_DB = [
      // ===== CHINA - COFFEE/TEA =====
      {id:"cn-luckin-1",brand:"Luckin Coffee",brandZh:"瑞幸咖啡",ssid:["Luckin Coffee"],password:"luckin123",auth:"password",category:"cafe",region:"CN",city:"*",tips:"Most common password across stores",updated:"2025"},
      {id:"cn-luckin-2",brand:"Luckin Coffee",brandZh:"瑞幸咖啡",ssid:["Luckin Coffee"],password:"luckin123456",auth:"password",category:"cafe",region:"CN",city:"*",tips:"Alternative password in some stores",updated:"2025"},
      {id:"cn-luckin-3",brand:"Luckin Coffee",brandZh:"瑞幸咖啡",ssid:["Luckin Coffee"],password:"stnt819",auth:"password",category:"cafe",region:"CN",city:"*",tips:"Seen in some locations, passwords rotate every 3 months",updated:"2025"},
      {id:"cn-heytea",brand:"HEYTEA",brandZh:"喜茶",ssid:["HEYTEA","HEYTEA_5G"],password:"zsttsftsng",auth:"password",category:"cafe",region:"CN",city:"*",tips:"Relatively consistent password across stores",updated:"2025"},
      {id:"cn-nayuki",brand:"Nayuki",brandZh:"奈雪的茶",ssid:["NaixueVip","Nayuki"],password:"ykhcykrob",auth:"password",category:"cafe",region:"CN",city:"*",tips:"一口好茶一口软欧包 (yi kou hao cha yi kou ruan ou bao) initials",updated:"2025"},
      {id:"cn-bawangchaji",brand:"Chagee",brandZh:"霸王茶姬",ssid:["霸王茶姬","BWCJ"],password:"bwcj1117",auth:"password",category:"cafe",region:"CN",city:"*",tips:"Brand founding date Nov 17",updated:"2025"},
      {id:"cn-mixue-1",brand:"Mixue Bingcheng",brandZh:"蜜雪冰城",ssid:["蜜雪冰城","MXBC"],password:"mxbc1997",auth:"password",category:"cafe",region:"CN",city:"*",tips:"Brand founded in 1997",updated:"2025"},
      {id:"cn-mixue-2",brand:"Mixue Bingcheng",brandZh:"蜜雪冰城",ssid:["蜜雪冰城","MXBC"],password:"mxbc8888",auth:"password",category:"cafe",region:"CN",city:"*",tips:"Alternative lucky number password",updated:"2025"},
      {id:"cn-guming-1",brand:"Gu Ming",brandZh:"古茗",ssid:["古茗","GUMING"],password:"GUMING123",auth:"password",category:"cafe",region:"CN",city:"*",tips:"Brand name + 123",updated:"2025"},
      {id:"cn-guming-2",brand:"Gu Ming",brandZh:"古茗",ssid:["古茗","GUMING"],password:"goodme123",auth:"password",category:"cafe",region:"CN",city:"*",tips:"English name variant",updated:"2025"},
      {id:"cn-cotti",brand:"Cotti Coffee",brandZh:"库迪咖啡",ssid:["CottiCoffee","库迪咖啡"],password:"Cotti123",auth:"password",category:"cafe",region:"CN",city:"*",tips:"Brand name + 123",updated:"2025"},
      {id:"cn-chabaidao",brand:"Cha Bai Dao",brandZh:"茶百道",ssid:["茶百道","CBD"],password:"bhqf2356",auth:"password",category:"cafe",region:"CN",city:"*",tips:"Internal code",updated:"2025"},
      {id:"cn-molinai",brand:"Moli Naibai",brandZh:"茉莉奶白",ssid:["茉莉奶白"],password:"xiaomoli2022",auth:"password",category:"cafe",region:"CN",city:"*",tips:"小茉莉2022",updated:"2025"},
      {id:"cn-molinai-2",brand:"Moli Naibai",brandZh:"茉莉奶白",ssid:["茉莉奶白"],password:"88888888",auth:"password",category:"cafe",region:"CN",city:"*",tips:"Alternative lucky 8s password",updated:"2025"},
      {id:"cn-costa",brand:"Costa Coffee",brandZh:"Costa咖啡",ssid:["Costa","CostaCoffee"],password:"costa123",auth:"password",category:"cafe",region:"CN",city:"*",tips:"Simple brand + 123",updated:"2025"},
      {id:"cn-starbucks",brand:"Starbucks",brandZh:"星巴克",ssid:["CMCC-Starbucks","Starbucks"],password:"",auth:"portal",category:"cafe",region:"CN",city:"*",tips:"Phone number registration + SMS code via portal page",updated:"2025"},
      {id:"cn-manner",brand:"Manner Coffee",brandZh:"Manner咖啡",ssid:["Manner","MannerCoffee"],password:"manner123",auth:"password",category:"cafe",region:"CN",city:"*",tips:"Ask staff for current password, varies by store",updated:"2025"},
      {id:"cn-tims",brand:"Tim Hortons",brandZh:"Tims咖啡",ssid:["TimsCoffee","Tims"],password:"tims1234",auth:"password",category:"cafe",region:"CN",city:"*",tips:"May vary by location",updated:"2025"},
      {id:"cn-pacific",brand:"Pacific Coffee",brandZh:"太平洋咖啡",ssid:["PacificCoffee"],password:"",auth:"portal",category:"cafe",region:"CN",city:"*",tips:"Portal-based, accept terms",updated:"2025"},
      {id:"cn-yidiandian",brand:"Yi Dian Dian",brandZh:"一点点",ssid:["一点点"],password:"1dd12345",auth:"password",category:"cafe",region:"CN",city:"*",tips:"May vary by franchise",updated:"2025"},
      {id:"cn-shuyi",brand:"Shuyi Shaoxiancao",brandZh:"书亦烧仙草",ssid:["书亦烧仙草"],password:"shuyi666",auth:"password",category:"cafe",region:"CN",city:"*",tips:"Brand name + lucky number",updated:"2025"},
      {id:"cn-7fenchatang",brand:"7 Fen Tian",brandZh:"七分甜",ssid:["七分甜"],password:"qifentian",auth:"password",category:"cafe",region:"CN",city:"*",tips:"Brand pinyin",updated:"2025"},
      {id:"cn-yihetang",brand:"Yi He Tang",brandZh:"益禾堂",ssid:["益禾堂","YHT"],password:"yihetang",auth:"password",category:"cafe",region:"CN",city:"*",tips:"Brand pinyin",updated:"2025"},
      {id:"cn-chayan",brand:"Cha Yan Yue Se",brandZh:"茶颜悦色",ssid:["茶颜悦色"],password:"chayanyuese",auth:"password",category:"cafe",region:"CN",city:"Changsha",tips:"Changsha-based brand, pinyin password",updated:"2025"},
      {id:"cn-lelecha",brand:"Le Le Cha",brandZh:"乐乐茶",ssid:["乐乐茶","LELECHA"],password:"lelecha1",auth:"password",category:"cafe",region:"CN",city:"*",tips:"Brand name + 1",updated:"2025"},
      {id:"cn-nowwa",brand:"Nowwa Coffee",brandZh:"挪瓦咖啡",ssid:["Nowwa"],password:"nowwa123",auth:"password",category:"cafe",region:"CN",city:"*",tips:"Brand + 123",updated:"2025"},

      // ===== CHINA - FAST FOOD =====
      {id:"cn-mcd",brand:"McDonald's",brandZh:"麦当劳",ssid:["McDonald-OC"],password:"Ac28Idfjla92ifjsl3jsHdowIo",auth:"password",category:"fastfood",region:"CN",city:"*",tips:"Hidden SSID - must add manually. Note: l=lowercase L, o=letter O not zero. Some stores switched to SMS auth.",updated:"2025"},
      {id:"cn-kfc",brand:"KFC",brandZh:"肯德基",ssid:["KFC FREE WIFI"],password:"",auth:"sms",category:"fastfood",region:"CN",city:"*",tips:"Phone number + SMS verification code via portal page",updated:"2025"},
      {id:"cn-pizzahut",brand:"Pizza Hut",brandZh:"必胜客",ssid:["PizzaHut","必胜客WiFi"],password:"pizza789",auth:"password",category:"fastfood",region:"CN",city:"*",tips:"May vary by store",updated:"2025"},
      {id:"cn-tastien",brand:"Tastien",brandZh:"塔斯汀",ssid:["塔斯汀","TASTIEN"],password:"88888888",auth:"password",category:"fastfood",region:"CN",city:"*",tips:"Lucky 8s - very common default",updated:"2025"},
      {id:"cn-wallace",brand:"Wallace",brandZh:"华莱士",ssid:["华莱士","Wallace"],password:"12345678",auth:"password",category:"fastfood",region:"CN",city:"*",tips:"Simple numeric password, varies by franchise",updated:"2025"},
      {id:"cn-zhengxin",brand:"Zhengxin Chicken",brandZh:"正新鸡排",ssid:["正新鸡排"],password:"zhengxin1",auth:"password",category:"fastfood",region:"CN",city:"*",tips:"Brand + 1",updated:"2025"},
      {id:"cn-dicos",brand:"Dicos",brandZh:"德克士",ssid:["Dicos","德克士WiFi"],password:"dicos123",auth:"password",category:"fastfood",region:"CN",city:"*",tips:"Brand + 123",updated:"2025"},
      {id:"cn-burger-king",brand:"Burger King",brandZh:"汉堡王",ssid:["BurgerKing","汉堡王"],password:"",auth:"portal",category:"fastfood",region:"CN",city:"*",tips:"Portal authentication in most stores",updated:"2025"},

      // ===== CHINA - RESTAURANTS =====
      {id:"cn-laoxiangji",brand:"Lao Xiang Ji",brandZh:"老乡鸡",ssid:["老乡鸡","LaoxiangJi"],password:"ganjingweisheng",auth:"password",category:"restaurant",region:"CN",city:"*",tips:"干净卫生 (clean & hygienic) - brand slogan in pinyin",updated:"2025"},
      {id:"cn-micun",brand:"Mi Cun Ban Fan",brandZh:"米村拌饭",ssid:["米村拌饭","MiCun"],password:"woaimicun",auth:"password",category:"restaurant",region:"CN",city:"*",tips:"我爱米村 (I love Micun) in pinyin",updated:"2025"},
      {id:"cn-bantianyao",brand:"Ban Tian Yao",brandZh:"半天妖",ssid:["半天妖"],password:"bantianyao",auth:"password",category:"restaurant",region:"CN",city:"*",tips:"Brand pinyin",updated:"2025"},
      {id:"cn-xibei",brand:"Xibei",brandZh:"西贝莜面村",ssid:["西贝","XIBEI"],password:"15880529",auth:"password",category:"restaurant",region:"CN",city:"*",tips:"Some stores use this, not universal. Ask staff.",updated:"2025"},
      {id:"cn-haidilao",brand:"Haidilao",brandZh:"海底捞",ssid:["海底捞","Haidilao"],password:"",auth:"password",category:"restaurant",region:"CN",city:"*",tips:"No universal password - ask your server. Different per store.",updated:"2025"},
      {id:"cn-xiabuxiabu",brand:"Xiabu Xiabu",brandZh:"呷哺呷哺",ssid:["呷哺呷哺"],password:"xiabuxiabu",auth:"password",category:"restaurant",region:"CN",city:"*",tips:"Brand pinyin",updated:"2025"},
      {id:"cn-yangguofu",brand:"Yang Guo Fu Malatang",brandZh:"杨国福麻辣烫",ssid:["杨国福","YGF"],password:"yangguofu",auth:"password",category:"restaurant",region:"CN",city:"*",tips:"Brand pinyin",updated:"2025"},
      {id:"cn-zhangliangmlt",brand:"Zhang Liang Malatang",brandZh:"张亮麻辣烫",ssid:["张亮麻辣烫"],password:"zhangliang",auth:"password",category:"restaurant",region:"CN",city:"*",tips:"Brand pinyin",updated:"2025"},
      {id:"cn-manzu",brand:"Man Zu Fan",brandZh:"满足饭",ssid:["满足饭"],password:"88888888",auth:"password",category:"restaurant",region:"CN",city:"*",tips:"Lucky 8s default",updated:"2025"},
      {id:"cn-juewei",brand:"Juewei Duck Neck",brandZh:"绝味鸭脖",ssid:["绝味"],password:"juewei123",auth:"password",category:"restaurant",region:"CN",city:"*",tips:"Brand + 123",updated:"2025"},
      {id:"cn-luckyhunan",brand:"Feichangxiang",brandZh:"费大厨辣椒炒肉",ssid:["费大厨"],password:"feidachu1",auth:"password",category:"restaurant",region:"CN",city:"*",tips:"Brand pinyin + 1",updated:"2025"},
      {id:"cn-nayou",brand:"Nayou Ramen",brandZh:"那有拉面",ssid:["那有拉面"],password:"nayou123",auth:"password",category:"restaurant",region:"CN",city:"*",tips:"Brand + 123",updated:"2025"},
      {id:"cn-tongxianghui",brand:"Tong Xiang Hui",brandZh:"同享荟",ssid:["同享荟"],password:"88888888",auth:"password",category:"restaurant",region:"CN",city:"*",tips:"Common 8s password",updated:"2025"},
      {id:"cn-wuming",brand:"Wu Ming Fen",brandZh:"无名粉",ssid:["无名粉"],password:"wumingfen",auth:"password",category:"restaurant",region:"CN",city:"*",tips:"Brand pinyin",updated:"2025"},
      {id:"cn-laoyuchun",brand:"Lao Yu Chun",brandZh:"老于春",ssid:["老于春"],password:"laoyuchun",auth:"password",category:"restaurant",region:"CN",city:"*",tips:"Brand pinyin",updated:"2025"},
      {id:"cn-xiaoyang",brand:"Xiao Yang Sheng Jian",brandZh:"小杨生煎",ssid:["小杨生煎"],password:"xysj1234",auth:"password",category:"restaurant",region:"CN",city:"*",tips:"Brand abbreviation + 1234",updated:"2025"},
      {id:"cn-yonghe",brand:"Yonghe King",brandZh:"永和大王",ssid:["永和大王","YongheKing"],password:"yonghe123",auth:"password",category:"restaurant",region:"CN",city:"*",tips:"Brand + 123",updated:"2025"},
      {id:"cn-kungfu",brand:"Real Kungfu",brandZh:"真功夫",ssid:["真功夫","ZGF"],password:"zhengongfu",auth:"password",category:"restaurant",region:"CN",city:"*",tips:"Brand pinyin",updated:"2025"},
      {id:"cn-caidian",brand:"Cai Dian",brandZh:"菜店",ssid:["菜店WiFi"],password:"12345678",auth:"password",category:"restaurant",region:"CN",city:"*",tips:"Common simple password",updated:"2025"},
      {id:"cn-grilledfish",brand:"Tan Shao",brandZh:"探鱼",ssid:["探鱼"],password:"tanyu2015",auth:"password",category:"restaurant",region:"CN",city:"*",tips:"Brand + founding year",updated:"2025"},
      {id:"cn-tongderen",brand:"Tong De Ren",brandZh:"同德仁",ssid:["同德仁"],password:"tongderen",auth:"password",category:"restaurant",region:"CN",city:"*",tips:"Brand pinyin",updated:"2025"},

      // ===== CHINA - BOOKSTORE / CULTURE =====
      {id:"cn-sisyphe",brand:"Sisyphe Books",brandZh:"西西弗书店",ssid:["SISYPHE","西西弗"],password:"sysphe1993",auth:"password",category:"other",region:"CN",city:"*",tips:"Brand abbreviation + founding year 1993",updated:"2025"},
      {id:"cn-fandeng",brand:"Fan Deng Reading",brandZh:"樊登读书",ssid:["樊登读书"],password:"fandeng66",auth:"password",category:"other",region:"CN",city:"*",tips:"Brand + 66",updated:"2025"},
      {id:"cn-zhongshuge",brand:"Zhongshu Ge",brandZh:"钟书阁",ssid:["钟书阁"],password:"zhongshuge",auth:"password",category:"other",region:"CN",city:"*",tips:"Brand pinyin",updated:"2025"},
      {id:"cn-yanji",brand:"Yan Ji You",brandZh:"言几又",ssid:["言几又","YanJiYou"],password:"yanjiyou1",auth:"password",category:"other",region:"CN",city:"*",tips:"Brand pinyin + 1",updated:"2025"},

      // ===== CHINA - HOTELS =====
      {id:"cn-hanting",brand:"Hanting Hotel",brandZh:"汉庭酒店",ssid:["Hanting","汉庭WiFi"],password:"88888888",auth:"password",category:"hotel",region:"CN",city:"*",tips:"Common default. Check room card or hallway signs. Some use phone verification.",updated:"2025"},
      {id:"cn-homeinns",brand:"Home Inn",brandZh:"如家酒店",ssid:["HomeInn","如家WiFi"],password:"4008203333",auth:"password",category:"hotel",region:"CN",city:"*",tips:"Customer service hotline. Also check order card in room. Some use portal.",updated:"2025"},
      {id:"cn-ji-lobby",brand:"Ji Hotel (lobby)",brandZh:"全季酒店(大堂)",ssid:["JiHotel","全季WiFi"],password:"7777777",auth:"password",category:"hotel",region:"CN",city:"*",tips:"Lobby WiFi. Can also use phone portal auth.",updated:"2025"},
      {id:"cn-ji-room",brand:"Ji Hotel (room)",brandZh:"全季酒店(客房)",ssid:["JiHotel_Room"],password:"(room number)",auth:"password",category:"hotel",region:"CN",city:"*",tips:"Room WiFi password = your room number",updated:"2025"},
      {id:"cn-7days",brand:"7 Days Inn",brandZh:"7天酒店",ssid:["7DaysInn","7天WiFi"],password:"77777777",auth:"password",category:"hotel",region:"CN",city:"*",tips:"Lucky 7s. May differ by franchise.",updated:"2025"},
      {id:"cn-jinjiang",brand:"Jinjiang Inn",brandZh:"锦江之星",ssid:["JinjiangInn","锦江之星"],password:"4008209999",auth:"password",category:"hotel",region:"CN",city:"*",tips:"Hotline number. Fairly consistent north & south.",updated:"2025"},
      {id:"cn-huazhu",brand:"Huazhu Group",brandZh:"华住集团",ssid:["Huazhu","华住WiFi"],password:"",auth:"portal",category:"hotel",region:"CN",city:"*",tips:"Portal auth: room number + surname. Switch to English interface to skip phone verification.",updated:"2025"},
      {id:"cn-atour",brand:"Atour Hotel",brandZh:"亚朵酒店",ssid:["Atour","亚朵WiFi"],password:"",auth:"portal",category:"hotel",region:"CN",city:"*",tips:"Get credentials via Atour app after check-in, or ask front desk",updated:"2025"},
      {id:"cn-greentree",brand:"GreenTree Inn",brandZh:"格林豪泰",ssid:["GreenTree","格林WiFi"],password:"12345678",auth:"password",category:"hotel",region:"CN",city:"*",tips:"Common simple password, ask front desk",updated:"2025"},
      {id:"cn-viennahotel",brand:"Vienna Hotel",brandZh:"维也纳酒店",ssid:["Vienna","维也纳WiFi"],password:"88888888",auth:"password",category:"hotel",region:"CN",city:"*",tips:"Lucky 8s, may vary",updated:"2025"},
      {id:"cn-ibis",brand:"Ibis Hotel",brandZh:"宜必思酒店",ssid:["ibis","宜必思WiFi"],password:"",auth:"portal",category:"hotel",region:"CN",city:"*",tips:"Portal: room + name. Part of Accor group.",updated:"2025"},
      {id:"cn-orangehotel",brand:"Orange Hotel",brandZh:"桔子酒店",ssid:["OrangeHotel"],password:"12345678",auth:"password",category:"hotel",region:"CN",city:"*",tips:"Ask front desk for current password",updated:"2025"},
      {id:"cn-podinns",brand:"Pod Inn",brandZh:"布丁酒店",ssid:["PodInn","布丁WiFi"],password:"12345678",auth:"password",category:"hotel",region:"CN",city:"*",tips:"Common default",updated:"2025"},
      {id:"cn-citycomfort",brand:"City Comfort Inn",brandZh:"城市便捷酒店",ssid:["CityComfort"],password:"88888888",auth:"password",category:"hotel",region:"CN",city:"*",tips:"Lucky 8s default",updated:"2025"},
      {id:"cn-thankyou",brand:"Thank You Hotel",brandZh:"感谢酒店",ssid:["IU","IU酒店"],password:"iuhotel1",auth:"password",category:"hotel",region:"CN",city:"*",tips:"IU Hotel brand + 1",updated:"2025"},
      {id:"cn-lavande",brand:"Lavande Hotel",brandZh:"丽枫酒店",ssid:["Lavande","丽枫WiFi"],password:"lavande1",auth:"password",category:"hotel",region:"CN",city:"*",tips:"Brand + 1",updated:"2025"},
      {id:"cn-fairyland",brand:"Fairy Land Hotel",brandZh:"童话酒店",ssid:["FairyLand"],password:"88888888",auth:"password",category:"hotel",region:"CN",city:"*",tips:"Lucky 8s",updated:"2025"},

      // ===== CHINA - AIRPORTS =====
      {id:"cn-pek",brand:"Beijing Capital Airport",brandZh:"北京首都机场",ssid:["Airport-Free-WiFi"],password:"",auth:"sms",category:"airport",region:"CN",city:"Beijing",tips:"SMS verification, 2-hour sessions",updated:"2025"},
      {id:"cn-pkx",brand:"Beijing Daxing Airport",brandZh:"北京大兴机场",ssid:["PKX-Free-WiFi"],password:"",auth:"sms",category:"airport",region:"CN",city:"Beijing",tips:"SMS verification",updated:"2025"},
      {id:"cn-pvg",brand:"Shanghai Pudong Airport",brandZh:"上海浦东机场",ssid:["Airport-Free-WiFi","#PVG-Free-WiFi"],password:"",auth:"sms",category:"airport",region:"CN",city:"Shanghai",tips:"SMS verification, portal login",updated:"2025"},
      {id:"cn-sha",brand:"Shanghai Hongqiao Airport",brandZh:"上海虹桥机场",ssid:["Airport-Free-WiFi"],password:"",auth:"sms",category:"airport",region:"CN",city:"Shanghai",tips:"SMS verification",updated:"2025"},
      {id:"cn-can",brand:"Guangzhou Baiyun Airport",brandZh:"广州白云机场",ssid:["CAN-Airport-WiFi"],password:"",auth:"sms",category:"airport",region:"CN",city:"Guangzhou",tips:"SMS verification, WeChat mini-program available",updated:"2025"},
      {id:"cn-szx",brand:"Shenzhen Baoan Airport",brandZh:"深圳宝安机场",ssid:["SZX-Airport-WiFi"],password:"",auth:"sms",category:"airport",region:"CN",city:"Shenzhen",tips:"SMS verification",updated:"2025"},
      {id:"cn-ctu",brand:"Chengdu Tianfu Airport",brandZh:"成都天府机场",ssid:["CTU-Free-WiFi"],password:"",auth:"sms",category:"airport",region:"CN",city:"Chengdu",tips:"SMS verification",updated:"2025"},
      {id:"cn-ckg",brand:"Chongqing Jiangbei Airport",brandZh:"重庆江北机场",ssid:["CKG-Free-WiFi"],password:"",auth:"sms",category:"airport",region:"CN",city:"Chongqing",tips:"SMS verification",updated:"2025"},
      {id:"cn-kmg",brand:"Kunming Changshui Airport",brandZh:"昆明长水机场",ssid:["KMG-Free-WiFi"],password:"",auth:"sms",category:"airport",region:"CN",city:"Kunming",tips:"SMS verification",updated:"2025"},
      {id:"cn-xiy",brand:"Xi'an Xianyang Airport",brandZh:"西安咸阳机场",ssid:["XIY-Free-WiFi"],password:"",auth:"sms",category:"airport",region:"CN",city:"Xi'an",tips:"SMS verification",updated:"2025"},
      {id:"cn-hgh",brand:"Hangzhou Xiaoshan Airport",brandZh:"杭州萧山机场",ssid:["HGH-Free-WiFi"],password:"",auth:"sms",category:"airport",region:"CN",city:"Hangzhou",tips:"SMS verification",updated:"2025"},
      {id:"cn-nkg",brand:"Nanjing Lukou Airport",brandZh:"南京禄口机场",ssid:["NKG-Free-WiFi"],password:"",auth:"sms",category:"airport",region:"CN",city:"Nanjing",tips:"SMS verification",updated:"2025"},
      {id:"cn-wuh",brand:"Wuhan Tianhe Airport",brandZh:"武汉天河机场",ssid:["WUH-Free-WiFi"],password:"",auth:"sms",category:"airport",region:"CN",city:"Wuhan",tips:"SMS verification",updated:"2025"},
      {id:"cn-tao",brand:"Qingdao Jiaodong Airport",brandZh:"青岛胶东机场",ssid:["TAO-Free-WiFi"],password:"",auth:"sms",category:"airport",region:"CN",city:"Qingdao",tips:"SMS verification",updated:"2025"},
      {id:"cn-dlc",brand:"Dalian Zhoushuizi Airport",brandZh:"大连周水子机场",ssid:["DLC-Free-WiFi"],password:"",auth:"sms",category:"airport",region:"CN",city:"Dalian",tips:"SMS verification",updated:"2025"},
      {id:"cn-she",brand:"Shenyang Taoxian Airport",brandZh:"沈阳桃仙机场",ssid:["SHE-Free-WiFi"],password:"",auth:"sms",category:"airport",region:"CN",city:"Shenyang",tips:"SMS verification",updated:"2025"},
      {id:"cn-hrb",brand:"Harbin Taiping Airport",brandZh:"哈尔滨太平机场",ssid:["HRB-Free-WiFi"],password:"",auth:"sms",category:"airport",region:"CN",city:"Harbin",tips:"SMS verification",updated:"2025"},
      {id:"cn-csxairport",brand:"Changsha Huanghua Airport",brandZh:"长沙黄花机场",ssid:["CSX-Free-WiFi"],password:"",auth:"sms",category:"airport",region:"CN",city:"Changsha",tips:"SMS verification",updated:"2025"},
      {id:"cn-xmn",brand:"Xiamen Gaoqi Airport",brandZh:"厦门高崎机场",ssid:["XMN-Free-WiFi"],password:"",auth:"sms",category:"airport",region:"CN",city:"Xiamen",tips:"SMS verification",updated:"2025"},
      {id:"cn-hak",brand:"Haikou Meilan Airport",brandZh:"海口美兰机场",ssid:["HAK-Free-WiFi"],password:"",auth:"sms",category:"airport",region:"CN",city:"Haikou",tips:"SMS verification",updated:"2025"},
      {id:"cn-syx",brand:"Sanya Phoenix Airport",brandZh:"三亚凤凰机场",ssid:["SYX-Free-WiFi"],password:"",auth:"sms",category:"airport",region:"CN",city:"Sanya",tips:"SMS verification",updated:"2025"},
      {id:"cn-foc",brand:"Fuzhou Changle Airport",brandZh:"福州长乐机场",ssid:["FOC-Free-WiFi"],password:"",auth:"sms",category:"airport",region:"CN",city:"Fuzhou",tips:"SMS verification",updated:"2025"},
      {id:"cn-tna",brand:"Jinan Yaoqiang Airport",brandZh:"济南遥墙机场",ssid:["TNA-Free-WiFi"],password:"",auth:"sms",category:"airport",region:"CN",city:"Jinan",tips:"SMS verification",updated:"2025"},
      {id:"cn-cgo",brand:"Zhengzhou Xinzheng Airport",brandZh:"郑州新郑机场",ssid:["CGO-Free-WiFi"],password:"",auth:"sms",category:"airport",region:"CN",city:"Zhengzhou",tips:"SMS verification",updated:"2025"},
      {id:"cn-urc",brand:"Urumqi Diwopu Airport",brandZh:"乌鲁木齐地窝堡机场",ssid:["URC-Free-WiFi"],password:"",auth:"sms",category:"airport",region:"CN",city:"Urumqi",tips:"SMS verification",updated:"2025"},
      {id:"cn-lhw",brand:"Lanzhou Zhongchuan Airport",brandZh:"兰州中川机场",ssid:["LHW-Free-WiFi"],password:"",auth:"sms",category:"airport",region:"CN",city:"Lanzhou",tips:"SMS verification",updated:"2025"},

      // ===== CHINA - TRANSIT =====
      {id:"cn-crwifi",brand:"China Railway WiFi",brandZh:"高铁WiFi",ssid:["CR-WiFi","高铁WiFi"],password:"",auth:"portal",category:"transit",region:"CN",city:"*",tips:"Download dedicated app or scan QR code. Speed varies. Not available on all routes.",updated:"2025"},
      {id:"cn-bjsubway",brand:"Beijing Subway",brandZh:"北京地铁",ssid:["花生地铁WiFi"],password:"",auth:"portal",category:"transit",region:"CN",city:"Beijing",tips:"Requires Peanut WiFi app authentication",updated:"2025"},
      {id:"cn-shsubway",brand:"Shanghai Metro",brandZh:"上海地铁",ssid:["花生地铁WiFi"],password:"",auth:"portal",category:"transit",region:"CN",city:"Shanghai",tips:"Requires app, available in stations",updated:"2025"},
      {id:"cn-gzsubway",brand:"Guangzhou Metro",brandZh:"广州地铁",ssid:["GZ-Metro-WiFi"],password:"",auth:"sms",category:"transit",region:"CN",city:"Guangzhou",tips:"SMS verification in some stations",updated:"2025"},

      // ===== CHINA - MALLS =====
      {id:"cn-wanda",brand:"Wanda Plaza",brandZh:"万达广场",ssid:["Wanda","万达慧WiFi"],password:"",auth:"sms",category:"mall",region:"CN",city:"*",tips:"Phone + SMS verification. Once logged in, works across all Wanda malls.",updated:"2025"},
      {id:"cn-joycity",brand:"Joy City",brandZh:"大悦城",ssid:["JoyCity","大悦城WiFi"],password:"",auth:"portal",category:"mall",region:"CN",city:"*",tips:"Follow WeChat official account or ask info desk. Password changes weekly.",updated:"2025"},
      {id:"cn-mixc",brand:"MixC / CR Land",brandZh:"万象城/华润",ssid:["MixC-WiFi","华润WiFi"],password:"",auth:"sms",category:"mall",region:"CN",city:"*",tips:"SMS verification via portal",updated:"2025"},
      {id:"cn-intime",brand:"Intime",brandZh:"银泰百货",ssid:["Intime-WiFi"],password:"",auth:"sms",category:"mall",region:"CN",city:"*",tips:"SMS verification",updated:"2025"},
      {id:"cn-aeon",brand:"AEON Mall",brandZh:"永旺商场",ssid:["AEON-WiFi"],password:"",auth:"portal",category:"mall",region:"CN",city:"*",tips:"Portal login, accept terms",updated:"2025"},
      {id:"cn-ikea",brand:"IKEA",brandZh:"宜家",ssid:["IKEA-WiFi"],password:"",auth:"sms",category:"mall",region:"CN",city:"*",tips:"SMS real-name verification",updated:"2025"},

      // ===== CHINA - TELECOM =====
      {id:"cn-cmcc",brand:"China Mobile",brandZh:"中国移动",ssid:["CMCC","CMCC-FREE"],password:"",auth:"sms",category:"public",region:"CN",city:"*",tips:"SMS verification or auto-connect for China Mobile subscribers",updated:"2025"},
      {id:"cn-chinanet",brand:"China Telecom",brandZh:"中国电信",ssid:["ChinaNet","ChinaNet-FREE"],password:"",auth:"sms",category:"public",region:"CN",city:"*",tips:"SMS verification or auto-connect for China Telecom subscribers",updated:"2025"},
      {id:"cn-unicom",brand:"China Unicom",brandZh:"中国联通",ssid:["ChinaUnicom","China-Unicom"],password:"",auth:"sms",category:"public",region:"CN",city:"*",tips:"SMS verification or auto-connect for China Unicom subscribers",updated:"2025"},

      // ===== CHINA - PUBLIC =====
      {id:"cn-library",brand:"Public Libraries",brandZh:"公共图书馆",ssid:["Library-WiFi","图书馆WiFi"],password:"",auth:"portal",category:"public",region:"CN",city:"*",tips:"Most libraries: phone verification portal. Some require library card number.",updated:"2025"},
      {id:"cn-govhall",brand:"Government Service Hall",brandZh:"政务服务大厅",ssid:["Gov-WiFi","政务WiFi"],password:"",auth:"portal",category:"public",region:"CN",city:"*",tips:"Portal login with phone number, free for visitors",updated:"2025"},
      {id:"cn-hospital",brand:"Hospitals",brandZh:"医院",ssid:["Hospital-WiFi"],password:"",auth:"portal",category:"public",region:"CN",city:"*",tips:"Major hospitals have free WiFi. Portal or SMS auth.",updated:"2025"},
      {id:"cn-eduroam",brand:"Eduroam (Universities)",brandZh:"校园网(Eduroam)",ssid:["eduroam"],password:"",auth:"portal",category:"public",region:"CN",city:"*",tips:"Login format: username@university-domain. Staff & students only. Roaming supported.",updated:"2025"},

      // ===== CHINA - COWORK =====
      {id:"cn-wework",brand:"WeWork",brandZh:"WeWork联合办公",ssid:["WeWork"],password:"",auth:"portal",category:"cowork",region:"CN",city:"*",tips:"Members only. Guest passes available at reception.",updated:"2025"},
      {id:"cn-krkj",brand:"Kr Space",brandZh:"氪空间",ssid:["KrSpace"],password:"",auth:"portal",category:"cowork",region:"CN",city:"*",tips:"Members portal login",updated:"2025"},

      // ===== CHINA - COMMON PATTERNS (generic tips) =====
      {id:"cn-pattern-8",brand:"Common Pattern: 8s",brandZh:"通用密码: 8个8",ssid:["Various"],password:"88888888",auth:"password",category:"other",region:"CN",city:"*",tips:"The most common WiFi password in China. Try this first!",updated:"2025"},
      {id:"cn-pattern-123",brand:"Common Pattern: 12345678",brandZh:"通用密码: 12345678",ssid:["Various"],password:"12345678",auth:"password",category:"other",region:"CN",city:"*",tips:"Second most common default password in China",updated:"2025"},
      {id:"cn-pattern-phone",brand:"Common Pattern: Phone #",brandZh:"通用密码: 店铺电话",ssid:["Various"],password:"(store phone number)",auth:"password",category:"other",region:"CN",city:"*",tips:"Many small shops use their phone number as WiFi password. Check signage!",updated:"2025"},
      {id:"cn-pattern-brand",brand:"Common Pattern: Brand Pinyin",brandZh:"通用密码: 品牌拼音",ssid:["Various"],password:"(brand pinyin)",auth:"password",category:"other",region:"CN",city:"*",tips:"Many chains use their brand name in pinyin as password",updated:"2025"},

      // ===== HONG KONG =====
      {id:"hk-airport",brand:"Hong Kong Airport",brandZh:"香港机场",ssid:["#HKAirport"],password:"",auth:"open",category:"airport",region:"HK",city:"Hong Kong",tips:"Free, no password needed",updated:"2025"},
      {id:"hk-mtr",brand:"MTR WiFi",brandZh:"港铁WiFi",ssid:["MTR Free Wi-Fi"],password:"",auth:"portal",category:"transit",region:"HK",city:"Hong Kong",tips:"Available in stations, 15 min sessions",updated:"2025"},
      {id:"hk-pacific",brand:"Pacific Coffee",brandZh:"太平洋咖啡",ssid:["PacificCoffee"],password:"",auth:"open",category:"cafe",region:"HK",city:"Hong Kong",tips:"Free WiFi for customers",updated:"2025"},
      {id:"hk-govwifi",brand:"GovWiFi",brandZh:"政府WiFi通",ssid:["freegovwifi-e"],password:"",auth:"open",category:"public",region:"HK",city:"Hong Kong",tips:"Free in government buildings, libraries, parks",updated:"2025"},
      {id:"hk-cathay-lounge",brand:"Cathay Wing Lounge",brandZh:"国泰航空贵宾室",ssid:["Cathay Wing lounge"],password:"cathay1234",auth:"password",category:"airport",region:"HK",city:"Hong Kong",tips:"Airport lounge",updated:"2025"},
      {id:"hk-plaza-lounge",brand:"Plaza Premium Lounge HKG",brandZh:"环亚贵宾室",ssid:["Plaza Premium Lounge"],password:"plaza2016",auth:"password",category:"airport",region:"HK",city:"Hong Kong",tips:"Airport lounge",updated:"2025"},
      {id:"hk-skyteam-lounge",brand:"Sky Team Lounge HKG",brandZh:"天合联盟贵宾室",ssid:["Sky Team Lounge"],password:"skyteam2016",auth:"password",category:"airport",region:"HK",city:"Hong Kong",tips:"Airport lounge",updated:"2025"},
      {id:"hk-centurion",brand:"Centurion Lounge HKG",brandZh:"百夫长贵宾室",ssid:["TheCenturionLounge"],password:"MemberSince",auth:"password",category:"airport",region:"HK",city:"Hong Kong",tips:"Amex Centurion lounge",updated:"2025"},
      {id:"hk-qantas",brand:"Qantas Lounge HKG",brandZh:"澳航贵宾室",ssid:["Qantas Hong Kong Lounge"],password:"Quantas88",auth:"password",category:"airport",region:"HK",city:"Hong Kong",tips:"Note: password has typo 'Quantas' not 'Qantas'",updated:"2025"},

      // ===== TAIWAN =====
      {id:"tw-itaiwan",brand:"iTaiwan",brandZh:"iTaiwan公共WiFi",ssid:["iTaiwan"],password:"",auth:"open",category:"public",region:"CN",city:"*",tips:"Free since July 2020, no registration needed. 5000+ hotspots.",updated:"2025"},
      {id:"tw-tpefree",brand:"Taipei Free",brandZh:"台北免费WiFi",ssid:["TPE-Free"],password:"",auth:"portal",category:"public",region:"CN",city:"Taipei",tips:"Accept terms to connect",updated:"2025"},
      {id:"tw-mrt",brand:"Taipei MRT WiFi",brandZh:"台北捷运WiFi",ssid:[".TPE-Free AD WiFi"],password:"",auth:"open",category:"transit",region:"CN",city:"Taipei",tips:"Available in stations",updated:"2025"},
      {id:"tw-mrtcar",brand:"Taipei MRT Car WiFi",brandZh:"台北捷运车厢WiFi",ssid:[".TPE-Free AD WiFi-Car"],password:"",auth:"open",category:"transit",region:"CN",city:"Taipei",tips:"Available inside train cars",updated:"2025"},
      {id:"tw-taichung",brand:"iTaichung",brandZh:"台中免费WiFi",ssid:["iTaichung"],password:"",auth:"portal",category:"public",region:"CN",city:"Taichung",tips:"Roaming with iTaiwan account",updated:"2025"},
      {id:"tw-tainan",brand:"Tainan WiFi",brandZh:"台南免费WiFi",ssid:["Tainan-WiFi"],password:"",auth:"portal",category:"public",region:"CN",city:"Tainan",tips:"Roaming with iTaiwan account",updated:"2025"},
      {id:"tw-louisa",brand:"Louisa Coffee",brandZh:"路易莎咖啡",ssid:["LouisaCoffee"],password:"",auth:"open",category:"cafe",region:"CN",city:"*",tips:"Free WiFi, no password",updated:"2025"},
      {id:"tw-711",brand:"7-Eleven Taiwan",brandZh:"7-11(台湾)",ssid:["7-ELEVEN"],password:"",auth:"portal",category:"other",region:"CN",city:"*",tips:"Portal login, limited time",updated:"2025"},

      // ===== JAPAN =====
      {id:"jp-narita",brand:"Narita Airport",brandZh:"成田机场",ssid:["FreeWiFi-NARITA"],password:"",auth:"open",category:"airport",region:"JP",city:"Tokyo",tips:"Free, no registration",updated:"2025"},
      {id:"jp-haneda",brand:"Haneda Airport",brandZh:"羽田机场",ssid:["HANEDA-FREE-WIFI"],password:"",auth:"open",category:"airport",region:"JP",city:"Tokyo",tips:"Free, no registration",updated:"2025"},
      {id:"jp-kansai",brand:"Kansai Airport",brandZh:"关西机场",ssid:["FreeWiFi@KansaiAirport"],password:"",auth:"open",category:"airport",region:"JP",city:"Osaka",tips:"Free, accept terms",updated:"2025"},
      {id:"jp-7spot",brand:"7-Eleven Japan",brandZh:"7-11(日本)",ssid:["7SPOT"],password:"",auth:"portal",category:"other",region:"JP",city:"*",tips:"Email registration, 60 min x 3 per day",updated:"2025"},
      {id:"jp-lawson",brand:"Lawson",brandZh:"罗森(日本)",ssid:["LAWSON_Free_Wi-Fi"],password:"",auth:"portal",category:"other",region:"JP",city:"*",tips:"Email registration, 60 min x 5 per day",updated:"2025"},
      {id:"jp-jreast",brand:"JR East Stations",brandZh:"JR东日本车站",ssid:["JR-EAST_FREE_Wi-Fi"],password:"",auth:"portal",category:"transit",region:"JP",city:"*",tips:"Email registration, 3-hour sessions",updated:"2025"},
      {id:"jp-shinkansen",brand:"Shinkansen",brandZh:"新干线",ssid:["Shinkansen_Free_Wi-Fi"],password:"",auth:"portal",category:"transit",region:"JP",city:"*",tips:"Email or SNS registration required",updated:"2025"},
      {id:"jp-metro",brand:"Tokyo Metro",brandZh:"东京地铁",ssid:["Metro_Free_Wi-Fi"],password:"",auth:"portal",category:"transit",region:"JP",city:"Tokyo",tips:"Email registration",updated:"2025"},
      {id:"jp-toei",brand:"Toei Subway",brandZh:"都营地铁",ssid:["Toei_Subway_Free_Wi-Fi"],password:"",auth:"portal",category:"transit",region:"JP",city:"Tokyo",tips:"Email registration",updated:"2025"},
      {id:"jp-starbucks",brand:"Starbucks Japan",brandZh:"星巴克(日本)",ssid:["at_STARBUCKS_Wi2"],password:"",auth:"portal",category:"cafe",region:"JP",city:"*",tips:"Email registration required",updated:"2025"},
      {id:"jp-doutor",brand:"Doutor Coffee",brandZh:"Doutor咖啡",ssid:["Wi2_Free_at_[doutor]"],password:"",auth:"portal",category:"cafe",region:"JP",city:"*",tips:"Email registration, time limited",updated:"2025"},
      {id:"jp-japanfree",brand:"Japan Free WiFi",brandZh:"日本免费WiFi",ssid:["Japan Free WiFi"],password:"",auth:"portal",category:"public",region:"JP",city:"*",tips:"NTT service, requires Japan Connected app or email registration",updated:"2025"},

      // ===== KOREA =====
      {id:"kr-seoul",brand:"Seoul City WiFi",brandZh:"首尔公共WiFi",ssid:["SEOUL"],password:"",auth:"open",category:"public",region:"KR",city:"Seoul",tips:"Free citywide WiFi, open access",updated:"2025"},
      {id:"kr-seoul-secure",brand:"Seoul Secure WiFi",brandZh:"首尔安全WiFi",ssid:["SEOUL_Secure"],password:"",auth:"portal",category:"public",region:"KR",city:"Seoul",tips:"Requires setup, more secure option",updated:"2025"},
      {id:"kr-incheon",brand:"Incheon Airport",brandZh:"仁川机场",ssid:["AirportWiFi"],password:"",auth:"open",category:"airport",region:"KR",city:"Incheon",tips:"Free, open access",updated:"2025"},
      {id:"kr-kt",brand:"KT WiFi",brandZh:"KT公共WiFi",ssid:["KT_WLAN"],password:"1234567890",auth:"password",category:"public",region:"KR",city:"*",tips:"Default password. Also try: 123456789a",updated:"2025"},
      {id:"kr-ediya",brand:"Ediya Coffee",brandZh:"Ediya咖啡",ssid:["Ediya-WiFi"],password:"",auth:"open",category:"cafe",region:"KR",city:"*",tips:"Free for customers",updated:"2025"},
      {id:"kr-twosome",brand:"A Twosome Place",brandZh:"ATwosome咖啡",ssid:["TwosomePlace"],password:"",auth:"open",category:"cafe",region:"KR",city:"*",tips:"Free for customers",updated:"2025"},

      // ===== SINGAPORE =====
      {id:"sg-changi",brand:"Changi Airport",brandZh:"樟宜机场",ssid:["#WiFi@Changi"],password:"",auth:"portal",category:"airport",region:"SG",city:"Singapore",tips:"May require passport number for registration",updated:"2025"},
      {id:"sg-wireless",brand:"Wireless@SG",brandZh:"新加坡公共WiFi",ssid:["Wireless@SG","Wireless@SGx"],password:"",auth:"portal",category:"public",region:"SG",city:"Singapore",tips:"Free nationwide. Register via SingPass or SMS.",updated:"2025"},

      // ===== THAILAND =====
      {id:"th-bkk",brand:"Suvarnabhumi Airport",brandZh:"素万那普机场",ssid:["Airport Free WiFi"],password:"",auth:"portal",category:"airport",region:"TH",city:"Bangkok",tips:"Free, accept terms",updated:"2025"},
      {id:"th-true",brand:"True Free WiFi",brandZh:"True免费WiFi",ssid:["TrueMove_Free_WiFi"],password:"",auth:"portal",category:"public",region:"TH",city:"*",tips:"Available in many public places",updated:"2025"},
      {id:"th-711",brand:"7-Eleven Thailand",brandZh:"7-11(泰国)",ssid:["7-Eleven WiFi"],password:"",auth:"portal",category:"other",region:"TH",city:"*",tips:"Free, portal login",updated:"2025"},
      {id:"th-bkk-afklm",brand:"AF-KLM Lounge BKK",brandZh:"法荷航贵宾室(曼谷)",ssid:["AFKLM SKY Lounge"],password:"THAILAND",auth:"password",category:"airport",region:"TH",city:"Bangkok",tips:"User: AFKLM / Pass: THAILAND",updated:"2025"},
      {id:"th-bkk-miracle",brand:"Miracle Lounge BKK",brandZh:"Miracle贵宾室(曼谷)",ssid:["Miracle Lounge"],password:"by miracle",auth:"password",category:"airport",region:"TH",city:"Bangkok",tips:"User: miracle / Pass: by miracle",updated:"2025"},

      // ===== MALAYSIA =====
      {id:"my-klia",brand:"KLIA Airport",brandZh:"吉隆坡机场",ssid:["FREE_WIFI@KLIA"],password:"",auth:"open",category:"airport",region:"MY",city:"Kuala Lumpur",tips:"Free, open",updated:"2025"},
      {id:"my-cosans",brand:"Cosans Coffee",brandZh:"Cosans咖啡",ssid:["CosansCoffee"],password:"believeingreat",auth:"password",category:"cafe",region:"MY",city:"*",tips:"Community shared",updated:"2025"},
      {id:"my-foodtea",brand:"Food & Tea HK",brandZh:"Food&Tea餐厅",ssid:["FoodNTea"],password:"foodntea12345",auth:"password",category:"restaurant",region:"MY",city:"*",tips:"Community shared",updated:"2025"},

      // ===== VIETNAM =====
      {id:"vn-hanoi",brand:"Hanoi Airport",brandZh:"河内机场",ssid:["NoiBai Airport Free Wi-Fi"],password:"",auth:"portal",category:"airport",region:"VN",city:"Hanoi",tips:"Login required",updated:"2025"},
      {id:"vn-highlands",brand:"Highlands Coffee",brandZh:"Highlands咖啡",ssid:["Highlands Coffee"],password:"",auth:"open",category:"cafe",region:"VN",city:"*",tips:"Free, open. Largest chain in Vietnam.",updated:"2025"},

      // ===== INDIA =====
      {id:"in-del",brand:"Delhi Airport",brandZh:"德里机场",ssid:["#DEL_Free_WiFi"],password:"",auth:"sms",category:"airport",region:"IN",city:"Delhi",tips:"OTP via Indian mobile number",updated:"2025"},
      {id:"in-bom",brand:"Mumbai Airport",brandZh:"孟买机场",ssid:["#MumbaiAirportWiFi"],password:"",auth:"sms",category:"airport",region:"IN",city:"Mumbai",tips:"OTP via Indian mobile number",updated:"2025"},
      {id:"in-blr",brand:"Bangalore Airport",brandZh:"班加罗尔机场",ssid:["BLR Free Wi-Fi"],password:"",auth:"sms",category:"airport",region:"IN",city:"Bangalore",tips:"OTP via Indian mobile",updated:"2025"},
      {id:"in-railwire",brand:"RailWire (Train Stations)",brandZh:"印度火车站WiFi",ssid:["RailWire"],password:"",auth:"sms",category:"transit",region:"IN",city:"*",tips:"Available at 6000+ stations. OTP via Indian mobile.",updated:"2025"},
      {id:"in-del-lounge-a",brand:"Delhi Lounge A/B",brandZh:"德里贵宾室",ssid:["LOUNGE A","LOUNGE B"],password:"6660055500",auth:"password",category:"airport",region:"IN",city:"Delhi",tips:"Airport lounge WiFi",updated:"2025"},
      {id:"in-del-premium",brand:"Delhi Premium WiFi",brandZh:"德里高级WiFi",ssid:["Premium Wi-Fi"],password:"s7k62c",auth:"password",category:"airport",region:"IN",city:"Delhi",tips:"Airport premium WiFi",updated:"2025"},

      // ===== USA =====
      {id:"us-starbucks",brand:"Starbucks",brandZh:"星巴克(美国)",ssid:["Google Starbucks"],password:"",auth:"portal",category:"cafe",region:"US",city:"*",tips:"No password, captive portal. Powered by Google.",updated:"2025"},
      {id:"us-mcd",brand:"McDonald's",brandZh:"麦当劳(美国)",ssid:["McDonald's Free WiFi"],password:"",auth:"portal",category:"fastfood",region:"US",city:"*",tips:"Accept terms",updated:"2025"},
      {id:"us-bk",brand:"Burger King",brandZh:"汉堡王(美国)",ssid:["BURGER KING FREE WI-FI"],password:"",auth:"open",category:"fastfood",region:"US",city:"*",tips:"Open, no password",updated:"2025"},
      {id:"us-panera",brand:"Panera Bread",brandZh:"Panera面包",ssid:["Panera Wi-Fi","Panera_Guest"],password:"",auth:"open",category:"cafe",region:"US",city:"*",tips:"No password",updated:"2025"},
      {id:"us-dunkin",brand:"Dunkin' Donuts",brandZh:"唐恩都乐",ssid:["DunkinNation WiFi"],password:"",auth:"portal",category:"cafe",region:"US",city:"*",tips:"DunkinNation account may be required",updated:"2025"},
      {id:"us-cfa",brand:"Chick-fil-A",brandZh:"Chick-fil-A",ssid:["CFA_Guest","Chick-fil-A WiFi"],password:"",auth:"open",category:"fastfood",region:"US",city:"*",tips:"No password",updated:"2025"},
      {id:"us-tacobell",brand:"Taco Bell",brandZh:"Taco Bell",ssid:["Taco Bell WiFi"],password:"",auth:"open",category:"fastfood",region:"US",city:"*",tips:"No password",updated:"2025"},
      {id:"us-wendys",brand:"Wendy's",brandZh:"Wendy's",ssid:["Wendy's Free WiFi"],password:"",auth:"open",category:"fastfood",region:"US",city:"*",tips:"No password",updated:"2025"},
      {id:"us-kfc",brand:"KFC",brandZh:"肯德基(美国)",ssid:["KFC Free WiFi"],password:"",auth:"open",category:"fastfood",region:"US",city:"*",tips:"No password, varies by location",updated:"2025"},
      {id:"us-subway",brand:"Subway",brandZh:"赛百味(美国)",ssid:["Subway WiFi"],password:"",auth:"portal",category:"fastfood",region:"US",city:"*",tips:"Varies by franchise, ask in-store",updated:"2025"},
      {id:"us-walmart",brand:"Walmart",brandZh:"沃尔玛",ssid:["Walmart WiFi","WMGuest"],password:"",auth:"open",category:"mall",region:"US",city:"*",tips:"No password",updated:"2025"},
      {id:"us-target",brand:"Target",brandZh:"Target",ssid:["Target Wireless"],password:"",auth:"open",category:"mall",region:"US",city:"*",tips:"No password",updated:"2025"},
      {id:"us-costco",brand:"Costco",brandZh:"Costco",ssid:["Costco Member Wifi"],password:"",auth:"open",category:"mall",region:"US",city:"*",tips:"No password",updated:"2025"},
      {id:"us-wholefoods",brand:"Whole Foods",brandZh:"Whole Foods",ssid:["Whole Foods Market"],password:"",auth:"open",category:"mall",region:"US",city:"*",tips:"No password",updated:"2025"},
      {id:"us-homedepot",brand:"Home Depot",brandZh:"Home Depot",ssid:["HomeDepotWiFi"],password:"",auth:"open",category:"mall",region:"US",city:"*",tips:"Varies by location",updated:"2025"},
      {id:"us-ikea",brand:"IKEA USA",brandZh:"宜家(美国)",ssid:["IKEA WiFi"],password:"",auth:"portal",category:"mall",region:"US",city:"*",tips:"Accept terms",updated:"2025"},
      {id:"us-sfo",brand:"San Francisco Airport",brandZh:"旧金山机场",ssid:["#SFO FREE WIFI"],password:"",auth:"open",category:"airport",region:"US",city:"San Francisco",tips:"Open, free",updated:"2025"},
      {id:"us-dfw",brand:"Dallas Airport",brandZh:"达拉斯机场",ssid:["DFW Public 5G Wi-Fi"],password:"",auth:"open",category:"airport",region:"US",city:"Dallas",tips:"Open, free",updated:"2025"},
      {id:"us-atl",brand:"Atlanta Airport",brandZh:"亚特兰大机场",ssid:["ATL Free Wi-Fi"],password:"",auth:"open",category:"airport",region:"US",city:"Atlanta",tips:"Open, free",updated:"2025"},
      {id:"us-mia",brand:"Miami Airport",brandZh:"迈阿密机场",ssid:["MIA-WiFi"],password:"",auth:"open",category:"airport",region:"US",city:"Miami",tips:"Open, free",updated:"2025"},
      {id:"us-den",brand:"Denver Airport",brandZh:"丹佛机场",ssid:["DEN Airport Free Wi-Fi"],password:"",auth:"open",category:"airport",region:"US",city:"Denver",tips:"Open, free",updated:"2025"},

      // ===== USA - AIRPORT LOUNGES =====
      {id:"us-jfk-delta",brand:"Delta Sky Club JFK",brandZh:"达美贵宾室(JFK)",ssid:["Delta Sky Club"],password:"faster",auth:"password",category:"airport",region:"US",city:"New York",tips:"",updated:"2025"},
      {id:"us-jfk-admirals",brand:"Admirals Club JFK",brandZh:"海军上将俱乐部(JFK)",ssid:["Admirals Club"],password:"StVincent2019",auth:"password",category:"airport",region:"US",city:"New York",tips:"Same password across many AA lounges",updated:"2025"},
      {id:"us-jfk-alitalia",brand:"Alitalia VIP JFK",brandZh:"意航贵宾室(JFK)",ssid:["AlitaliaVIP"],password:"romamilano",auth:"password",category:"airport",region:"US",city:"New York",tips:"",updated:"2025"},
      {id:"us-jfk-ba",brand:"British Airways Lounge JFK",brandZh:"英航贵宾室(JFK)",ssid:["British Airways Lounge"],password:"lasvegas",auth:"password",category:"airport",region:"US",city:"New York",tips:"",updated:"2025"},
      {id:"us-jfk-wingtip",brand:"Wingtip Lounge JFK",brandZh:"Wingtip贵宾室(JFK)",ssid:["Wingtip lounge"],password:"WingtipS",auth:"password",category:"airport",region:"US",city:"New York",tips:"",updated:"2025"},
      {id:"us-jfk-etihad",brand:"Etihad Lounge JFK",brandZh:"阿提哈德贵宾室(JFK)",ssid:["Etihad lounge"],password:"etihadjfk",auth:"password",category:"airport",region:"US",city:"New York",tips:"",updated:"2025"},
      {id:"us-jfk-alaska",brand:"Alaska Lounge JFK",brandZh:"阿拉斯加贵宾室(JFK)",ssid:["Alaska lounge"],password:"MostWestCoast",auth:"password",category:"airport",region:"US",city:"New York",tips:"",updated:"2025"},
      {id:"us-jfk-korean",brand:"KAL Lounge JFK",brandZh:"大韩航空贵宾室(JFK)",ssid:["KAL Lounge_JFK"],password:"koreanair03",auth:"password",category:"airport",region:"US",city:"New York",tips:"",updated:"2025"},
      {id:"us-lax-oneworld",brand:"Oneworld Lounge LAX",brandZh:"寰宇一家贵宾室(LAX)",ssid:["oneworld"],password:"oneworld",auth:"password",category:"airport",region:"US",city:"Los Angeles",tips:"",updated:"2025"},
      {id:"us-lax-alaska",brand:"Alaska Board Room LAX",brandZh:"阿拉斯加贵宾室(LAX)",ssid:["Alaska Board Room"],password:"MostWestCoast",auth:"password",category:"airport",region:"US",city:"Los Angeles",tips:"",updated:"2025"},
      {id:"us-lax-admirals",brand:"Admirals Club LAX",brandZh:"海军上将俱乐部(LAX)",ssid:["Admirals Club"],password:"StVincent2019",auth:"password",category:"airport",region:"US",city:"Los Angeles",tips:"",updated:"2025"},
      {id:"us-lax-emirates",brand:"Emirates Lounge LAX",brandZh:"阿联酋航空贵宾室(LAX)",ssid:["Emirates lounge"],password:"EK2017",auth:"password",category:"airport",region:"US",city:"Los Angeles",tips:"",updated:"2025"},
      {id:"us-lax-united",brand:"United Club LAX T7",brandZh:"美联航俱乐部(LAX)",ssid:["United Club Terminal 7"],password:"CLUB8385",auth:"password",category:"airport",region:"US",city:"Los Angeles",tips:"",updated:"2025"},
      {id:"us-lax-qantas",brand:"Qantas First LAX",brandZh:"澳航头等舱贵宾室(LAX)",ssid:["Qantas First Class lounge"],password:"fly qantas",auth:"password",category:"airport",region:"US",city:"Los Angeles",tips:"",updated:"2025"},
      {id:"us-lax-delta",brand:"Delta Sky Club LAX",brandZh:"达美贵宾室(LAX)",ssid:["Delta Sky Club"],password:"faster",auth:"password",category:"airport",region:"US",city:"Los Angeles",tips:"",updated:"2025"},

      // ===== USA - HOTELS =====
      {id:"us-marriott",brand:"Marriott",brandZh:"万豪酒店",ssid:["MarriottBonvoy_Guest"],password:"",auth:"portal",category:"hotel",region:"US",city:"*",tips:"Last name + room number",updated:"2025"},
      {id:"us-hilton",brand:"Hilton",brandZh:"希尔顿酒店",ssid:["Hilton Honors","hhonors"],password:"",auth:"portal",category:"hotel",region:"US",city:"*",tips:"Last name + room number or HHonors login",updated:"2025"},
      {id:"us-ihg",brand:"IHG (Holiday Inn etc.)",brandZh:"洲际酒店集团",ssid:["IHG Connect"],password:"",auth:"portal",category:"hotel",region:"US",city:"*",tips:"Last name + room number",updated:"2025"},
      {id:"us-hyatt",brand:"Hyatt",brandZh:"凯悦酒店",ssid:["Hyatt_Guest"],password:"",auth:"portal",category:"hotel",region:"US",city:"*",tips:"Captive portal",updated:"2025"},
      {id:"us-bestwestern",brand:"Best Western",brandZh:"最佳西方酒店",ssid:["Best Western Guest"],password:"",auth:"portal",category:"hotel",region:"US",city:"*",tips:"Varies by property",updated:"2025"},

      // ===== USA - LIBRARIES =====
      {id:"us-sfpl",brand:"SF Public Library",brandZh:"旧金山公共图书馆",ssid:["#SFLibraryWiFi"],password:"",auth:"open",category:"public",region:"US",city:"San Francisco",tips:"Open, no password",updated:"2025"},
      {id:"us-sjpl",brand:"San Jose Library",brandZh:"圣何塞公共图书馆",ssid:["SJPL-WiFi"],password:"",auth:"open",category:"public",region:"US",city:"San Jose",tips:"Open, no password",updated:"2025"},
      {id:"us-sdpl",brand:"San Diego Library",brandZh:"圣地亚哥公共图书馆",ssid:["sdpl"],password:"",auth:"open",category:"public",region:"US",city:"San Diego",tips:"Open",updated:"2025"},

      // ===== USA - CAFES (with passwords) =====
      {id:"us-breka",brand:"Breka Bakery",brandZh:"Breka面包店",ssid:["Breka"],password:"ilovebreka",auth:"password",category:"cafe",region:"US",city:"Vancouver",tips:"",updated:"2025"},
      {id:"us-bennys",brand:"Benny's",brandZh:"Benny's",ssid:["Bennys"],password:"bennys123",auth:"password",category:"cafe",region:"US",city:"Vancouver",tips:"",updated:"2025"},
      {id:"us-cartems",brand:"Cartems Donuts",brandZh:"Cartems甜甜圈",ssid:["Cartems"],password:"3040cartems",auth:"password",category:"cafe",region:"CA",city:"Vancouver",tips:"",updated:"2025"},
      {id:"us-cartemsmain",brand:"Cartems on Main",brandZh:"Cartems(Main店)",ssid:["Cartems Main"],password:"citrusdust",auth:"password",category:"cafe",region:"CA",city:"Vancouver",tips:"",updated:"2025"},
      {id:"us-grounds",brand:"Grounds for Coffee",brandZh:"Grounds咖啡",ssid:["GroundsForCoffee"],password:"groundsforcoffee",auth:"password",category:"cafe",region:"CA",city:"Vancouver",tips:"",updated:"2025"},
      {id:"us-gardencorner",brand:"Garden Corner Cafe",brandZh:"Garden Corner",ssid:["GardenCorner"],password:"organicsip",auth:"password",category:"cafe",region:"CA",city:"Vancouver",tips:"",updated:"2025"},
      {id:"us-beanaround",brand:"Bean Around The World",brandZh:"Bean Around",ssid:["BeanAround"],password:"Kitsilano",auth:"password",category:"cafe",region:"CA",city:"Vancouver",tips:"",updated:"2025"},
      {id:"us-beanaround2",brand:"Bean Around (Main)",brandZh:"Bean Around(Main)",ssid:["BeanAround Main"],password:"cowboyslikebeans",auth:"password",category:"cafe",region:"CA",city:"Vancouver",tips:"",updated:"2025"},
      {id:"us-arbutus",brand:"Arbutus Coffee",brandZh:"Arbutus咖啡",ssid:["ArbutusCoffee"],password:"coffeecake",auth:"password",category:"cafe",region:"CA",city:"Vancouver",tips:"",updated:"2025"},
      {id:"us-stormcrow",brand:"Storm Crow Tavern",brandZh:"Storm Crow酒馆",ssid:["StormCrow"],password:"Gandalf",auth:"password",category:"cafe",region:"CA",city:"Vancouver",tips:"",updated:"2025"},
      {id:"us-tazikis",brand:"Taziki's Cafe",brandZh:"Taziki's",ssid:["Tazikis"],password:"4customers",auth:"password",category:"restaurant",region:"US",city:"Nashville",tips:"",updated:"2025"},
      {id:"us-frothymonkey",brand:"Frothy Monkey",brandZh:"Frothy Monkey",ssid:["FrothyMonkey"],password:"frothytn",auth:"password",category:"cafe",region:"US",city:"Nashville",tips:"",updated:"2025"},
      {id:"us-jimnicks",brand:"Jim 'N Nick's BBQ",brandZh:"Jim N Nicks烧烤",ssid:["JimNNicks"],password:"4customers",auth:"password",category:"restaurant",region:"US",city:"Nashville",tips:"",updated:"2025"},
      {id:"us-brixx",brand:"Brixx Pizza",brandZh:"Brixx披萨",ssid:["Brixx"],password:"brixxpizza01",auth:"password",category:"restaurant",region:"US",city:"*",tips:"",updated:"2025"},
      {id:"us-pjw",brand:"P.J. Whelihan's Pub",brandZh:"PJ's酒馆",ssid:["PJWhelihan"],password:"pjswings",auth:"password",category:"restaurant",region:"US",city:"Pennsylvania",tips:"",updated:"2025"},
      {id:"us-unopizza",brand:"Uno Pizzeria",brandZh:"Uno披萨",ssid:["UnoPizzeria"],password:"guest",auth:"password",category:"restaurant",region:"US",city:"*",tips:"",updated:"2025"},
      {id:"us-orpheu",brand:"Orpheu Caffe",brandZh:"Orpheu咖啡",ssid:["OrpheuCaffe"],password:"fernandopessoa",auth:"password",category:"cafe",region:"US",city:"Lisbon",tips:"Portuguese poet name as password",updated:"2025"},

      // ===== CANADA =====
      {id:"ca-timhortons",brand:"Tim Hortons",brandZh:"Tim Hortons",ssid:["Tim Hortons WiFi"],password:"",auth:"portal",category:"cafe",region:"CA",city:"*",tips:"No password, accept use policy",updated:"2025"},
      {id:"ca-yyz",brand:"Toronto Pearson Airport",brandZh:"多伦多机场",ssid:["Toronto Pearson Wi-Fi"],password:"",auth:"portal",category:"airport",region:"CA",city:"Toronto",tips:"Captive portal",updated:"2025"},
      {id:"ca-yvr",brand:"Vancouver Airport",brandZh:"温哥华机场",ssid:["#YVR Free WiFi"],password:"",auth:"portal",category:"airport",region:"CA",city:"Vancouver",tips:"Captive portal",updated:"2025"},
      {id:"ca-yul",brand:"Montreal Airport",brandZh:"蒙特利尔机场",ssid:["AERO Wi-Fi"],password:"",auth:"portal",category:"airport",region:"CA",city:"Montreal",tips:"60 min free",updated:"2025"},

      // ===== UK =====
      {id:"gb-lhr",brand:"Heathrow Airport",brandZh:"希思罗机场",ssid:["_Heathrow Wi-Fi"],password:"",auth:"portal",category:"airport",region:"GB",city:"London",tips:"Email registration",updated:"2025"},
      {id:"gb-lgw",brand:"Gatwick Airport",brandZh:"盖特威克机场",ssid:["Gatwick FREE Wi-Fi"],password:"",auth:"portal",category:"airport",region:"GB",city:"London",tips:"1.5 hours free",updated:"2025"},
      {id:"gb-stn",brand:"Stansted Airport",brandZh:"斯坦斯特德机场",ssid:["_stanstedairport"],password:"",auth:"portal",category:"airport",region:"GB",city:"London",tips:"4 hours free",updated:"2025"},
      {id:"gb-pret",brand:"Pret a Manger",brandZh:"Pret三明治",ssid:["Pret WiFi"],password:"",auth:"open",category:"cafe",region:"GB",city:"*",tips:"No password",updated:"2025"},
      {id:"gb-costa",brand:"Costa Coffee UK",brandZh:"Costa咖啡(英国)",ssid:["Costa Coffee"],password:"",auth:"portal",category:"cafe",region:"GB",city:"*",tips:"1-hour voucher from counter per purchase",updated:"2025"},

      // ===== UK - AIRPORT LOUNGES =====
      {id:"gb-lhr-pp",brand:"Plaza Premium LHR",brandZh:"环亚贵宾室(LHR)",ssid:["PPLLHR"],password:"plazalhr",auth:"password",category:"airport",region:"GB",city:"London",tips:"",updated:"2025"},
      {id:"gb-lhr-admirals",brand:"Admirals Club LHR",brandZh:"海军上将俱乐部(LHR)",ssid:["Admirals Club"],password:"StVincent2019",auth:"password",category:"airport",region:"GB",city:"London",tips:"",updated:"2025"},
      {id:"gb-lhr-ey",brand:"EY Lounge LHR",brandZh:"阿提哈德贵宾室(LHR)",ssid:["EYLHRLG"],password:"asdfg12345",auth:"password",category:"airport",region:"GB",city:"London",tips:"",updated:"2025"},
      {id:"gb-lhr-ba",brand:"BA Lounge LHR",brandZh:"英航贵宾室(LHR)",ssid:["BALoungeWiFi"],password:"vancouver",auth:"password",category:"airport",region:"GB",city:"London",tips:"",updated:"2025"},
      {id:"gb-lhr-ek",brand:"Emirates Lounge LHR",brandZh:"阿联酋航空贵宾室(LHR)",ssid:["EK LOUNGES"],password:"FLYEKA380",auth:"password",category:"airport",region:"GB",city:"London",tips:"",updated:"2025"},
      {id:"gb-lhr-virgin",brand:"Virgin Clubhouse LHR",brandZh:"维珍贵宾室(LHR)",ssid:["Virgin Atlantic Clubhouse"],password:"oasis",auth:"password",category:"airport",region:"GB",city:"London",tips:"",updated:"2025"},

      // ===== FRANCE =====
      {id:"fr-cdg",brand:"Paris CDG Airport",brandZh:"巴黎戴高乐机场",ssid:["WIFI-AIRPORT"],password:"",auth:"portal",category:"airport",region:"FR",city:"Paris",tips:"Free, portal login",updated:"2025"},
      {id:"fr-cdg-admirals",brand:"Admirals Club CDG",brandZh:"海军上将俱乐部(CDG)",ssid:["Admirals Club"],password:"StVincent2019",auth:"password",category:"airport",region:"FR",city:"Paris",tips:"",updated:"2025"},
      {id:"fr-cdg-espace",brand:"Espace Business CDG",brandZh:"商务空间(CDG)",ssid:["ESPACE_BUSINESS"],password:"ADP2065",auth:"password",category:"airport",region:"FR",city:"Paris",tips:"",updated:"2025"},
      {id:"fr-cdg-sas",brand:"SAS Lounge CDG",brandZh:"北欧航空贵宾室(CDG)",ssid:["SAS WiPoint"],password:"SASHOME",auth:"password",category:"airport",region:"FR",city:"Paris",tips:"",updated:"2025"},
      {id:"fr-sncf",brand:"SNCF Train Stations",brandZh:"法国火车站",ssid:["SNCF WiFi"],password:"",auth:"portal",category:"transit",region:"FR",city:"*",tips:"Free WiFi in major stations",updated:"2025"},

      // ===== GERMANY =====
      {id:"de-fra",brand:"Frankfurt Airport",brandZh:"法兰克福机场",ssid:["Airport-Frankfurt-Free-WiFi"],password:"",auth:"open",category:"airport",region:"DE",city:"Frankfurt",tips:"Open, free",updated:"2025"},
      {id:"de-db-station",brand:"Deutsche Bahn Stations",brandZh:"德国火车站",ssid:["WIFI@DB"],password:"",auth:"open",category:"transit",region:"DE",city:"*",tips:"Open, free in major stations",updated:"2025"},
      {id:"de-db-ice",brand:"ICE Train WiFi",brandZh:"ICE高铁WiFi",ssid:["WIFIonICE"],password:"",auth:"open",category:"transit",region:"DE",city:"*",tips:"Free on ICE trains",updated:"2025"},

      // ===== EUROPE - LOUNGES =====
      {id:"eu-bru-bc",brand:"B.connected BRU",brandZh:"布鲁塞尔机场贵宾",ssid:["B.connected Guests"],password:"hi!belgium",auth:"password",category:"airport",region:"EU",city:"Brussels",tips:"",updated:"2025"},
      {id:"eu-bru-ba",brand:"BA Lounge BRU",brandZh:"英航贵宾室(BRU)",ssid:["British Airways Lounge"],password:"singapore",auth:"password",category:"airport",region:"EU",city:"Brussels",tips:"",updated:"2025"},
      {id:"eu-bru-diamond",brand:"Diamond Lounge BRU",brandZh:"钻石贵宾室(BRU)",ssid:["DIAMOND"],password:"Welcome1",auth:"password",category:"airport",region:"EU",city:"Brussels",tips:"",updated:"2025"},
      {id:"eu-bud-mc",brand:"Mastercard Lounge BUD",brandZh:"万事达贵宾室(BUD)",ssid:["Mastercard_wifi"],password:"mastercard",auth:"password",category:"airport",region:"EU",city:"Budapest",tips:"",updated:"2025"},
      {id:"eu-bud-sky",brand:"SkyCourt Lounge BUD",brandZh:"SkyCourt贵宾室(BUD)",ssid:["SkyCourt-Lounge"],password:"Skycourt1",auth:"password",category:"airport",region:"EU",city:"Budapest",tips:"",updated:"2025"},
      {id:"eu-cph-sas",brand:"SAS Lounge CPH",brandZh:"北欧航空贵宾室(CPH)",ssid:["SAS lounge"],password:"SASHOME",auth:"password",category:"airport",region:"EU",city:"Copenhagen",tips:"",updated:"2025"},
      {id:"eu-txl-lounge",brand:"Berlin Tegel Lounge",brandZh:"柏林机场贵宾室",ssid:["Lounge-Terminal C"],password:"!Lounge#",auth:"password",category:"airport",region:"EU",city:"Berlin",tips:"",updated:"2025"},
      {id:"eu-lis-ana",brand:"ANA Lounge LIS",brandZh:"ANA贵宾室(里斯本)",ssid:["ANA Lounge"],password:"WIFI@ANA-Lounge",auth:"password",category:"airport",region:"EU",city:"Lisbon",tips:"",updated:"2025"},
      {id:"eu-lis-tap",brand:"TAP Lounge LIS",brandZh:"TAP贵宾室(里斯本)",ssid:["_TAP Lounge"],password:"Welcome2LIS",auth:"password",category:"airport",region:"EU",city:"Lisbon",tips:"",updated:"2025"},
      {id:"eu-mad-iberia",brand:"Iberia Lounge MAD",brandZh:"伊比利亚贵宾室(MAD)",ssid:["Iberia Lounge"],password:"panama",auth:"password",category:"airport",region:"EU",city:"Madrid",tips:"",updated:"2025"},
      {id:"eu-mad-vip",brand:"VIP AENA MAD",brandZh:"VIP贵宾室(MAD)",ssid:["VIP AENA"],password:"tcy4332",auth:"password",category:"airport",region:"EU",city:"Madrid",tips:"",updated:"2025"},
      {id:"eu-mxp-ba",brand:"BA Lounge MXP",brandZh:"英航贵宾室(米兰)",ssid:["British Airways lounge"],password:"singapore",auth:"password",category:"airport",region:"EU",city:"Milan",tips:"",updated:"2025"},
      {id:"eu-fco-avia",brand:"Aviapartner FCO",brandZh:"Aviapartner(罗马)",ssid:["Aviapartner"],password:"Aviapartner01",auth:"password",category:"airport",region:"EU",city:"Rome",tips:"",updated:"2025"},
      {id:"eu-fco-ba",brand:"BA Lounge FCO",brandZh:"英航贵宾室(罗马)",ssid:["British Airways Lounge"],password:"singapore",auth:"password",category:"airport",region:"EU",city:"Rome",tips:"",updated:"2025"},
      {id:"eu-fco-star",brand:"Star Alliance Lounge FCO",brandZh:"星空联盟贵宾室(罗马)",ssid:["Star Alliance Lounge"],password:"Romelounge2018",auth:"password",category:"airport",region:"EU",city:"Rome",tips:"",updated:"2025"},
      {id:"eu-arn-sas",brand:"SAS Lounge ARN",brandZh:"北欧航空贵宾室(斯德哥尔摩)",ssid:["SAS WiPoint"],password:"SASHOME",auth:"password",category:"airport",region:"EU",city:"Stockholm",tips:"",updated:"2025"},
      {id:"eu-hel-sas",brand:"SAS Lounge HEL",brandZh:"北欧航空贵宾室(赫尔辛基)",ssid:["SAS WiPoint"],password:"SASHOME",auth:"password",category:"airport",region:"EU",city:"Helsinki",tips:"",updated:"2025"},

      // ===== EUROPE - OTHER AIRPORTS =====
      {id:"eu-ams",brand:"Schiphol Airport",brandZh:"阿姆斯特丹机场",ssid:["Airport_Free_WiFi"],password:"",auth:"portal",category:"airport",region:"EU",city:"Amsterdam",tips:"Time-limited captive portal",updated:"2025"},
      {id:"eu-bcn",brand:"Barcelona Airport",brandZh:"巴塞罗那机场",ssid:["Free WiFi"],password:"",auth:"open",category:"airport",region:"EU",city:"Barcelona",tips:"Open, all terminals",updated:"2025"},
      {id:"eu-vie",brand:"Vienna Airport",brandZh:"维也纳机场",ssid:["AIRPORT_FREE_WIFI"],password:"",auth:"open",category:"airport",region:"EU",city:"Vienna",tips:"Open",updated:"2025"},
      {id:"eu-prg",brand:"Prague Airport",brandZh:"布拉格机场",ssid:["Free WiFi"],password:"",auth:"open",category:"airport",region:"EU",city:"Prague",tips:"Open throughout",updated:"2025"},
      {id:"eu-hel",brand:"Helsinki Airport",brandZh:"赫尔辛基机场",ssid:["Helsinki Airport Free Wi-Fi"],password:"",auth:"open",category:"airport",region:"EU",city:"Helsinki",tips:"Open",updated:"2025"},
      {id:"eu-ist",brand:"Istanbul Airport",brandZh:"伊斯坦布尔机场",ssid:["IST-Free-WiFi"],password:"",auth:"open",category:"airport",region:"EU",city:"Istanbul",tips:"Open",updated:"2025"},
      {id:"eu-mad-airport",brand:"Madrid Airport",brandZh:"马德里机场",ssid:["Airport_Free_Wifi_AENA"],password:"",auth:"open",category:"airport",region:"EU",city:"Madrid",tips:"Open",updated:"2025"},
      {id:"eu-fco-airport",brand:"Rome Fiumicino Airport",brandZh:"罗马机场",ssid:["AIRPORT FREE WIFI"],password:"",auth:"open",category:"airport",region:"EU",city:"Rome",tips:"Open",updated:"2025"},

      // ===== EUROPE - CAFES =====
      {id:"eu-stureplan",brand:"Cafe Stureplan",brandZh:"Stureplan咖啡",ssid:["CafeStureplan"],password:"Nybrogatan21",auth:"password",category:"cafe",region:"EU",city:"Stockholm",tips:"Address as password",updated:"2025"},
      {id:"eu-cafe60",brand:"Cafe 60",brandZh:"Cafe 60",ssid:["Cafe60"],password:"Ilikecoffee",auth:"password",category:"cafe",region:"EU",city:"Stockholm",tips:"",updated:"2025"},
      {id:"eu-doncamillo",brand:"DonCamillo",brandZh:"DonCamillo",ssid:["DonCamillo"],password:"doncamillo",auth:"password",category:"restaurant",region:"EU",city:"*",tips:"",updated:"2025"},
      {id:"eu-olearys",brand:"O'Leary's",brandZh:"O'Leary's",ssid:["OLearys"],password:"guinness",auth:"password",category:"restaurant",region:"EU",city:"*",tips:"",updated:"2025"},
      {id:"eu-rambler",brand:"The Rambler",brandZh:"The Rambler",ssid:["TheRambler"],password:"1234567890",auth:"password",category:"restaurant",region:"EU",city:"*",tips:"",updated:"2025"},

      // ===== UAE =====
      {id:"ae-dxb",brand:"Dubai Airport",brandZh:"迪拜机场",ssid:["DXB Free WiFi"],password:"",auth:"open",category:"airport",region:"AE",city:"Dubai",tips:"Open, free",updated:"2025"},
      {id:"ae-doh",brand:"Doha Hamad Airport",brandZh:"多哈机场",ssid:["HIAQatarComplimentary"],password:"",auth:"open",category:"airport",region:"AE",city:"Doha",tips:"Open, free",updated:"2025"},

      // ===== COLOMBIA =====
      {id:"co-bog-avianca",brand:"Avianca VIP BOG",brandZh:"哥伦比亚航空贵宾室",ssid:["Avianca VIP lounge"],password:"Movistaru",auth:"password",category:"airport",region:"LATAM",city:"Bogota",tips:"",updated:"2025"},

      // ===== SRI LANKA =====
      {id:"lk-cmb-araliya",brand:"Araliya Lounge CMB",brandZh:"Araliya贵宾室(科伦坡)",ssid:["Araliya Lounge"],password:"B1@lounge",auth:"password",category:"airport",region:"LK",city:"Colombo",tips:"",updated:"2025"},
      {id:"lk-cmb-wdf",brand:"World Duty Free CMB",brandZh:"免税店WiFi(科伦坡)",ssid:["World Duty Free"],password:"WDFG@T803",auth:"password",category:"airport",region:"LK",city:"Colombo",tips:"",updated:"2025"},
      {id:"lk-cmb-lotus",brand:"Lotus Lounge CMB",brandZh:"Lotus贵宾室(科伦坡)",ssid:["#WIFI@LotusLounge"],password:"biainter",auth:"password",category:"airport",region:"LK",city:"Colombo",tips:"User: biainter / Pass: biainter",updated:"2025"},

      // ===== INDONESIA =====
      {id:"id-dps-manda",brand:"Restaurant Manda DPS",brandZh:"Manda餐厅(巴厘岛)",ssid:["Restaurant Manda"],password:"lovebali",auth:"password",category:"restaurant",region:"ID",city:"Bali",tips:"",updated:"2025"},
      {id:"id-dps-lastwave",brand:"Last Wave DPS",brandZh:"Last Wave(巴厘岛)",ssid:["lastwave"],password:"funboard",auth:"password",category:"restaurant",region:"ID",city:"Bali",tips:"",updated:"2025"},
      {id:"id-dps-tg",brand:"TG Premium Lounge DPS",brandZh:"TG贵宾室(巴厘岛)",ssid:["TG PREMIUM LOUNGE"],password:"tg13042017",auth:"password",category:"airport",region:"ID",city:"Bali",tips:"",updated:"2025"},
      {id:"id-dps-premier",brand:"Premier Lounge DPS",brandZh:"Premier贵宾室(巴厘岛)",ssid:["Premier lounge"],password:"dps1",auth:"password",category:"airport",region:"ID",city:"Bali",tips:"",updated:"2025"},
      {id:"id-cgk",brand:"Jakarta Airport",brandZh:"雅加达机场",ssid:["FreeWifi@CGK"],password:"",auth:"open",category:"airport",region:"ID",city:"Jakarta",tips:"Open",updated:"2025"},

      // ===== MEXICO =====
      {id:"mx-cun",brand:"Cancun Airport",brandZh:"坎昆机场",ssid:["CUN Wi-Fi"],password:"",auth:"portal",category:"airport",region:"MX",city:"Cancun",tips:"60 min free",updated:"2025"},
      {id:"mx-mex",brand:"Mexico City Airport",brandZh:"墨西哥城机场",ssid:["Infinitum"],password:"",auth:"portal",category:"airport",region:"MX",city:"Mexico City",tips:"45 min free",updated:"2025"},

      // ===== SOUTH AMERICA =====
      {id:"br-gru",brand:"Sao Paulo Airport",brandZh:"圣保罗机场",ssid:["GRU Wi-Fi Gratis"],password:"",auth:"open",category:"airport",region:"BR",city:"Sao Paulo",tips:"Open",updated:"2025"},
      {id:"ar-eze",brand:"Buenos Aires Airport",brandZh:"布宜诺斯艾利斯机场",ssid:["Aeropuertos 2000"],password:"",auth:"open",category:"airport",region:"AR",city:"Buenos Aires",tips:"Open",updated:"2025"},
      {id:"pe-lim",brand:"Lima Airport",brandZh:"利马机场",ssid:[".FreeAeropuertoGTD"],password:"",auth:"open",category:"airport",region:"PE",city:"Lima",tips:"Open",updated:"2025"},
      {id:"pe-starbucks",brand:"Starbucks Peru",brandZh:"星巴克(秘鲁)",ssid:["RED_STB"],password:"",auth:"open",category:"cafe",region:"PE",city:"*",tips:"No password",updated:"2025"},

      // ===== AFRICA =====
      {id:"za-jnb",brand:"Johannesburg Airport",brandZh:"约翰内斯堡机场",ssid:["#Airports@WiFi"],password:"",auth:"portal",category:"airport",region:"ZA",city:"Johannesburg",tips:"1GB / 4 hours free",updated:"2025"},
      {id:"za-cpt",brand:"Cape Town Airport",brandZh:"开普敦机场",ssid:["#CPTFreeWiFi"],password:"",auth:"portal",category:"airport",region:"ZA",city:"Cape Town",tips:"1GB / 4 hours free",updated:"2025"},

      // ===== PHILIPPINES =====
      {id:"ph-mnl",brand:"Manila Airport",brandZh:"马尼拉机场",ssid:["GlobeFreeWiFi@NAIA"],password:"",auth:"portal",category:"airport",region:"PH",city:"Manila",tips:"Accept terms",updated:"2025"},

      // ===== EGYPT =====
      {id:"eg-cai",brand:"Cairo Airport",brandZh:"开罗机场",ssid:["Airport-Free-WiFi"],password:"",auth:"open",category:"airport",region:"EG",city:"Cairo",tips:"Open",updated:"2025"},

      // ===== AUSTRALIA =====
      {id:"au-syd",brand:"Sydney Airport",brandZh:"悉尼机场",ssid:["FREE SYD WiFi"],password:"",auth:"portal",category:"airport",region:"AU",city:"Sydney",tips:"Captive portal",updated:"2025"},

      // ===== NEW ZEALAND =====
      {id:"nz-akl",brand:"Auckland Airport",brandZh:"奥克兰机场",ssid:["AKL Free WiFi"],password:"",auth:"portal",category:"airport",region:"NZ",city:"Auckland",tips:"Captive portal",updated:"2025"},

      // ===== GLOBAL CHAINS =====
      {id:"gl-mcd",brand:"McDonald's (Global)",brandZh:"麦当劳(全球)",ssid:["McDonald's Free WiFi"],password:"",auth:"portal",category:"fastfood",region:"GLOBAL",city:"*",tips:"Accept terms. Available in 30,000+ locations worldwide.",updated:"2025"},
      {id:"gl-starbucks",brand:"Starbucks (Global)",brandZh:"星巴克(全球)",ssid:["Starbucks WiFi"],password:"",auth:"portal",category:"cafe",region:"GLOBAL",city:"*",tips:"No password in most countries. Portal login.",updated:"2025"},
      {id:"gl-ikea",brand:"IKEA (Global)",brandZh:"宜家(全球)",ssid:["IKEA WiFi"],password:"",auth:"portal",category:"mall",region:"GLOBAL",city:"*",tips:"Accept terms",updated:"2025"},

      // ===== COMMON GLOBAL PATTERNS =====
      {id:"gl-marriott",brand:"Marriott (Global)",brandZh:"万豪(全球)",ssid:["MarriottBonvoy_Guest","Sheraton_Guest","Westin_Guest","Courtyard_Guest"],password:"",auth:"portal",category:"hotel",region:"GLOBAL",city:"*",tips:"Last name + room number. Applies to all Marriott brands (Sheraton, Westin, Courtyard, etc.)",updated:"2025"},
      {id:"gl-hilton",brand:"Hilton (Global)",brandZh:"希尔顿(全球)",ssid:["Hilton Honors","hhonors"],password:"",auth:"portal",category:"hotel",region:"GLOBAL",city:"*",tips:"Last name + room number, or HHonors member login",updated:"2025"},
      {id:"gl-ihg",brand:"IHG (Global)",brandZh:"洲际(全球)",ssid:["IHG Connect"],password:"",auth:"portal",category:"hotel",region:"GLOBAL",city:"*",tips:"Last name + room number. Covers Holiday Inn, Crowne Plaza, etc.",updated:"2025"},
      ];

      // ==================== APP LOGIC ====================
      const CATEGORIES = {
        all:{label:"All / 全部",icon:"&#x1F4F6;"},
        cafe:{label:"Cafe / 咖啡茶饮",icon:"&#x2615;"},
        fastfood:{label:"Fast Food / 快餐",icon:"&#x1F354;"},
        restaurant:{label:"Restaurant / 餐厅",icon:"&#x1F37D;"},
        hotel:{label:"Hotel / 酒店",icon:"&#x1F3E8;"},
        airport:{label:"Airport / 机场",icon:"&#x2708;"},
        transit:{label:"Transit / 交通",icon:"&#x1F689;"},
        mall:{label:"Mall / 商场",icon:"&#x1F6CD;"},
        public:{label:"Public / 公共",icon:"&#x1F3DB;"},
        cowork:{label:"Cowork / 办公",icon:"&#x1F4BC;"},
        other:{label:"Other / 其他",icon:"&#x1F4CC;"}
      };

      const REGIONS = {
        all:{label:"All",flag:"&#x1F30D;"},
        CN:{label:"China",flag:"&#x1F1E8;&#x1F1F3;"},
        HK:{label:"HK",flag:"&#x1F1ED;&#x1F1F0;"},

        JP:{label:"Japan",flag:"&#x1F1EF;&#x1F1F5;"},
        KR:{label:"Korea",flag:"&#x1F1F0;&#x1F1F7;"},
        SG:{label:"Singapore",flag:"&#x1F1F8;&#x1F1EC;"},
        TH:{label:"Thailand",flag:"&#x1F1F9;&#x1F1ED;"},
        MY:{label:"Malaysia",flag:"&#x1F1F2;&#x1F1FE;"},
        VN:{label:"Vietnam",flag:"&#x1F1FB;&#x1F1F3;"},
        IN:{label:"India",flag:"&#x1F1EE;&#x1F1F3;"},
        US:{label:"USA",flag:"&#x1F1FA;&#x1F1F8;"},
        CA:{label:"Canada",flag:"&#x1F1E8;&#x1F1E6;"},
        GB:{label:"UK",flag:"&#x1F1EC;&#x1F1E7;"},
        FR:{label:"France",flag:"&#x1F1EB;&#x1F1F7;"},
        DE:{label:"Germany",flag:"&#x1F1E9;&#x1F1EA;"},
        EU:{label:"Europe",flag:"&#x1F1EA;&#x1F1FA;"},
        AE:{label:"UAE",flag:"&#x1F1E6;&#x1F1EA;"},
        AU:{label:"Australia",flag:"&#x1F1E6;&#x1F1FA;"},
        ID:{label:"Indonesia",flag:"&#x1F1EE;&#x1F1E9;"},
        GLOBAL:{label:"Global",flag:"&#x1F30E;"},
        OTHER:{label:"Other",flag:"&#x1F30F;"}
      };

      let allData = [];
      let userData = [];
      let currentCategory = 'all';
      let currentRegion = 'all';
      let currentSearch = '';
      let currentView = 'all';

      function init(){
        userData = JSON.parse(localStorage.getItem('wifi_user_data')||'[]');
        allData = [...WIFI_DB,...userData.map(u=>({...u,isUser:true}))];
        renderCategoryTabs();
        renderRegionTabs();
        renderCards();
        updateStats();

        document.getElementById('searchInput').addEventListener('input',e=>{
          currentSearch=e.target.value.toLowerCase().trim();
          renderCards();
        });

        // Theme
        if(localStorage.getItem('wifi_theme')==='light'){
          document.body.classList.add('light');
          document.getElementById('themeBtn').innerHTML='&#x2600;';
        }
      }

      function renderCategoryTabs(){
        const c=document.getElementById('categoryTabs');
        c.innerHTML=Object.entries(CATEGORIES).map(([k,v])=>
          `<div class="tab${currentCategory===k?' active':''}" onclick="setCategory('${k}')">${v.icon} ${v.label}</div>`
        ).join('');
      }

      function renderRegionTabs(){
        const c=document.getElementById('regionTabs');
        // Only show regions that have data
        const activeRegions=new Set(allData.map(d=>d.region));
        c.innerHTML=Object.entries(REGIONS).filter(([k])=>k==='all'||activeRegions.has(k)).map(([k,v])=>
          `<div class="rtab${currentRegion===k?' active':''}" onclick="setRegion('${k}')">${v.flag} ${v.label}</div>`
        ).join('');
      }

      function setCategory(cat){
        currentCategory=cat;
        renderCategoryTabs();
        renderCards();
      }

      function setRegion(reg){
        currentRegion=reg;
        renderRegionTabs();
        renderCards();
      }

      function setView(view,btn){
        currentView=view;
        document.querySelectorAll('.footer-nav button').forEach(b=>b.classList.remove('active'));
        if(btn)btn.classList.add('active');
        renderCards();
      }

      function filterData(){
        return allData.filter(d=>{
          if(currentView==='password'&&d.auth!=='password')return false;
          if(currentView==='user'&&!d.isUser)return false;
          if(currentCategory!=='all'&&d.category!==currentCategory)return false;
          if(currentRegion!=='all'&&d.region!==currentRegion)return false;
          if(currentSearch){
            const s=currentSearch;
            const hay=[d.brand,d.brandZh||'',d.ssid.join(' '),d.password||'',d.city||'',d.tips||'',d.region].join(' ').toLowerCase();
            return hay.includes(s);
          }
          return true;
        });
      }

      function renderCards(){
        const data=filterData();
        const grid=document.getElementById('grid');
        const empty=document.getElementById('empty');

        if(!data.length){
          grid.innerHTML='';
          empty.style.display='block';
          return;
        }
        empty.style.display='none';

        grid.innerHTML=data.map((d,i)=>{
          const authBadge={password:'badge-password',open:'badge-open',portal:'badge-portal',sms:'badge-sms'}[d.auth]||'badge-portal';
          const authLabel={password:'Password',open:'Open',portal:'Portal',sms:'SMS'}[d.auth]||d.auth;
          const regionInfo=REGIONS[d.region]||REGIONS.OTHER;
          const brandDisplay=d.brandZh?`${d.brandZh}<small>${d.brand}</small>`:d.brand;

          let pwdHtml='';
          if(d.password){
            pwdHtml=`<div class="card-row"><span class="label">Pass:</span><div class="pwd-wrap"><span class="val pwd-val">${escHtml(d.password)}</span><button class="copy-btn" onclick="event.stopPropagation();copyPwd(this,'${escAttr(d.password)}')" title="Copy">&#x1F4CB;</button></div></div>`;
          }

          return `<div class="card" style="animation-delay:${Math.min(i*0.02,0.3)}s">
            <div class="card-head">
              <div class="card-brand">${brandDisplay}</div>
              <span class="card-badge ${authBadge}">${authLabel}</span>
            </div>
            <div class="card-row"><span class="label">SSID:</span><span class="val ssid-val">${d.ssid.map(escHtml).join(' / ')}</span></div>
            ${pwdHtml}
            ${d.tips?`<div class="card-tips">${escHtml(d.tips)}</div>`:''}
            <div class="card-meta"><span>${regionInfo.flag} ${d.city||''}</span>${d.isUser?'<span style="color:var(--purple)">User Added</span>':''}</div>
          </div>`;
        }).join('');
      }

      function escHtml(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
      function escAttr(s){return String(s).replace(/'/g,"\\'").replace(/"/g,'&quot;')}

      function copyPwd(btn,pwd){
        navigator.clipboard.writeText(pwd).then(()=>{
          btn.classList.add('copied');
          btn.innerHTML='&#x2714;';
          showToast('Password copied!');
          if(navigator.vibrate)navigator.vibrate(50);
          setTimeout(()=>{btn.classList.remove('copied');btn.innerHTML='&#x1F4CB;';},1500);
        }).catch(()=>{
          // Fallback
          const ta=document.createElement('textarea');
          ta.value=pwd;document.body.appendChild(ta);ta.select();
          document.execCommand('copy');document.body.removeChild(ta);
          btn.classList.add('copied');btn.innerHTML='&#x2714;';
          showToast('Password copied!');
          setTimeout(()=>{btn.classList.remove('copied');btn.innerHTML='&#x1F4CB;';},1500);
        });
      }

      function showToast(msg){
        const t=document.getElementById('toast');
        t.textContent=msg;t.classList.add('show');
        setTimeout(()=>t.classList.remove('show'),2000);
      }

      function updateStats(){
        document.getElementById('totalCount').textContent=allData.length;
        document.getElementById('regionCount').textContent=new Set(allData.map(d=>d.region)).size;
        document.getElementById('pwdCount').textContent=allData.filter(d=>d.password&&d.auth==='password').length;
        document.getElementById('userCount').textContent=userData.length;
      }

      function toggleTheme(){
        document.body.classList.toggle('light');
        const isLight=document.body.classList.contains('light');
        localStorage.setItem('wifi_theme',isLight?'light':'dark');
        document.getElementById('themeBtn').innerHTML=isLight?'&#x2600;':'&#x1F319;';
      }

      function showModal(name){document.getElementById('modal-'+name).classList.add('show')}
      function hideModal(name){document.getElementById('modal-'+name).classList.remove('show')}

      // Click outside to close
      document.addEventListener('click',e=>{
        if(e.target.classList.contains('modal-overlay'))e.target.classList.remove('show');
      });

      function submitContrib(){
        const brand=document.getElementById('f-brand').value.trim();
        const ssid=document.getElementById('f-ssid').value.trim();
        if(!brand||!ssid){showToast('Brand and SSID are required!');return;}

        const entry={
          id:'user-'+Date.now(),
          brand:brand,
          brandZh:'',
          ssid:[ssid],
          password:document.getElementById('f-pwd').value.trim(),
          auth:document.getElementById('f-auth').value,
          category:document.getElementById('f-cat').value,
          region:document.getElementById('f-region').value,
          city:document.getElementById('f-city').value.trim()||'*',
          tips:document.getElementById('f-tips').value.trim(),
          updated:new Date().toISOString().slice(0,7),
          isUser:true
        };

        userData.push(entry);
        localStorage.setItem('wifi_user_data',JSON.stringify(userData));
        allData.push(entry);

        // Clear form
        ['f-brand','f-ssid','f-pwd','f-city','f-tips'].forEach(id=>document.getElementById(id).value='');

        hideModal('contribute');
        renderCards();
        updateStats();
        showToast('WiFi added successfully!');
      }

      function exportData(){
        document.getElementById('ie-data').value=JSON.stringify(allData,null,2);
        showToast('Data exported to textarea');
      }

      function exportUserData(){
        document.getElementById('ie-data').value=JSON.stringify(userData,null,2);
        showToast('User data exported');
      }

      function importData(){
        const raw=document.getElementById('ie-data').value.trim();
        if(!raw){showToast('Paste JSON first!');return;}
        try{
          const imported=JSON.parse(raw);
          if(!Array.isArray(imported)){showToast('Must be a JSON array!');return;}
          let count=0;
          imported.forEach(item=>{
            if(item.brand&&item.ssid){
              item.isUser=true;
              item.id=item.id||'user-'+Date.now()+'-'+Math.random().toString(36).slice(2,6);
              userData.push(item);
              allData.push(item);
              count++;
            }
          });
          localStorage.setItem('wifi_user_data',JSON.stringify(userData));
          renderCards();
          updateStats();
          renderRegionTabs();
          showToast(`Imported ${count} entries!`);
        }catch(e){showToast('Invalid JSON: '+e.message);}
      }

      // Init
      init();
    </script>
  </body>
</html>
```

**使用方法：**

1. 下载这个 HTML 文件

1. 用任意浏览器打开它

1. 搜索你要去的地方或品牌

1. 复制密码，连接 WiFi

你还可以通过"+"按钮添加你发现的新 WiFi 数据，通过导入导出功能和朋友分享数据。

### 写在最后

这个小工具解决的问题很简单，但它背后代表了一种趋势：**在 AI 时代，每个人都可以成为自己需求的开发者。** 你不需要学三个月编程，不需要搭建开发环境，不需要看 Stack Overflow——你只需要清楚地知道自己要什么，然后用自然语言告诉 AI。

如果你也有类似的"小痛点"，不妨试试 Vibe Coding。也许 30 分钟后，你就能拥有一个专属于你的解决方案。

---

*本文首发于 *[*黑粉科技 hyphentech.top*](https://hyphentech.top/)*。让普通人也能驾驭 AI。*
