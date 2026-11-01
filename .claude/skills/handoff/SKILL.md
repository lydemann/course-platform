---
name: handoff
description: Update .ai/HANDOFF.md in the format AGENTS.md requires, with timestamps and agent/model attribution. Use when finishing a work session, handing off to another agent, or after the Stop hook warns the handoff is stale.
---

# Update the AI handoff

`.ai/HANDOFF.md` is the live task state shared between Claude Code and Codex. It is gitignored on purpose: it coordinates agents working the same checkout and must never be committed.

## Steps

1. **Read the rules.** `AGENTS.md` → "Continuous AI Handoff" is authoritative, in particular the "Attribution and Timestamps" and "Snapshot Rules" subsections. If this skill and `AGENTS.md` ever disagree, `AGENTS.md` wins.

2. **Get the real time.** Run `date "+%Y-%m-%d %H:%M %Z"`. Never guess or reuse a timestamp from earlier in the session.

3. **Identify yourself.** You need agent and model for the attribution tags — e.g. `Claude Code (claude-opus-5)`. Use the model actually running, not a remembered default.

4. **Reconcile against reality before writing.** The repository outranks the existing handoff text. Check:
   - `git status --porcelain -uall` — note that an unscoped `git status` can under-report new directories when `core.untrackedCache` is stale.
   - `git branch --show-current` and `git log --oneline -3` — the branch may have moved since the handoff was last written.
   - The relevant diff, and the current verification results.

   Correct anything the repository contradicts. Do not carry forward a claim you did not re-check when the evidence for it has changed.

5. **Write the snapshot.** Keep the sections `AGENTS.md` lists. It is a snapshot, not a diary: replace stale entries rather than appending. Specifically:
   - `Last updated: <timestamp> by <agent> (<model>)` immediately under the `# AI Handoff` heading.
   - `[<timestamp> · <agent>/<model>]` prefixes on `Current State`, `Important Decisions`, and `Verification` entries.
   - Entries you did not change keep their original tag. Re-stamp only what you rewrote, and say what changed.
   - Be specific in `Verification` about what was and was not tested — an untested layer recorded as verified is worse than no entry.
   - `Next Step` names the single best next action, concretely.

6. **Never put secrets in it** — no keys, tokens, or passwords, even ones already exposed elsewhere.

## Checks worth making

- Does `Next Step` name one concrete action, or does it hedge?
- Does `Verification` distinguish what was proven from what was assumed?
- Would someone resuming cold know which branch to be on and what is uncommitted?
- Is anything in `Known Issues` actually fixed now?
