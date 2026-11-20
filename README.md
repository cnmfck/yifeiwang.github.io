# Yifei Wang (王奕霏) — Personal Website / 个人网站

**Version 版本: v1.5 (2026-11-18)**

A bilingual (English / 中文) portfolio site for graduate applications, built with plain HTML, CSS and JavaScript and hosted on GitHub Pages with a custom domain.
中英双语个人作品集网站，用于研究生申请。纯 HTML、CSS、JavaScript 编写，部署在 GitHub Pages 并绑定自有域名。

---

## 1. Pages 页面

| File 文件 | Page 页面 | Content 内容 |
|---|---|---|
| `index.html` | Home 首页 | Cover with a four-line Highlights list, keyword ticker, At a glance (short intro, numbers, education, coursework, interests, languages), Selected work, Skills and languages 封面（含四条代表经历）、关键词滚动条、概览（简介、数字、学业、课程、兴趣、语言）、作品精选、技能与语言 |
| `timeline.html` | Timeline 经历 | Every résumé entry since 2022 with filters and a scroll-drawn line, then skills and languages 简历上的全部经历，可筛选，时间轴随滚动画线，末尾附技能与语言 |
| `portfolio.html` | Portfolio 作品 | 10 projects with filters; each opens a detail window with facts and photos 10 个作品，可筛选，点开有详情和图集 |
| `contact.html` | Contact 联系 | Statement on the left; contact card on the right: Queen’s email (preferred), personal email, phone, LinkedIn, location, with copy buttons 左侧标题，右侧联系卡片：皇后大学邮箱（首选）、个人邮箱、电话、LinkedIn、所在地，可一键复制 |
| `qcssa.html` | QCSSA case study 宣传案例 | Mid-Autumn article in full inside a phone on a navy “moon” stage; Year of the Horse and White Dew side by side on themed stages; all 21 WeChat articles (covers pop out on hover); 8 graphic posts on a pinboard; 3 more Instagram posts; QCSSA’s official accounts. 中秋完整推送、马年与白露并排、21 篇推送、8 张图文海报、3 条 Instagram、官方账号 |
| `cosplay.html` | Cosplay lookbook Cosplay 作品集 | Three looks, each in a section coloured after its shoot: Kita Ikuyo (night, red), Misa Amane (limestone, arched frame like Ontario Hall’s windows), Mizuki (deep-sea neon). Click any photo to open it full screen; arrows, arrow keys or swipe to move. 三套造型，每套的配色取自那组照片：喜多郁代（夜色、红）、弥海砂（石灰岩、仿 Ontario Hall 窗户的拱形相框）、水月（深海霓虹）。点任意照片全屏看大图，可用箭头、方向键或滑动切换。 |
| `writing.html` | Film and media writing 电影与媒体写作 | The featured essay (culture jamming) on a dark “screen” band, the psychology concepts the essays use, all eight essays grouped by course with a one-paragraph summary, and the scholars read along the way. 精选文章（文化干扰）放在深色“银幕”区块，接着是文章里用到的心理学概念、按课程排列的八篇文章概要，以及读过的学者。 |
| `404.html` | Not found 404 页 | Magazine "errata" page: a dashed cut-out with the 404, a link list of all pages, and an editor’s note with your photo and email. Works at any missing address and when opened locally. 杂志"勘误"风格：虚线剪切框里的 404、全站页面目录、带照片和邮箱的编者按；任何不存在的地址都能正常显示，本地打开也正常 |

## 2. Folder structure 目录结构

```
yifei-wang-site/
├── index.html  timeline.html  portfolio.html  contact.html  404.html
├── css/style.css            all styles 全部样式
├── js/main.js               language switch, filters, detail window, copy buttons, animations 语言切换、筛选、详情弹窗、复制按钮、动画
├── assets/
│   ├── fonts/               self-hosted fonts: Bodoni Moda, Schibsted Grotesk, Mrs Saint Delafield (SIL OFL) 自托管字体
│   ├── img/
│   │   ├── portrait/        portrait.jpg, your photo (cover and 404 page) 个人照片（首页封面和 404 页使用）
│   │   ├── qcssa/           WeChat article covers and the long screenshot; .svg files are the typographic stand-ins 公众号头图与长图；.svg 是排版占位图
│   │   ├── portfolio/       project photos go here 作品照片放这里
│   │   ├── placeholders/    art shown until a photo exists 没有照片时显示的占位图
│   │   ├── favicon.svg, favicon-32.png, apple-touch-icon.png, icon-192/512.png
│   │   └── og-cover.png     preview image for social sharing 分享预览图
├── sitemap.xml  robots.txt  site.webmanifest
├── CNAME                    custom domain for GitHub Pages 自定义域名
├── .nojekyll                tells GitHub Pages to serve files as-is 让 GitHub Pages 直接发布文件
├── VERSION  CHANGELOG.md  README.md
```

## 3. Deploy to GitHub Pages 部署到 GitHub Pages

1. **Domain 域名:** already set to `yifeiwang.cc` in `CNAME`, `sitemap.xml`, `robots.txt` and every page's `<head>`. 域名已全部设置为 `yifeiwang.cc`。
2. Create a GitHub repository (public) and upload **the contents of this folder** to the repository root (not the folder itself).
   新建一个公开仓库，把本文件夹**里面的所有文件**上传到仓库根目录（不要多套一层文件夹）。`.nojekyll` 是隐藏文件，也要上传。
3. Repository → **Settings → Pages** → Source: *Deploy from a branch* → Branch `main`, folder `/ (root)` → Save.
4. In the same page, type your domain under **Custom domain** and save. Tick **Enforce HTTPS** once it becomes available.
   在同一页面的 Custom domain 填入域名并保存；证书生成后勾选 Enforce HTTPS。
5. At your domain registrar, add DNS records 在域名服务商处添加解析:
   | Type | Host | Value |
   |---|---|---|
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |
   | CNAME | www | `YOUR-GITHUB-USERNAME.github.io` |
   DNS can take up to a day to spread. 解析生效可能需要几小时到一天。
6. Submit `https://yifeiwang.cc/sitemap.xml` in Google Search Console (and Bing Webmaster Tools) so the site gets indexed.
   在 Google Search Console 提交 sitemap，方便被搜索引擎收录。

## 4. Editing text 修改文字

Every bilingual sentence is written twice, side by side:
每句双语文字都并排写两遍：

```html
<span data-lang="en">View portfolio</span><span data-lang="zh">查看作品</span>
```

Edit both. The button in the header switches languages; the choice is remembered and added to links as `?lang=zh`. English is the default.
两种语言都要改。页头按钮切换语言，选择会被记住，并以 `?lang=zh` 带到站内链接。默认英文。

Dropdown options and placeholder text keep both languages in attributes (`data-text-en` / `data-text-zh`, `data-placeholder-en` / `data-placeholder-zh`).
下拉选项和输入框提示文字的双语写在属性里。

## 5. Adding photos 添加照片

Drop JPG files with **exactly these names** into the folders below. No code changes needed: until a file exists, the page shows the matching placeholder art.
把 JPG 照片按**下面的文件名**放进对应文件夹即可，无需改代码；没有照片时会自动显示占位图。

| File 文件名 | Used for 用途 | Shape 比例 |
|---|---|---|
| `assets/img/portrait/portrait.jpg` | Home cover and 404 editor’s note (already added) 首页封面和 404 页编者按（已放入） | any; cropped to 4:5 with the face kept near the top 任意比例，裁成 4:5 时保留脸部 |
| `assets/img/portfolio/event-*.jpg` (Mid-Autumn cruise, Spring Festival dinner ×2, Halloween, hanfu group, partner booth) | QCSSA events card, stacked cover, Timeline (already added) QCSSA 活动卡片、叠放封面、经历页（已放入） | 4:3 |
| `assets/img/portfolio/speech-solo.jpg`, `speech-group.jpg`, `speech-certificate.jpg` | Japanese speech contest (already added) 日语演讲比赛（已放入） | as is 原比例 |
| `assets/img/portfolio/cas-certificate.jpg`, `cas-letter-excerpt.jpg` | CAS internship: certificate and the first two paragraphs of the letter (already added) 中科院实习：实习证明、推荐信前两段（已放入） | as is 原比例 |
| `assets/img/portfolio/recall-01.jpg` | Immediate Recall Study cover, Timeline, Home research card (already added; 600 px wide, a larger copy would look sharper) 回忆实验封面、经历页、首页研究卡片（已放入，宽 600 像素，有大图会更清晰） | 3:2 |
| `assets/img/portfolio/qcssa-team-banner.jpg` | QCSSA team with the banner: Timeline (Marketing Officer) and Home media stack (already added) QCSSA 成员和会旗合影：经历页“市场部干事”、首页媒体卡片（已放入） | 3:2 |
| `assets/img/timeline/upath-booth.jpg` | UPATH outreach booth on Timeline (already added) 经历页 UPATH 宣传摊位（已放入） | 4:3 |
| `assets/img/timeline/queens-psychology.jpg` | BA (Honours), Psychology on Timeline (already added) 经历页“心理学荣誉学士”（已放入） | 4:3 |
| `assets/img/portfolio/seed-title.jpg`, `seed-case-1.jpg`, `seed-case-6.jpg` | Counselling course: pages from the phone-interview case document (already added) 心理咨询课程：电话面试案例文档的页面（已放入） | as is 原比例 |
| `assets/img/portfolio/uibe-01.jpg`, `uibe-02.jpg` | UIBE info session: snack table and gifts (already added) UIBE 宣讲会：零食桌和礼品（已放入） | 4:3 |
| `assets/img/portfolio/recall-sheet-story.jpg` | Recall study: a completed story response sheet (already added) 回忆实验：填好的故事记录表（已放入） | as is 原比例 |
| `assets/img/portfolio/writing-cover.jpg` | Film writing card cover, a typeset list of the eight essays (already added) 电影写作卡片封面，八篇文章的排版目录（已放入） | 4:5 |
| `assets/img/cosplay/<look>-NN-m.jpg` and `-l.jpg` | Cosplay lookbook: `kita` (7), `misa` (7), `mizuki` (6). `-m` is about 900 px for the page, `-l` about 1800 px for the photo viewer. To add a photo, save both sizes with the next number and add it to `COS` in `build3.py`. Cosplay 作品集：`kita` 7 张、`misa` 7 张、`mizuki` 6 张。`-m` 约 900 像素用于页面，`-l` 约 1800 像素用于看大图。加新照片要两种尺寸都存，并在 `build3.py` 的 `COS` 里加一行。 | as shot 原比例 |
| `assets/img/cosplay/more/<character>-NN-m.jpg` and `-l.jpg` | Other cosplay, shown together under Mizuki with no names on the page: Power with Denji (8), Reze (5), pink dress (2), Jolyne, Makima, Tomori (already added). Order follows `COS_MORE_NAMES` in `build3.py`. 其他 cosplay，在水月下面合并展示，页面上不显示角色名：帕瓦与电次 8 张、蕾塞 5 张、粉裙 2 张、徐伦、玛奇玛、高松灯各 1 张（已放入），顺序按 `build3.py` 的 `COS_MORE_NAMES`。 | as shot 原比例 |
| `assets/img/portfolio/r-cover.jpg` | R study card cover: the four correlations with 95% CIs (already added) R 研究卡片封面：四个相关系数及 95% 置信区间（已放入） | 4:5 |
| `assets/img/portfolio/makeup-01.jpg` … `makeup-03.jpg` | Makeup card (hidden for now: it lives in `HIDDEN_WORKS` in `build3.py`; move it back into `WORKS` to show it) 化妆卡片（暂时隐藏，在 `build3.py` 的 `HIDDEN_WORKS` 里，移回 `WORKS` 即可显示） | 4:3 or 4:5 |
| `assets/img/portfolio/deadline-logo.png`, `deadline-plate.jpg`, `deadline-plate-tall.jpg` | DeADline logo (transparent) and the logo on navy for the card, dialog and Home stack (already added) 乐队 logo（透明底）及其深蓝底版本，用于卡片、详情窗口和首页（已放入） | 4:3 / 4:5 |

Tips: long side about 1600 px, under 400 KB each (compress at squoosh.app). Photos are cropped to fill their frame, so keep faces near the centre. To change a caption, edit the `<figcaption>` in the hidden `.story-src` block at the bottom of `portfolio.html` and `timeline.html`.
建议：长边约 1600 像素，每张 400 KB 以内。照片会裁切填满画框，人物尽量居中。图注在 `portfolio.html` 和 `timeline.html` 底部隐藏的 `.story-src` 区块里的 `<figcaption>` 修改。

### WeChat and Instagram images 公众号与 Instagram 图片 (`qcssa.html`)

All images live in `assets/img/qcssa/`, cropped from your screenshots (phone and app bars removed), converted to JPG and resized.
图片都在 `assets/img/qcssa/`，已从截图裁掉手机和应用界面，转成 JPG 并缩小。

| Files 文件 | Used for 用途 |
|---|---|
| `midautumn-01.jpg` … `midautumn-06.jpg` | Mid-Autumn cruise, full article in the phone 中秋完整推送 |
| `<slug>.jpg` (21 files, e.g. `cny-fair-horse.jpg`, `canteen.jpg`, `new-members-intro.jpg`) | WeChat article covers 公众号推送缩略图 |
| `post-midautumn-fair.jpg`, `post-sidewalk-a.jpg`, `post-cny-taste.jpg`, `post-labour-day.jpg`, `post-mothers-day.jpg`, `post-xiaoman.jpg`, `post-sidewalk-b.jpg`, `post-uibe-info.jpg` | Graphic posts 图文海报 |
| `ig-bailu.jpg` (DOT1vRnEa3G), `ig-DVxPd-Yli9H.jpg`, `ig-DWDEQ7AFsIG.jpg`, `ig-CyzDngbLRcS.jpg` | Instagram posts, named by link code Instagram 帖子，按链接代码命名 |

The 2024 Spring Festival gala recap still has no WeChat link (its card says “No public link”). 2024 新春嘉年会回顾仍无链接。

### Detail windows 详情窗口

Timeline entries and Portfolio cards open the same window. Each story is written once per page in a hidden `<div class="story-src" id="src-…">`; anything with `data-story="…"` opens it, and `page.html#story-id` opens it directly. Stories shared by both pages: Japanese speech contest, CAS internship, QCSSA events, UIBE outreach, Immediate Recall Study, counselling course.
经历页条目和作品卡片打开的是同一个详情窗口。每个故事在页面底部隐藏的 `.story-src` 里写一次，带 `data-story` 的按钮或图片会打开它，网址加 `#故事id` 也能直接打开。两页共用的有：日语比赛、中科院实习、QCSSA 活动、UIBE 推广、即时回忆实验、心理咨询课程。

### 404 page 404 页面

GitHub Pages serves `404.html` for every address on yifeiwang.cc that doesn’t exist, at any depth, with a real 404 status. The visitor keeps the address they typed, so the page shows it and suggests the closest real page (e.g. `/resume` → Timeline, `/cos` → Cosplay lookbook). A redirect to a fixed URL is deliberately not used: it would hide what was typed and report the missing page as found.
GitHub Pages 会对 yifeiwang.cc 下所有不存在的地址（任何层级）返回 `404.html`，状态码是真正的 404。地址栏保留访客输入的地址，页面会显示这个地址并推荐最接近的页面（如 `/resume` → 经历，`/cos` → Cosplay 作品集）。没有改成跳转到固定网址，因为那样会丢掉访客输入的地址，搜索引擎也会把不存在的页面当成存在。

## 6. Other edits 其他修改

- **Contact details 联系方式:** edit the `CONTACTS` rows in `contact.html` (each row is one `<li class="cline">`). To add Instagram or X, copy the LinkedIn row and change the label, link and text. 在 `contact.html` 修改联系卡片，每一行是一个 `<li class="cline">`；要加 Instagram 或 X，复制 LinkedIn 那行改文字和链接即可。
- **Résumé 简历:** there is no separate PDF on the site on purpose. Every item on the graduate CV appears on the pages: education, coursework and interests on Home (About), all roles and projects on Timeline, skills and languages on Home and Timeline. When the résumé changes, update the matching text. 网站不单独提供简历 PDF，简历上的每一项都分布在各页面里；简历更新时同步修改对应文字。
- **Colours and fonts 颜色字体:** all in the `:root` block at the top of `css/style.css`.

## 7. Versioning 版本规则

Each update gets a new number (v1.0 → v1.1 for content and small fixes, v2.0 for a redesign). When releasing, update:
每次更新都升级版本号（内容/小修 v1.1，改版 v2.0），同时修改：
1. `VERSION` and `CHANGELOG.md`
2. The version comment at the top of every HTML file (generated in `<head>`) 每个页面 `<head>` 里的版本注释
3. `?v=1.6` after `style.css` and `main.js` in all HTML files (forces browsers to load the new files) 强制浏览器加载新文件
4. The version comment at the top of `css/style.css` and `js/main.js`
5. `<lastmod>` dates in `sitemap.xml`

## 8. Draft copy to review 需要本人确认的文字

All English and Chinese copy was edited to read naturally (no stock phrases, no translated-sounding Chinese). A few first-person lines are still drafts written for you; change them to your own words if they don't sound like you:
中英文文案都已改写得更自然。下面几句第一人称文字是替你写的草稿，不像你的口吻就改掉：
- Home: the cover paragraph and the two At a glance paragraphs 首页封面简介和"概览"两段
- Portfolio: cosplay opening sentence and character list; makeup first sentence; film writing first sentence 作品页 cosplay 开头和角色列表、化妆第一句、电影写作第一句
- UIBE start date: the CV says Sep 2024. Confirm it before publishing. UIBE 起始时间请核对。

## 9. Animations 动画效果

All motion lives in `js/main.js` (section 6) and the "MOTION" block in `css/style.css`. Since v1.6 motion runs for every visitor, including devices set to reduce motion, so distances and durations are kept small.
所有动画在 `js/main.js` 第 6 部分和 `css/style.css` 的 MOTION 区块。从 v1.6 起所有访客都能看到动效（包括系统关了动画效果的设备），所以幅度和时长都调小了。

| Effect 效果 | Where 位置 | How to use 用法 |
|---|---|---|
| Letters rise, pink ink slides into register, photo unveils, script writes itself 字母升起、粉色套印就位、照片揭开、手写字书写 | Home cover 首页封面 | automatic 自动 |
| Spinning badge, speeds up when scrolling 旋转徽章，滚动时加速 | Home cover 首页封面 | automatic 自动 |
| Keyword ticker 关键词滚动条 | Home 首页 | hover pauses 悬停暂停 |
| Headlines rise word by word 标题逐词升起 | all pages 各页 | add `data-split` to a heading 给标题加 `data-split` |
| Fade-up reveal 淡入上移 | all pages 各页 | add `data-reveal` (optional `style="--d:.1s"` delay) |
| Script draws in 手写字书写 | all pages 各页 | add `data-reveal="script"` to a `.script` element |
| Numbers count up 数字滚动 | Home, At a glance 首页概览 | `data-count="20"` on `.stat__num` |
| Photo drift 照片视差 | Home 首页 | `data-parallax="0.05"` |
| Line draws and dots light up 时间轴画线、圆点点亮 | Timeline 经历 | automatic 自动 |
| 3D tilt with a light glare 立体倾斜与反光 | Case study prints and posters 案例页海报 | add `data-tilt` |
| Reading progress line 阅读进度条 | header 页头 | automatic 自动 |
| Page-to-page transition 换页过渡 | all pages (Chrome, Edge, Safari 18.2+) | automatic 自动 |

## 10. Tech notes 技术说明

- No build step, no libraries. Works when opened from any static host. 无需构建、无第三方库。
- Fonts are self-hosted (Bodoni Moda, Schibsted Grotesk, Mrs Saint Delafield; SIL Open Font License in `assets/fonts/`). Chinese text uses each device's system fonts, so the site loads without Google services. 字体自托管，中文用系统字体，不依赖谷歌服务。
- SEO: canonical URLs, `hreflang` alternates (`?lang=zh`), Open Graph/Twitter cards, JSON-LD `Person` data on the home page, `sitemap.xml`, `robots.txt`.
- Accessibility: skip link, keyboard-friendly filters and dialog, visible focus. 无障碍：跳转链接、键盘可操作、焦点可见。
