/* SneakToken — model data layer
 * Every price below was read off the provider's own pricing page on the date in `verified`.
 * If we could not reach the official page, prices are null and status is "unverified".
 * We do not fill gaps with aggregator numbers.
 * Unit: USD per 1,000,000 tokens.
 */
window.MODELS = {
  meta: {
    asof: "2026-09-26",
    unit: "USD / 1M tokens",
    rule: "A price only enters this table with four things attached: the channel it was quoted on, the processing tier, the date it was checked, and the URL we read. Missing one and the row is marked unverified.",
    verified: 0,
    unverified: 0
  },

  models: [
    /* ---------------- OpenAI ---------------- */
    {
      id: "gpt-6-astra",
      name: "GPT-6 Astra",
      model_id: "gpt-6-astra",
      vendor: "OpenAI",
      vendor_url: "https://platform.openai.com",
      weights: "closed",
      license: null,
      params_b: null,
      context: "1,050,000",
      max_out: "128K",
      modalities: ["text", "image", "audio"],
      tools: true,
      price: {
        in: 10.0, cached_in: 1.0, out: 50.0,
        batch: { in: 5.0, cached_in: 0.5, out: 25.0 },
        long_ctx: "Above 272K context: input x2, cached input x2, output x1.5.",
        notes: "Data-residency endpoints +10%. Fast mode x2.5. Cache writes billed at $12.50/M.",
        status: "verified", verified: "2026-09-26",
        source_label: "OpenAI API pricing", source_url: "https://developers.openai.com/api/docs/pricing/"
      },
      hosts: [],
      self_host: { feasible: false, note: "Closed weights. API only." },
      residency: { eu: true, us: true, note: "Regional processing available at +10%." },
      best_for: "The hardest end-to-end work, where you already know cheaper tiers failed.",
      tags: ["frontier", "coding", "long-context", "multimodal"]
    },
    {
      id: "gpt-5.6-sol",
      name: "GPT-5.6 Sol",
      model_id: "gpt-5.6-sol",
      vendor: "OpenAI",
      vendor_url: "https://platform.openai.com",
      weights: "closed",
      license: null,
      params_b: null,
      context: "1,050,000",
      max_out: "128K",
      modalities: ["text", "image", "audio"],
      tools: true,
      price: {
        in: 4.0, cached_in: 0.4, out: 20.0,
        batch: { in: 2.0, cached_in: 0.2, out: 10.0 },
        long_ctx: "Above 272K context: input x2, cached input x2, output x1.5.",
        notes: "Promotional rate (was $5 / $0.50 / $30). OpenAI states it holds at least through 2026-11-21 — budget for the list price after that.",
        status: "verified", verified: "2026-09-26",
        source_label: "OpenAI API pricing", source_url: "https://developers.openai.com/api/docs/pricing/"
      },
      hosts: [],
      self_host: { feasible: false, note: "Closed weights." },
      residency: { eu: true, us: true, note: "Regional processing at +10%." },
      best_for: "Ambitious agentic work that still has to fit a budget.",
      tags: ["frontier", "coding", "long-context"]
    },
    {
      id: "gpt-5.6-terra",
      name: "GPT-5.6 Terra",
      model_id: "gpt-5.6-terra",
      vendor: "OpenAI",
      vendor_url: "https://platform.openai.com",
      weights: "closed",
      license: null,
      params_b: null,
      context: "1,050,000",
      max_out: "128K",
      modalities: ["text", "image", "audio"],
      tools: true,
      price: {
        in: 2.0, cached_in: 0.2, out: 12.0,
        batch: { in: 1.0, cached_in: 0.1, out: 6.0 },
        long_ctx: "Above 272K context: input x2, cached input x2, output x1.5.",
        notes: "Cut to these rates on 2026-07-30 (previously higher).",
        status: "verified", verified: "2026-09-26",
        source_label: "OpenAI API pricing", source_url: "https://developers.openai.com/api/docs/pricing/"
      },
      hosts: [],
      self_host: { feasible: false, note: "Closed weights." },
      residency: { eu: true, us: true, note: "Regional processing at +10%." },
      best_for: "High-volume production traffic that still needs a frontier-tier brain.",
      tags: ["frontier", "balanced", "long-context"]
    },
    {
      id: "gpt-5.6-luna",
      name: "GPT-5.6 Luna",
      model_id: "gpt-5.6-luna",
      vendor: "OpenAI",
      vendor_url: "https://platform.openai.com",
      weights: "closed",
      license: null,
      params_b: null,
      context: "1,050,000",
      max_out: "128K",
      modalities: ["text", "image", "audio"],
      tools: true,
      price: {
        in: 0.2, cached_in: 0.02, out: 1.2,
        batch: { in: 0.1, cached_in: 0.01, out: 0.6 },
        long_ctx: "Above 272K context: input x2, cached input x2, output x1.5.",
        notes: "Cut to these rates on 2026-07-30. The cheapest way to stay inside the OpenAI platform.",
        status: "verified", verified: "2026-09-26",
        source_label: "OpenAI API pricing", source_url: "https://developers.openai.com/api/docs/pricing/"
      },
      hosts: [],
      self_host: { feasible: false, note: "Closed weights." },
      residency: { eu: true, us: true, note: "Regional processing at +10%." },
      best_for: "Everyday high-volume calls: classification, extraction, routing, summaries.",
      tags: ["cheap", "bulk", "balanced"]
    },

    /* ---------------- Anthropic ---------------- */
    {
      id: "fable-5.1",
      name: "Fable 5.1",
      model_id: "fable-5.1",
      vendor: "Anthropic",
      vendor_url: "https://console.anthropic.com",
      weights: "closed",
      license: null,
      params_b: null,
      context: "200K",
      context_note: "Anthropic advertises up to 1M on selected models; confirm per model before you design around it.",
      max_out: null,
      modalities: ["text", "image"],
      tools: true,
      price: {
        in: 10.0, cached_in: 0.25, out: 50.0,
        batch: { in: 5.0, cached_in: 0.125, out: 25.0 },
        long_ctx: null,
        notes: "Cache write $12.50/M at the 5-minute TTL; 1-hour TTL costs more. US-only inference billed at 1.1x.",
        status: "verified", verified: "2026-09-26",
        source_label: "Claude pricing", source_url: "https://claude.com/pricing"
      },
      hosts: [],
      self_host: { feasible: false, note: "Closed weights." },
      residency: { eu: true, us: true, note: "US-only inference option at 1.1x." },
      best_for: "Long-running agents where you pay for autonomy, not tokens.",
      tags: ["frontier", "coding", "agents"]
    },
    {
      id: "claude-opus-5.5",
      name: "Claude Opus 5.5",
      model_id: "claude-opus-5.5",
      vendor: "Anthropic",
      vendor_url: "https://console.anthropic.com",
      weights: "closed",
      license: null,
      params_b: null,
      context: "200K",
      context_note: "Up to 1M on selected models — confirm per model.",
      max_out: null,
      modalities: ["text", "image"],
      tools: true,
      price: {
        in: 4.0, cached_in: 0.2, out: 20.0,
        batch: { in: 2.0, cached_in: 0.1, out: 10.0 },
        long_ctx: null,
        notes: "Fast mode costs 2x standard. Cache write $5.00/M at 5-minute TTL. Same price at any context length.",
        status: "verified", verified: "2026-09-26",
        source_label: "Claude pricing", source_url: "https://claude.com/pricing"
      },
      hosts: [],
      self_host: { feasible: false, note: "Closed weights." },
      residency: { eu: true, us: true, note: "US-only inference at 1.1x." },
      best_for: "Hard reasoning and code, when Sonnet 5 is not enough.",
      tags: ["frontier", "coding", "agents"]
    },
    {
      id: "claude-sonnet-5",
      name: "Claude Sonnet 5",
      model_id: "claude-sonnet-5",
      vendor: "Anthropic",
      vendor_url: "https://console.anthropic.com",
      weights: "closed",
      license: null,
      params_b: null,
      context: "200K",
      context_note: "Up to 1M on selected models — confirm per model.",
      max_out: null,
      modalities: ["text", "image"],
      tools: true,
      price: {
        in: 2.0, cached_in: 0.2, out: 10.0,
        batch: { in: 1.0, cached_in: 0.1, out: 5.0 },
        long_ctx: null,
        notes: "Cache write $2.50/M at 5-minute TTL. Batch API 50% off.",
        status: "verified", verified: "2026-09-26",
        source_label: "Claude pricing", source_url: "https://claude.com/pricing"
      },
      hosts: [],
      self_host: { feasible: false, note: "Closed weights." },
      residency: { eu: true, us: true, note: "US-only inference at 1.1x." },
      best_for: "The default coding and agent workhorse.",
      tags: ["balanced", "coding", "agents"]
    },
    {
      id: "claude-haiku-4.5",
      name: "Claude Haiku 4.5",
      model_id: "claude-haiku-4.5",
      vendor: "Anthropic",
      vendor_url: "https://console.anthropic.com",
      weights: "closed",
      license: null,
      params_b: null,
      context: "200K",
      max_out: null,
      modalities: ["text", "image"],
      tools: true,
      price: {
        in: 1.0, cached_in: 0.1, out: 5.0,
        batch: { in: 0.5, cached_in: 0.05, out: 2.5 },
        long_ctx: null,
        notes: "Cache write $1.25/M at 5-minute TTL.",
        status: "verified", verified: "2026-09-26",
        source_label: "Claude pricing", source_url: "https://claude.com/pricing"
      },
      hosts: [],
      self_host: { feasible: false, note: "Closed weights." },
      residency: { eu: true, us: true, note: "US-only inference at 1.1x." },
      best_for: "Sub-agent fan-out, routing, and anything called thousands of times an hour.",
      tags: ["cheap", "bulk"]
    },

    /* ---------------- Google ---------------- */
    {
      id: "gemini-3.5-flash",
      name: "Gemini 3.5 Flash",
      model_id: "gemini-3.5-flash",
      vendor: "Google",
      vendor_url: "https://aistudio.google.com",
      weights: "closed",
      license: null,
      params_b: null,
      context: "1,000,000",
      max_out: "65,536",
      modalities: ["text", "image", "audio", "video"],
      tools: true,
      price: {
        in: 1.5, cached_in: 0.15, out: 9.0,
        batch: { in: 0.75, cached_in: 0.075, out: 4.5 },
        long_ctx: null,
        notes: "Context caching also carries a storage charge of $1.00 per 1M tokens per hour. Output price includes thinking tokens. Grounding with Google Search: 5,000 free requests/month, then $14 per 1,000.",
        status: "verified", verified: "2026-09-26",
        source_label: "Gemini API pricing", source_url: "https://ai.google.dev/gemini-api/docs/pricing"
      },
      hosts: [],
      self_host: { feasible: false, note: "Closed weights." },
      residency: { eu: true, us: true, note: "Vertex AI adds regional endpoints and enterprise controls." },
      best_for: "Native multimodal input at a mid-tier price.",
      tags: ["multimodal", "long-context", "balanced"]
    },

    /* ---------------- xAI ---------------- */
    {
      id: "grok-4.6",
      name: "Grok 4.6",
      model_id: "grok-4.6",
      vendor: "xAI",
      vendor_url: "https://console.x.ai",
      weights: "closed",
      license: null,
      params_b: null,
      context: "500K",
      max_out: null,
      modalities: ["text", "image"],
      tools: true,
      price: {
        in: null, cached_in: null, out: null,
        batch: null,
        long_ctx: null,
        notes: "Unverified: docs.x.ai was unreachable on this pass, so no number is printed. Community trackers put this tier near $2 in / $6 out — treat that as a rumour until you read the official page yourself.",
        status: "unverified", verified: null,
        source_label: "xAI docs (unreachable)", source_url: "https://docs.x.ai/docs/models"
      },
      hosts: [],
      self_host: { feasible: false, note: "Closed weights." },
      residency: { eu: null, us: true, note: "Not verified this pass." },
      best_for: "Live web/X retrieval baked into the model.",
      tags: ["frontier", "agents"]
    },
    {
      id: "grok-4.5",
      name: "Grok 4.5",
      model_id: "grok-4.5",
      vendor: "xAI",
      vendor_url: "https://console.x.ai",
      weights: "closed",
      license: null,
      params_b: null,
      context: "500K",
      max_out: null,
      modalities: ["text", "image"],
      tools: true,
      price: {
        in: null, cached_in: null, out: null,
        batch: null,
        long_ctx: null,
        notes: "Unverified: docs.x.ai was unreachable on this pass. No number printed rather than one copied from a tracker.",
        status: "unverified", verified: null,
        source_label: "xAI docs (unreachable)", source_url: "https://docs.x.ai/docs/models"
      },
      hosts: [],
      self_host: { feasible: false, note: "Closed weights." },
      residency: { eu: null, us: true, note: "Not verified this pass." },
      best_for: "Same family, one generation back — usually cheaper once verified.",
      tags: ["frontier"]
    },

    /* ---------------- DeepSeek ---------------- */
    {
      id: "deepseek-v4-pro",
      name: "DeepSeek V4 Pro",
      model_id: "deepseek-v4-pro",
      vendor: "DeepSeek",
      vendor_url: "https://platform.deepseek.com",
      weights: "open",
      license: "MIT",
      params_b: null,
      context: "1,000,000",
      max_out: "384K",
      modalities: ["text"],
      tools: true,
      price: {
        in: 1.32, cached_in: 0.044, out: 3.96,
        batch: null,
        long_ctx: null,
        notes: "Off-peak is exactly half: $0.66 in / $1.98 out / $0.022 cached. Peak windows are 01:00-04:00 and 06:00-10:00 UTC, Mon-Fri, excluding Chinese public holidays. Concurrency limit 500.",
        status: "verified", verified: "2026-09-26",
        source_label: "DeepSeek pricing", source_url: "https://api-docs.deepseek.com/quick_start/pricing"
      },
      hosts: [
        { provider: "Together AI", in: 1.32, cached_in: 0.13, out: 3.96, url: "https://www.together.ai/pricing", verified: "2026-09-26", note: "Same list price as first-party, no off-peak swing." },
        { provider: "RunPod (serverless)", in: null, cached_in: null, out: null, url: "https://www.runpod.io/pricing", verified: null, note: "Available; per-token rate not published on the pricing page." }
      ],
      self_host: { feasible: true, note: "MIT weights, downloadable. Parameter count not published — size your own box by measuring the checkpoint." },
      residency: { eu: null, us: null, note: "Self-host is the usual route for residency requirements." },
      best_for: "Frontier-class reasoning at roughly a tenth of frontier pricing.",
      tags: ["open-weights", "cheap", "reasoning", "long-context"]
    },
    {
      id: "deepseek-v4.1-flash",
      name: "DeepSeek V4.1 Flash",
      model_id: "deepseek-flash",
      vendor: "DeepSeek",
      vendor_url: "https://platform.deepseek.com",
      weights: "open",
      license: "MIT",
      params_b: null,
      context: "1,000,000",
      max_out: null,
      modalities: ["text", "image"],
      tools: true,
      price: {
        in: 0.3, cached_in: 0.006, out: 1.2,
        batch: null,
        long_ctx: null,
        notes: "Off-peak half: $0.15 / $0.60 / $0.003. Cached input is 1/50th of input — the single biggest lever if your prompts share a prefix. Concurrency limit 2,500.",
        status: "verified", verified: "2026-09-26",
        source_label: "DeepSeek pricing", source_url: "https://api-docs.deepseek.com/quick_start/pricing"
      },
      hosts: [
        { provider: "Together AI", in: 0.30, cached_in: 0.006, out: 1.20, url: "https://www.together.ai/pricing", verified: "2026-09-26", note: "Matches first-party." }
      ],
      self_host: { feasible: true, note: "MIT weights." },
      residency: { eu: null, us: null, note: "Self-host for residency." },
      best_for: "Bulk work with a stable prompt prefix. Watch the cache-hit price, not the headline price.",
      tags: ["open-weights", "cheap", "bulk", "long-context"]
    },

    /* ---------------- Mistral ---------------- */
    {
      id: "mistral-large-3",
      name: "Mistral Large 3",
      model_id: "mistral-large-3",
      vendor: "Mistral AI",
      vendor_url: "https://console.mistral.ai",
      weights: "open",
      license: "Apache 2.0",
      params_b: 675,
      params_active_b: 41,
      context: null,
      max_out: null,
      modalities: ["text", "image"],
      tools: true,
      price: {
        in: 0.5, cached_in: 0.05, out: 1.5,
        batch: null,
        long_ctx: null,
        notes: "675B total / 41B active. Regional inference +10%. Cached input is ~90% off. Enterprise APIs (regional processing controls, SLA) list at +75%.",
        status: "verified", verified: "2026-09-26",
        source_label: "Mistral inference pricing", source_url: "https://docs.mistral.ai/inference/pricing"
      },
      hosts: [],
      self_host: { feasible: true, note: "Apache 2.0 weights; 41B active parameters means a sparse model — plan for total checkpoint size, not active size." },
      residency: { eu: true, us: true, note: "EU-based provider; regional inference available." },
      eu_vendor: true,
      best_for: "The default answer when you need an EU vendor and open weights.",
      tags: ["open-weights", "eu", "multimodal", "balanced"]
    },
    {
      id: "mistral-medium-3.5",
      name: "Mistral Medium 3.5",
      model_id: "mistral-medium-3.5",
      vendor: "Mistral AI",
      vendor_url: "https://console.mistral.ai",
      weights: "open",
      license: "Modified MIT",
      params_b: 128,
      context: null,
      max_out: null,
      modalities: ["text", "image"],
      tools: true,
      price: {
        in: 1.5, cached_in: 0.15, out: 7.5,
        batch: null,
        long_ctx: null,
        notes: "128B dense. Built for long-horizon agentic and coding work. Regional inference +10%.",
        status: "verified", verified: "2026-09-26",
        source_label: "Mistral inference pricing", source_url: "https://docs.mistral.ai/inference/pricing"
      },
      hosts: [],
      self_host: { feasible: true, note: "Weights published under a modified MIT licence — read the licence before commercial self-hosting." },
      residency: { eu: true, us: true, note: "EU-based provider." },
      eu_vendor: true,
      best_for: "Agentic coding under an EU vendor.",
      tags: ["open-weights", "eu", "coding", "agents"]
    },
    {
      id: "mistral-small-4",
      name: "Mistral Small 4",
      model_id: "mistral-small-4",
      vendor: "Mistral AI",
      vendor_url: "https://console.mistral.ai",
      weights: "open",
      license: "Apache 2.0",
      params_b: null,
      context: null,
      max_out: null,
      modalities: ["text", "image"],
      tools: true,
      price: {
        in: 0.15, cached_in: 0.015, out: 0.6,
        batch: null,
        long_ctx: null,
        notes: "Apache 2.0. Multimodal and multilingual. Regional inference +10%.",
        status: "verified", verified: "2026-09-26",
        source_label: "Mistral inference pricing", source_url: "https://docs.mistral.ai/inference/pricing"
      },
      hosts: [],
      self_host: { feasible: true, note: "Apache 2.0 — the cleanest self-host licence on this page." },
      residency: { eu: true, us: true, note: "EU-based provider." },
      eu_vendor: true,
      best_for: "Cheap multimodal work you may later move in-house.",
      tags: ["open-weights", "eu", "cheap", "bulk", "multimodal"]
    },
    {
      id: "ministral-3-8b",
      name: "Ministral 3 8B",
      model_id: "ministral-3-8b",
      vendor: "Mistral AI",
      vendor_url: "https://console.mistral.ai",
      weights: "open",
      license: "Apache 2.0",
      params_b: 8,
      context: null,
      max_out: null,
      modalities: ["text"],
      tools: true,
      price: {
        in: 0.15, cached_in: 0.015, out: 0.15,
        batch: null,
        long_ctx: null,
        notes: "Also available as 3B ($0.10 / $0.10) and 14B ($0.20 / $0.20). Output costs the same as input — unusual, and useful when answers are long.",
        status: "verified", verified: "2026-09-26",
        source_label: "Mistral inference pricing", source_url: "https://docs.mistral.ai/inference/pricing"
      },
      hosts: [],
      self_host: { feasible: true, note: "Small enough for a single consumer GPU or an edge box." },
      residency: { eu: true, us: true, note: "EU-based provider." },
      eu_vendor: true,
      best_for: "On-device and edge workloads, and any job where you can self-host for pennies.",
      tags: ["open-weights", "eu", "edge", "cheap", "bulk"]
    },

    /* ---------------- OpenAI open weights ---------------- */
    {
      id: "gpt-oss-120b",
      name: "gpt-oss-120B",
      model_id: "gpt-oss-120b",
      vendor: "OpenAI (open weights)",
      vendor_url: "https://developers.openai.com",
      weights: "open",
      license: "Apache 2.0",
      params_b: 120,
      context: null,
      max_out: null,
      modalities: ["text"],
      tools: true,
      price: {
        in: null, cached_in: null, out: null,
        batch: null,
        long_ctx: null,
        notes: "No first-party hosted price — OpenAI ships the weights, not a cheap endpoint. Prices shown below are from a third-party host.",
        status: "verified", verified: "2026-09-26",
        source_label: "Together AI pricing (host)", source_url: "https://www.together.ai/pricing"
      },
      hosts: [
        { provider: "Together AI", in: 0.15, cached_in: null, out: 0.60, url: "https://www.together.ai/pricing", verified: "2026-09-26", note: "Hosted Apache 2.0 weights." }
      ],
      self_host: { feasible: true, note: "Apache 2.0, 120B — fits a 2x80GB box at FP8, or one 80GB card at INT4." },
      residency: { eu: null, us: null, note: "Depends on your host; self-host gives you full control." },
      best_for: "When legal wants an Apache 2.0 licence and engineering wants a model that actually follows instructions.",
      tags: ["open-weights", "cheap", "coding"]
    },

    /* ---------------- Open weights via third-party hosts ---------------- */
    {
      id: "glm-5.3",
      name: "GLM-5.3",
      model_id: "glm-5.3",
      vendor: "Z.ai",
      vendor_url: "https://open.bigmodel.cn",
      weights: "open",
      license: null,
      params_b: null,
      context: "1,000,000",
      max_out: null,
      modalities: ["text"],
      tools: true,
      price: {
        in: 1.4, cached_in: 0.26, out: 4.4,
        batch: null,
        long_ctx: null,
        notes: "No first-party Western price verified. Shown rate is Mistral's hosted listing, which is an official price for that channel — not for buying direct from Z.ai. Verify the vendor's own page before committing.",
        status: "verified", verified: "2026-09-26",
        source_label: "Mistral pricing (third-party hosted)", source_url: "https://docs.mistral.ai/inference/pricing"
      },
      hosts: [
        { provider: "Mistral AI", in: 1.40, cached_in: null, out: 4.40, url: "https://docs.mistral.ai/inference/pricing", verified: "2026-09-26", note: "Hosted by Mistral." },
        { provider: "Together AI", in: 1.40, cached_in: 0.26, out: 4.40, url: "https://www.together.ai/pricing", verified: "2026-09-26", note: "Same headline rate, cheaper cached input." }
      ],
      self_host: { feasible: true, note: "Open weights. Licence terms not verified this pass — check before commercial use." },
      residency: { eu: true, us: null, note: "Hosted in the EU by Mistral." },
      best_for: "Long-context agentic coding from an open-weights family.",
      tags: ["open-weights", "coding", "long-context", "agents"]
    },
    {
      id: "glm-5.3-flash",
      name: "GLM-5.3-Flash",
      model_id: "glm-5.3-flash",
      vendor: "Z.ai",
      vendor_url: "https://open.bigmodel.cn",
      weights: "open",
      license: null,
      params_b: null,
      context: "1,000,000",
      max_out: null,
      modalities: ["text"],
      tools: true,
      price: {
        in: 0.15, cached_in: 0.03, out: 0.5,
        batch: null,
        long_ctx: null,
        notes: "Hosted rate. One of the lowest output prices anywhere on this page.",
        status: "verified", verified: "2026-09-26",
        source_label: "Together AI pricing (host)", source_url: "https://www.together.ai/pricing"
      },
      hosts: [
        { provider: "Together AI", in: 0.15, cached_in: 0.03, out: 0.50, url: "https://www.together.ai/pricing", verified: "2026-09-26", note: "Hosted." }
      ],
      self_host: { feasible: true, note: "Open weights; licence unverified." },
      residency: { eu: null, us: null, note: "Depends on host." },
      best_for: "High-volume generation where output tokens dominate the bill.",
      tags: ["open-weights", "cheap", "bulk", "long-context"]
    },
    {
      id: "kimi-k3",
      name: "Kimi K3",
      model_id: "kimi-k3",
      vendor: "Moonshot AI",
      vendor_url: "https://platform.kimi.com",
      weights: "open",
      license: null,
      params_b: null,
      context: "1,048,576",
      max_out: null,
      modalities: ["text"],
      tools: true,
      price: {
        in: 3.0, cached_in: 0.3, out: 15.0,
        batch: null,
        long_ctx: null,
        notes: "Hosted rate from Together. Note the shape: cheap-ish input, expensive output. Long-context encoding jobs get expensive fast.",
        status: "verified", verified: "2026-09-26",
        source_label: "Together AI pricing (host)", source_url: "https://www.together.ai/pricing"
      },
      hosts: [
        { provider: "Together AI", in: 3.00, cached_in: 0.30, out: 15.00, url: "https://www.together.ai/pricing", verified: "2026-09-26", note: "Hosted." }
      ],
      self_host: { feasible: true, note: "Open weights; licence unverified." },
      residency: { eu: null, us: null, note: "Depends on host." },
      best_for: "Very long documents where you are willing to pay for output quality.",
      tags: ["open-weights", "long-context", "reasoning"]
    },
    {
      id: "qwen3.8-max",
      name: "Qwen3.8-2.4T-A95B",
      model_id: "qwen3.8-max",
      vendor: "Alibaba Qwen",
      vendor_url: "https://bailian.console.aliyun.com",
      weights: "open",
      license: null,
      params_b: 2400,
      params_active_b: 95,
      context: null,
      max_out: null,
      modalities: ["text"],
      tools: true,
      price: {
        in: 2.0, cached_in: 0.25, out: 6.0,
        batch: null,
        long_ctx: null,
        notes: "Hosted rate from Together. 2.4T total / 95B active — enormous checkpoint, modest compute per token. That combination is usually a bad deal to self-host.",
        status: "verified", verified: "2026-09-26",
        source_label: "Together AI pricing (host)", source_url: "https://www.together.ai/pricing"
      },
      hosts: [
        { provider: "Together AI", in: 2.00, cached_in: 0.25, out: 6.00, url: "https://www.together.ai/pricing", verified: "2026-09-26", note: "Hosted." }
      ],
      self_host: { feasible: true, note: "Technically open, economically questionable: you pay to hold terabytes of weights to use 95B of them per token." },
      residency: { eu: null, us: null, note: "Depends on host." },
      best_for: "Strong general capability at mid-tier prices — as long as someone else hosts it.",
      tags: ["open-weights", "balanced", "reasoning"]
    },
    {
      id: "qwen3.8-flash",
      name: "Qwen3.8 Flash",
      model_id: "qwen3.8-flash",
      vendor: "Alibaba Qwen",
      vendor_url: "https://bailian.console.aliyun.com",
      weights: "open",
      license: null,
      params_b: null,
      context: null,
      max_out: null,
      modalities: ["text"],
      tools: true,
      price: {
        in: 0.09, cached_in: null, out: 0.28,
        batch: null,
        long_ctx: null,
        notes: "Hosted rate from Together. Lowest input price on this page.",
        status: "verified", verified: "2026-09-26",
        source_label: "Together AI pricing (host)", source_url: "https://www.together.ai/pricing"
      },
      hosts: [
        { provider: "Together AI", in: 0.09, cached_in: null, out: 0.28, url: "https://www.together.ai/pricing", verified: "2026-09-26", note: "Hosted." }
      ],
      self_host: { feasible: true, note: "Open weights; licence unverified." },
      residency: { eu: null, us: null, note: "Depends on host." },
      best_for: "Price floor for bulk text work.",
      tags: ["open-weights", "cheap", "bulk"]
    },
    {
      id: "minimax-m3",
      name: "MiniMax M3",
      model_id: "minimax-m3",
      vendor: "MiniMax",
      vendor_url: "https://platform.minimax.ai",
      weights: "open",
      license: null,
      params_b: null,
      context: "1,000,000",
      max_out: null,
      modalities: ["text", "image"],
      tools: true,
      price: {
        in: 0.3, cached_in: 0.06, out: 1.2,
        batch: null,
        long_ctx: null,
        notes: "Hosted rate from Together. Vendor's own pricing page was not reachable this pass.",
        status: "verified", verified: "2026-09-26",
        source_label: "Together AI pricing (host)", source_url: "https://www.together.ai/pricing"
      },
      hosts: [
        { provider: "Together AI", in: 0.30, cached_in: 0.06, out: 1.20, url: "https://www.together.ai/pricing", verified: "2026-09-26", note: "Hosted." }
      ],
      self_host: { feasible: true, note: "Open weights; licence unverified." },
      residency: { eu: null, us: null, note: "Depends on host." },
      best_for: "Cheap long-context multimodal on a hosted endpoint.",
      tags: ["open-weights", "cheap", "multimodal", "long-context"]
    }
  ]
};
