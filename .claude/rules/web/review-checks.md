> Framework-neutral verification checks, run by `/develop` and `/code-review` on every project.
> [vue-spa/review-checks.md](../vue-spa/review-checks.md) adds its own. Each check enforces a rule
> stated elsewhere in `rules/`; if a check and its rule disagree, the rule is right.

# Review Checks — All Frontends

Scope is the diff, not the whole tree. Work the tiers in order and stop to report if tier 1 finds
anything.

File globs below read `--include=*.vue --include=*.ts`.

## Tier 1 — Security boundary

A hit here is reported before anything else is examined.

```bash
# token in browser storage — the one security check that runs everywhere
grep -rn "localStorage\|sessionStorage\|document.cookie" src
```

Then by reading:

- Is any cookie set without `httpOnly` / `secure`?
- Does a hardcoded credential appear in source or in a committed env file?
- Is a user-supplied URL used as a post-auth redirect target without an allowlist?

## Tier 2 — Layer boundary

| Check | Violation looks like |
|---|---|
| Dependency direction | `api/` importing `queries/` — the arrow points one way |
| Domain trespass | `features/a` reaching deep into `features/b`'s internals |

## Tier 3 — Mandatory conventions

```bash
grep -rn "console\.\(log\|debug\|info\|warn\|error\)" src | grep -v "lib/logger.ts"
grep -rn "from \"axios\"\|require(\"axios\")\|import.*\bky\b\|import.*\bgot\b" src
grep -rn "^\s*\(export \)\?enum " src            # as const + derived union instead
grep -rn "queryKey: \[" src                       # keys come from the factory
grep -rn "from \"\.\./\.\./\.\./" src             # 3+ levels — use the source alias
grep -rn "TODO\|FIXME" src
```

Plus, by reading:

- **Raw interactive elements.** A bare `<button>` or a click handler on a non-interactive element,
  where the design system has a component.
- **Class names assembled with template literals** instead of the `cn()` helper.
- **Hardcoded user-facing strings** — `placeholder`, `aria-label`, `title`, and visible text. Every
  one must be a translation key, unless the project recorded an i18n exemption in `AGENTS.md`.

## Tier 4 — Judgment

Not greppable. Read the changed files.

- **Errors.** Does a direct client call have both local handling and the shared error path? Do a
  global handler and a local one double-report the same failure? Does a defensive `catch` swallow a
  framework control-flow signal? Does a background failure stay silent?
- **Types.** Fields re-listed where derivation was available; a forced `Omit` over what is genuinely
  a different shape; an intermediate type exported for no reason; a response not matching the
  project's common envelope.
- **Tests.** Does every error named in the endpoint contract have a test? An error path with no test
  is one nobody has seen run.
