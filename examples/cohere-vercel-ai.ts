/**
 * cohere-vercel-ai.ts — generateText through Tessera proxy + Vercel AI SDK + Cohere.
 *
 * Usage:
 *
 *   npm install @tessera-llm/vercel-ai ai @ai-sdk/cohere
 *   export COHERE_API_KEY=...
 *   export TESSERA_API_KEY=tk_...
 *   npx tsx cohere-vercel-ai.ts
 */

import { generateText } from "ai";
import { createCohere } from "@ai-sdk/cohere";
import { tesseraCohereConfig } from "@tessera-llm/vercel-ai";

async function main(): Promise<void> {
  const cohereKey = process.env.COHERE_API_KEY;
  const tesseraKey = process.env.TESSERA_API_KEY;
  if (!cohereKey || !tesseraKey) {
    throw new Error("Set COHERE_API_KEY and TESSERA_API_KEY before running.");
  }

  const cohere = createCohere({
    apiKey: cohereKey,
    ...tesseraCohereConfig({ apiKey: tesseraKey }),
  });

  const { text } = await generateText({
    model: cohere("command-r-plus-08-2024"),
    prompt:
      "Compare Cohere's Rerank model to a dense vector retriever for " +
      "production RAG. 3 concise bullets.",
  });

  console.log(text);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
