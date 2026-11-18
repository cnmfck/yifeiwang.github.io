# Changelog 更新记录

## v1.2 (2026-11-18)

- Added the portrait in a new folder, `assets/img/portrait/portrait.jpg` (replaces the old `profile/` placeholder slot). 新建 `assets/img/portrait/` 存放个人照片。
- Home cover: photo moved so the big name no longer covers the face. 首页封面调整照片位置，大字不再挡住脸。
- Redesigned 404 page as a magazine errata page: dashed cut-out frame with moving scissors, out-of-register 404, spinning badge back to the home page, list of all pages, editor’s note with photo and email. 404 页重新设计为杂志"勘误"页。
- 404 links now work at nested missing addresses on GitHub Pages and when the file is opened locally. 404 页在任意不存在的地址和本地打开时链接都正常。
- Chinese punctuation no longer wraps onto its own line in animated headings. 动画标题里的中文标点不再单独换行。

## v1.1 (2026-11-18)

- Removed the Chinese name 王奕霏 from the home cover and the header. 首页封面和顶部栏去掉"王奕霏"。
- Footer cut to email, © 2026, Sitemap and Back to top. 页脚只保留邮箱、© 2026、网站地图、回到顶部。
- Home condensed to about half its length: cover with a Highlights list (Director of Marketing, CAS research intern, speech contest first prize, UIBE ambassador), one At a glance block with smaller numbers, Selected work, Skills. Removed the Now panel, pull quote and contents list. Smaller cover and section type. 首页压缩到约一半长度，封面加入四条代表经历，数字与简介合并为"概览"，删除"现在"、引言、目录，字号整体调小。
- All English copy edited with the humanizer rules and all Chinese copy with humanizer-zh, so the Chinese reads as written in Chinese, not translated. 英文按 humanizer、中文按 humanizer-zh 全部改写，中文不再有翻译腔。
- Social sharing image redrawn without the Chinese name. 分享预览图同步去掉中文名。

## v1.0 (2026-11-18)

First release. 首个版本。

- Magazine design on newsprint-grey paper: Bodoni cover lines, heavy grotesk numbers, pink hand-written script. 报纸灰纸色杂志风：Bodoni 封面大字、粗体数字、粉色手写体。
- Four main pages (Home, Timeline, Portfolio, Contact) plus a 404 page. 四个主页面加 404 页。
- Every résumé item is shown on the site (education, coursework, interests, all roles, projects, awards, training, skills, languages); no separate résumé download. 简历全部内容分布在网站各页，不单独提供简历下载。
- English/Chinese switch with English as default; choice remembered across pages. 中英切换，默认英文，跨页面记住选择。
- Animations: cover entrance, spinning badge, ticker, word-by-word headlines, script writing, count-up numbers, parallax photos, scroll-drawn timeline, custom cursor, reading progress, page transitions; all off for reduced-motion users. 动画效果，开启"减少动态效果"时全部关闭。
- Timeline and portfolio filters; portfolio detail window with deep links like `portfolio.html#makeup`. 经历与作品筛选；作品详情弹窗，支持直接链接。
- Contact page: statement plus a contact card (preferred email, Queen’s email, phone, LinkedIn, location) with copy buttons. 联系页：标题加联系卡片，可一键复制。
- Content matches the graduate CV (coursework, interests, skills, languages, award details). 内容与研究生 CV 一致。
- Domain set to yifeiwang.cc; home links point to index.html so they also work when opened from local files. 域名设为 yifeiwang.cc；首页链接改为 index.html，本地打开也能正常跳转。
- Placeholder art for all 22 photo slots; real photos replace them automatically by file name. 22 个照片位使用占位图，按文件名放入照片即自动替换。
- sitemap.xml, robots.txt, CNAME, .nojekyll, web manifest, favicons, social sharing image, structured data. 部署与 SEO 文件。
