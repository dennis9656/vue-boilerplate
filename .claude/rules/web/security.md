> This file extends [common/security.md](../common/security.md) with web-specific security content.
> What this architecture leaves open is in [vue-spa/security.md](../vue-spa/security.md).

# Web Security Rules

## Review Surface

**Check on every feature:**

| Surface | What to look for |
|---|---|
| New input surfaces | An externally supplied URL placed straight into `href` / `src`; raw HTML injection |
| Authorization | Client-side gating is not a control. Every hidden action needs a server-side equivalent check |
| PII in logs | The logger also runs in the browser. Audit what is passed to it |
| Open redirect | If a post-auth return URL arrives as a parameter, it needs an allowlist |

Some classes of risk are closed by the architecture and some are left open. Re-reviewing a
structurally closed risk every feature wastes attention the open ones need; assuming a risk is closed
when the architecture does not close it is worse. [vue-spa/security.md](../vue-spa/security.md)
states which is which here — read it before deciding what to skip.

Classify every finding as `must-fix-before-dev`, `tracked-mitigation`, or `accepted-risk`. Implementation does not start while a `must-fix-before-dev` is open.

## Content Security Policy

> **Ownership**: the hosting or proxy layer. Feature design does not re-decide these values — it verifies they exist.

Always configure a production CSP.

### Nonce-Based CSP

Use a per-request nonce for scripts instead of `'unsafe-inline'`.

```text
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-{RANDOM}' https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://*.example.com;
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
```

Adjust origins to the project. Do not cargo-cult this block unchanged.

## XSS Prevention

- Never inject unsanitized HTML
- Avoid the raw-HTML escape hatch (`v-html`) unless the input is sanitized first
- Escape dynamic template values
- Sanitize user HTML with a vetted local sanitizer when absolutely necessary

## Third-Party Scripts

- Load asynchronously
- Use SRI when serving from a CDN
- Audit quarterly
- Prefer self-hosting for critical dependencies when practical

## HTTPS and Headers

> **Ownership**: the hosting or proxy layer, same as CSP above.

```text
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## Forms

- CSRF protection on state-changing forms
- Rate limiting on submission endpoints
- Validate client and server side
- Prefer honeypots or light anti-abuse controls over heavy-handed CAPTCHA defaults
