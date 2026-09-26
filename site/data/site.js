/* SneakToken — editorial content layer (channels, hardware, engines, FAQ, price moves) */
window.SITE = {

  /* ---- Five ways to buy the same model ---- */
  channels: [
    {
      id: "direct",
      name: "Direct from the lab",
      who: "Individuals, startups, teams that want the newest model the day it ships",
      price: "List price. No middle margin — and no negotiated discount either.",
      invoice: "Card or prepaid credits. Consolidated invoicing is usually not offered until you reach enterprise tiers.",
      risk: "You inherit the lab's own rate limits, region availability, and incident history. Each new vendor adds another security review.",
      watch: "Promotional pricing. A rate that expires is a rate you must re-budget — GPT-5.6 Sol's current price is explicitly promotional.",
      examples: ["platform.openai.com", "console.anthropic.com", "ai.google.dev", "console.mistral.ai", "platform.deepseek.com"]
    },
    {
      id: "cloud-market",
      name: "Hyperscaler model marketplace",
      who: "Companies that already run on AWS, Azure or Google Cloud",
      price: "Often identical to list for the same model, occasionally higher. The real saving is consolidated spend commitments.",
      invoice: "One cloud bill, in your existing currency and VAT treatment, against a contract you already signed.",
      risk: "Model versions can lag the lab's own release by weeks. Some SKUs are a different build from the first-party model with the same name.",
      watch: "Whether the marketplace SKU is the same build. Confirm the model version string before you benchmark.",
      examples: ["Amazon Bedrock", "Azure AI Foundry", "Google Vertex AI"]
    },
    {
      id: "host",
      name: "Inference platform (open weights)",
      who: "Teams that want one API across many open-weight models, often at the lowest per-token price",
      price: "Frequently below the first-party rate for open-weight models, and the only option when the lab sells no hosted endpoint.",
      invoice: "Standard SaaS billing; invoicing and VAT handling vary a lot by provider.",
      risk: "You are adding a processor to your data chain — DPA, sub-processor list, region, and retention all need checking. Quantisation and context limits may differ from the reference build.",
      watch: "Cached-input price. Two hosts can list the same model at the same headline rate and differ 4x on cache hits.",
      examples: ["Together AI", "Fireworks AI", "Groq", "Baseten"]
    },
    {
      id: "cross-host",
      name: "One lab hosting another lab's open weights",
      who: "Anyone who wants a second source for a model, or needs it inside a specific jurisdiction",
      price: "Set by the host, not the model's author. Can be above or below the author's own rate.",
      invoice: "Billed by the host under its own terms.",
      risk: "Support ownership is split: the host owns uptime, the author owns the weights. Ask who patches a bad checkpoint.",
      watch: "Whether the hosted build is the reference build, a quantised variant, or a fine-tune.",
      examples: ["GLM-5.3 hosted by Mistral (EU)", "DeepSeek V4 Pro hosted by Together"]
    },
    {
      id: "self-host",
      name: "Self-host: rented GPUs or your own hardware",
      who: "Regulated workloads, steady high volume, and anyone whose unit economics actually work out",
      price: "Fixed cost instead of variable cost. Only wins above a break-even volume — run the calculator before you commit.",
      invoice: "Cloud GPU rental or a capital purchase; you also invoice yourself for the engineering time.",
      risk: "You now own uptime, scaling, model updates, and eval regression. That is a team, not a script.",
      watch: "Occupancy. A GPU you rent 24/7 to serve 3 hours of daily traffic is the most expensive option on this list.",
      examples: ["RunPod", "Vast.ai", "Together dedicated", "your own rack"]
    }
  ],

  /* ---- Enterprise buying checklist (what procurement actually asks) ---- */
  enterpriseChecklist: [
    { q: "Will they sign a DPA, and is the sub-processor list published?", why: "If the answer is no, legal will stop the purchase — no matter how good the benchmark looks." },
    { q: "Is zero data retention available, and at what price?", why: "Usually an enterprise-tier feature. Sometimes a multiplier. Always ask before you build on the assumption." },
    { q: "Can you pin inference to a region (EU / US / APAC)?", why: "OpenAI charges +10% for regional processing; Mistral +10% for regional inference. Budget for it." },
    { q: "Is there a written no-training-on-your-data commitment?", why: "Almost every lab offers it now, but not on every tier. Free and low tiers are the usual exception." },
    { q: "SOC 2 Type 2 / ISO 27001, and a HIPAA BAA if health data is in scope", why: "Security review will ask in week one. Having the reports ready saves a month." },
    { q: "Committed-use discounts and how they are measured", why: "Commitments are denominated in spend, not tokens. Tokens get cheaper every year — spending commitments do not." },
    { q: "Rate limits in writing, and the path to more", why: "A launch that hits a rate limit is an outage. Ask for the escalation path before you need it." },
    { q: "What happens to your prompts if the model is deprecated?", why: "Every lab retires models. You need a migration path and a date, not a surprise email." }
  ],

  /* ---- Serving engines ---- */
  engines: [
    { name: "vLLM", best: "Production serving on NVIDIA GPUs, multi-GPU and multi-node", notes: "OpenAI-compatible server, continuous batching, PagedAttention. The default choice when you need throughput and you control the box.", cost: "Free / OSS", ops: "Medium — you own the deploy" },
    { name: "SGLang", best: "Very long contexts, structured output, high concurrency", notes: "RadixAttention prefix reuse makes it strong where many requests share a prefix. Often the fastest option for agent loops.", cost: "Free / OSS", ops: "Medium" },
    { name: "TensorRT-LLM", best: "Squeezing maximum throughput out of NVIDIA hardware", notes: "Builds an optimised engine per model/GPU. Fastest in benchmarks, slowest to change. Good once the model is frozen.", cost: "Free / OSS", ops: "High — compile step per model" },
    { name: "llama.cpp / GGUF", best: "CPU, Apple silicon, consumer GPUs, embedded", notes: "Single binary, no Python stack, runs on almost anything. The right answer for a laptop, a Mac Studio, or an edge box.", cost: "Free / OSS", ops: "Low" },
    { name: "Ollama", best: "Local development and demos", notes: "One command to pull and run. Built on llama.cpp. Perfect on a laptop; not what you put behind a production load balancer.", cost: "Free / OSS", ops: "Very low" }
  ],

  /* ---- Quantisation trade-offs ---- */
  quant: [
    { fmt: "BF16 / FP16", bytes: 2.0, note: "Reference quality. What the published evals were run at." },
    { fmt: "FP8", bytes: 1.0, note: "Usually within noise of BF16 on H100-class hardware. The sensible production default." },
    { fmt: "AWQ / GPTQ INT4", bytes: 0.55, note: "Roughly half the memory. Small quality loss on most tasks, visible on maths and long-form reasoning." },
    { fmt: "INT4 (aggressive)", bytes: 0.5, note: "Fits more, costs accuracy. Benchmark your own task before shipping." },
    { fmt: "GGUF Q4_K_M", bytes: 0.58, note: "The llama.cpp convention. Convenient, portable, and well-tested on consumer hardware." }
  ],

  /* ---- GPU rental reference (RunPod Secure Cloud pods, USD/hr) ---- */
  hardware: [
    { gpu: "NVIDIA B300", vram: 288, hr: 7.89, note: "288 GB HBM3e — the only card here that holds a 675B checkpoint without sharding." },
    { gpu: "NVIDIA B200", vram: 180, hr: 6.79, note: "Blackwell workhorse for large models." },
    { gpu: "NVIDIA H200", vram: 141, hr: 4.59, note: "Best memory-per-dollar for big open models." },
    { gpu: "NVIDIA H100 SXM", vram: 80, hr: 3.49, note: "The standard production card. Everything is optimised for it." },
    { gpu: "NVIDIA H100 PCIe", vram: 80, hr: 2.89, note: "Slightly cheaper than SXM, lower interconnect bandwidth." },
    { gpu: "NVIDIA A100 SXM", vram: 80, hr: 1.59, note: "Older, slower, still the cheapest 80 GB card for batch work." },
    { gpu: "NVIDIA RTX PRO 6000", vram: 96, hr: 2.09, note: "96 GB on a workstation card — popular for a single-GPU private box." },
    { gpu: "NVIDIA L40S", vram: 48, hr: 1.09, note: "48 GB, cheap, fine for 8B-32B models." },
    { gpu: "NVIDIA RTX 5090", vram: 32, hr: 0.99, note: "32 GB consumer card. Great for 8B-14B at quantised precision." },
    { gpu: "NVIDIA RTX 4090", vram: 24, hr: 0.74, note: "The self-hosting entry point. 24 GB fits 7B-14B comfortably." },
    { gpu: "NVIDIA RTX 3090", vram: 24, hr: 0.50, note: "Cheapest 24 GB. Slow by modern standards, unbeatable for experimentation." }
  ],
  hardware_source: { label: "RunPod GPU pricing, updated 2026-09-13", url: "https://www.runpod.io/pricing" },

  /* ---- Price moves we actually logged ---- */
  priceMoves: [
    {
      date: "2026-09-26",
      what: "Baseline snapshot taken",
      detail: "First published snapshot of this table. 22 models, 19 with a price verified against the provider's own page. Diffs start from the next run.",
      source: { label: "SneakToken snapshot", url: "/market.html" }
    },
    {
      date: "2026-07-30",
      what: "OpenAI cut GPT-5.6 Terra and Luna",
      detail: "Terra moved to $2 in / $12 out. Luna moved to $0.20 in / $1.20 out. Sol was unchanged at the time. Fast mode also replaced Priority Processing on that date.",
      source: { label: "OpenAI announcement", url: "https://openai.com/index/advancing-the-price-performance-frontier-with-gpt-5-6/" }
    },
    {
      date: "2026-09-26",
      what: "GPT-5.6 Sol is on a promotional rate",
      detail: "Currently $4 in / $20 out against a list price of $5 / $30. OpenAI says the promotion holds at least through 21 November 2026. Model your budget on the list price.",
      source: { label: "OpenAI API pricing", url: "https://developers.openai.com/api/docs/pricing/" }
    },
    {
      date: "2026-09-26",
      what: "Claude Opus 5 moved to legacy",
      detail: "Opus 5 ($5 / $25) now sits in the legacy block alongside Opus 4.x. The current top of the range is Fable 5.1 ($10 / $50) with Opus 5.5 at $4 / $20.",
      source: { label: "Claude pricing", url: "https://claude.com/pricing" }
    },
    {
      date: "2026-09-26",
      what: "Two providers we could not verify",
      detail: "docs.x.ai and the MiniMax pricing page were unreachable on this pass. Both rows are published with no price rather than a copied number.",
      source: { label: "SneakToken methodology", url: "/method.html" }
    }
  ],

  /* ---- FAQ ---- */
  faq: [
    {
      q: "Why are some models listed with no price at all?",
      a: "Because we could not read the provider's own pricing page when we checked. Printing a number from a tracker is how stale prices get into budget spreadsheets. We print nothing and link the page you should read yourself."
    },
    {
      q: "Is the cheapest model per million tokens actually the cheapest?",
      a: "Usually not. Output tokens are billed separately and typically cost 3-5x input. A model with cheap input and expensive output loses badly on generation-heavy work. Cached input is a third number and often 10-50x cheaper than input. Compare all three against your own traffic mix."
    },
    {
      q: "When does self-hosting beat the API?",
      a: "When your utilisation is high and steady. A rented H100 running 24/7 costs roughly $2,550/month before storage and engineering. At DeepSeek V4 Flash rates that is about 1.6 billion output tokens — if your GPU sits idle half the day, the API wins comfortably. Run the break-even calculator on the Cost page with your own numbers."
    },
    {
      q: "Do open weights mean free for commercial use?",
      a: "No. Apache 2.0 and MIT are permissive. Modified MIT, community licences, and 'open weights' with a bespoke licence are not the same thing. Read the actual licence file in the model repository before you ship — several models on this page carry licences we have not verified."
    },
    {
      q: "How often is this data checked?",
      a: "Every price carries the date it was last read off the provider's page, and the URL. Snapshots are kept so that changes show up as a diff rather than a silent edit."
    },
    {
      q: "Do you take money from providers?",
      a: "Some outbound links are affiliate links, including GPU rental. That is disclosed on every page that carries one, and it does not change which prices get printed — the price is the provider's published number either way."
    }
  ],

  /* ---- Pick wizard configuration ---- */
  pick: {
    useCases: [
      { id: "coding", label: "Coding agent", hint: "Writes and edits code, runs tools" },
      { id: "bulk", label: "Bulk processing", hint: "Classification, extraction, routing" },
      { id: "longdoc", label: "Long documents", hint: "Hundreds of pages per request" },
      { id: "chat", label: "Chat / assistant", hint: "Interactive, latency matters" },
      { id: "multimodal", label: "Image / audio input", hint: "Non-text in the prompt" },
      { id: "agents", label: "Long-running agents", hint: "Many steps, lots of output" }
    ],
    constraints: [
      { id: "any", label: "No hard constraint", hint: "Just show me the best fit" },
      { id: "open", label: "Open weights required", hint: "I need to be able to self-host" },
      { id: "eu", label: "EU data residency", hint: "EU vendor or EU region" },
      { id: "cheap", label: "Lowest possible cost", hint: "Output-token cost dominates" },
      { id: "frontier", label: "Maximum capability", hint: "Cost is not the constraint" }
    ],
    volumes: [
      { id: "tiny", label: "Under $50 / month", tokens: 20 },
      { id: "small", label: "$50 - $500 / month", tokens: 200 },
      { id: "mid", label: "$500 - $5,000 / month", tokens: 2000 },
      { id: "big", label: "Over $5,000 / month", tokens: 20000 }
    ]
  }
};
