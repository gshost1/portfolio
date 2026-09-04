---
title: Agent harness
summary: The multi-agent coding and operations setup one person uses to work like a small team, and the guardrails that came from breaking it.
period: "2026"
status: in use
order: 4
stack: ["Claude Code", "Hermes", "Telegram", "launchd", "Pi"]
---

## The setup

Claude Code as the main session, a cheaper model for tightly specified code
changes, a Telegram relay so I can drive sessions from a phone, cron-scheduled
agents for research and briefings, and a backup tool that keeps the config
whitelist in git and the secrets out of it.

Most of the product work on this site was typed by agents. My job moved to
writing specs tight enough to leave nothing to place, reviewing diffs, and
keeping the record.

## Rules that came from failures

- **A prompt rule is not a guardrail.** Anything that must not happen gets a
  hook or a permission, not a sentence in a system prompt.
- **Specs leave nothing to place.** Smaller models die deliberating over where
  a try/finally goes. Give literal code and insertion points, or write it by
  hand.
- **Fix the program, not the instance.** When a review finding traces to a
  template gap, fix the template, then reapply.
- **Verify concurrently, not sequentially.** A critique of a finished draft
  cannot catch what was never written down. Run an independent read of the
  same sources in parallel.
- **Headless runs stall on consent dialogs.** A scheduled process that touches
  a protected folder waits forever for a click nobody will make.
- **"Finished" is not "accepted".** A build system says done; the app store
  rejects it an hour later. Confirm at the destination.
- **Parallel browser automation gets accounts flagged.** One session at a
  time.

## Why it is on a portfolio

Because it is the thing I actually know how to do that most people do not
yet: run a real product, alone, through agents, and know where they lie.
