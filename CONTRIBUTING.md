# Contributing to @tessera-llm/vercel-ai

Thanks for your interest. The package is Apache-2.0 licensed and PRs are welcome.

For the canonical contributing rules (style, what we want, what we don't want,
PR review expectations) see
[`tessera-llm/tessera-sdk/CONTRIBUTING.md`](https://github.com/tessera-llm/tessera-sdk/blob/main/CONTRIBUTING.md).
This file documents the package-specific bits.

## Reporting bugs

Open an issue at
[github.com/tessera-llm/tessera-vercel-ai/issues](https://github.com/tessera-llm/tessera-vercel-ai/issues)
with:

- Package version (`npm list @tessera-llm/vercel-ai`)
- AI SDK version (`npm list ai @ai-sdk/openai @ai-sdk/anthropic`)
- Node version
- Minimum reproduction snippet
- Expected vs. actual behaviour

For security vulnerabilities, see [`SECURITY.md`](./SECURITY.md) — please do
not file public issues.

## Development setup

```bash
npm install
npm test
npm run build
```

The CI workflow under `.github/workflows/` runs the same checks on every
push and pull request — keep it green.

## Package-specific scope

This package wraps the [Vercel AI SDK](https://sdk.vercel.ai/) provider
factories (`@ai-sdk/openai`, `@ai-sdk/anthropic`, `@ai-sdk/mistral`,
`@ai-sdk/groq`, `@ai-sdk/cohere`) with the Tessera proxy. The integration
shape is a thin `tesseraXxx(provider, options)` helper that injects
`baseURL` + Tessera headers. Keep new wrappers tiny — one factory per
upstream provider, no business logic inside the wrapper, mirror the
AI SDK provider's own public API surface exactly.

## Contact

- Bug reports: GitHub Issues.
- Security: [security@tesseraai.io](mailto:security@tesseraai.io).
- Code of Conduct enforcement: [conduct@tesseraai.io](mailto:conduct@tesseraai.io).
- General: [founder@tesseraai.io](mailto:founder@tesseraai.io).
