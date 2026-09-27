---
title: vercel-compaction
summary: Claude Code plugin that replaces the compaction summary with pruning. An evaluation model scores every old tool call through the Vercel AI Gateway, stale ones are dropped, and everything kept stays verbatim.
period: September 2026
status: in use, open source
repo: https://github.com/gshost1/vercel-compaction
order: 6
stack: ["TypeScript", "Claude Code plugin", "Vercel AI Gateway", "function hooks"]
---

## Why it exists

When a long agent session fills its context, the usual fix is to ask a model
to summarize the old turns. A summary is lossy in exactly the wrong places: a
file path, an exact error, a constraint or a command can vanish even though it
matters an hour later.

This plugin never rewrites anything. It only deletes tool calls and tool
results that an evaluation model judges no longer needed. User and assistant
text stays verbatim and in order.

## How it works

Every tool call is paired with its result. The first message and the newest
few are pinned. For every other call the judge gets two yes/no questions:
should the call stay, and should its result stay verbatim. The judge is Jev,
an evaluation model that answers typed questions with calibrated
probabilities and is priced per input token with no output cost, so scoring a
whole session is cheap.

The conversation sent for scoring is fitted into a token ceiling in stages,
each applied only if the one before was not enough. Questions are split into
as many concurrent requests as needed and the answers merged. Per call, the
outcome is keep both, keep the call and truncate the result to a short head,
or remove both. No result is ever left without its call.

## Failing safe

A failed request, a malformed or incomplete answer, a missing key, or a
history that cannot be fitted all throw, and the plugin falls back to Claude
Code's built-in summary. If pruning would free less than a quarter of the
context it also falls back. A failure never costs the session.

## What leaves the machine

Prompts, assistant text and tool inputs go to the gateway at each compaction.
Tool results do not; each is replaced by a one-line size note. The README
says this before the install steps finish, and recommends project scope, so
it is never switched on for a repo whose contents may not leave the machine.

The raw gateway key does not have to live in Claude Code either. A launcher
asks [Keysrs](/projects/keysreallysafe/) for a short-lived grant and
hands the session a token and a loopback URL. When the token expires,
compaction quietly falls back to the summary.

## Credit

Adapted from [fast-jev-compaction](https://github.com/tamaratran/fast-jev-compaction)
(MIT), which does the same pruning against TypeSafe's own API. This project
changes the transport to the Vercel AI Gateway: one key, no proxy process, no
SDK dependency. It is also usable as a library.
