> This file extends [web/testing.md](../web/testing.md) with where the mock server sits when there is
> no server hop.
>
> ⚠️ **Not yet validated on a real project.** See [stack-standards.md](./stack-standards.md).

# Vue SPA Testing Rules

## Mock Service Worker — intercepts in the browser

The browser's own request **is** the request to the backend. There is no intermediate hop, so the
browser is the only place an interceptor can sit.

```text
Browser  ──▶  [MSW intercept]  ──▶  mock response
```

- Component and integration tests run under Node with `setupServer` from `msw/node`.
- Browser-run development and E2E use `setupWorker` with the generated service worker.

> **This inverts the usual rule.** A ruleset written for an architecture with its own server hop
> forbids `setupWorker` outright — correctly, because a browser worker there would sit on the wrong
> side of the proxy and mock a request the application never makes. Here it is the only correct
> placement. Do not carry that prohibition across; the reasoning behind it does not survive the move.

The shared handler rules still hold: one file per domain under `__mocks__/handlers/`, and fixtures
that mirror the endpoint contract exactly. A handler that invents a field, a status code, or an error
envelope makes the whole integration suite lie about what the backend does.

## Component Tests

- `@vue/test-utils` with Vitest.
- Mount with the real router and a fresh Pinia (`createTestingPinia`) rather than stubbing them.
  Stubbing the router hides the navigation bugs that route guards actually produce.
- **A fresh QueryClient per test.** [patterns.md](./patterns.md) permits one client for the whole app
  at runtime because a tab is one user; a test file is not one user, and a shared cache makes tests
  order-dependent in a way that fails in CI and passes locally.
- Assert on rendered output and emitted events, not on internal refs. A test that reads component
  internals passes through a refactor that broke the screen.

## Composables

Test query composables through a mounted component or `withSetup`-style harness, not by calling them
directly — they depend on an active effect scope and on the injected query client.

**Assert that a parameter change refetches.** [patterns.md](./patterns.md) requires query composables
to accept `MaybeRefOrGetter`; taking a plain value fails silently, which means a test is the only
thing that catches it. One test per composable that changes the argument and expects a second request.

## Hydration

Not applicable — nothing is server-rendered. If prerendering is introduced for SEO (§4 of
[stack-standards.md](./stack-standards.md)), hydration mismatches become possible and this section
needs writing at that point.
