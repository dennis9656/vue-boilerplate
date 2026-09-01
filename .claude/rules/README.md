# Rules

This project is a **Vue 3 + Vite SPA with no server of its own** — the browser calls the backend
directly. Every rule here is written against that architecture, and several of them are only correct
because of it.

```text
common/       language- and stack-agnostic engineering rules
typescript/   TypeScript and JavaScript specifics (path-scoped via frontmatter)
web/          true of any frontend project — the requirement
vue-spa/      how this stack meets it — the implementation
```

## Rule priority

```text
common/  →  typescript/  →  web/  →  vue-spa/
```

Each layer overrides the one before it. `vue-spa/` wins over `web/` on conflict, for the same reason
domain rules win over common ones: the more specific statement is the one that knows the context.

When a `web/` rule states a requirement and `vue-spa/` states how it is met, **both apply** — that is
the normal case, not a conflict. A genuine conflict means one of the two is wrong and should be
fixed, not resolved by precedence.

## Reading the comparisons

Several `vue-spa/` rules explain themselves by contrast with an architecture that has its own server
tier — "this inverts the usual rule", "that reasoning does not hold here". Those passages are load
bearing, not history. A rule carried across architectures without its reasoning is wrong in a way
that looks right, and nobody re-examines it because nobody remembers why it was there.

The clearest example: constructing the QueryClient at module level is forbidden where one server
process serves many users, and correct here, where a browser tab is one user. Copy the rule without
the reason and you get the wrong answer with full confidence.

## Where project decisions live

Not here. The bundle budget, breakpoints, icon ratio, SEO decision, i18n exemption status, and the
list of obligations the backend owns are recorded in [`AGENTS.md`](../../AGENTS.md) at the project
root. Rules state what must hold; `AGENTS.md` records what this project decided.
