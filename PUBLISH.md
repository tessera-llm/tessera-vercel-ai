# Publish playbook — @tessera-llm/vercel-ai

CI workflows automate the heavy lifting. To ship a new release:

1. **Repo secret configured** (one-time setup):
   - `NPM_TOKEN` — npm automation token with publish access to `@tessera-llm/vercel-ai`
   Set via `gh secret set NPM_TOKEN --repo tessera-llm/tessera-vercel-ai` or in Settings → Secrets → Actions.

2. **Version bump** in two places (must match):
   - `package.json` → `"version": "X.Y.Z"`
   - `src/index.ts` → `export const VERSION = "X.Y.Z";`

3. **CHANGELOG.md** updated with the new version block.

4. **Commit + push** the version bump.

5. **Create + push release tag:**
   ```bash
   git tag v0.1.0
   git push origin v0.1.0
   ```
   The `v*` tag triggers `publish-node.yml` → npm publish.

6. **Verify after publish:**
   ```bash
   curl -sI https://registry.npmjs.org/@tessera-llm/vercel-ai/X.Y.Z
   ```
   Should return 200 OK. npm usually indexes within 10-30 seconds.

7. **GitHub Release object:**
   ```bash
   gh release create v0.1.0 --title "v0.1.0 — first public release" --notes-file <(awk '/^## \[0\.1\.0\]/{flag=1} /^## \[/&&!/0\.1\.0/{flag=0} flag' CHANGELOG.md)
   ```

8. **Announce** — the npm + GitHub Release are sufficient for awesome-list submissions and cross-package README updates.

## Versioning policy

Semver. Wire format compatibility across minor versions (0.X.Y). Breaking changes only on major bumps.
