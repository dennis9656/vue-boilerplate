> This file extends [web/coding-style.md](../web/coding-style.md) with Vue SPA specifics.
>
> ⚠️ **Not yet validated on a real project.** See [stack-standards.md](./stack-standards.md).

# Vue SPA Coding Style

## File Organization

Organize by domain, not by file type. Source root is `src/`, alias `@/*` → `./src/*` (set in both
`vite.config.ts` and `tsconfig.json` — they are separate settings and drift apart silently).

```text
src/
├── views/                        # route entry points, one per route. Layout and composition only
├── router/                       # route table, guards
├── features/{domain}/            # everything a domain owns, UI included
│   ├── api/{domain}Api.ts        # one file — there is no server/client split here
│   ├── queries/keys/             # key definitions only
│   ├── queries/composables/      # useQuery / useMutation wrappers
│   ├── composables/              # non-query domain logic
│   ├── components/               # this domain's UI
│   └── types/                    # …plus reducers, helpers, schemas, mappers
├── stores/                       # Pinia — client-only state (see patterns.md)
├── components/
│   ├── custom/                   # project wrappers over the design system
│   ├── ui/                       # design-system primitives
│   └── icons/{group}/            # grouped by where they are used
├── lib/                          # http client, logger, queryClient, i18n
├── common/                       # constants, error/, composables/, utils/, types/
├── styles/
└── main.ts

__mocks__/  __tests__/            # outside src/, at the project root
```

Where a new file goes:

| Building | Location |
|---|---|
| A route's page | `views/` |
| A domain's component | `features/{d}/components/` — including when one view uses it |
| A component used across domains | `components/custom/` |
| Backend call | `features/{d}/api/{d}Api.ts` |
| Query keys / query wrappers | `features/{d}/queries/keys/` · `queries/composables/` |
| Client-only shared state | `stores/` |
| Domain-agnostic composable or util | `common/composables/`, `common/utils/` |
| HTTP client, logger, QueryClient setup | `lib/` |

**Components live inside the domain, not under `views/`.** `views/` holds route entry points and
composes features, and that is all it holds. A view that grows domain logic has taken work that
belongs in `features/`.

Route-directory placement is the obvious alternative — several frameworks default to it — so the
reasons matter. Three of them, and the first is the one that decides it:

**A directory that mimics routing is not routing, and drifts from it.** Where the directory tree *is*
the route table, route-based placement cannot diverge from the URL: they are one fact. Here the route
table is a central config file. Put components under `views/sample/` and you are hand-maintaining a
hierarchy that looks like route structure while nothing enforces the correspondence — change the path
in `router/index.ts` and the directory keeps its old name, nothing breaks, nothing warns. From then
on the folder names lie about where things render. This is why the pattern looks safe when borrowed:
the mechanism that made it safe stayed behind.

**A component used by two routes has no home under `views/`.** You would invent `views/_shared/`,
which is a third category, and it immediately raises "shared between these two views, or global?"
Domain placement never asks: a component belongs to its domain however many views render it.

**One feature is one folder.** `rm -rf features/sample/` takes the types, the api layer, the queries,
and the UI together. Split the UI out and deleting a feature means walking two trees, which means
orphans every time.

### The screen-specific fragment

The one genuinely ambiguous case, and the answer is that **if it has no domain, it has no reason to be
a separate file**:

- Has domain meaning → `features/{d}/components/`. `SampleListToolbar` used by exactly one screen is
  still a `sample` component.
- No domain meaning → leave it in the view file. A large `<template>` with a small script is fine.
- Layout scaffolding for several screens → `components/custom/`.

Do not open an exception for "just this one view's layout". The moment both homes exist, nobody can
answer where the next file goes.

**One API file per domain.** A server/client split (`{d}Api.ts` / `{d}Api.client.ts`) exists where two
callers reach the backend by two different paths. There is one caller here.

## Single-File Components

- `<script setup lang="ts">`. The Options API is not used in new code, and `defineComponent` is not
  needed to get types.
- Order the blocks `<script setup>` → `<template>` → `<style>`. Consistency matters more than the
  order chosen, but pick this one.
- `<style scoped>` for anything Tailwind cannot express. An unscoped `<style>` in a component leaks
  into the whole app and the leak is found much later, in an unrelated screen.
- Props and emits are declared with types, not runtime shapes: `defineProps<{ … }>()` and
  `defineEmits<{ … }>()`.
- Prefer `withDefaults` over assigning defaults in the body — the default is then part of the type.

### Component size

The general criteria are in [web/coding-style.md](../web/coding-style.md); line count is not one of
them. The SFC-specific signal: **when the `<script setup>` block stops being about this component's
own rendering, extract a composable.** Fetching, timers, retry logic, and state machines are the
usual cases. A large `<template>` with a small script is generally fine and splitting it produces
components with no reason to exist.

## Naming

The shared table is in [web/coding-style.md](../web/coding-style.md). Vue-specific rows:

| Target | Rule | Example |
|---|---|---|
| Component files | PascalCase, `.vue` | `SampleCard.vue` |
| Views | PascalCase + `View` suffix | `SampleListView.vue` |
| Composables | `use` + camelCase, `.ts` | `useSampleList.ts` |
| Pinia stores | `use` + camelCase + `Store` | `useUiStore.ts` |
| Store id | camelCase, matching the file | `defineStore('ui', …)` |

**Multi-word component names**, always — `SampleCard`, never `Card`. Single-word names collide with
current and future HTML elements, and the failure is a silently wrong element rather than an error.

In templates, refer to components in PascalCase. Vue accepts kebab-case too; picking one and keeping
it means a component is greppable by a single spelling.
