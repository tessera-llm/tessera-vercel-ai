# `@tessera-llm/vercel-ai`

**Drop-in cost optimization for the Vercel AI SDK.** One line of config routes your existing `generateText` / `streamText` / `generateObject` / `streamObject` calls through the [Tessera](https://tesseraai.io) optimization proxy — auto-route to cheaper-equivalent models, exact + provider-prompt-cache hits, prompt compression with per-stack quality canary, batch arbitrage on async-tolerant calls. Free Dev tier: **60M tokens/month, no card**. Production: **20% of measured savings, $0 if we save you nothing**.

<!-- COMPANION-PACKAGES-START -->
Companion to [`tessera-sdk`](https://github.com/tessera-llm/tessera-sdk) (vanilla provider SDKs), [`tessera-langchain`](https://github.com/tessera-llm/tessera-langchain) (LangChain integration), [`tessera-llamaindex`](https://github.com/tessera-llm/tessera-llamaindex) (LlamaIndex integration), [`tessera-mastra`](https://www.npmjs.com/package/@tessera-llm/mastra) (Mastra Agent framework integration), [`tessera-pydantic-ai`](https://pypi.org/project/tessera-pydantic-ai/) (Pydantic AI integration), [`tessera-crewai`](https://pypi.org/project/tessera-crewai/) (CrewAI multi-agent integration), and [`tessera-autogen`](https://pypi.org/project/tessera-autogen/) (AutoGen 0.4+ multi-agent integration). Same proxy, same mechanic stack, Vercel AI SDK-shaped API.
<!-- COMPANION-PACKAGES-END -->

[![npm version](https://img.shields.io/npm/v/@tessera-llm/vercel-ai.svg)](https://www.npmjs.com/package/@tessera-llm/vercel-ai) [![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)

---

## What it looks like

```ts
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { tesseraOpenAIConfig } from "@tessera-llm/vercel-ai";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  ...tesseraOpenAIConfig({ apiKey: process.env.TESSERA_API_KEY! }),
});

const { text } = await generateText({
  model: openai("gpt-4o"),
  prompt: "Summarize this customer support ticket in 2 sentences.",
});
```

Three changes in your code: one import, three lines in the constructor call. Your existing `generateText` / `streamText` / `generateObject` calls work unchanged.

Or use the convenience factory (skips the explicit `createOpenAI` import):

```ts
import { generateText } from "ai";
import { tesseraOpenAI } from "@tessera-llm/vercel-ai";

const openai = await tesseraOpenAI({
  openaiApiKey: process.env.OPENAI_API_KEY!,
  tesseraApiKey: process.env.TESSERA_API_KEY!,
});

const { text } = await generateText({
  model: openai("gpt-4o"),
  prompt: "Summarize this customer support ticket in 2 sentences.",
});
```

---

## Install

```bash
npm install @tessera-llm/vercel-ai
# Plus whichever provider package you use:
npm install @ai-sdk/openai          # or @ai-sdk/anthropic / @ai-sdk/mistral / @ai-sdk/groq / @ai-sdk/cohere
```

The `@ai-sdk/*` packages are peer dependencies — install only the providers you actually use. The `ai` core SDK is whatever version you already have.

Get a free Tessera API key (60M tokens/mo, no card) at **[tesseraai.io/dev](https://tesseraai.io/dev)** — sign-up takes ~30 seconds and returns an instant `tsr_…` key plus magic-link dashboard access.

---

## Provider support

| Provider | @ai-sdk package | Tessera config function | Convenience factory |
|---|---|---|---|
| OpenAI | `@ai-sdk/openai` | `tesseraOpenAIConfig` | `tesseraOpenAI` |
| Anthropic | `@ai-sdk/anthropic` | `tesseraAnthropicConfig` | `tesseraAnthropic` |
| Mistral | `@ai-sdk/mistral` | `tesseraMistralConfig` | `tesseraMistral` |
| Groq | `@ai-sdk/groq` | `tesseraGroqConfig` | `tesseraGroq` |
| Cohere | `@ai-sdk/cohere` | `tesseraCohereConfig` | `tesseraCohere` |

Generic dispatcher available too: `tesseraConfig("openai", { apiKey: "tsr_..." })` — returns the right `{ baseURL, headers }` object regardless of provider. Useful when the provider is parameterized at runtime.

---

## Worked example

Real customer-support agent on `gpt-4o`, 5B tokens/month, OpenAI list prices:

| Stage | Cost / mo | Saved |
|---|---:|---:|
| Baseline — OpenAI direct via Vercel AI SDK | $24,000 | — |
| + Tessera (route, cache, prompt-cache headers, compress, M9 ceiling, batch) | $9,400 | $14,600 |
| Tessera fee (20% × savings) | $2,920 | — |
| **You net pay** | **$12,320** | **$11,680 / mo saved** |

Quality canary across the full mechanic stack: mean-score 0.96 (floor 0.95) — 0.95 SLA held all 30 days. Full breakdown: [`/blog/cut-openai-bill-38-percent-without-quality-regression`](https://tesseraai.io/blog/cut-openai-bill-38-percent-without-quality-regression).

---

## What Tessera does on every request

Same mechanic stack as the main [`tessera-sdk`](https://github.com/tessera-llm/tessera-sdk). Each mechanic is opt-in per workload, observable per request, and bypasses when its quality canary drops below the per-stack 0.95 floor.

| Mechanic | What it does | Typical savings |
|---|---|---|
| **Auto-route** <sub>(m1)</sub> | Route to a cheaper-equivalent model gated by a daily promptfoo canary on your eval set | 15–35% on routed calls |
| **Auto-cache** <sub>(m2)</sub> | sha256 cache on the canonical request body, 7-day TTL, Cloudflare edge KV | 5–40% depending on prompt repetition |
| **Auto-compress** <sub>(m3)</sub> | Per-role heuristic compression (system + user toggles independent). Preserves code fences and JSON shapes. | 5–15% on prompt tokens |
| **Prompt cache** <sub>(m6)</sub> | Inject provider-native cache headers — OpenAI cached-input (50% off), Anthropic `cache_control: ephemeral` (90% off cache reads) | 50–90% on cached prefixes |
| **Context prune** <sub>(m7)</sub> | Conservative trim on long conversations (system + last 8 turns; TF-IDF rerank on RAG attachments) | 5–25% on multi-turn workloads |
| **Output-length ceiling** <sub>(m9)</sub> | Daily compute fits p90 of completion length per workload, injects `maxTokens = p90 × 1.3` | 5–15% on completion cost |
| **Batch arbitrage** <sub>(m10)</sub> | Route async-tolerant calls to provider Batch APIs (OpenAI Batch + Anthropic Message Batches both 50% off) | 50% on batch-eligible traffic |
| **Per-provider circuit breaker** | (Reliability primitive, above the mechanics.) Rolling 5xx-rate state machine per upstream — when a provider degrades, auto-route skips its intra-provider alternative mappings until the half-open probe succeeds. | n/a — keeps the savings stack honest |

---

## Pricing

- **Free Dev** — 60M tokens/month, 30 requests/minute, all mechanics on, no card. Forever.
- **Production** — over 60M tokens/month or higher rate limit. **20% of measured savings only.** Zero savings, zero fee. Prepaid Stripe balance, $100 minimum top-up. No subscription, no commit, no minimum monthly.

Existing customers of `tessera-sdk` and `tessera-langchain` keep their `rate_locked_pct` (if any) on this package too — same `tsr_…` key, same billing record.

---

## FAQ

### Q: How is this different from `tessera-langchain` and `tessera-sdk`?

Same proxy. Same mechanics. Same billing. The three packages target different code surfaces:

- **`tessera-sdk`** — patches the underlying provider client constructors (OpenAI, Anthropic, etc.) directly via `tessera.activate(key)`. Use when calling provider SDKs without a framework.
- **`tessera-langchain`** — wires into LangChain ChatModel constructors. Use when you're on LangChain.
- **`tessera-vercel-ai`** *(this package)* — wires into the Vercel AI SDK provider factories (`createOpenAI`, `createAnthropic`, etc.). Use when you're on `ai` core + `@ai-sdk/*`.

Pick whichever fits your codebase. Side-by-side install is supported — all three resolve to the same proxy and same billing record.

### Q: Does this break my eval / structured output / tool calling / streaming?

No. The Vercel AI SDK provider object behaves identically — `generateText`, `streamText`, `generateObject`, `streamObject` all work unchanged. Schema-constrained outputs pass through. Tools pass through (auto-route gates on tool-calling capability). Streaming streams.

### Q: What happens if Tessera's proxy is down?

Your application gets HTTP errors instead of LLM responses. On the proxy side, a per-provider circuit breaker tracks rolling 5xx rates and skips degraded providers in auto-route decisions. Cross-provider failover (re-routing to a different provider entirely when an upstream is down) is on the roadmap, not shipped yet.

### Q: What happens to my OpenAI / Anthropic rate limits?

They pass through. Tessera does not aggregate quotas across customers. Your provider rate limits apply normally; the proxy enforces only the Tessera tier limits (30 rpm Free Dev, 60 rpm Production by default — higher on request).

### Q: Are you storing my prompts and completions?

No. We log only token counts, cost deltas, mechanics_stack, and provider response status. Prompts and completions are never persisted. Full data handling on [`tesseraai.io/security`](https://tesseraai.io/security).

### Q: Why are there two API surfaces (`tesseraOpenAIConfig` vs `tesseraOpenAI`)?

The config function returns the kwargs object you spread into `createOpenAI(...)` — explicit, easy to combine with other settings (organization, custom fetch, etc.). The convenience factory imports `createOpenAI` for you and pre-merges. Use whichever you find more readable. Both ship in the same package.

### Q: Can I use this with the Next.js App Router / Server Actions / Edge Runtime?

Yes. `@tessera-llm/vercel-ai` is a thin ESM/CJS dual package with no runtime dependencies on its own — same compatibility as the Vercel AI SDK itself.

---

## Architecture

Open-source SDK ↔ closed-source proxy. This package is a thin client that adds one HTTP hop. The actual mechanic decisions (route, cache, compress, etc.) run inside the Tessera Cloudflare Worker proxy at `api.tesseraai.io`. The split is intentional: the wire format is open so you can audit what we send; the mechanic implementations are closed because that's the asymmetric IP. See the [`tessera-sdk` README's "Architecture" note](https://github.com/tessera-llm/tessera-sdk#architecture) for the longer explanation.

## License

Apache-2.0. See [LICENSE](LICENSE).

## Contributing

We accept PRs that:

- Add support for a new `@ai-sdk/*` provider package (paste-and-mirror the existing config function shape)
- Improve typing precision (TypeScript strict)
- Add concrete example scripts under `examples/` showing a real Vercel AI SDK pipeline
- Improve tests or test infrastructure

We do **not** accept PRs that change the proxy's HTTP contract — that lives in the closed-source worker.

## Versioning

Semver. Wire format compatibility committed across minor releases; breaking changes only on major bumps.

## Security

See [`SECURITY.md`](./SECURITY.md). Coordinated disclosure address: `security@tesseraai.io`.

---

## About Tessera

Tessera is the **substrate layer** for **LLM cost optimization**, also called the **Optimize Layer** in our product surface. A thin proxy that sits in your application's **request-path**, applies a conservative cascade of optimization mechanics, and measures every saved dollar against an **audit-immutable** baseline. We bill **20% of verified savings**, prepaid. Zero savings = zero fee. No per-token gateway fee, no subscription, no minimum monthly commitment; the category we operate in is "**success-fee LLM optimizer**," distinct from per-token **AI gateways** and observability dashboards.

Where observability tools tell you what you spent and AI gateways re-shape the request without measuring the cost delta, Tessera is the layer that does both, and only takes a cut when the measured savings are positive. The **verified-savings ledger** at [`ledger.tesseraai.io`](https://ledger.tesseraai.io) shows every original-vs-actual cost pair, snapshot-pinned to a `pricing_catalog` version captured at request time. Mid-contract price changes don't retroactively alter past savings. This is the **FinOps**-friendly model for AI inference: every line of the bill traces to a code-enforced rule.

Operated by Fintechagency OÜ (Tallinn, Estonia, registry code 16638667).

- Developer entry: [tesseraai.io/dev](https://tesseraai.io/dev)
- Mechanic reference: [tesseraai.io/how-it-works](https://tesseraai.io/how-it-works)
- Dashboard: [ledger.tesseraai.io](https://ledger.tesseraai.io)
- Engineering blog: [tesseraai.io/blog](https://tesseraai.io/blog)
