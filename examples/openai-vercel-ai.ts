/**
 * openai-vercel-ai.ts — generateText through Tessera proxy + Vercel AI SDK.
 *
 * Usage:
 *
 *   npm install @tessera-llm/vercel-ai ai @ai-sdk/openai
 *   export OPENAI_API_KEY=sk-...
 *   export TESSERA_API_KEY=tk_...
 *   npx tsx openai-vercel-ai.ts
 */

import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { tesseraOpenAIConfig } from "@tessera-llm/vercel-ai";

async function main(): Promise<void> {
  const openaiKey = process.env.OPENAI_API_KEY;
  const tesseraKey = process.env.TESSERA_API_KEY;
  if (!openaiKey || !tesseraKey) {
    throw new Error("Set OPENAI_API_KEY and TESSERA_API_KEY before running.");
  }

  const openai = createOpenAI({
    apiKey: openaiKey,
    ...tesseraOpenAIConfig({ apiKey: tesseraKey }),
  });

  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt:
      "Compare a service mesh sidecar approach vs an eBPF-based approach " +
      "for east-west traffic policy enforcement. Answer in 3 concise bullets.",
  });

  console.log(text);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
