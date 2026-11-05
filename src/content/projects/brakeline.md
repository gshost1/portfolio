---
title: brakeline
summary: A seatbelt for unattended coding agents. One Rust binary in the agent's hook pipeline that stops loops and runaway spend, refuses catastrophic commands, and snapshots work before destructive ones, in about 6 ms per tool call. Claude Code and Factory Droid.
period: October 2026 to now
status: open source, MIT
repo: https://github.com/gshost1/brakeline
order: 5
stack: ["Rust", "Claude Code hooks", "Factory Droid hooks", "git internals"]
---

## Why it exists

An agent left alone fails in a few predictable ways. It retries the same
failing command for hours, it spends a week of quota redoing finished work,
or it runs one shell command that wipes out uncommitted work. Built-in undo
does not help with the last one: Claude Code's checkpoints do not track
files changed by `rm`, `mv` or other shell commands.

Existing tools each cover one slice. brakeline puts four protections in
one binary with no runtime dependencies, fast enough to run on every call.

## What it does

1. **Stops loops.** The same call repeated with no file changes in
   between, or the same command failing again and again, is refused with an
   explanation the agent can act on: "read the error, change something, or
   ask the user". Three refusals in a row stop the run, and a stopped
   session stays stopped until I look.
2. **Enforces budgets.** Per-session caps on estimated spend, output
   tokens, tool calls and active time, with a warning at 80% and a hard
   stop at 100%. On Droid a whole mission, with its workers, validators and
   subagents, counts as one budget, so it cannot spread past a cap one
   worker at a time.
3. **Refuses catastrophic commands.** `rm -rf ~`, `rm -rf $UNSET_VAR/`,
   `find / -delete`, `dd` onto a disk, `mkfs`, force pushes, and my own
   patterns.
4. **Snapshots before destructive commands.** Before `rm`, `mv`, an
   overwrite, `git reset --hard`, `git clean`, `sed -i` and similar, it
   saves tracked and untracked files as a git object, without touching the
   index, branches or stash. `brakeline restore <id>` brings them back.

## Design choices

- **A cloned repo can only tighten limits.** A repository may ship its own
  config, but it can lower budgets and add blocked patterns, never raise a
  budget or turn a protection off. A cloned repo is untrusted input.
- **Fail open, except for the worst.** If brakeline's own state is broken
  it allows the call with a notice, but still refuses catastrophic
  commands.
- **Two parsers, the stricter wins.** Each command is judged by both the
  old and the new shell parser, after a pass that closed bypasses neither
  had caught.

## Tested against real agents

Tested live with Droid: a force push was refused, a retry loop was refused
after three failures and then stopped, and `git reset --hard && git clean
-fd` was snapshotted and fully restored.

## What it is not

A guard rail, not a sandbox. It parses the command shapes agents actually
emit, including quoting, pipes, `sudo`, `xargs`, `bash -c` and `eval`, but
a deliberately obfuscated command can get past it. Spend is an estimate
from list prices, and snapshots cover only git repositories and skip
ignored files.
