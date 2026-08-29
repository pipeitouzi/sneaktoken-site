# NOTES — LLM / 多模态 API 免费额度核实（清单 A）

核实日期：2026-08-29
产出文件：`data/offers-api.json`（5 条收录）

方法：只用 WebFetch 抓官方页面，抓不到就写 `unknown`，不用搜索摘要填数。

---

## 一、抓到官方页面并确认（5 条）

### 1. Groq Cloud — `official`
- URL：https://console.groq.com/docs/rate-limits （另抓 https://console.groq.com/docs/quickstart ）
- 关键原文：
  > "Rate limits apply at the organization level, not individual users."
  > "Cached tokens do not count towards your rate limits."
  > "Upgrade to Developer plan to access higher limits... Note that the limits shown below are the base limits for the Developer plan"
- 抓到的表格（每模型 RPM/RPD/TPM/TPD）：gpt-oss-120b 30 / 1K / 8K / 200K；qwen3.8-27b 30 / 1K / 8K / 2M；groq/compound 30 / 250 / 70K / -；whisper-large-v3 20 / 2K / ASH 7.2K / ASD 28.8K。
- ⚠️ **需要人工复核的坑**：页面有 `Free Plan Limits` 和 `Developer Plan Limits` 两个 tab，但页面源码里**只有一张表**，而正文那句 "the limits shown below are the base limits for the Developer plan" 暗示这张表是付费档。免费档真实数字可能更低。
  - 我把这个不确定性**写进了 JSON 的 `limits` 字段**，没有假装数字是确定的。
  - 建议上线前让人登一个免费账号，看 https://console.groq.com/settings/limits 的真实值，再回填。
- 信用卡：官方两页都**没有**直接写 "no credit card"。判为 "No" 的依据是官方文档区分了 Free Plan 与付费 Developer Plan，且 quickstart 注册路径只有「建 key」一步、无 billing 步骤。**这是推断，不是原文**，若要求严格应改成 unknown。
- 数据是否用于训练：官方 rate-limits / quickstart 页均未提及 → `unknown`。

### 2. OpenRouter — `official`
- URL：https://openrouter.ai/docs/api_reference/limits
- 模型数：**额外抓了官方 API** https://openrouter.ai/api/v1/models （HTTP 200，完整 JSON，共 396 个模型，其中 18 个以 `:free` 结尾）
- 关键原文：
  > "If you're using a free model variant (with an ID ending in `:free`)... Credits purchased (all time): Less than 10 → 20 RPM / 50 RPD. At least 10 → 20 RPM / 1000 RPD."
  > "If your account has a negative credit balance, you may see `402` errors, including for free models."
  > "Making additional accounts or API keys will not affect your rate limits, as we govern capacity globally."
- `:free` 模型 18 个（含 `google/gemma-4-31b-it:free`、`z-ai/glm-5.2:free`、`minimax/minimax-m3:free`、`nvidia/nemotron-3-ultra-550b-a55b:free` 等）。`minimax-m3` 已带 `Deprecation in 11d` 标记，说明免费阵容流动很快。
- 信用卡：文档未提 → 但「未充值账户可调用 `:free`」是原文明确支持的，判 "No"。
- 数据是否用于训练：`unknown`。

### 3. Cloudflare Workers AI — `official`
- URL：https://developers.cloudflare.com/workers-ai/platform/pricing/ （页面标注 Last updated Aug 28, 2026，很新）
- 关键原文：
  > "Our free allocation allows anyone to use a total of **10,000 Neurons per day at no charge**."
  > "All limits reset daily at 00:00 UTC."
  > "Some models require a paid billing method. This applies to `@cf/moonshotai/kimi-k2.6`, `@cf/moonshotai/kimi-k2.7-code`, `@cf/zai-org/glm-5.2`, `@cf/zai-org/glm-5.3`, `@cf/zai-org/glm-5.3-flash`, `@cf/deepseek-ai/deepseek-v4-flash-0731`, `@cf/deepseek-ai/deepseek-v4-pro-0813`."
- 免费额度是 **Neurons**（不是 token），页面给了每个模型 neurons/M tokens 的对照，我把换算写进了 `quota`。
- **重要**：7 个旗舰模型需付费，别把 Cloudflare 当"免费跑 DeepSeek V4"来推荐。
- 信用卡：免费档在 Workers Free 计划下可用 → "No"（"allows anyone"）。
- 地区限制：页面未提 → 未写 `region_notes`。

### 4. Cohere — `official`
- URL：https://docs.cohere.com/v2/docs/rate-limits （另抓 https://docs.cohere.com/v2/docs/how-does-cohere-pricing-work ）
- 关键原文：
  > "Trial keys (and prod keys on newer Chat model variants) are limited to **1,000 API calls a month**."
  > "trial API key usage is free, but limited. Developers wanting to test different applications or build proofs of concept can use all of Cohere's models and APIs ... by simply signing up for a Cohere account."
- 各端点 trial 限速：Chat 全系 20 req/min；Embed 2,000 inputs/min；Rerank 10 req/min；Embed(images) 5 inputs/min；EmbedJob 5 req/min；Tokenize 100 req/min；Parse 500 req/min；Audio Transcriptions 5 req/min。
- **关键判断**：1,000 次/月的帽子只扣在 Chat 上，Embed 和 Rerank 没有月度上限、只有每分钟限速 —— 所以 Cohere 免费档真正的价值是 Rerank，不是聊天。这一点写进了 `verdict`。
- 信用卡：官方说「注册账号即可」→ "No"。
- 是否过期：**官网没写** → `expiry: unknown`（不要凭印象写"永不过期"）。
- 数据是否用于训练：`unknown`。

### 5. NVIDIA NIM / build.nvidia.com — `official`（但信息量很低）
- URL：https://build.nvidia.com/explore/discover 、https://build.nvidia.com/models 、https://docs.nvidia.com/nim/
- 唯一能确认的原文：
  > "Free serverless APIs for development"
  以及模型卡片上的 `Free Endpoint` 标签（kimi-k3、deepseek-v4-pro-0813、nemotron-3.5-lightning-30b-a3b、nemotron-3-ultra-550b-a55b 等）。
- **没有任何页面公布**：免费 credits 数量、是否过期、RPM、是否需绑卡、商用授权限制。
  → 这些字段全部写 `unknown`，没有用二手数字填补。
- 端点 `https://integrate.api.nvidia.com/v1` 已实测可达（curl 返回 200），可确认是有效的 OpenAI 兼容入口。
- 结论：收录了，但只因为它"确实有免费端点"这一件事可证；其余留白。

---

## 二、已经没有免费档，应当剔除（1 条）

### GitHub Models — 已于 2026-07-30 完全下线
- URL：https://docs.github.com/en/github-models
- 原文：
  > "GitHub Models has been retired. As of July 30, 2026, GitHub Models has been fully retired. The playground, model catalog, inference API, and bring your own key (BYOK) are no longer available to any customer."
- **未收录**。任何还写着"GitHub Models 免费额度"的页面都是过期信息。

（另：Cerebras 无卡免费档已取消、改为 $5 试用金必须绑卡，team-lead 已核实并记在 `data/offers-manual.json`，我不重复收录。）

---

## 三、抓不到官方页面，未收录（4 条）

这 4 家的官方域名在本次环境里**完全不通**。我用 curl 逐个探测，`HTTP 000` = 连接失败（不是被墙页或 404，是域名级不可达）：

| Provider | 试过的官方 URL | 探测结果 |
|---|---|---|
| Google AI Studio / Gemini | https://ai.google.dev/gemini-api/docs/rate-limits 、https://ai.google.dev/gemini-api/docs/pricing | `000`（WebFetch 也 fetch failed，两次） |
| Mistral La Plateforme | https://help.mistral.ai/en/articles/225174-what-are-the-limits-and-quotas-of-the-free-tier 、https://docs.mistral.ai/deployment/laplateforme/pricing 、https://mistral.ai/pricing | `000` |
| Hugging Face Inference / Router | https://huggingface.co/docs/inference-providers/pricing 、https://huggingface.co/docs/inference-providers/index | `000` |
| xAI Grok | https://docs.x.ai/docs/overview 、https://docs.x.ai/ | `000` |

补充探测：整个 `ai.google.dev` / `ai.google` / `developers.google.com` / `cloud.google.com` 全段不通；`docs.x.ai` / `console.x.ai` / `x.ai` 全段不通；`mistral.ai` / `docs.mistral.ai` / `help.mistral.ai` 全段不通；`huggingface.co` 全段不通。

**这 4 条我没有写进 JSON**。理由：拿不到任何官方数字，写进去就是一排 `unknown`，对用户没有价值，反而稀释可信度。宁可少收录。

**这 4 条恰恰是二手信息最泛滥的**（尤其是 Gemini 免费档的 RPM/RPD、HF 的每月 credits 金额、xAI 的注册赠金）。**强烈建议换一个能通这些域名的环境补抓，不要凭搜索摘要或记忆填数。**

---

## 四、给合并 / 上线前的提醒

1. **Groq 的免费档数字需要人工复核**（见上面第一节第 1 条的 ⚠️）。这是本次唯一一处"数字来自官方页面但可能对应付费档"的情况。
2. **Groq、OpenRouter、Cohere、NVIDIA 的 `card_required: "No"` 里，只有 Cohere 有原文明确支持**（"by simply signing up for a Cohere account"）。Groq 和 OpenRouter 是根据"存在免费档 / 未充值账户可调用 `:free`"推断的。若要 100% 严格，这三处应改 `unknown`。
3. **`expiry` 只有 Cloudflare（明确写着 daily reset）和 Groq（plan 无到期日）有据**；Cohere、OpenRouter、NVIDIA 均未在官方页面写明 → 该填的填了 `unknown`，没填的别脑补。
4. **`data_training` 五条全是 `unknown`** —— 没有任何一家在被抓到的页面上说了这件事。不要为了让表格好看而填"No"。
5. **`featured` 编号是本文件内部的 1–5**，与 `offers-manual.json` 里的编号（Cerebras 是 18）不在同一空间，合并时需要重新统一排序。
6. 本次**实测可用的 OpenAI 兼容端点**（curl 探测）：
   - Groq `https://api.groq.com/openai/v1` → 403（需鉴权，端点有效）
   - OpenRouter `https://openrouter.ai/api/v1` → 200
   - NVIDIA `https://integrate.api.nvidia.com/v1` → 200

---

## 五、还没做的（清单里我没碰的）

任务描述里还提到 Vercel AI Gateway、Together、Fireworks、DeepSeek、Qwen、Z.ai、Moonshot —— 这些不在 team-lead 给我的 10 条清单里，我没抓。如果需要，可以再开一轮（这些域名大概率是通的）。
