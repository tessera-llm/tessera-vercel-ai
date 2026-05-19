/**
 * mistral-vercel-ai.ts — generateText through Tessera proxy + Vercel AI SDK + Mistral.
 *
 * Usage:
 *
 *   npm install @tessera-llm/vercel-ai ai @ai-sdk/mistral
 *   export MISTRAL_API_KEY=...
 *   export TESSERA_API_KEY=tk_...
 *   npx tsx mistral-vercel-ai.ts
 */

import { generateText } from "ai";
import { createMistral } from "@ai-sdk/mistral";
import { tesseraMistralConfig } from "@tessera-llm/vercel-ai";

async function main(): Promise<void> {
  const mistralKey = process.env.MISTRAL_API_KEY;
  const tesseraKey = process.env.TESSERA_API_KEY;
  if (!mistralKey || !tesseraKey) {
    throw new Error("Set MISTRAL_API_KEY and TESSERA_API_KEY before running.");
  }

  const mistral = createMistral({
    apiKey: mistralKey,
    ...tesseraMistralConfig({ apiKey: tesseraKey }),
  });

  const { text } = await generateText({
    model: mistral("mistral-large-latest"),
    prompt:
      "Compare Mixtral's mixture-of-experts architecture to a dense " +
      "Llama-class model. 3 concise bullets.",
  });

  console.log(text);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
