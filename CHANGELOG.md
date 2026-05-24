# Changelog

All notable changes to `@tessera-llm/vercel-ai` documented here. Follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

## [0.1.1] -- 2026-05-25

### Fixed
- Free Sandbox terminology + observability-only mechanics consistency.
- Blog cross-link slug 38 -> 48.

### Changed
- Companion-cross-link block refreshed for 4 new sibling repos.
### Changed

- README cross-link block extended to include `@tessera-llm/mastra` (Mastra
  Agent framework integration) and `tessera-pydantic-ai` (Pydantic AI
  integration) — Tessera's sibling-package roster now covers six framework
  surfaces. No code change in this package; the cross-link refresh ships on
  the next code-driven version bump per the package's piggy-back policy.

## [0.1.0] — 2026-05-19 — first public release

### Added

- **Config functions** for the five major Vercel AI SDK provider packages:
  - `tesseraOpenAIConfig({ apiKey })` → kwargs for `createOpenAI(...)`
  - `tesseraAnthropicConfig({ apiKey })` → kwargs for `createAnthropic(...)`
  - `tesseraMistralConfig({ apiKey })` → kwargs for `createMistral(...)`
  - `tesseraGroqConfig({ apiKey })` → kwargs for `createGroq(...)`
  - `tesseraCohereConfig({ apiKey })` → kwargs for `createCohere(...)`
- `tesseraConfig(provider, input)` — generic dispatcher.
- **Convenience factories** (`tesseraOpenAI`, `tesseraAnthropic`, etc.) — dynamically import the corresponding `@ai-sdk/*` package and return a pre-configured provider. Lets users skip the explicit `createX` import.
- Optional `extraHeaders` and `baseUrl` parameters on every config function (staging endpoints, custom Tessera deployments, app-trace headers).
- E2E smoke verified against real `@ai-sdk/openai` 3.0.64: `createOpenAI(tesseraOpenAIConfig(...))` returns a callable provider, `provider("gpt-4o")` returns a model with the expected modelId.

### Architecture

- Same proxy as `tessera-sdk` and `tessera-langchain`. Same `tk_…` API key works across all three; same billing record. Safe to install side by side.
- Open-source thin client × closed-source proxy at `api.tesseraai.io`.
- No `ai` core dependency, no runtime dep on any `@ai-sdk/*` package — peer-deps only. Install only the providers you actually use.

### CI + tooling

- ESM + CJS dual bundle via tsup. Full `.d.ts` declarations.
- Vitest unit tests (16 cases covering config shape, header merge, dispatcher, validation).
- Apache-2.0 license.

[Unreleased]: https://github.com/tessera-llm/tessera-vercel-ai/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/tessera-llm/tessera-vercel-ai/releases/tag/v0.1.0
