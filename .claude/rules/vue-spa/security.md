> This file extends [web/security.md](../web/security.md) with what an architecture that has no server
> of its own leaves open.
>
> ⚠️ **Not yet validated on a real project.** The backend-owned items below depend on how the API is
> actually deployed. Review this list against the real contract on first adoption.

# Vue SPA Security Rules

## What Moves to the Backend

**Read this before anything else in this pack.** A frontend with no server of its own cannot enforce
the following. They do not become less necessary — they become someone else's, and if nobody writes
them down they belong to nobody.

Put each on the table during backend contract negotiation, before implementation starts.

| Obligation | What the backend must do |
|---|---|
| **Response minimization** | Mask, aggregate, or omit PII before it leaves the API. Name the specific fields. If the UI shows the last four digits, the response carries four digits |
| **Auth cookie issuance** | Set the session cookie `httpOnly`, `Secure`, with an appropriate `SameSite`. The frontend cannot set an httpOnly cookie |
| **CORS allowlist** | Explicit origins. A wildcard is incompatible with credentialed requests and fails at runtime, not at review |
| **CSRF defense** | Required whenever auth rides on a cookie. `SameSite=Strict`/`Lax`, or a CSRF token the backend validates. `SameSite=None` — needed for a cross-origin backend — provides none |
| **Authorization** | Every action needs a server-side check. Hiding a button is presentation, not a control |
| **Rate limiting** | On authentication and on any endpoint that costs something |
| **Security headers** | CSP, HSTS, `frame-ancestors`. Owned by the static host or CDN serving the bundle |

A `must-fix-before-dev` finding in this table blocks implementation exactly like any other.

## Structurally Open — check these every feature

An architecture with a server tier of its own closes several risks by construction, and its reviewers
are told not to re-litigate them. **Here the same risks are open**, and a reviewer carrying that
habit across will skip precisely the checks that matter most.

| Risk | Status here |
|---|---|
| **Token theft** | **Open, and the highest-value target.** No server holds the token on the user's behalf. §5 of [stack-standards.md](./stack-standards.md) is the whole defense, and one `localStorage.setItem` undoes it |
| **CSRF** | **Open.** There is no proxy attaching auth server-side. Cookie auth here needs an explicit answer |
| Backend URL exposure | **Not a risk — it is the architecture.** Flagging it wastes review attention. What *is* a finding: a secret behind a `VITE_` prefix |
| Secrets in the bundle | **Open.** Nothing breaks the build. `VITE_`-prefixed secrets and hardcoded keys are found by review and CI scanning or not at all |
| CSP / clickjacking | Owned by the static host or CDN |
| Dependency vulnerabilities | Separate operational track, as everywhere |

**Server-side request forgery does not apply.** The redirect-chasing trap concerns a server fetching
a user-supplied URL, and no server of ours fetches anything. Every request here originates in the
browser and is subject to CORS and the same-origin policy. Do not carry that check across; do carry
the open-redirect check, which is about where *the user* is sent and applies everywhere.

## XSS

The escape hatch here is **`v-html`**.

Vue escapes interpolation, so the default is safe and the unsafe path is explicit — which makes
`v-html` a reliable thing to grep for and a reliable thing to justify in review.

- `v-html` on server-supplied content requires sanitization at the boundary, by a vetted library, on
  the way in — not in the template.
- "The backend sanitizes it" is a claim to verify against the contract, not to accept. If it is true,
  record it; an unrecorded assumption gets falsified by a later API change nobody connects to this.
- A dynamic `:href` or `:src` built from user input needs a scheme allowlist. `javascript:` in an
  `href` is XSS that no HTML sanitizer sees.

## Review Surface — additions to the shared list

The shared checks are in [web/security.md](../web/security.md). Additionally, every feature:

| Surface | What to look for |
|---|---|
| Token handling | Anything touching `localStorage`, `sessionStorage`, `document.cookie` near auth |
| Environment variables | A new `VITE_`-prefixed variable whose name suggests a credential |
| Client-side gating | A route guard or `v-if` used as if it were authorization |
| Persisted state | A Pinia persistence plugin quietly writing user data to `localStorage` |

The last one is worth stating because it arrives as a convenience feature, applies to every store at
once, and moves data into browser storage without any single line of code looking like it did that.
