---
title: "Agent-desktop 1.4"
date: 2026-11-12
summary: "my fork of vercel-labs/agent-desktop: faster on native apps, where it still loses, and why the model is now the bottleneck"
---

Agent-desktop 1.4 is my fork of vercel-labs/agent-desktop. A lot of computer use tools we see on the market right now are reliant on the screenshot to tell the model where it is. Agent-desktop is different: it uses the accessibility tree available to you pretty much taken from the Voiceover use.

One of the additions that was purposely made is an ability to access chrome pages through dev tools. Other improvements include: 1 Doesnt check every mac app before it starts 2 Commands run fresh, set up runs at the same time not one step after the other. 3 no longer hangs on the permission prompt for 3 minutes. after those and other fixes the time to find a button in system settings went from 1 second to 0.3 seconds.

I also changed the instruction in the guide so the agent does the whole path in one call, find each step by name click it and read the answer in the end. system settings task went from 4 steps to 2 and input tokens from 51k to 26k. More docs made it worse, a quick reference for the main commands was added to the main guide and the agent used 14% more tokens. the main guide gets read every run so i moved the reference to a separate page that the agent opens only when it needs it. same idea with the output, --lines prints one line per element instead of json and its about a third fewer tokens, and the web guide the agent reads first went from 4,400 tokens to 1,800.

How i tested. the tasks i tuned on ran with opus 5.5 on a macbook air m2, 3 to 8 runs per task, against upstream and browser-harness. then 18 tasks it had never seen from osworld webarena and webvoyager, frozen before the first run, sonnet 5.5, 5 runs each on a macbook pro m1 pro and linux vms. a script judged every run against the expected result. its one model per test and a few runs per task so its not a big study, take the numbers as a direction not a final word.

<figure class="chart">
<img class="chart-dark" src="/writing/agent-desktop-1-4/1-vs-upstream-dark.png" alt="agent-desktop 1.4 vs upstream, fork's time and tokens as a percent of upstream (100% is the same as upstream), Opus 5.5 on an M2 Air. 3 native tasks: 55% time, 51% tokens. 6 harder native tasks: 56% time, 62% tokens. 9 web tasks: 35% time, 24% tokens." width="2000" height="1120" loading="lazy" />
<img class="chart-light" src="/writing/agent-desktop-1-4/1-vs-upstream-light.png" alt="agent-desktop 1.4 vs upstream, fork's time and tokens as a percent of upstream (100% is the same as upstream), Opus 5.5 on an M2 Air. 3 native tasks: 55% time, 51% tokens. 6 harder native tasks: 56% time, 62% tokens. 9 web tasks: 35% time, 24% tokens." width="2000" height="1120" loading="lazy" />
</figure>

The area where i take the cake is native apps which are the most adapted to the accessibility tree in them. against upstream im 45% faster and 49% fewer tokens and on even harder native tasks i'm 44% faster with 38% fewer tokens and passed 24/24 when upstream passed 23/24. on 18 tasks it had never seen it had the lowest tool time on native apps on both machines, 36.7s vs cua 52.4s on mac and 96.9s vs upstream 102.1s on linux, and passed the most mac native runs 32/40 when peekaboo passed 31/40.

<figure class="chart">
<img class="chart-dark" src="/writing/agent-desktop-1-4/2-tool-vs-total-dark.png" alt="Fastest tool, not fastest run: 18 held-out tasks, native suites, sum of per-task medians in seconds, Sonnet 5.5. Tool time on Mac: agent-desktop 36.7s, Cua Driver 52.4s. Tool time on Linux: agent-desktop 96.9s, upstream 102.1s. Total time on Mac: agent-desktop 368.5s, Cua Driver 277.7s. Total time on Linux: agent-desktop 371.4s, upstream 318.4s." width="2000" height="1120" loading="lazy" />
<img class="chart-light" src="/writing/agent-desktop-1-4/2-tool-vs-total-light.png" alt="Fastest tool, not fastest run: 18 held-out tasks, native suites, sum of per-task medians in seconds, Sonnet 5.5. Tool time on Mac: agent-desktop 36.7s, Cua Driver 52.4s. Tool time on Linux: agent-desktop 96.9s, upstream 102.1s. Total time on Mac: agent-desktop 368.5s, Cua Driver 277.7s. Total time on Linux: agent-desktop 371.4s, upstream 318.4s." width="2000" height="1120" loading="lazy" />
</figure>

The area where im lacking is web and total time. web is not the primary role of agent desktop, agent-browser had lower tool time on both machines 7.7s vs 10.3s on mac and 5.5s vs 8.2s on linux, browser-harness passed 50/50 when my fork passed 47 on mac and 46 on linux, and on my own web tasks it used 8% more tokens than browser-harness. I didnt achieve the lowest total time, cua was faster on mac 278s vs 369s, on linux my fork was 17% slower end to end than upstream and used 12% more tokens. Textedit strikethrough my fork passed 0/5 when cua and peekaboo passed 3/5, and it miscounted meanings of a cambridge dictionary word 3 of 5 runs on mac and 4 of 5 on linux.

Credit where credit is due. Kudos to the upstream for providing the base, snapshot and refs loop, the cli and support for mac windows and linux is from them, and my fork is built on top. cua and peekaboo both passed textedit strikethrough 3/5. agent-browser was the fastest on the web and browser-harness passed every web run.

<figure class="chart">
<img class="chart-dark" src="/writing/agent-desktop-1-4/3-where-time-goes-dark.png" alt="Where the time goes: agent-desktop's tool time vs the model's turns on held-out tasks, as a share of total time. Mac native: tool 10%, model 90%. Mac web: tool 8%, model 92%. Linux native: tool 26%, model 74%. Linux web: tool 7%, model 93%." width="2000" height="1000" loading="lazy" />
<img class="chart-light" src="/writing/agent-desktop-1-4/3-where-time-goes-light.png" alt="Where the time goes: agent-desktop's tool time vs the model's turns on held-out tasks, as a share of total time. Mac native: tool 10%, model 90%. Mac web: tool 8%, model 92%. Linux native: tool 26%, model 74%. Linux web: tool 7%, model 93%." width="2000" height="1000" loading="lazy" />
</figure>

On the tasks never seen the majority of the time went to the model thinking, the tool was only 7 to 26 percent of each run. my goal for 1.4 was to make the cli as fast as possible so the only gain left is in tps of a model. fixes: high tps model or thinking turned off. turning thinking off probably costs accuracy so i see the first one as the better option and thats whats next.

Its on github releases here [https://github.com/gshost1/agent-desktop/releases/latest](https://github.com/gshost1/agent-desktop/releases/latest) , npm and brew install upstream not my fork so download it from the release.
