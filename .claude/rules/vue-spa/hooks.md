> This file extends [web/hooks.md](../web/hooks.md) with the Vue toolchain.

# Vue SPA Hooks

The hook shapes are in [web/hooks.md](../web/hooks.md). Two commands differ, and one of them fails
dangerously if taken from the shared file unchanged.

## Type Check — `vue-tsc`, not `tsc`

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "command": "pnpm vue-tsc --noEmit",
        "description": "Type-check after edits, including .vue single-file components"
      }
    ]
  }
}
```

**`tsc` does not parse `.vue` files.** It does not error on them either — it skips them and exits
zero. A project that wires up the shared `tsc` hook gets a green check on every edit while none of
its components have ever been type-checked. That is worse than having no hook, because the green
signal is trusted.

`vue-tsc` type-checks the whole project rather than one file, so it is slower than a per-file `tsc`
run. Run it on edit anyway; a type error found at the end of a session has already been built on.

## Lint — `eslint-plugin-vue` required

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "command": "pnpm eslint --fix \"$FILE_PATH\"",
        "description": "Lint edited files including SFCs"
      }
    ]
  }
}
```

The command is the same; what matters is the config. Without `eslint-plugin-vue` the `<template>`
block is not linted at all, so nothing catches an unkeyed `v-for`, a `v-if` competing with `v-for` on
one element, or a mutated prop.

Worth enabling beyond the recommended set:

- `vue/no-v-html` — makes every use an explicit, reviewable exception rather than an invisible one
  ([security.md](./security.md))
- `vue/multi-word-component-names` — [coding-style.md](./coding-style.md)
- `no-restricted-imports`, configured to keep the HTTP client out of `stores/` — this is the
  [patterns.md](./patterns.md) state-ownership rule, enforced at write time instead of at review

The last one is the only mechanical enforcement this pack has for that rule. Nothing in the build can
catch it, because there is no server module for a build to refuse. Configure it; a rule enforced only
by review is enforced only when someone is looking.

## Formatting

Prettier needs no Vue-specific plugin for SFCs. If both Prettier and ESLint format the template, pick
one — two formatters on one file produce a diff that flips back and forth between commits.
