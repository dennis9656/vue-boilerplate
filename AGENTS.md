# AGENTS.md

Project-level decisions the rule packs require to be recorded. An unrecorded
decision is the failure mode these entries exist to prevent.

```yaml
framework: vue-spa            # rules/web/FRAMEWORKS.md — explicit declaration wins over detection
package-manager: npm

bundle-budget:                # gzipped, rules/web/performance.md
  app: { js: 300kb, css: 50kb }

breakpoints: [320, 640, 768, 1024, 1440]

icon-glyph-ratio: 0.72        # 24px viewBox, glyph drawn inside a ~17px box
```

## i18n

Not exempt. Every user-facing string goes through `vue-i18n`, including
`placeholder`, `aria-label`, and error text. Keys live next to the feature
(`src/features/{domain}/locales/`), merged in `src/lib/i18n.ts`.

## SEO / prerendering — decided

**Not indexed.** This boilerplate targets an authenticated internal application,
so there is no publicly indexable content and no prerendering step. If a
marketing or docs surface is added later, this line is what has to change first:
pick prerendering or a static build, and record it here.

## Authentication

httpOnly cookie set by the backend; `lib/http.ts` sends `credentials: 'include'`.
Nothing in this repo reads or writes a token, and nothing may: `localStorage`,
`sessionStorage`, and non-httpOnly cookies are forbidden for tokens.

Cross-origin deployment needs `SameSite=None; Secure`, which removes the CSRF
protection `Lax` provided — the backend must supply a CSRF token. Raise it during
contract negotiation, not during implementation.

## What the backend owns

The frontend cannot enforce these. They belong to the API contract:

| Obligation | Status |
|---|---|
| Response minimization (PII) | **open** — name the fields per endpoint before implementing |
| Auth cookie issuance (`httpOnly`, `Secure`, `SameSite`) | **open** |
| CORS origin allowlist (no wildcard, credentials are sent) | **open** |
| CSRF defense | **open** |
| Authorization on every action | **open** |
| Rate limiting on auth and costly endpoints | **open** |
| Security headers (CSP, HSTS, `frame-ancestors`) | **open** — static host or CDN |
