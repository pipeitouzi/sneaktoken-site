# Research Notes — Free AI API / GPU Credit Directory

**Research date:** 2026-08-29
**Researcher:** general-purpose-1
**Output:** `offers.json` (23 entries)

---

## Method

Every entry was researched with live web search and, where possible, by fetching the vendor's own
documentation or pricing page. Search results were dominated by SEO/affiliate content farms
(`freellm.net`, `toolfreebie.com`, `aimultiple.com`, `hackernoon.com` lite reprints, and a large
volume of Chinese aggregator wikis), which recycle each other's numbers. **Where a figure appears
only in those sources and not on a vendor page, it is marked `unknown` or explicitly flagged in
that entry's `notes`.** No number in `offers.json` is invented.

---

## Tier 1 — Confirmed on an official page (highest confidence)

These entries' `quota` and `limits` were read directly from vendor-owned documentation during this
research. Cite these freely.

| Entry | Official page opened | What was confirmed |
|---|---|---|
| `groq` | https://console.groq.com/docs/rate-limits | Full free-plan RPM/RPD/TPM/TPD table for 13 models |
| `cerebras` | https://inference-docs.cerebras.ai/support/rate-limits | **No free tier anymore.** $5 trial, verified payment method mandatory, 30-day expiry |
| `cloudflare-workers-ai` | https://developers.cloudflare.com/workers-ai/platform/pricing/ | 10,000 Neurons/day free, resets 00:00 UTC. Page last updated 2026-08-28 |
| `openrouter` | https://openrouter.ai/docs/api_reference/limits | 20 RPM / 50 RPD unfunded; 1,000 RPD after 10 credits purchased |
| `cohere` | https://docs.cohere.com/docs/rate-limits | Trial key: 1,000 calls/month for chat, 20 RPM; Embed 2,000 inputs/min; Rerank 10 RPM |
| `vercel-ai-gateway` | https://vercel.com/docs/ai-gateway/pricing | $5/month free credits, free-tier-eligible model subset, no card |
| `modal` | https://modal.com/pricing | Starter $0/month includes $30/month compute credits |
| `kaggle-notebooks` | https://www.kaggle.com/docs/notebooks **and** https://kaggle.com/docs/efficient-gpu-usage | 30 GPU-hours/week (official wording: "resets weekly and is 30 hours or sometimes higher"); 12h GPU / 9h TPU sessions; P100 + TPU v3-8 free |
| `hugging-face-spaces-zerogpu` | https://huggingface.co/docs/hub/spaces-api-endpoints **and** https://huggingface.co/docs/hub/enterprise-hub | ZeroGPU ladder: 2 min unauthenticated / 5 min free / 40 min PRO; $1 per 10 min beyond. Free API quota 1,000 requests per 5-min window |

---

## Tier 2 — Partially official or heavily corroborated secondary (medium confidence)

| Entry | Basis | Caveat |
|---|---|---|
| `google-ai-studio` | Multiple independent Aug-2026 sources agree on ~10-15 RPM and up to ~1,500 RPD on the Flash family, and on Pro leaving the free tier 2026-04-01 | **`limits` is `"unknown"`.** The official rate-limits page (`ai.google.dev/gemini-api/docs/rate-limits`) failed to load on five separate attempts, and Google no longer publishes a static table — it points at the AI Studio dashboard. Do not publish exact RPD without a dashboard check |
| `zai-glm` | Model naming, OpenAI-compatible base URL and endpoint confirmed on https://docs.z.ai/guides/overview/quick-start; free-model list and 1-concurrency limit from secondary sources citing Z.ai's own pricing docs | Z.ai's quick-start page does not itself mention a free tier |
| `nvidia-nim` | 1,000 credits / up to 5,000 / no expiry / no card / 40 RPM is consistent across ~5 independent 2026 sources | Not confirmed on any NVIDIA page. build.nvidia.com says only "Free inference with leading models"; docs.nvidia.com/NIM covers self-hosted containers only |
| `mistral` | ~1 RPS / 500K TPM / 1B tokens per month / phone verification / no card, converged across several sources | docs.mistral.ai and help.mistral.ai both failed to load. The **data-training flag is the important one** and every source that mentions it agrees free-tier traffic may be used for training |
| `deepseek` | 5M tokens / 30 days / no card, consistent across several 2026 pricing trackers | Concurrency figures are secondary only. Data residency in China is well documented and surfaced in `region_notes` |
| `hugging-face-inference` | Rate limits read from HF's official plan comparison (1,000 API requests / 5,000 resolver requests per 5-min window on Free) | **Free credit is `unknown`.** HF's own doc lists Inference Providers for Free as "PAYG" with no included credit; secondary sources claim "$0.10/month". Official and secondary disagree, so I refused to pick a number |
| `google-colab` | Qualitative picture (no published quota, dynamic allocation, 12h cap, aggressive idle-kills) is consistent across official-position summaries and several independent 2026 benchmark tests | The "15-30 GPU-hours/week" figure appears only in `notes` as an estimate, not in `quota` |
| `lightning-ai-studios` | "15 monthly credits" is from Lightning's own template page; "up to 80 free GPU hours" is from Lightning's own blog | **The two vendor figures contradict each other.** Both are recorded in `quota` with the conflict stated. lightning.ai/pricing would not load |
| `fireworks-ai` | $1 one-time credit corroborated across several 2026 reviews, one citing Fireworks' own billing docs | 10 RPM no-card figure is single-source |
| `xai-grok` | Multiple sources describe a $25 signup grant plus a recurring $150/month tied to data sharing | **Low confidence and internally contradictory across sources.** See below |

### `xai-grok` — flagged for review
`docs.x.ai` failed to load. Secondary sources describe the programme three different ways:
- $25/month resetting monthly, card required
- $25 one-time expiring in 30 days
- $25 on signup **plus** $150/month after enabling data sharing, which requires prior spend of ~$5 and is described by some sources as **irreversible at the team level**

I recorded the most conservative reading (one-time $25, 30-day expiry) and documented the
discrepancy in `notes`. **Do not publish the $150 figure without confirming it on docs.x.ai.**

---

## Tier 3 — Weak, recorded as `unknown` (do not present as a free tier)

| Entry | Situation |
|---|---|
| `runpod` | RunPod's own homepage advertises "a random credit bonus between $5 and $500 **when you spend your first $10**" — a spend-triggered promo, not a signup grant. Secondary sources still cite a flat $5 or $10 signup credit, almost certainly stale. `quota` and `limits` are `unknown` |
| `lambda-labs` | Secondary sources say $10, one says $15. Lambda's own site not retrieved. `quota` and `limits` are `unknown` |
| `vast-ai` | Secondary sources say "around $5" and hedge. Included because Vast.ai is the **price floor for paid GPU rental**, which is useful context — but it should be framed as "cheapest paid option", not a free tier. `quota` and `limits` are `unknown` |
| `qwen-international` | ~1M tokens / 90 days / Singapore-region-only. Two secondary sources, one of which explicitly flags the number as vendor-stated and needing native reverification. Weakest entry in the file — verify before publishing |

---

## Removed from the list (no longer a free tier)

| Was on the brief | Why removed | Evidence |
|---|---|---|
| **GitHub Models** | **Retired.** As of 2026-07-30 the playground, model catalog, inference API and BYOK are unavailable to all customers | Official: https://docs.github.com/en/github-models — page now reads "GitHub Models has been retired" and redirects to Azure AI Foundry |
| **Together AI** | No ongoing free tier. Requires a minimum prepaid balance (~$5) before any call; the old signup credit was retired in 2025 | Multiple 2026 pricing comparisons, one citing Together's own billing docs |
| **Replicate** | No free tier advertised. Read directly from https://replicate.com/pricing — it is pure pay-as-you-go with no credit grant section | Official pricing page |
| **Baseten** | Basic plan is $0/month but **pay-as-you-go with no published free credit**. Read from https://www.baseten.co/pricing/ | Official pricing page. Secondary claims of "$30 free credits" are not supported by the current page |
| **Paperspace / Gradient** | Free M4000 tier is now effectively unavailable — reported as capacity-limited to the point of unusability, and the standalone platform is being folded into DigitalOcean | Secondary (aimultiple.com, gputracker.dev, and a 2026 first-person test). Not verified against a DigitalOcean page, so excluded rather than listed with a number |
| **Moonshot / Kimi** | No standing free tier for international users. Requires a minimum top-up (~$1) to activate the API | Secondary sources agree; no vendor page retrieved |

---

## Things that surprised me (worth editorialising on the site)

1. **Cerebras is no longer a no-card free tier.** It was one of the most-cited free inference
   options and the vendor docs now state plainly that no auto-renewing free tier exists. Most
   comparison content has not caught up.
2. **GitHub Models is dead** as of 2026-07-30. Any "free AI API" listicle still listing it — and
   many do — is stale by two months.
3. **Google removed all Pro models from the Gemini free tier on 2026-04-01**, and did so without a
   formal changelog; it surfaced through API errors. Flash-only is now the reality.
4. **Hugging Face Spaces quietly paywalled compute Spaces.** Gradio and Docker Spaces now require a
   paid plan to create; the one surviving free lane is 2 ZeroGPU Gradio Spaces at 5 minutes of GPU
   per day.
5. **The three data-privacy traps** worth calling out explicitly for a Western audience: Mistral's
   free Experiment tier (traffic may be used for training), Google's free tier outside the
   EEA/UK/CH, and xAI's $150/month grant (requires what some sources describe as an irreversible
   training opt-in).
6. **Kaggle is the best free GPU in 2026 and is under-recommended.** It is the only one with a
   published, readable quota counter (30h/week), and P100 beats Colab's T4 for training.

---

## Known gaps / suggested follow-ups

- **`ai.google.dev` is unreachable from this environment.** Every fetch failed. Gemini is the single
  most important entry in this dataset and its `limits` field is `unknown` as a result. This should
  be resolved before launch — ideally by logging into AI Studio and reading the live dashboard.
- **`docs.x.ai`, `docs.mistral.ai` and `lightning.ai/pricing` also failed to load.**
- **`region_notes` and `data_training` are the weakest fields overall.** Several vendors do not
  publish a clean training-opt-out statement, so those are recorded as `unknown` rather than
  guessed. For a site whose audience cares about this, a follow-up pass reading each vendor's
  privacy policy and DPA would add real value.
- **Model catalogs rotate constantly** (Groq, OpenRouter, NVIDIA, Z.ai). Consider adding a
  `last_verified` date to each entry at build time so the site can show freshness and flag entries
  older than ~30 days.
