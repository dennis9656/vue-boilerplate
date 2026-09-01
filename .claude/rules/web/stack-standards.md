> This file defines mandatory frontend stack standards. These rules are non-negotiable defaults —
> deviate only with explicit approval. **How** each is met is in
> [vue-spa/stack-standards.md](../vue-spa/stack-standards.md).

# Web Stack Standards (Mandatory)

These six requirements MUST be applied to every frontend feature. They override conflicting defaults in other rule files unless an exception is explicitly approved.

Each requirement states *what* must hold. [vue-spa/stack-standards.md](../vue-spa/stack-standards.md)
states *how* — and for §4 and §6 an architecture with no server of its own makes the requirement take
a different shape. Read both.

## 1. Internationalization (i18n)

All user-facing strings must flow through the i18n layer. Hardcoded copy is not allowed in components, pages, or layouts.

- Translation keys live alongside the feature, not in a single global bag.
- Plural / interpolation must use the i18n library's API, not string concatenation.
- Error messages, toast text, ARIA labels, and meta tags also go through i18n.

**Exemption.** A single-locale project may opt out of the i18n layer entirely. If it does, record the decision in the project's `AGENTS.md` — an unrecorded opt-out is a violation, not a choice. Scaffolding a project without i18n is allowed; scaffolding it without that record is not.

## 2. REST Calls Use Native `fetch`

Use the platform `fetch` API. Do not introduce `axios`, `ky`, `got`, or similar HTTP clients.

```ts
// ✅ Good
const res = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const data = await res.json();
```

- Wrap repeated concerns (auth header injection, error normalization) in a thin local helper around `fetch` — not a third-party client.

## 3. Stack

- **Styling**: Tailwind CSS utility classes. Custom CSS only when Tailwind cannot express the design (e.g., complex keyframes); colocate it next to the component.
- Do not introduce competing styling systems (styled-components, Emotion, vanilla-extract) unless explicitly approved.

Framework, UI library, and rendering model are in [vue-spa/stack-standards.md](../vue-spa/stack-standards.md).

## 4. Rendering

Server-side rendering by default where the framework provides it; pure CSR is the exception that gets justified, not the default that goes unexamined.

An architecture with no server hop of its own cannot meet this as written.
[vue-spa/stack-standards.md](../vue-spa/stack-standards.md) §4 replaces it with substitute
obligations — route-level code splitting, an initial payload budget, an explicit prerendering
decision where SEO requires it. That substitution is declared there, not decided per feature.

## 5. Authentication: JWT

Use JWT for authentication and authorization.

- Store tokens in **httpOnly, Secure, SameSite=Lax (or Strict)** cookies. Do not put JWTs in `localStorage` or non-httpOnly cookies — they are reachable by XSS.
- Use short-lived access tokens with refresh rotation. Revoke on logout server-side.
- Never expose the signing secret through a bundler-public environment variable.

Where the token is verified, and what is possible with no server of our own, is in
[vue-spa/stack-standards.md](../vue-spa/stack-standards.md) §5.

## 6. Sensitive PII Is Minimized Before It Reaches the Browser

Sensitive personal data (national IDs, full SSNs, raw phone numbers, full addresses, payment details, government identifiers, precise location, health data, etc.) MUST be filtered, masked, or aggregated before any response reaches the browser.

- Send the **minimum** projection the UI actually needs. If the UI only displays the last 4 digits, only ship the last 4 digits.
- Never leak PII into client-side state, URL params, analytics events, error messages, or logs that the client can read.
- Treat search/filter inputs over PII carefully: filter server-side and return only matching minimal records.

A frontend with no server of its own cannot enforce this at all.
[vue-spa/stack-standards.md](../vue-spa/stack-standards.md) §6 names the backend as owner rather than
letting the requirement sit with nobody.

## Never Do

Each of these has a designated replacement. There is no case where the left column is the right answer.

| Never | Use instead |
|---|---|
| `console.log` / `warn` / `error` | the project logger (`lib/logger.ts`) |
| `axios`, `ky`, `got` | the fetch-based client (rule 2) |
| Raw `<button>` or a click handler on a non-interactive element | the design-system `BaseButton` |
| Conditional `:class` assembled with a template literal | `cn()` |

[vue-spa/stack-standards.md](../vue-spa/stack-standards.md) adds its own rows.

## Enforcement

- Code review must reject changes that violate any of the six rules above.
- Generated/scaffolded code (including AI-assisted output) must conform to these rules by default.
- See also: [security.md](./security.md), [patterns.md](./patterns.md), [vue-spa/stack-standards.md](../vue-spa/stack-standards.md).
