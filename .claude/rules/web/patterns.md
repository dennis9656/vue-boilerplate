> This file extends [common/patterns.md](../common/patterns.md) with web-specific patterns.
> Placement and tooling are in [vue-spa/patterns.md](../vue-spa/patterns.md).

# Web Patterns

## Layer Dependency Direction

Imports flow one way only:

```text
types  ←  api  ←  queries/keys  ←  queries/composables  ←  components
                                ↖  composables (actions) ↗
```

- `types/` may be referenced from any layer — it has no direction constraint.
- Reverse imports are a violation: `api/` must not know that `queries/` exists.
- Cross-domain imports are allowed, but a cycle between two domains means the shared piece belongs in `common/`.

Where each layer physically sits is in [vue-spa/patterns.md](../vue-spa/patterns.md).

## Component Composition

### Compound Components

Use compound components when related UI shares state and interaction semantics — a `Tabs` that owns
the active tab while `Tabs.List`, `Tabs.Trigger`, and `Tabs.Content` read it, rather than every piece
taking the same three props.

- Parent owns state
- Children read it through the framework's injection mechanism rather than through props
- Prefer this over prop drilling for complex widgets

### Render Props / Slots

- Use the framework's content-projection mechanism when behavior is shared but markup must vary
- Keep keyboard handling, ARIA, and focus logic in the headless layer

### Container / Presentational Split

- Container components own data loading and side effects
- Presentational components receive props and render UI
- Presentational components should stay pure

## State Management

Server state, client state, URL state, and form state are four different concerns and are kept
apart. Which library owns each is in [vue-spa/patterns.md](../vue-spa/patterns.md).

- Do not duplicate server state into client stores
- Derive values instead of storing redundant computed state
- **Never hand-write a `queryKey: [...]` array.** Keys come from the key factory in `features/{domain}/queries/keys/` — a hand-written key that disagrees with the prefetched one silently refetches everything the server already fetched.

## URL As State

Persist shareable state in the URL:
- filters
- sort order
- pagination
- active tab
- search query

## Data Fetching

### Stale-While-Revalidate

- Return cached data immediately
- Revalidate in the background
- Prefer existing libraries instead of rolling this by hand

### Optimistic Updates

- Snapshot current state
- Apply optimistic update
- Roll back on failure
- Emit visible error feedback when rolling back

### Parallel Loading

- Fetch independent data in parallel
- Avoid parent-child request waterfalls
- Prefetch likely next routes or states when justified
