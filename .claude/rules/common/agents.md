# Agent Orchestration

## Available Agents

Shipped with the plugin under `agents/`. This is a frontend plugin — there is no agent here for a
language it does not target.

| Agent | Purpose | When to Use |
|-------|---------|-------------|
| planner | Implementation planning | Complex features, refactoring |
| architect | System design | Architectural decisions |
| code-explorer | Trace execution paths, map layers | Understanding unfamiliar code before changing it |
| tdd-guide | Test-driven development | New features, bug fixes |
| code-reviewer | Code review | After writing code |
| typescript-reviewer | TypeScript/JavaScript review | TS/JS changes |
| security-reviewer | Security analysis | Before commits |
| silent-failure-hunter | Swallowed errors, bad fallbacks | Error handling paths |
| type-design-analyzer | Type encapsulation and invariants | Type-heavy changes |
| pr-test-analyzer | Test coverage quality | Reviewing a PR's tests |
| comment-analyzer | Comment accuracy, rot risk | Comment-heavy diffs |
| a11y-architect | WCAG 2.2 compliance | UI components, design systems |
| performance-optimizer | Bottlenecks, bundle size, render cost | Measured slowness |
| build-error-resolver | Fix build and type errors | When the build fails |
| e2e-runner | E2E testing | Critical user flows |
| refactor-cleaner | Dead code cleanup | Code maintenance |
| code-simplifier | Clarity and consistency, behavior preserved | After a feature lands |
| doc-updater | Documentation and codemaps | Updating docs |

Keep this table in step with `agents/`. An inventory that lists an agent nobody can invoke, or omits
one that exists, sends work to the wrong place — and nothing fails loudly when it does.

## Immediate Agent Usage

No user prompt needed:
1. Complex feature requests - Use **planner** agent
2. Code just written/modified - Use **code-reviewer** agent
3. Bug fix or new feature - Use **tdd-guide** agent
4. Architectural decision - Use **architect** agent

## Parallel Task Execution

ALWAYS use parallel Task execution for independent operations:

```markdown
# GOOD: Parallel execution
Launch 3 agents in parallel:
1. Agent 1: Security analysis of auth module
2. Agent 2: Performance review of cache system
3. Agent 3: Type checking of utilities

# BAD: Sequential when unnecessary
First agent 1, then agent 2, then agent 3
```

## Multi-Perspective Analysis

For complex problems, use split role sub-agents:
- Factual reviewer
- Senior engineer
- Security expert
- Consistency reviewer
- Redundancy checker
