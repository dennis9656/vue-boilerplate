> This file extends [web/stack-standards.md](../web/stack-standards.md) with the Vue SPA implementation
> of each requirement.
>
> ⚠️ **Not yet validated on a real project.** This pack was written by taking a ruleset built for an
> architecture with its own server tier and re-testing every rule's reasoning against an SPA. It has
> been checked for internal consistency, but no production Vue codebase has run under it. On first adoption, review the rules themselves alongside the code — particularly §4 and
> §5, whose shape depends on how the backend is actually deployed.

# Vue SPA Stack Standards (Mandatory)

The six requirements are in [web/stack-standards.md](../web/stack-standards.md). This file says how
they are met here — and for two of them, why they take a different shape.

## Architecture Axiom: there is no server of our own

The browser calls the backend directly. Nothing sits between them that we control.

```text
Browser  ──  Authorization / cookie  ──▶  Backend API
   │
   └── static assets from a CDN or object store (no application server)
```

Three consequences, stated up front because each of them looks like a violation to anyone arriving
from an architecture where the frontend has a server tier of its own:

- **The backend URL is in the bundle. This is not a leak.** There is nowhere else to put it. A
  check that flags `VITE_API_BASE_URL` is applying a rule whose basis does not exist here.
- **Cross-origin is the normal case**, so CORS is part of the design rather than an accident.
- **There is no mechanical enforcement of a server boundary.** Where the frontend has a server tier,
  a `server-only` import guard breaks the build when a client component reaches a server module.
  Nothing here does that, because there is no server module. The substitutes are named under §5 and in the Never Do table.

What this axiom costs is real: several risks a server tier would close structurally are wide open
here, and
one obligation cannot be met by the frontend at all. [security.md](./security.md) lists both, and
names what must move to the backend contract.

## 1. Internationalization

Library: `vue-i18n`. The requirement and the single-locale exemption are unchanged — including that
an unrecorded opt-out is a violation, not a choice.

## 2. REST Calls

Native `fetch`, wrapped in one thin local helper. No `axios`, `ky`, or `got`.

- **Assume cross-origin.** The helper sets `credentials: 'include'` when the backend authenticates by
  cookie, and the backend must answer with an explicit origin allowlist — a wildcard `Access-Control-Allow-Origin`
  is incompatible with credentialed requests and will fail at runtime rather than at review.
- Preflight cost is a design input, not an afterthought. Custom headers on a cross-origin request
  trigger an `OPTIONS` round trip on every call that is not simple.

## 3. Stack: Vue 3 + Vite + Tailwind CSS

- **Framework**: Vue 3 with `<script setup>` single-file components. The Options API is not used in new code.
- **Build**: Vite. TypeScript in `strict` mode.
- **Router**: `vue-router` 4.
- **Styling**: Tailwind utility classes, per the shared rule.

## 4. Rendering — the SSR requirement does not apply as written

There is no server hop, so "SSR by default" cannot be met. It is replaced by three obligations that
serve the same end — a first paint that is fast and not blank:

- **Route-level code splitting is mandatory**, not an optimization. Every route is a dynamic import;
  a router that statically imports all of its views ships the whole app to someone who opened one page.
- **The initial payload has a budget**, recorded per [web/performance.md](../web/performance.md).
  An SPA has no server-rendered fallback to hide behind, so the budget is the whole story.
- **SEO is an explicit decision, recorded in `AGENTS.md`.** If the app has publicly indexable content,
  say how it is served — prerendering, a static build, or an accepted decision that it is not indexed.
  Leaving this unrecorded is how a marketing page ends up invisible and nobody notices for a quarter.

Data fetching belongs in the query layer, not in `onMounted` — see [patterns.md](./patterns.md).

## 5. Authentication: JWT

The requirement — no JWT in `localStorage` — holds. **How it is met depends on where the backend sits,
and this is the rule most likely to need adjusting on first adoption.**

**Preferred: httpOnly cookie, same site as the frontend.** The backend sets it; browser JS never sees
it; nothing about the SPA weakens this. If the deployment allows it, this is the answer and the rest
of this section does not apply.

**Cross-origin backend.** The cookie still works, and is still preferred, but it needs
`SameSite=None; Secure` plus `credentials: 'include'` on every request — and `SameSite=None` removes
the CSRF protection that `Lax` was providing. The backend must supply a CSRF token or an equivalent.
Do not treat the cookie as sufficient on its own here.

**Only if the token must be readable by JS**, hold it in a module-scoped variable that does not
survive a reload. **Not in a Pinia store** — store state is serialized into devtools and into any
state-persistence plugin someone adds later.

**In every case:** `localStorage`, `sessionStorage`, and non-httpOnly cookies are forbidden for tokens.
This is the one line here that does not bend, and it is the first thing a review checks — the
structural protection a server tier of our own would have provided does not exist here.

## 6. Sensitive PII — the frontend cannot enforce this

There is no tier under our control between the backend and the browser. **Response minimization moves
to the backend contract**, and it is not met by hoping.

- The backend owns it. Record it as a contract requirement, with the specific fields, before
  implementation starts. [security.md](./security.md) lists this alongside the rest of what moves.
- What remains the frontend's own obligation is narrower but still binding: **do not spread PII the
  backend did send.** It stays out of logs, URLs and query strings, `localStorage`, analytics events,
  and error messages.
- If a screen needs a field the UI does not display, that is a contract bug — raise it rather than
  filtering in the component. Filtering in the browser is not filtering; the data already arrived.

## Never Do — Vue SPA additions

The shared table is in [web/stack-standards.md](../web/stack-standards.md); all four of its rows apply
here unchanged. These are additional:

| Never | Use instead |
|---|---|
| A secret behind a `VITE_` prefix | server-side config. Anything `VITE_`-prefixed is public by construction — the prefix is what puts it in the bundle |
| A token in `localStorage` / `sessionStorage` / a non-httpOnly cookie | an httpOnly cookie the backend sets (§5) |
| `v-html` on anything that is not sanitized | text interpolation, or a vetted sanitizer at the boundary |
| An HTTP client imported under `stores/` | the query layer — see [patterns.md](./patterns.md) |

Since no build step enforces the first row, the substitutes are: the `VITE_` prefix convention itself
(unprefixed variables never reach the bundle), an `eslint no-restricted-imports` rule for paths that
must not be reachable from the client, and keeping secrets out of the frontend repository entirely
so that CI secret scanning is the backstop.

## Enforcement

- Code review must reject changes that violate any of the six requirements.
- Generated or scaffolded code must conform by default.
- See also: [security.md](./security.md), [patterns.md](./patterns.md), [web/stack-standards.md](../web/stack-standards.md).
