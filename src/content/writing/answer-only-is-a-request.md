---
title: "'Answer only' is a request, not a switch"
date: 2026-10-15
summary: I told five models to skip their reasoning and just answer. One actually stopped. The rest kept thinking, in a separate channel, in the answer, or in tokens I paid for and never saw.
---

I started this because I'd watched labs pull back on how much model reasoning
they show. I left Anthropic's models out of this experiment entirely: prompting
a model to expose or suppress its reasoning comes close to distillation
territory, and I didn't want to go near that. But it left a question I couldn't
let go of. If you tell a model plainly not to think, does it actually stop?

A recent paper, [Thinking Inertia](https://arxiv.org/abs/2610.11765), said
mostly no. I wanted to see it for myself.

## What I ran

Five models: Gemini-4-Argon, GPT-6-Astra, Kimi-K3, DeepSeek-V4-Flash and
Muse-Wonder-1.0. Each got the same 210 questions, 35 from each of six
benchmarks: yes/no (BoolQ, StrategyQA), multiple choice (MMLU, MMLU-Pro) and
open maths (GSM8K, MATH-500). Every prompt asked for the final answer in a box.

Each question ran under several instructions, from "think step by step" to
"give the final answer directly without any reasoning." For Kimi and DeepSeek I
also switched thinking off at the API level. That came to about 6,400
responses and $19.

For each response I split out everything the model wrote before its answer and
had judge models decide whether it contained actual reasoning: a computation, a
deduction, an elimination. I also recorded the reasoning tokens each provider
billed, whether or not they showed up in the output.

## One model listened

Told not to reason, here is what each model did:

| Model | Bare answers | Visible reasoning | Clean answers that still billed reasoning | Accuracy |
| --- | --- | --- | --- | --- |
| Gemini-4-Argon | 100% | 0% | 0% | 91% |
| GPT-6-Astra | 85% | 13% | 21% | 91% |
| Kimi-K3 (thinking on) | 0% | 96% | n/a | 90% |
| DeepSeek-V4-Flash (thinking on) | 0% | 96% | n/a | 88% |
| Kimi-K3 (thinking off) | 96% | 2% | 0% | 76% |
| DeepSeek-V4-Flash (thinking off) | 83% | 13% | 0% | 74% |

Argon is the only model that did what it was told and paid nothing for it:
bare answers, zero reasoning tokens, accuracy within two points of its best.

Kimi and DeepSeek, with thinking on, simply kept going. They return their
reasoning in a separate field, and that field was full on 96% of questions,
including the ones where I'd asked them not to think. The instruction changed
nothing.

## The bill

The finding that stuck with me was the bill. With thinking on and no
instruction, every clean-looking answer from Muse still billed reasoning
tokens, around 514 per answer. Argon did the same 86% of the time. The output
says "just the answer." The invoice says otherwise.

Telling the model outright not to reason mostly closes that gap. Argon went to
zero. Astra didn't: about one in five of its clean answers still billed hidden
tokens, around 14 on average. Small, but it means a bare answer is not proof
the model didn't think.

## When thinking earns its keep

Thinking clearly matters on hard questions. Switch it off and Kimi's accuracy
on open maths problems falls from 99% to 69%. DeepSeek, switched off and told
not to reason, drops from 99% to 80%.

But plenty of questions don't need it. Asked to skip reasoning on yes/no
questions, Argon lost nothing (87% to 89%). That's exactly where you'd want to
save the tokens, and it's where most models won't let you: with thinking on,
Kimi and DeepSeek reasoned on about 95% of yes/no questions even when told not
to.

Thinking off isn't a free fix either. Even with it disabled, DeepSeek
reasoned in the visible answer on 100% of open questions at its default
prompt, matching the paper's 99.9%. The more open the question, the more it
reasoned: 9% on yes/no, 74% on multiple choice, 100% on open. Telling it not to
reason cut that to 33% on open questions, and cost 11 points of accuracy.

## What I'd do with this

"Answer only" in a prompt is a request. If you want cheap answers on easy
questions, turn thinking off in the API call or pick a model that actually
obeys, and expect to give up some accuracy on anything hard. And check the
reasoning-token count on your bill, not just the text you got back.

## How rough these numbers are

The reasoning rates come from judge models, and I checked them against my own
labels on 30 samples. They agreed with me about 82% of the time, below the 95%
I was aiming for, and I'm one labeller who wasn't sure of every call. Treat
differences of a few points between models as noise; the large effects above
hold either way. My checks suggest Astra's reasoning rate is slightly
overstated and Kimi's and DeepSeek's slightly understated.

A few other limits: Muse ran under the default setting only, with 136
responses, before I hit my budget. DigitalOcean doesn't report reasoning-token
counts, so DeepSeek's hidden billing is unmeasured. And I graded MATH-500 by
string match, which undercounts correct answers written differently.

## Next

This is the first half of a question I care more about. A clean answer that
still billed reasoning is a small gap between what a model shows you and what
it did. Next I'm testing a bigger one: coding agents that take a shortcut,
like editing the failing test, and then report that everything passed.
Whether models hide their mistakes, not just their thinking.
