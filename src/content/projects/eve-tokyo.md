---
title: eve-tokyo
summary: Benchmarks and long-run tests for Vercel's eve agent framework, built on eve's own code. Found that compaction made summaries call failing builds passing in 40% of checkpoints, and reported six eve bugs; the eve team has fixed three so far.
period: October 2026 to now
status: open source
repo: https://github.com/gshost1/eve-tokyo
order: 2
stack: ["TypeScript", "Vitest", "Python", "eve", "Vercel AI Gateway", "DigitalOcean inference", "Docker"]
---

## Why it exists

eve's compaction first trims old tool output without calling a model, and
only writes a summary when trimming is not enough. Long agent runs still
compact many times, and each summary updates the last one. I wanted to know
what survives that loop: which exact details are still in context after the
first, second and fifth compaction, alongside context reduction, cost and
latency.

Measuring compaction drift is not a new idea, and the README credits the
work it builds on. What I could not find was numbers for eve, or recall
scored across repeated summary-of-a-summary cycles per detail type.

## How it works

A pinned eve checkout gets the bench copied in, and each strategy is a small
patch applied to a sibling copy of eve's real `engine.ts` and `prompt.ts`.
Everything else is eve's own code. Synthetic sessions, generated from a
fixed seed, plant uniquely identifiable paths, errors, commands and
decisions at the start, middle or end of tool results shaped like eve's own
tools. After each round the bench checks for each detail by exact substring
match over the kept context.

The summary path was run with six summarizers: three through the Vercel AI
Gateway and three open-weight models through DigitalOcean inference.

## The main result

Every build and test run in these sessions failed, and the failure was
always at the end of the output. When compaction kept only the start of a
trimmed result (eve's default, with or without the #4771 fix below),
summaries described a failing build or test as passing in 72 of 180
checkpoints across the six models. When it kept the start and the end, none
did. Per model, out of 15 checkpoints each:

| Summarizer | eve default | #4771 fix | head + tail |
|---|---|---|---|
| anthropic/claude-haiku-5.5 | 3 | 4 | 0 |
| openai/gpt-6-luna-fast | 1 | 1 | 0 |
| google/gemini-3.8-flash | 0 | 1 | 0 |
| deepseek-v4.1-flash | 15 | 13 | 0 |
| qwen3.8-max | 10 | 11 | 0 |
| kimi-k2.6 | 8 | 5 | 0 |

The frontier models mostly hedged when the end was missing; the open-weight
models filled the gap with "passed". Summaries also kept meaning better
than exact strings: after one summary about 5% of exact error strings
remained, after five about 1%, on every model tested.

## After the fix

The eve team merged fixes for both compaction reports on October 15 (below).
I reran the benchmark on October 25 against eve as shipped at `a3654ef`,
with the same sessions, seeds and scorer and no patches. Checkpoints that
called a failing build or test passing went from 29 of 75 on the five
summarizers rerun to **0 of 75**. Exact retention now tracks the head and
tail run, and sessions go 10 to 15 cap rounds before their first summary
instead of 6 to 7, because a capped result no longer shrinks again at every
compaction: fewer paid summaries for the same work. Kimi was not rerun, to
keep the cost down.

## Long-run sessions

The second half of the repo drives real multi-hour eve sessions on coding
tasks: changes to real repositories and a command-line tool built from
scratch over 48 features in three stages. Each new message adds a rule, so
the rules from the first message survive only through compaction. A driver
starts a headless `eve dev`, sends continue prompts until the agent reports
done or a turn, budget or time limit is hit, then asks recall questions and
runs the task's checks in a sandbox container. Every model call, context
dump, tool call and hook event is logged.

Two of the bug reports below, #5350 and #5936, came out of these runs.

## Reported upstream

Six issues on [vercel/eve](https://github.com/vercel/eve), each with a
minimal reproduction. The fixes were written and merged by the eve team.

- **Re-capping.** A tool result already capped was capped again at every
  later compaction, so it shrank each round: in a 400-line grep, 60 paths
  visible after the first cap, then 48, then 35.
  [#4769](https://github.com/vercel/eve/issues/4769), reported October 14,
  fixed within hours in [#4771](https://github.com/vercel/eve/pull/4771).
  Repro: [eve-recap-repro](https://github.com/gshost1/eve-recap-repro).
- **Head only.** Compaction kept only the start of a large tool result,
  dropping test failures, errors and the exit code. eve's `bash` tool
  already keeps the end of output for that reason.
  [#4772](https://github.com/vercel/eve/issues/4772), fixed in
  [#4773](https://github.com/vercel/eve/pull/4773), both merged October 15.
- **A 429 ended the session.** When the compaction call inside a turn hit
  a provider 429, the whole session ended instead of that turn.
  [#5350](https://github.com/vercel/eve/issues/5350), fixed in
  [#5355](https://github.com/vercel/eve/pull/5355) on October 27; the eve
  0.84.1 release notes credit the report and reproduction. Repro:
  [eve-turnstep-escape-repro](https://github.com/gshost1/eve-turnstep-escape-repro).
- **A late question after cancel.** Cancelling or clearing while a turn
  is dispatching `ask_question` leaves a stale question open, and the next
  message fails the session.
  [#5752](https://github.com/vercel/eve/issues/5752), with a fix in review
  in [#5754](https://github.com/vercel/eve/pull/5754).
- **Frozen after a crash.** A step interrupted by a crash stays frozen for
  about 14 minutes after a restart, because recovery never matches the dead
  owner's lease. [#5386](https://github.com/vercel/eve/issues/5386), open.
  Repro: [eve-resume-freeze-repro](https://github.com/gshost1/eve-resume-freeze-repro).
- **Checkpoints that lose rules.** In a long coding task, summary
  checkpoints became deltas pointing at earlier checkpoints that had
  already been discarded, and user rules disappeared or were rewritten.
  [#5936](https://github.com/vercel/eve/issues/5936), reported November 4,
  open.

## The companion repro

[eve-recap-repro](https://github.com/gshost1/eve-recap-repro) is the
minimal reproduction for #4769. It is a fresh `npx eve@0.79.0 init`
project that runs fully offline: a mock model calls a tool returning 400
grep lines that end in a `FAIL` line, then pads each later turn with 40,000
characters so every turn compacts again. Over six turns the output shows
the result capped once at turn 4 and then re-capped, with annotations and
backslashes piling up while the kept paths drop from 60 to 35 and the
`FAIL` line is gone.

## Caveats

The benchmark sessions are synthetic, and errors are planted at the end of
outputs as in real test and build runs, which favours a head and tail cap
by construction. There are 3 seeds per model and summaries vary run to
run, so the tables show direction rather than precision. The main result
was measured against eve 0.79.0 at commit `0fd4240`, the rerun at
`a3654ef`.
