# sneaktoken.com — 上线文档

站点是纯静态的，无构建步骤、无后端、无依赖。整个 `site/` 目录直接扔上去就能跑。

## 目录结构

```
site/
├── index.html          页面骨架
├── assets/
│   ├── styles.css      全部样式（改配色看文件顶部 :root 变量）
│   └── app.js          筛选、搜索、渲染逻辑
├── data/
│   ├── offers.js       ★ 额度数据，日常只改这个文件（由 merge 生成，别手改）
│   └── content.js      编辑内容：How to pick 卡片、FAQ
├── robots.txt
└── sitemap.xml
```

> `_headers` 和 `vercel.json` 是 Cloudflare / Vercel 专用的响应头配置，**部署 EdgeOne Pages 不需要它们**，部署包里已排除。以后换平台时放回源码目录即可。

## 日常维护：更新额度数据

只改 `data/offers-*.json`（在站点目录的上一级，`tools/merge-offers.js` 同目录），然后运行：

```bash
node tools/merge-offers.js
```

它会生成 `site/data/offers.js`。每条数据的字段结构见文件内的注释约定。**规则：查不到确切数字就写 `'unknown'`，不要编。** 这个站的全部价值建立在「数据可信」上。

---

## 关于备案

**选对部署区域就不需要备案。**

EdgeOne Pages 创建项目时有三个「加速区域」可选：

| 加速区域 | 自定义域名要求 |
|---|---|
| 中国大陆可用区 | 需 ICP 备案 |
| 全球可用区（含中国大陆） | 需 ICP 备案 |
| **全球可用区（不含中国大陆）** | **不要求备案** ← 选这个 |

注意：选了「不含中国大陆」后，项目默认的预览链接在大陆网络下会返回 401——这是 EdgeOne 的内容合规机制，**绑定自定义域名后即恢复正常访问**，海外用户更是全程不受影响。

---

## 方案 A：腾讯云 EdgeOne Pages + Git 自动部署（首选，已确认）

腾讯云的边缘托管平台，对标 Cloudflare Pages。免费版长期有效，对你这个站足够：不限流量、不限请求数、每月 500 次构建、免费 SSL 证书、3200+ 全球节点。**接 Git 后，改完代码 `git push` 就自动上线，不用再手动上传。**

> 项目已经是 Git 仓库（分支 `main`，首个提交 `0af0db4`）。`site/` 是部署目录，所以 EdgeOne 的「输出目录」要填 `site`。

### 第一步：把仓库推到 GitHub / GitLab

EdgeOne Pages 的 Git 集成支持 GitHub 和 GitLab，二选一（没有就先注册一个，免费）：

```bash
# 1. 在 GitHub/GitLab 网页上新建一个空仓库（如 sneaktoken-site），不要勾 README
# 2. 本地关联并推送（把下面 URL 换成你自己的仓库地址）
git remote add origin https://github.com/你的账号/sneaktoken-site.git
git push -u origin main
```

### 第二步：EdgeOne 连接 Git 自动部署

1. 打开 [EdgeOne Pages 控制台](https://console.tencentcloud.com/edgeone)，一键开通免费版
2. **创建项目** → 选 **「连接 Git」**（不是上传）→ 授权 GitHub/GitLab → 选中 `sneaktoken-site` 仓库
3. 构建配置：
   - 框架预设：`None`（纯静态，无构建步骤）
   - 构建命令：留空
   - **输出目录：`site`** ← 关键，仓库里网页文件都在 `site/` 下
   - 生产分支：`main`
4. **加速区域：务必选「全球可用区（不含中国大陆）」** ← 免备案的关键
5. 点部署，几十秒后拿到 `xxx.edgeone.app` 预览域名，先确认站能打开、筛选和搜索正常

> 以后日常更新：改完文件 → `git add -A && git commit -m "..." && git push` → EdgeOne 自动重新部署，一般 1 分钟内生效。

### 第三步：绑定 sneaktoken.com

1. 项目 → **域名管理** → **添加自定义域名**，输入 `sneaktoken.com`（根域名）
2. 控制台会显示需要添加的 **CNAME 目标**（形如 `xxx.pages.edgeone.cloud`），记下来
3. 去腾讯云 **DNSPod 控制台** → `sneaktoken.com` → 添加记录：

   | 主机记录 | 记录类型 | 记录值 |
   |---|---|---|
   | `@` | CNAME | 控制台给的目标 |
   | `www` | CNAME | 控制台给的目标 |

   （按弹窗提示可能还需要先加一条 TXT 记录验证域名归属，照做即可）
4. 回 EdgeOne 点击**验证**。DNS 生效通常几分钟，最多 48 小时
5. 验证通过后，在域名管理里开启 **HTTPS 强制跳转**，平台自动申请并部署免费 SSL 证书

### 第四步（建议）：统一入口

至少保证 `www` 和根域名二选一，别两个都能独立访问（SEO 会分散权重）。在 `site/` 根目录放一个 `edgeone.json` 并提交即可：

```json
{
  "redirects": [
    { "source": "/", "destination": "/index.html", "permanent": true },
    { "source": "/:path*", "destination": "/index.html", "permanent": false }
  ]
}
```

---

## 备选：手动上传 zip（不接 Git 时用）

项目 → 部署 → **上传静态文件**，把 `sneaktoken-site.zip`（仓库根目录已备好）拖进去。注意站里所有路径是相对路径，**输出目录要设为 `/`**（zip 内容已平铺在根）。每次更新都要重新打包上传：

```bash
# 重新生成部署包（排除 CF/Vercel 专用文件）
python -c "import zipfile,os; z=zipfile.ZipFile('sneaktoken-site.zip','w',zipfile.ZIP_DEFLATED); [z.write(os.path.join(r,f), os.path.relpath(os.path.join(r,f),'site').replace(os.sep,'/')) for r,_,fs in os.walk('site') for f in fs if f not in ('_headers','vercel.json')]; z.close()"
```


---

## 方案 B：Cloudflare Pages / Vercel（备选）

如果哪天觉得 EdgeOne 不够用，可以无缝切：

**Cloudflare Pages**：把 `site/` 推到 GitHub → CF Pages 连接仓库 → 构建配置留空（Framework preset: None, output dir: `/`）→ 自定义域名填 `sneaktoken.com` → 去 DNSPod 加 `@` 和 `www` 的 CNAME 指向 `xxx.pages.dev`。

**Vercel**：`cd site && vercel --prod` → Settings → Domains 填 `sneaktoken.com` → 按提示在 DNSPod 加记录。

切换不影响任何代码——换平台只是换托管，静态文件一样的。

---

## 上线后检查清单

- [ ] 项目域名能打开，`/` 直接显示首页（不是目录列表）
- [ ] 绑定 `sneaktoken.com` 后 HTTPS 生效，`http://` 自动跳 `https://`
- [ ] `www.sneaktoken.com` 与根域名行为一致（301 或直接可访问，二选一）
- [ ] 手机上看一遍：筛选器、卡片、代码块横向滚动是否正常
- [ ] `https://sneaktoken.com/robots.txt` 和 `/sitemap.xml` 能访问
- [ ] 随机点开 3 个 "Get credits →" 外链，确认没写错
- [ ] 去 [Google Search Console](https://search.google.com/search-console) 提交 sitemap，这是海外流量的主要来源
- [ ] 订阅表单目前只做了前端校验，没接邮件服务——上线前要接（EdgeOne 的 Cloud Functions 或第三方 Buttondown/Mailchimp），否则收不到任何邮箱

## 已知待办

- 订阅表单（`index.html` 里 `#subForm`）目前只做前端校验，没接邮件服务；上线前若要真收邮箱，建议用 EdgeOne Cloud Functions 或第三方 Buttondown/Mailchimp
- 统计建议用 EdgeOne 自带的分析（开通免费版自带指标分析），不用再挂第三方
- **数据缺口**：Google AI Studio 和 Google Colab 尚未核实，模板在 `data/templates/`，补法见 `data/TBD.md`；补完复制成 `data/offers-google.json` 跑 `node tools/merge-offers.js` 即可上线
- 上线后去 [Google Search Console](https://search.google.com/search-console) 提交 `sitemap.xml`，这是海外流量的主要来源
