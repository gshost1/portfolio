---
title: eve-tokyo
summary: Compaction drift benchmark for Vercel's eve agent framework. It replays long coding sessions through eve's real compaction engine, compacts them repeatedly, and scores which exact file paths, errors, commands and decisions are still in context after each round.
period: October 2026
status: open source
repo: https://github.com/gshost1/eve-tokyo
order: 4
stack: ["TypeScript", "Vitest", "Python", "eve", "Vercel AI Gateway", "DigitalOcean inference"]
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

## Contributed upstream

While reading the engine I found that a tool result already capped is
capped again at every later compaction, so its real content shrinks each
round. In a 400-line grep, 60 paths were visible after the first cap, then
48, then 35. I reported it as
[vercel/eve#4769](https://github.com/vercel/eve/issues/4769), and the eve
team confirmed it and had a fix up within hours in
[vercel/eve#4771](https://github.com/vercel/eve/pull/4771), merged on
October 14. With that fix,
trimming lasts 8 to 12 rounds before a summary is needed instead of 5 to 6.

I also proposed keeping the start and the end of a capped result in
[vercel/eve#4772](https://github.com/vercel/eve/issues/4772). eve's `bash`
tool already keeps the end of output because that is where errors appear.

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

The sessions are synthetic, and errors are planted at the end of outputs
as in real test and build runs, which favours a head and tail cap by
construction. There are 3 seeds per model and summaries vary run to run,
so the tables show direction rather than precision. Results were measured
against eve 0.79.0 at commit `0fd4240`.
