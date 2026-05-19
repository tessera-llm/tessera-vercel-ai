/**
 * anthropic-vercel-ai.ts — generateText through Tessera proxy + Vercel AI SDK + Anthropic.
 *
 * Usage:
 *
 *   npm install @tessera-llm/vercel-ai ai @ai-sdk/anthropic
 *   export ANTHROPIC_API_KEY=sk-ant-...
 *   export TESSERA_API_KEY=tk_...
 *   npx tsx anthropic-vercel-ai.ts
 */

import { generateText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { tesseraAnthropicConfig } from "@tessera-llm/vercel-ai";

async function main(): Promise<void> {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const tesseraKey = process.env.TESSERA_API_KEY;
  if (!anthropicKey || !tesseraKey) {
    throw new Error("Set ANTHROPIC_API_KEY and TESSERA_API_KEY before running.");
  }

  const anthropic = createAnthropic({
    apiKey: anthropicKey,
    ...tesseraAnthropicConfig({ apiKey: tesseraKey }),
  });

  const { text } = await generateText({
    model: anthropic("claude-sonnet-4-5-20250929"),
    prompt:
      "Explain why log-structured merge trees outperform B-trees on " +
      "write-heavy workloads in three concise bullets.",
  });

  console.log(text);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
