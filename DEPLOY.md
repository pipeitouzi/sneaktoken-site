# sneaktoken.com — 上线文档

站点是纯静态的，无构建步骤、无后端、无依赖。整个 `site/` 目录直接扔上去就能跑。
部署平台：**Cloudflare Pages**（Git 原生自动部署，全球 CDN，面向海外用户）。

## 目录结构

```
site/
├── index.html          页面骨架
├── _headers            安全响应头（Cloudflare Pages 原生读取）
├── _redirects          www → 根域名 301 跳转（Cloudflare Pages 原生读取）
├── assets/
│   ├── styles.css      全部样式（改配色看文件顶部 :root 变量）
│   └── app.js          筛选、搜索、渲染逻辑
├── data/
│   ├── offers.js       ★ 额度数据，日常只改这个文件（由 merge 生成，别手改）
│   └── content.js      编辑内容：How to pick 卡片、FAQ
├── robots.txt
└── sitemap.xml
```

> `vercel.json` 已删除（Vercel 专用）。Cloudflare Pages 用 `_headers` + `_redirects` 控制响应头和跳转。

## 日常维护：更新额度数据

只改 `data/offers-*.json`（在站点目录的上一级，`tools/merge-offers.js` 同目录），然后运行：

```bash
node tools/merge-offers.js
```

它会生成 `site/data/offers.js`。每条数据的字段结构见文件内的注释约定。**规则：查不到确切数字就写 `'unknown'`，不要编。** 这个站的全部价值建立在「数据可信」上。

---

## 关于备案（结论：不需要）

Cloudflare Pages 的节点在全球（不含中国大陆境内机房），**绑定自定义域名不要求 ICP 备案**。
腾讯云对域名的「未备案」提示是针对「解析到中国大陆服务器」的引导，你忽略即可——
只要不改回国内服务器，就永远不需要备案。

注意点：Cloudflare 在中国大陆节点有限，大陆访客可能偏慢；但本站立志面向海外用户，无影响。
域名仍在腾讯云注册、DNS 仍在 DNSPod，只加一条 CNAME 指向 Cloudflare 给的地址即可，不用转移。

---

## 方案 A：Cloudflare Pages + Git 自动部署（已选定）

Cloudflare Pages 连接 GitHub/GitLab 后，**`git push` 即自动部署**，无需任何 CI 配置、
无需手动上传。免费额度对静态站绰绰有余：不限请求数、每月 500 次构建、自动 SSL、全球 CDN。

> 项目已经是 Git 仓库（分支 `main`）。`site/` 是部署目录，所以 Cloudflare 的
> **Build output directory 要填 `site`**。

### 第一步：把仓库推到 GitHub / GitLab

Cloudflare Pages 的 Git 集成支持 GitHub 和 GitLab，二选一（没有就先注册一个，免费）：

```bash
# 1. 在 GitHub/GitLab 网页上新建一个空仓库（如 sneaktoken-site），不要勾 README
# 2. 本地关联并推送（把下面 URL 换成你自己的仓库地址）
git remote add origin https://github.com/你的账号/sneaktoken-site.git
git push -u origin main
```

### 第二步：Cloudflare 连接 Git 自动部署

1. 打开 [Cloudflare Pages 控制台](https://dash.cloudflare.com/?to=/:account/pages)（需有 Cloudflare 账号，免费）
2. **Create a project** → 选 **`Connect to Git`** → 授权 GitHub/GitLab → 选中 `sneaktoken-site` 仓库
3. 构建配置：
   - Framework preset：`None`（纯静态，无构建步骤）
   - Build command：留空
   - **Build output directory：`site`** ← 关键，仓库里网页文件都在 `site/` 下
   - 生产分支：`main`
4. 点 **Save and Deploy**，几十秒后拿到 `xxx.pages.dev` 预览域名，先确认站能打开、筛选和搜索正常

> 以后日常更新：改完文件 → `git add -A && git commit -m "..." && git push`
> → Cloudflare 自动重新部署，一般 1 分钟内生效。

### 第三步：绑定 sneaktoken.com（DNS 仍在腾讯云 DNSPod）

1. 项目 → **Custom domains** → **Set up a custom domain**，输入 `sneaktoken.com`
2. Cloudflare 会显示需要添加的 **CNAME 目标**（形如 `sneaktoken.pages.dev` 或一组具体值），记下来
3. 去腾讯云 **DNSPod 控制台** → `sneaktoken.com` → 添加记录：

   | 主机记录 | 记录类型 | 记录值 |
   |---|---|---|
   | `@` | CNAME | Cloudflare 给的目标（如 `sneaktoken.pages.dev`） |
   | `www` | CNAME | 同上 |

   - 若 DNSPod 不允许 `@` 用 CNAME（少数情况），改用 Cloudflare 页面上给的 **A 记录**（一组固定 IP）
   - 可能还需加一条 **TXT / CNAME 验证记录**，按 Cloudflare 弹窗提示照做即可
4. 回 Cloudflare 点 **Activate domain**。DNS 生效通常几分钟，最多 48 小时
5. Cloudflare **自动签发并续期免费 SSL 证书**，HTTPS 默认生效（建议在 SSL/TLS → Edge Certificates 开「Always Use HTTPS」）

> www → 根域名的 301 跳转已由 `site/_redirects` 处理，无需在 DNS 层再配。

---

## 备选：EdgeOne Pages（同属腾讯云，若以后想换）

若哪天想回到腾讯云生态：EdgeOne Pages 控制台创建项目 → 连接 Git → 输出目录 `site` →
加速区域**务必选「全球可用区（不含中国大陆）」** → 同样免备案、同样 Git 自动部署。
静态文件不变，换平台只是换托管方。

---

## 上线后检查清单

- [ ] `xxx.pages.dev` 预览域名能打开，`/` 直接显示首页（非目录列表）
- [ ] 绑定 `sneaktoken.com` 后 HTTPS 生效，`http://` 自动跳 `https://`
- [ ] `www.sneaktoken.com` 访问后 301 跳到根域名（看地址栏确认）
- [ ] 手机上看一遍：筛选器、卡片、代码块横向滚动是否正常
- [ ] `https://sneaktoken.com/robots.txt` 和 `/sitemap.xml` 能访问
- [ ] 随机点开 3 个 "Get credits →" 外链，确认没写错
- [ ] 去 [Google Search Console](https://search.google.com/search-console) 提交 sitemap，这是海外流量的主要来源
- [ ] 统计可选 Cloudflare 自带 Web Analytics（免费、隐私友好、不种第三方 cookie），在 Pages 项目里一键开启

## 已知待办

- 订阅表单（`index.html` 里 `#subForm`）目前只做前端校验，没接邮件服务；上线前若要真收邮箱，建议用 Cloudflare Workers + 第三方邮件服务（Buttondown/Mailchimp），或先接 Formspree 之类
- **数据缺口**：Google AI Studio 和 Google Colab 尚未核实，模板在 `data/templates/`，补法见 `data/TBD.md`；补完复制成 `data/offers-google.json` 跑 `node tools/merge-offers.js` 再 `git push` 即可上线
