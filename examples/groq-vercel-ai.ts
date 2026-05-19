/**
 * groq-vercel-ai.ts — generateText through Tessera proxy + Vercel AI SDK + Groq.
 *
 * Usage:
 *
 *   npm install @tessera-llm/vercel-ai ai @ai-sdk/groq
 *   export GROQ_API_KEY=gsk_...
 *   export TESSERA_API_KEY=tk_...
 *   npx tsx groq-vercel-ai.ts
 */

import { generateText } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { tesseraGroqConfig } from "@tessera-llm/vercel-ai";

async function main(): Promise<void> {
  const groqKey = process.env.GROQ_API_KEY;
  const tesseraKey = process.env.TESSERA_API_KEY;
  if (!groqKey || !tesseraKey) {
    throw new Error("Set GROQ_API_KEY and TESSERA_API_KEY before running.");
  }

  const groq = createGroq({
    apiKey: groqKey,
    ...tesseraGroqConfig({ apiKey: tesseraKey }),
  });

  const { text } = await generateText({
    model: groq("llama-3.3-70b-versatile"),
    prompt:
      "How does Groq's LPU architecture differ from a GPU for inference? " +
      "3 concise bullets.",
  });

  console.log(text);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
