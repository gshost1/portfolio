---
title: "Agent-desktop 1.4"
date: 2026-11-12
summary: "My fork of vercel-labs/agent-desktop: faster on native apps, where it still loses, and why the model is now the bottleneck"
---

Agent-desktop 1.4 is my fork of vercel-labs/agent-desktop. A lot of computer-use tools we see on the market right now are reliant on screenshots to tell the model where it is. Agent-desktop is different: it uses the accessibility tree available to you, pretty much the one VoiceOver uses.

One of the additions that was purposely made is the ability to access Chrome pages through DevTools. Other improvements include: (1) it doesn't check every Mac app before it starts; (2) commands run fresh, and setup runs at the same time, not one step after the other; (3) it no longer hangs on the permission prompt for 3 minutes. After those and other fixes, the time to find a button in System Settings went from 1 second to 0.3 seconds.

I also changed the instructions in the guide so the agent does the whole path in one call: find each step by name, click it, and read the answer at the end. The System Settings task went from 4 steps to 2, and input tokens from 51k to 26k. More docs made it worse: when a quick reference for the main commands was added to the main guide, the agent used 14% more tokens. The main guide gets read every run, so I moved the reference to a separate page that the agent opens only when it needs it. Same idea with the output: `--lines` prints one line per element instead of JSON, and it's about a third fewer tokens. The web guide the agent reads first went from 4,400 tokens to 1,800.

How I tested: the tasks I tuned on ran with Opus 5.5 on a MacBook Air M2, 3 to 8 runs per task, against upstream and browser-harness. Then came 18 tasks it had never seen, from OSWorld, WebArena and WebVoyager, frozen before the first run, with Sonnet 5.5, 5 runs each on a MacBook Pro M1 Pro and Linux VMs. A script judged every run against the expected result. It's one model per test and a few runs per task, so it's not a big study; take the numbers as a direction, not a final word.

<figure class="chart">
<img class="chart-dark" src="/writing/agent-desktop-1-4/1-vs-upstream-dark.png" alt="agent-desktop 1.4 vs upstream, fork's time and tokens as a percent of upstream (100% is the same as upstream), Opus 5.5 on an M2 Air. 3 native tasks: 55% time, 51% tokens. 6 harder native tasks: 56% time, 62% tokens. 9 web tasks: 35% time, 24% tokens." width="2000" height="1120" loading="lazy" />
<img class="chart-light" src="/writing/agent-desktop-1-4/1-vs-upstream-light.png" alt="agent-desktop 1.4 vs upstream, fork's time and tokens as a percent of upstream (100% is the same as upstream), Opus 5.5 on an M2 Air. 3 native tasks: 55% time, 51% tokens. 6 harder native tasks: 56% time, 62% tokens. 9 web tasks: 35% time, 24% tokens." width="2000" height="1120" loading="lazy" />
</figure>

The area where I take the cake is native apps, which are the most adapted to the accessibility tree. Against upstream I'm 45% faster with 49% fewer tokens, and on even harder native tasks I'm 44% faster with 38% fewer tokens and passed 24/24 when upstream passed 23/24. On the 18 tasks it had never seen, it had the lowest tool time on native apps on both machines (36.7s vs Cua's 52.4s on Mac, and 96.9s vs upstream's 102.1s on Linux) and passed the most Mac native runs, 32/40, when Peekaboo passed 31/40.

<figure class="chart">
<img class="chart-dark" src="/writing/agent-desktop-1-4/2-tool-vs-total-dark.png" alt="Fastest tool, not fastest run: 18 held-out tasks, native suites, sum of per-task medians in seconds, Sonnet 5.5. Tool time on Mac: agent-desktop 36.7s, Cua Driver 52.4s. Tool time on Linux: agent-desktop 96.9s, upstream 102.1s. Total time on Mac: agent-desktop 368.5s, Cua Driver 277.7s. Total time on Linux: agent-desktop 371.4s, upstream 318.4s." width="2000" height="1120" loading="lazy" />
<img class="chart-light" src="/writing/agent-desktop-1-4/2-tool-vs-total-light.png" alt="Fastest tool, not fastest run: 18 held-out tasks, native suites, sum of per-task medians in seconds, Sonnet 5.5. Tool time on Mac: agent-desktop 36.7s, Cua Driver 52.4s. Tool time on Linux: agent-desktop 96.9s, upstream 102.1s. Total time on Mac: agent-desktop 368.5s, Cua Driver 277.7s. Total time on Linux: agent-desktop 371.4s, upstream 318.4s." width="2000" height="1120" loading="lazy" />
</figure>

The area where I'm lacking is web and total time. Web is not the primary role of agent-desktop: agent-browser had lower tool time on both machines (7.7s vs 10.3s on Mac, and 5.5s vs 8.2s on Linux), browser-harness passed 50/50 when my fork passed 47 on Mac and 46 on Linux, and on my own web tasks it used 8% more tokens than browser-harness. I didn't achieve the lowest total time: Cua was faster on Mac, 278s vs 369s, and on Linux my fork was 17% slower end to end than upstream and used 12% more tokens. On TextEdit strikethrough my fork passed 0/5 when Cua and Peekaboo passed 3/5, and it miscounted the meanings of a Cambridge Dictionary word in 3 of 5 runs on Mac and 4 of 5 on Linux.

Credit where credit is due. Kudos to upstream for providing the base: the snapshot and refs loop, the CLI, and support for Mac, Windows and Linux are from them, and my fork is built on top. Cua and Peekaboo both passed TextEdit strikethrough 3/5. Agent-browser was the fastest on the web, and browser-harness passed every web run.

<figure class="chart">
<img class="chart-dark" src="/writing/agent-desktop-1-4/3-where-time-goes-dark.png" alt="Where the time goes: agent-desktop's tool time vs the model's turns on held-out tasks, as a share of total time. Mac native: tool 10%, model 90%. Mac web: tool 8%, model 92%. Linux native: tool 26%, model 74%. Linux web: tool 7%, model 93%." width="2000" height="1000" loading="lazy" />
<img class="chart-light" src="/writing/agent-desktop-1-4/3-where-time-goes-light.png" alt="Where the time goes: agent-desktop's tool time vs the model's turns on held-out tasks, as a share of total time. Mac native: tool 10%, model 90%. Mac web: tool 8%, model 92%. Linux native: tool 26%, model 74%. Linux web: tool 7%, model 93%." width="2000" height="1000" loading="lazy" />
</figure>

On the tasks it had never seen, the majority of the time went to the model thinking; the tool was only 7 to 26 percent of each run. My goal for 1.4 was to make the CLI as fast as possible, so the only gain left is in the model's TPS. The fixes: a high-TPS model, or thinking turned off. Turning thinking off probably costs accuracy, so I see the first one as the better option, and that's what's next.

It's on GitHub releases here: [https://github.com/gshost1/agent-desktop/releases/latest](https://github.com/gshost1/agent-desktop/releases/latest). npm and brew install upstream, not my fork, so download it from the release.
