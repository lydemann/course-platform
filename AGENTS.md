# Repository Agent Guide

These instructions apply to every coding agent working in this repository. Use the repository, its configuration, and current verification results as the source of truth.

## Repository Workflow

- This is an Nx monorepo. Prefer the existing `package.json` scripts and Nx targets over ad hoc commands.
- Keep changes scoped to the active task and preserve unrelated work in the working tree.
- Use affected lint, test, and build targets where practical, then add focused verification for the systems changed.
- Never treat an ignored, generated, cached, or local environment file as a durable repository instruction.

## Continuous AI Handoff

Codex and Claude Code share `.ai/HANDOFF.md` as the live state for the current task. The file is intentionally gitignored: it coordinates agents using the same working copy and must not be committed.

### Starting or Resuming Existing Work

Before continuing an existing task, every agent must:

1. Read and follow `AGENTS.md`.
2. Read `.ai/HANDOFF.md`. If it does not exist, create it using the standard sections described below.
3. Inspect `git status`.
4. Inspect the relevant `git diff`, including staged changes when present.
5. Verify the handoff claims against the actual repository state and available test or CI results.

If the handoff conflicts with the repository or current verification evidence, trust the repository and test results, then correct the handoff immediately.

### Continuous Update Triggers

Update `.ai/HANDOFF.md` whenever you:

- complete a meaningful implementation step;
- make an architectural or technical decision;
- discover an important constraint;
- encounter or resolve a significant error or blocker;
- run tests, lint, typecheck, build, end-to-end tests, deployment checks, or other verification that changes the known status;
- change the recommended next step; or
- are about to begin a large, risky, or multi-step change.

Update it before voluntarily stopping or handing work to another agent. Because an agent can hit a usage limit without warning, keep the snapshot current during the work rather than waiting until the end.

### Automation

Claude Code enforces part of this automatically; Codex does not, and follows the prose below.

- `.claude/hooks/check-handoff.sh` runs on Claude Code's `Stop` event and prints a reminder when `.ai/HANDOFF.md` is older than the most recently changed file in the working tree. It is advisory: it never blocks, and it can be wrong (a trivial edit still counts as a change). Registered in `.claude/settings.json`; review or disable it with `/hooks`.
- `.claude/skills/handoff/SKILL.md` writes the file in the format below. Invoke it with `/handoff`.

Neither removes the obligation. The rules here bind every agent, hook or no hook.

### Attribution and Timestamps

Every agent writing to `.ai/HANDOFF.md` must make it clear _when_ something was established and _by which agent and model_. A later reader needs this to judge how much to trust a claim: a verification run an hour ago on the current working tree carries different weight from one recorded two days and three branches ago, and knowing which model produced a decision helps calibrate how carefully to re-check it.

Rules:

- Put a `Last updated` line directly under the `# AI Handoff` heading, in the form `Last updated: YYYY-MM-DD HH:MM TZ by <agent> (<model>)` — for example `2026-08-30 13:36 CEST by Claude Code (claude-opus-5)` or `2026-08-30 09:12 CEST by Codex (gpt-5-codex)`. Use the machine's local time; get it from `date "+%Y-%m-%d %H:%M %Z"` rather than guessing.
- Prefix each entry under `Current State`, `Important Decisions`, and `Verification` with `[YYYY-MM-DD HH:MM · <agent>/<model>]`. Keep the tag short; it is metadata, not prose.
- Attribute the agent and model that actually produced the work, not the one currently editing the file. When you rewrite or correct someone else's entry, re-stamp it with your own tag and say what changed.
- Entries carried forward unchanged keep their original tag. Do not re-stamp an entry merely because you read it.
- `Known Issues`, `Working Area`, `Remaining Work`, and `Next Step` do not need per-entry tags — the `Last updated` line covers them — but timestamp any individual issue whose relevance depends on when it was observed.
- Timestamps are for handoff entries only. Do not add them to `AGENTS.md`, `CLAUDE.md`, code comments, or commit messages.

### Snapshot Rules

`.ai/HANDOFF.md` is a concise snapshot, not a chronological diary, activity log, chat transcript, or collection of past status reports. Replace or remove stale information instead of appending history. Record only facts another agent needs to continue safely and immediately.

Keep these sections:

- `Objective`
- `Current State`
- `Important Decisions`
- `Working Area`
- `Verification`
- `Known Issues`
- `Remaining Work`
- `Next Step`

The `Next Step` must name the exact best action to take next. Keep commands, paths, commit identifiers, and error text only when they materially help continuation. Never put credentials, tokens, passwords, or other secrets in the handoff.

### Separation of Responsibilities

- `AGENTS.md` contains durable instructions shared by all agents.
- `CLAUDE.md` contains Claude-specific guidance and points Claude to the shared instructions.
- `.ai/HANDOFF.md` contains only the current task state.

Do not copy large blocks between these files.
