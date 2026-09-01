> This file extends [web/patterns.md](../web/patterns.md) with Vue SPA specifics.
>
> ⚠️ **Not yet validated on a real project.** See [stack-standards.md](./stack-standards.md).

# Vue SPA Patterns

## Layer Dependency Direction — Placement

The one-way import rule is in [web/patterns.md](../web/patterns.md). Placement here is simpler than
in a router-directory framework: **every layer, components included, lives under `features/{domain}/`.**

```text
features/{domain}/
types  ←  api  ←  queries/keys  ←  queries/composables  ←  components
                                ↖  composables (actions) ↗
```

A framework that owns a route directory pulls components out of the domain, because route-local and
domain-local placement would otherwise become two parallel homes for the same file. Nothing pulls
them out here — `views/` holds route entry points and nothing else — so the domain keeps its UI.

Do not import that split. Its second reason — client/server boundaries following the route —
describes a mechanism this pack does not have.

## State Management

Three owners, and the boundaries between them are the rule:

| State | Owner | Examples |
|---|---|---|
| Came from the server | **TanStack Query** (`@tanstack/vue-query`) | lists, detail records, pagination, mutations |
| Client-only, outlives a component | **Pinia** | sidebar open, theme, multi-step form progress, selected row id |
| Belongs in the URL | **`vue-router` query** | filters, sort, page, search text |

### The rule that matters

> **A Pinia store does not hold server responses. Server entities are referenced by id.**

The grep-visible symptom is an HTTP client imported under `stores/`. The actual defect is two sources
of truth for the same data with nothing keeping them in agreement — which is precisely what the query
cache exists to prevent.

This needs stating firmly, for a reason that has nothing to do with SPAs: **Pinia is pleasant to use,
and the ecosystem's habits predate the query cache.** A `fetchArticles()` action that fills `state.articles` is the shape most Vue examples still
show. It will be written unless the rule is explicit.

Pinia is the default for client state — this pack does not treat it as an exception needing approval.
What needs approval is anything *beyond* it: a second store library, a state machine library, or a
persistence plugin (which has security consequences — see [security.md](./security.md)).

### Three boundary cases

**Authentication.** The session and the user profile are **server state**; they belong to the query
cache. Do not copy `isLoggedIn` into Pinia — you get a second answer that goes stale at the worst
moment. If §5 of [stack-standards.md](./stack-standards.md) has forced an in-memory token, it lives
in a module-scoped variable, **not** in a store: store state is visible in devtools and is what a
persistence plugin would serialize.

**URL state.** The third store people forget. Filters, sort, and pagination live in the router query
and are copied into neither Pinia nor a query key by hand — instead the query params **are part of**
the query key, so the cache and the URL cannot disagree. A filter that survives a page refresh but
not a link paste is this rule being half-applied.

**Optimistic updates** belong to the mutation, not to a store. A store that mirrors the optimistic
value has to implement rollback a second time, and the two rollbacks diverge on the first edge case.

## Data Fetching

Most of the query layer is ordinary TanStack Query practice: keys from a key factory rather than
hand-written arrays, composables that wire up `queryFn` and hold no logic, a `makeQueryClient`
factory with a deliberate `retry` policy, global error handling on the caches, and
`invalidateQueries` after mutations. Those are in [web/patterns.md](../web/patterns.md) and the
`vue-patterns` skill. What follows is where this architecture differs.

### QueryClient construction — the usual rule is inverted here

Where the frontend has a server of its own, constructing the QueryClient at module level is
forbidden: one server process handles many requests, and a shared cache leaks one user's response to
another.

**That reasoning does not hold here.** A browser tab is one user. Creating the client once at
bootstrap and installing it via `VueQueryPlugin` is correct, and the per-request construction the
other pack requires has nothing to be per-request about.

**The risk moves rather than disappearing:**

> **Clear the query cache on logout and on account switch.** In a per-request architecture, isolation
> was a side effect of the request boundary. Here one client instance outlives the session, so the
> previous user's data stays cached until something removes it.

This is the clearest example of a rule that must be re-derived rather than copied. A rule carried
across without its reasoning is wrong in a way that looks right, and nobody re-examines it because
nobody remembers why it was there.

### Why query keys live apart from composables

The reason usually given is that server-rendered code needs the key while the hook file is
client-only. **That reason does not exist here.** The separation is still right, for different reasons: mutations
invalidate by key without importing the composable, route guards can prefetch, and tests can address
the cache directly.

Stated because a rule whose reason has quietly evaporated gets deleted by the first person who asks
why it exists — and they are not wrong to ask.

### Reactive arguments

Vue Query tracks dependencies through reactivity, not through re-invocation. **A composable that takes
a plain value will never refetch when that value changes** — the most common Vue Query mistake, and it
fails silently.

```ts
// ✗ refetch never fires when sampleId changes
export function useSampleDetail(sampleId: number)

// ✓
export function useSampleDetail(sampleId: MaybeRefOrGetter<number>)
```

Query composables accept `MaybeRefOrGetter` for every argument that participates in the key. Returned
`data` is a ref; unwrap it in templates, not by destructuring in script.

## Route Guards

- A guard is navigation control, **not authorization**. The backend authorizes ([security.md](./security.md)).
- Guards do not fetch. A guard that awaits a request blocks navigation on the network and produces a
  frozen UI with no feedback; prefetch into the query cache instead and let the view render its own
  pending state.
- Keep the post-login return path on an allowlist. An open redirect is as available here as anywhere.
