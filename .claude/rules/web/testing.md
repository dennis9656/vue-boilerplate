> This file extends [common/testing.md](../common/testing.md) with web-specific testing content.
> Where the mock server intercepts is in [vue-spa/testing.md](../vue-spa/testing.md).

# Web Testing Rules

## Test Boundaries

| Boundary | Tooling | Scope |
|---|---|---|
| Unit | Vitest | Pure functions, `common/utils/`, composables |
| Integration | Vitest + Testing Library + MSW | Page level. The happy path **and every error** named in the endpoint contract |
| E2E | Playwright | Core journeys per capability only — not a second integration suite |

"Every error in the contract" is literal. An error response that the design says exists but that no test exercises is an error path nobody has ever seen run.

## Mock Service Worker

- All handlers for a domain live in one file, under the project-root `__mocks__/handlers/` directory.
- Handler fixtures are the endpoint contract's FE-side copy. They do not invent fields, status codes, or error envelopes — a handler that drifts from the contract makes the whole integration suite lie.

**Install MSW on the hop that actually reaches the backend** — the frontend's own server where one
exists, and the browser where none does. Installing it on the wrong hop mocks a request nobody makes.
There is no server of ours here, so it is the browser: see
[vue-spa/testing.md](../vue-spa/testing.md).

## Priority Order

### 1. Visual Regression

- Screenshot the project's breakpoints, as recorded in `AGENTS.md` (`breakpoints: [320, 768, 1024, 1440]` is a common set — the design system decides, not this file)
- Test hero sections, scrollytelling sections, and meaningful states
- Use Playwright screenshots for visual-heavy work
- If both themes exist, test both

### 2. Accessibility

- Run automated accessibility checks
- Test keyboard navigation
- Verify reduced-motion behavior
- Verify color contrast

### 3. Performance

- Run Lighthouse or equivalent against meaningful pages
- Keep CWV targets from [performance.md](performance.md)

### 4. Cross-Browser

- Minimum: Chrome, Firefox, Safari
- Test scrolling, motion, and fallback behavior

### 5. Responsive

- Test every recorded breakpoint plus the widths on either side of each — a layout breaks at the boundary, not in the middle of a range
- Verify no overflow
- Verify touch interactions

## E2E Shape

```ts
import { test, expect } from '@playwright/test';

test('landing hero loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
});
```

- Avoid flaky timeout-based assertions
- Prefer deterministic waits

## Unit Tests

- Test utilities, data transforms, and composables
- For highly visual components, visual regression often carries more signal than brittle markup assertions
- Visual regression supplements coverage targets; it does not replace them
