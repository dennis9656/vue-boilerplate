# vue-boilerplate

Vue 3 + Vite SPA boilerplate implementing `.claude/rules/vue-spa/` as written —
no server of its own, the browser calls the backend directly.

```bash
npm install
npm run msw:init    # once — generates public/mockServiceWorker.js
npm run dev         # MSW serves the sample API, no backend needed
```

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server with the MSW browser worker on |
| `npm run build` | `vue-tsc --noEmit` then a production build |
| `npm run typecheck` | `vue-tsc` — **not** `tsc`, which skips `.vue` files and still exits zero |
| `npm run lint` | ESLint with `eslint-plugin-vue` |
| `npm test` | Vitest + `@vue/test-utils` + MSW (`msw/node`) |

Set `VITE_ENABLE_MSW=0` in `.env.development` to talk to a real backend.

## Stack

Vue 3 `<script setup>` · Vite · TypeScript strict · vue-router 4 · Pinia ·
TanStack Query (`@tanstack/vue-query`) · Tailwind CSS v4 · vue-i18n · Vitest · MSW.

Native `fetch` only — no axios, ky, or got.

## Layout

```text
src/
├── views/                     route entry points — layout and composition only
├── router/                    route table, guards (every route a dynamic import)
├── features/sample/           the reference domain, UI included
│   ├── api/sampleApi.ts       one API file per domain
│   ├── queries/keys/          key factory — never a hand-written queryKey array
│   ├── queries/composables/   useQuery / useMutation wrappers
│   ├── composables/           non-query domain logic (URL filter state)
│   ├── components/            this domain's UI
│   ├── locales/               translation keys, next to the feature
│   └── types/
├── stores/                    Pinia — client-only state, no server entities
├── components/{ui,custom,icons/shell}/
├── lib/                       http, logger, queryClient, i18n, session
├── common/                    constants, error, types, utils
└── styles/main.css            design tokens (Tailwind v4 has no config file)

__mocks__/  __tests__/         outside src/, at the project root
```

## The rules this exists to demonstrate

Each is one file away, with the reasoning in a comment at the point of use:

- **Server state never lives in Pinia** — `src/stores/useUiStore.ts` holds a
  `selectedSampleId`, not a sample. An HTTP client imported under `stores/` is a
  lint error, not a review note.
- **Query composables take `MaybeRefOrGetter`** — a plain value never refetches,
  and fails silently. `__tests__/features/sample/useSampleDetail.spec.ts` is the
  only thing that catches it.
- **Filters live in the URL and *are* part of the query key** —
  `src/features/sample/composables/useSampleFilters.ts`.
- **One QueryClient outlives the session** — so `src/lib/session.ts` clears it on
  logout and account switch. A per-request server boundary would have given that
  for free.
- **MSW intercepts in the browser** — there is no server hop, so it is the only
  correct placement. `__mocks__/browser.ts`.
- **Components live in the domain, not under `views/`** — `views/` composes.

Project decisions (bundle budget, breakpoints, SEO, what the backend owns) are in
[AGENTS.md](./AGENTS.md).
