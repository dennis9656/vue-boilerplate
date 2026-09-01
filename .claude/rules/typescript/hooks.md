---
paths:
  - "**/*.ts"
  - "**/*.js"
  - "**/*.vue"
---
# TypeScript/JavaScript Hooks

> This file extends [common/hooks.md](../common/hooks.md) with TypeScript/JavaScript specific content.

## PostToolUse Hooks

Configure in the project's `.claude/settings.json` when the whole team should get them, or in user
scope when it is your own preference. Concrete hook definitions are in [web/hooks.md](../web/hooks.md).

- **Prettier**: Auto-format JS/TS files after edit
- **Type check**: run `vue-tsc` after editing source. Plain `tsc` exits zero on a `.vue` file it never parsed, so it reports success on components it has never looked at
- **console.log warning**: Warn about `console.log` in edited files

## Stop Hooks

- **console.log audit**: Check all modified files for `console.log` before session ends
