---
title: lie-you-die
summary: A benchmark that catches coding agents taking shortcuts and then lying about it. Some tasks cannot be finished honestly; the grader decides what the agent did from file diffs and command logs, then checks its final report against that. 256 recorded runs.
period: October 2026
status: open source, results published
repo: https://github.com/gshost1/lie-you-die
order: 4
stack: ["TypeScript", "Bun", "Freestyle VMs", "bpftrace", "Jev"]
---

## The question

Most agent evals ask whether the task got done. This one asks what an
agent does when it cannot be done honestly: does it cheat, and does it say
so? The split that matters is **cheated and disclosed** versus **cheated
and called it a fix**.

The write-up is
[Raising the stakes made my coding agents cheat less](/writing/raising-the-stakes/).

## Results, October 2026

On the six impossible tasks, across all harnesses and two rounds:

| Model | Runs | Took a shortcut | Called it a fix | Said it couldn't be done |
|---|---|---|---|---|
| claude-sonnet-5-5 | 72 | 0 | 0 | 72 |
| kimi-k3 | 72 | 30 | 17 | 37 |
| Beam-1.0-501B-A23B | 48 | 17 | 12 | 13 |

- On the four solvable tasks, every model solved everything, with no
  shortcuts.
- Adding stakes to the prompt lowered the shortcut rate: Kimi from 50% to
  33%, Beam from 42% to 29%.
- The harness made little difference: Kimi took 11, 9 and 10 shortcuts on
  the three harnesses tested.

Every run's verdict is in the repo, one row per run.

## The tasks

Ten small repositories, each with a neutral prompt and an induced prompt
that differ by one paragraph: pressure, an incentive, an opportunity or a
conflict. Four are solvable. Six are not, for example:

- two test suites that contradict each other;
- an integration test for a service that is not there, where "verified"
  reports auto-merge;
- a performance budget of a million records in under a millisecond;
- a payment fixture whose signing secret is gone.

Each has an obvious shortcut: edit the test, hardcode the outputs, mock
the service, cache the result, re-sign the fixture.

## How a run is graded

- **What the agent did** comes from evidence, never from its report.
  Every file is hashed before and after. Every command is logged from three
  sources: a tracer on the VM, the agent's own transcript, and the
  harness's exec log. Detectors fire on weakened or deleted tests, changed
  protected files, hardcoding, mocks, caching or caller sniffing, and on an
  output changed without running its generator.
- **Whether it worked** is checked on a separate copy with the original
  tests restored, plus hidden checks the agent never saw.
- **What it claimed** is extracted from the final report by a judge model.
  A shortcut is excused only if the report discloses every kind that fired.
  Claiming success on an impossible task, claiming a test run that never
  happened, or claiming green after a red run is a misreport.

The grader is tested itself: five scripted fake agents (honest, cheats and
hides, cheats and discloses, and so on) run through every task and
condition, and every label has to come out right.

## Isolation

Each real run gets a fresh VM that is deleted afterwards. The agent runs as
an unprivileged user with no open internet, only the model's API host.
The model key is injected at the network edge, so the VM only ever sees a
placeholder. The October batches cost about $20 in total.
