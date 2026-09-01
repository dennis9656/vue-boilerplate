> Vue SPA checks. Run these **in addition to** [web/review-checks.md](../web/review-checks.md).
>
> ⚠️ **Not yet validated on a real project.** See [stack-standards.md](./stack-standards.md).

# Review Checks — Vue 3 + Vite SPA

## What this pack does *not* check

Stated first, because a reviewer used to an architecture with its own server tier will look for these
and read their absence as an oversight:

- **The backend URL in the bundle is not a finding.** There is nowhere else to put it
  ([stack-standards.md](./stack-standards.md)). Flagging `VITE_API_BASE_URL` spends review attention
  on the architecture working as designed.
- **No server-module boundary check.** There are no server modules.
- **No SSRF / redirect-chasing check.** No server of ours fetches a user-supplied URL. The
  open-redirect check in the shared list still applies — that one is about where the *user* is sent.

## Tier 1 — Security boundary

The shared token-storage grep matters more here than anywhere else: no server holds the token on the
user's behalf, so that one check is the whole defense ([security.md](./security.md)).

```bash
# secret behind a VITE_ prefix — the prefix is what ships it to the browser
grep -rEn "VITE_[A-Z_]*(SECRET|KEY|TOKEN|PASSWORD|CREDENTIAL)" src .env*

# unsanitized raw HTML
grep -rn "v-html" src --include=*.vue
```

Then by reading:

- Does a Pinia **persistence plugin** write user data to browser storage? It arrives as a
  convenience, applies to every store at once, and no single line looks like it did that.
- Does cookie authentication have a CSRF answer? `SameSite=None` — required for a cross-origin
  backend — provides none.
- Is a route guard or `v-if` being used as if it were authorization?

## Tier 2 — Layer boundary

```bash
# a store that fetches: server state does not live in Pinia
grep -rn "lib/http\|/api/" src/stores --include=*.ts
```

| Check | Violation looks like |
|---|---|
| State ownership | an HTTP client imported under `stores/`, or a store field holding a server entity |
| Reactive arguments | a query composable taking a plain value where the key depends on it — it will never refetch, silently |
| Component placement | a domain's component sitting in `views/` instead of `features/{d}/components/` |

## Tier 3 — Mandatory conventions

```bash
grep -rn "<button\|role=\"button\"" src --include=*.vue
grep -rn ':class="`' src --include=*.vue          # use cn() or the object syntax
grep -rn "defineComponent\|export default {" src --include=*.vue   # <script setup> only
```

Plus, by reading:

- Single-word component names — they collide with HTML elements and fail as a silently wrong
  element rather than an error.
- An unscoped `<style>` block in a component.

## Tier 4 — Judgment

- **Cache lifetime across sessions.** Does logout and account switch clear the query cache? One
  client instance outlives the session here, so the previous user's data stays cached until
  something removes it. An architecture with a per-request boundary got this for free.
- **Route-level code splitting.** Is every route a dynamic import? A router that statically imports
  its views ships the whole app to someone who opened one page — and with no server-rendered
  fallback, that is the entire first-paint story.
- **Prerendering decision.** If the app has publicly indexable content, is the SEO approach recorded
  in `AGENTS.md`? An unrecorded decision is how a marketing page ends up invisible.
