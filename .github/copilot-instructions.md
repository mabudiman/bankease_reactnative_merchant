# BankEase Merchant

See `.github/instructions/` for project context (auto-attached to every request).

For domain-specific guidance, invoke skills:

- `#unit-test` — Write unit tests
- `#feature-scaffold` — Scaffold new feature modules
- `#implementation-patterns` — Feature-specific implementation patterns
- `#project-history` — Completed features & decision evolution

### Superpowers Skills (workflow & quality)

Skills are in `.github/skills/superpowers/`. Invoke with `#superpowers/[name]`:

- `#superpowers/brainstorming` — Explore intent & requirements before building anything
- `#superpowers/writing-plans` — Write structured implementation plans from specs
- `#superpowers/executing-plans` — Execute a written plan with review checkpoints
- `#superpowers/test-driven-development` — TDD workflow before writing implementation code
- `#superpowers/systematic-debugging` — Root-cause debugging before proposing fixes
- `#superpowers/subagent-driven-development` — Execute plans using parallel subagents
- `#superpowers/dispatching-parallel-agents` — Run 2+ independent tasks in parallel
- `#superpowers/requesting-code-review` — Request a code review after implementation
- `#superpowers/receiving-code-review` — Process and evaluate code review feedback
- `#superpowers/finishing-a-development-branch` — Merge/PR/cleanup after work is done
- `#superpowers/verification-before-completion` — Verify tests pass before claiming done
- `#superpowers/using-git-worktrees` — Isolate feature work with git worktrees
- `#superpowers/writing-skills` — Create or update skill files
- `#superpowers/using-superpowers` — Meta-skill: how to find and invoke all skills

## Keeping Context Updated

After completing a feature or making significant decisions, update these files:

- `active-context.instructions.md` — current focus, status, active decisions (update most often)
- `progress.instructions.md` — completed features summary, pending items, known issues (update at milestones)
- `project-history` skill — detailed checklists & decision evolution table (append after feature completion)

When the user says **"update memory bank"**, review and update all three.
