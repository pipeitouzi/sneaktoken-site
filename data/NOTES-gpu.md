# GPU / compute free-tier verification notes — checked 2026-08-29

Method: every entry below was verified by WebFetch against the vendor's own page. WebSearch was
not used as a source of numbers anywhere. Where the official page did not state a number, the field
is `unknown` — no secondhand figure was substituted.

## Included (4 entries, all `confidence: official`)

| # | Platform | Source URL actually fetched | What the official page confirmed |
|---|----------|----------------------------|----------------------------------|
| 20 | Kaggle Notebooks | https://www.kaggle.com/docs/notebooks | Free P100 (1x) or T4 x2; 12h session cap; 20min idle timeout; no card mentioned |
| 21 | Modal | https://modal.com/pricing | Starter $0/mo + $30/mo free credit; 100 containers / 10 GPU concurrency; full per-second GPU rate card |
| 22 | Lightning AI | https://lightning.ai/docs/platform/overview/faq/billing | 1 free 4-CPU Studio; 10 GB free Drive; "complimentary credits" exist but **no amount published** |
| 23 | Replicate | https://replicate.com/docs/billing + /collections/try-for-free + /pricing | "Free limits" section survives: select models free until billing is set up; no numeric limit |

### Key verbatim quotes

**Kaggle** (https://www.kaggle.com/docs/notebooks)
- "You can add a single NVIDIA Tesla P100 to your Notebook for free."
- "12 hours execution time for CPU and GPU notebook sessions and 9 hours for TPU notebook sessions"
- "While editing a Notebook, you are provided with 20 minutes of idle time for your interactive session."
- "Free GPU availability is limited: in busy times, you might be placed in a queue."
- "Colab Pro and Pro+ users will get 15 and 30 hours of extra GPU hours per week respectively on Kaggle."
- P100 spec: "1 Nvidia Tesla P100 GPU", "4 CPU cores", "29 Gigabytes of RAM". T4 x2 spec: "2 Nvidia Tesla T4 GPUs".
- **No weekly GPU-hour quota is published for standard free accounts.** The "15/30 hours per week"
  figures are *extra* hours for paid Colab Pro/Pro+ subscribers, not the free tier. Widely-repeated
  "30 hours/week free" claims trace back to misreading this line. `quota` therefore describes
  hardware, and `limits` describes the per-session caps only.
- Phone verification: the Notebooks doc never mentions it. Kaggle is known to gate GPU/internet
  behind phone verification in the account flow, but since the official doc is silent this was
  **not** asserted in any field.

**Modal** (https://modal.com/pricing)
- "Starter — $0 + compute / month — $30 / month free credits — 3 workspace seats included —
  100 containers + 10 GPU concurrency — Scheduled and Web Functions (limited)"
- GPU rate card verbatim: B300 $0.001972/sec, B200 $0.001736/sec, H200 SXM $0.001261/sec,
  H100 SXM5 $0.001097/sec, RTX PRO 6000 $0.000842/sec, A100 80GB $0.000694/sec,
  A100 40GB $0.000583/sec, L40S $0.000542/sec, A10 $0.000306/sec, L4 $0.000222/sec, T4 $0.000164/sec.
- "Volumes: $0.09 / GiB / mo — includes 1 TiB / mo free"
- Also confirmed: "Credit grants for academics — up to $10k free compute credits"; startup credits exist too.
- **Card requirement not stated on the pricing page** → `card_required: "unknown"`.

**Lightning AI** (https://lightning.ai/docs/platform/overview/faq/billing)
- "Users get 1 free 4-CPU Studio to code in and run workloads on. The remaining CPUs and GPUs will be billed as advertised."
- "Eligible free plan users receive complimentary credits to explore Lightning AI."
- "Free credits are promotional, non-transferable, and do not accumulate."
- "Lightning AI may change or limit free credit grants, eligibility, usage rules, or expiration terms at any time."
- "A GPU that costs 1.17 credits / hr is the equivalent of $1.17 / hr."
- Storage: "Free: 50 GB total storage limit (only first 10 GB free)"; overage $0.10/GB/month billed daily.
- **The old "15 free GPU hours/month" figure does not appear anywhere on the official billing page
  and was deliberately not used.** The credit amount is genuinely unpublished now.

**Replicate** (https://replicate.com/docs/billing)
- Under the heading "Free limits": "You can run select models on Replicate for free, but after a bit you'll be asked to set up billing. Some features are only available to customers with billing set up."
- The linked collection (https://replicate.com/collections/try-for-free) lists 11 models across
  video gen, image gen, and upscaling/restoration.
- https://replicate.com/pricing has no free-tier block at all — only per-second hardware rates.
- No numeric free allowance is published anywhere, so none was invented.

## Not included — no free tier found on official pages

| Platform | URLs fetched | Official finding |
|----------|--------------|------------------|
| **Baseten** | https://www.baseten.co/pricing/ , https://docs.baseten.co/ | Basic plan is "$0 per month, pay as you go" — that is a $0 *subscription fee*, not free compute. GPU instances are billed from minute one (T4 $0.01052/min … B200 $0.16633/min). No free credit or trial grant is mentioned on either page. The $30-grant figure circulating in blog posts is not on any official page we could reach. |
| **Together AI** | https://www.together.ai/pricing , https://docs.together.ai/docs/quickstart | Pricing page is pure per-token / per-GPU-hour with no free tier or free credit section. Quickstart assumes you already have a billed API key. **We could not confirm the "$5 minimum top-up" claim from any official page** — treat it as unverified rumour, do not publish it as fact. |
| **RunPod** | https://www.runpod.io/pricing | Full rate card only (Community Cloud RTXA5000 $0.27/hr … B300 $7.89/hr; page footer says "Updated July 27, 2026"). No new-user credit or free tier anywhere on the page. |
| **Vast.ai** | https://vast.ai/pricing | Marketplace rate card only (68+ GPU types, from $0.02/hr). No free tier, no new-user credit, no card requirement stated. |
| **Lambda Labs** | https://lambda.ai/service/gpu-cloud | Pure per-minute on-demand pricing (V100 $0.79 … B200 $6.69 per GPU/hr). No free tier or signup credit on the page. |

None of these five had any free compute on the official page, so per the "don't收录 dead tiers" rule
they are excluded from `offers-gpu.json` rather than padded with hopeful numbers.

## Not included — could not verify (host unreachable, NOT evidence of no free tier)

| Platform | URLs tried | Result |
|----------|-----------|--------|
| **Google Colab** | https://research.google.com/colaboratory/faq.html (x2), https://colab.research.google.com/ , https://research.google.com/colaboratory/ , https://colab.google/ , https://colab.research.google.com/faq | Every `research.google.com` and `colab.research.google.com` fetch returned `fetch failed`. This is host-level blocking of the fetcher, not a missing page — the same fetcher worked fine on kaggle.com, modal.com, replicate.com, lightning.ai, runpod.io, lambda.ai, baseten.co, together.ai and vast.ai. **Colab's 2026 free GPU policy therefore remains UNVERIFIED and is deliberately absent from the dataset.** |
| **Hugging Face Spaces / ZeroGPU** | https://huggingface.co/docs/hub/spaces-gpus (x2), https://huggingface.co/pricing , https://huggingface.co/docs/hub/en/spaces-gpus , https://huggingface.co/docs/hub/spaces-overview | All `huggingface.co` fetches returned `fetch failed` — same host-level issue. Free-tier CPU/GPU specs, ZeroGPU quota and Spaces sleep behaviour are **UNVERIFIED**. |

Both of these are high-value entries for a "free GPU" site. They need a manual check in a real browser
(or a fetch path that isn't blocked) before they go on the page. Do **not** backfill them from
training data: Colab's free GPU policy in particular has changed repeatedly, and the whole point of
this exercise was that the remembered numbers were wrong for Cerebras.

## Fields left as `unknown` and why

- `card_required` on **Modal** and **Lightning AI**: neither pricing nor billing page states whether a
  card is needed to claim the free grant. Guessing either way would be inventing a fact.
- `data_training` on all four: none of the fetched pages state whether your data or outputs are used
  for training. Left `unknown` across the board rather than assuming.
- **Lightning AI** GPU credit amount: official page confirms credits exist but publishes no number.
  `quota` says exactly what the docs say and nothing more; `verdict` flags the opacity.
- **Replicate** free allowance: official page confirms free runs exist but gives no number.

## Confidence summary

- 4 entries written, all `official` (fetched vendor page, numbers quoted verbatim).
- 5 platforms excluded because the official page showed pay-as-you-go with no free tier.
- 2 platforms excluded because their hosts could not be fetched at all.
- 0 entries written from secondhand sources.
