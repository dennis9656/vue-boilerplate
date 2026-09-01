# Git Workflow

## Who Commits

**The agent does not run `git commit`.** When the work is done, write the commit message draft, report it, and stop — the developer commits. If the resulting changes warrant more than one commit, do not merge them into a single draft: report each commit as a git add <file, file> line paired with its own message draft, ordered so the developer can run them sequentially.

This is not about trust. A commit is where the developer draws the boundary of one reviewable change, and that boundary is often different from where the agent happened to stop working.

## Commit Message Format
```
<type>: <description>

<optional body>
```

Types: feat, fix, refactor, docs, test, chore, perf, ci

Note: whether commits carry co-author attribution is a per-user setting, not a property of this
ruleset. Follow whatever the repository has agreed; this file does not decide it.

## Pull Request Workflow

When creating PRs:
1. Analyze full commit history (not just latest commit)
2. Use `git diff [base-branch]...HEAD` to see all changes
3. Draft comprehensive PR summary
4. Include test plan with TODOs
5. Push with `-u` flag if new branch

> For the full development process (planning, TDD, code review) before git operations,
> see [development-workflow.md](./development-workflow.md).
