/* ============================================================
   sneaktoken.com — editorial content (edit freely)

   注意：这里推荐的 provider 必须存在于 data/offers.js。
   每次增删条目后，回来检查一遍有没有引用到已下架的服务。
   ============================================================ */
window.CONTENT = {

  contact: 'mailto:pipeitouzi@gmail.com',

  /* 可见的纠错/联系入口，让读者在任何问题下都能联系到你 */
  contactLabel: 'Found a broken link or a tier that changed? Email me at',
  contactEmail: 'pipeitouzi@gmail.com',

  /* ---------- "How to pick" cards ---------- */
  picks: [
    {
      tag: 'Fastest start',
      title: 'I want a prototype running tonight',
      body: 'You don’t need the biggest quota, you need the shortest path from signup to a 200 response. Favour providers that hand you a key in under two minutes and speak the OpenAI wire format, so swapping later is a one-line change.',
      pick: 'Groq. Sign up with a Google or GitHub account, no billing step appears anywhere in the flow, and the endpoint is OpenAI-compatible.'
    },
    {
      tag: 'Latency',
      title: 'Speed matters more than volume',
      body: 'For chat UIs, agents that call the model in a loop, and anything a human is sitting and waiting on, throughput is the bottleneck — not the token count. Specialised inference hardware beats GPU clouds by an order of magnitude here.',
      pick: 'Groq, for LPU inference that stays fast under load. Worth knowing: Cerebras used to be the other answer here, but it retired its no-card tier in 2026.'
    },
    {
      tag: 'RAG',
      title: 'I’m building RAG',
      body: 'Retrieval quality is won at the rerank step, not the embedding step. Most people ship vector search alone and wonder why results feel off. Rerank endpoints are rarely free anywhere — which makes the one that is unusually valuable.',
      pick: 'Cohere. Its 1,000-calls-a-month cap only applies to Chat — Embedding and Rerank are rate-limited instead, so you get a reranker for free indefinitely.'
    },
    {
      tag: 'GPU',
      title: 'I need a GPU, not an API',
      body: 'Fine-tuning, training, and heavy batch inference need real silicon. Notebook platforms hand out accelerators by session rather than by credit, which suits experimental work far better than a metered balance does.',
      pick: 'Kaggle Notebooks for a full P100 with no card and no paid plan. The catches are queueing at peak hours and a 20-minute idle timeout.'
    },
    {
      tag: 'Serverless GPU',
      title: 'I want GPU without babysitting a notebook',
      body: 'Notebooks are fine until you need something to run unattended, on a schedule, or behind an HTTP endpoint. Serverless GPU platforms bill per second, so an idle container costs nothing — unlike a VM you forgot to stop.',
      pick: 'Modal. $30 a month of credit on the free Starter plan, billed by the second, reaching everything from a T4 up to a B300.'
    },
    {
      tag: 'Model shopping',
      title: 'I want to try several models',
      body: 'Committing to one vendor before you know which model suits your task is how prototypes get rewritten. A router lets you change model with a string, and keeps working when one upstream provider has a bad day.',
      pick: 'OpenRouter. One OpenAI-compatible key in front of 18 free models from different labs — though 50 requests a day until you spend $10 is the real ceiling.'
    },
    {
      tag: 'Region',
      title: 'I’m not in the US or EU',
      body: 'Several major providers geo-restrict free tiers or throttle hard outside their core regions. Edge networks are the exception — they run the model in a datacentre near you by design, not as a courtesy.',
      pick: 'Cloudflare Workers AI, which runs across 300+ cities. Note the frontier models there are card-gated, so check which models the free allowance actually covers.'
    },
    {
      tag: 'No card',
      title: 'I don’t have a credit card',
      body: 'Plenty of developers can’t or won’t put a card on file — age, country, or principle. That rules out every “$5 in free credits” offer on this page, which is exactly why the card requirement is its own row on every entry.',
      pick: 'Filter by "No card". Groq, OpenRouter, Cloudflare Workers AI, Cohere and Kaggle all give you a working key without one. (NVIDIA NIM’s card requirement isn’t published on its docs — its card shows "unknown".)'
    },
    {
      tag: 'Production',
      title: 'I’m going to production',
      body: 'Be honest with yourself here. Free tiers have no SLA, they change without notice, and several throttle the moment you start to look like real traffic. They are for validating an idea, not for serving customers.',
      pick: 'Prototype free, then move the hot path to a paid tier before you have users. Keep the free tier as a fallback, not the plan.'
    },
    {
      tag: 'Privacy',
      title: 'My data is sensitive',
      body: 'The trade nobody reads: on many free tiers your prompts are logged and used to improve the model. That is the actual price you are paying instead of money, and it is rarely mentioned on the pricing page.',
      pick: 'Check the “Data” row on each card. Where we could not confirm a provider’s policy, it says unknown rather than reassuring you for free.'
    }
  ],

  /* ---------- FAQ ---------- */
  faq: [
    {
      q: 'How do you verify these numbers?',
      a: 'We open the provider’s own documentation — the rate-limit page, the pricing page, the billing FAQ — and read the numbers off it. Search results, blog posts and aggregator sites are not accepted as evidence. Every card’s date links to the exact page we checked, so you can confirm it yourself.'
    },
    {
      q: 'Are these tiers actually free, or just trials?',
      a: 'Both, and we label the difference. Some are permanent free tiers meant to keep developers on the platform; others are one-time credits that expire in 30 days. The badge on each card tells you which — “No expiry”, “Daily reset”, or “One-time”.'
    },
    {
      q: 'Do I need a credit card?',
      a: 'It depends entirely on the provider, which is why there is a "Card" row on every entry. Groq, OpenRouter, Cloudflare Workers AI, Cohere and Kaggle all hand you a working key without one. (NVIDIA NIM’s card requirement isn’t published on its docs, so its card shows "unknown".) Others advertise free credits but require a card on file to release them — Replicate and Cerebras both fall into that camp now.'
    },
    {
      q: 'Why is a provider I expected not listed?',
      a: 'Usually one of three reasons: it quietly ended its free tier, we could not reach its official docs to confirm the numbers, or the published figures turned out not to exist. Two concrete examples — GitHub Models was fully retired on 30 July 2026, and Cerebras replaced its no-card allowance with a $5 card-verified trial. Both are absent or re-labelled here on purpose. If you think we missed something legitimate, send us the official page and we will add it.'
    },
    {
      q: 'Will my prompts be used to train models?',
      a: 'On some free tiers, yes — that is the unwritten price, and several major labs do it or offer extra quota in exchange for it. Where we could confirm a provider’s policy it is in the “Data” row. Where we could not, it says unknown. If it matters to you, look for an opt-out switch in the provider’s settings on day one.'
    },
    {
      q: 'How often is this directory checked?',
      a: 'Every entry carries the date it was last verified. When a quota changes we correct it; when a tier is discontinued we remove it rather than leaving a dead link rotting on the page. The date on each card is your signal for how fresh that particular number is.'
    },
    {
      q: 'Why do you write “unknown” instead of a number?',
      a: 'Because a guessed number is worse than a gap. Providers move limits constantly, and secondary sources go stale without ever being corrected. If we could not confirm a figure on an official page, we print unknown. You can plan around a gap; you cannot plan around a number that looks authoritative and is not.'
    },
    {
      q: 'Can I run a real product on a free tier?',
      a: 'You can run a demo, a prototype, and an early beta. You should not run revenue on one. Free tiers carry no SLA, they get cut with little notice, and rate limits are usually far tighter than the headline quota implies. Validate for free, then pay for the path that matters.'
    },
    {
      q: 'Do you earn money from these links?',
      a: 'No. SneakToken is free and we earn nothing from it — no affiliate codes, no referral fees, no paid placements. Every listing is verified independently and ordered by usefulness. If a provider ends its free tier it comes off the list regardless. Outbound links are plain nofollow links straight to each provider’s own sign-up page.'
    },
    {
      q: 'Can I suggest a provider that’s missing?',
      a: 'Yes. Send the provider name and a link to their official pricing or rate-limit page — that last part matters, since we verify against primary sources only. Submissions without an official page to check against take much longer to add.'
    }
  ]
};
