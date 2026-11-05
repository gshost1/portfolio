---
title: NodFirst
summary: Coordination app for families caring for a parent from far away. Shipped to the App Store, set down in September after the buyer question failed twice, picked back up in October and paused again.
period: 2025 to October 2026
status: paused
site: https://nodfirst.com
order: 7
stack: ["Next.js", "Postgres", "Expo", "Playwright", "Claude Code", "Hermes"]
---

## What it is

A web and iOS app for the adult child who lives far from an aging parent and is
coordinating care through siblings, a home-care agency and a phone. Tasks, rides,
a shared log, a digest, voice notes, and later a version aimed at the agencies
themselves. It was first called Rowanstead.

I built it solo: Next.js and Postgres on a VPS, an Expo mobile app, a
Playwright test suite, and a small fleet of coding agents doing most of the
typing. Version 1.0 went to Apple for review on September 2, 2026, and is live on the
App Store as of September 4.

## The thesis, and how it changed

The first thesis was that home-care agencies needed a **sign-off record**:
proof, for the family and for compliance, of what was done on each visit.
That died on a single call on August 10, 2026, when an agency owner explained,
patiently, that this is not a problem they have. The repo kept building on it
for three more weeks anyway, which is the mistake I would most like not to
repeat.

The second thesis was **absence**. The real pain belongs to the person who is
not in the room, and it was my own problem, which is why I believed in it.
That thesis I still think is right.

## Why it was set down in September

Because a correct thesis is not a business until someone with the pain also
has a reason to pay.

- **The agency** has budget but not the pain. They were polite, and nobody
  bought.
- **The family** has the pain but no habit of paying. A one-time setup fee is
  not a business, and a monthly subscription for looking after your mother is
  the guilt tax that filled the consumer-caregiving graveyard before me
  (CareZone, Lotsa Helping Hands, Carely: all free, none of them a company).
- **The employer**, the way Wellthy and Cariloop sell, is the one shape where
  the payer has both budget and motive. It is also a six-to-twelve-month
  enterprise cycle for a solo, unincorporated, pre-revenue founder. I named it
  and did not start it.

## What the numbers actually said

Almost nothing, and that is the honest part. Every discouraging number the
project produced (224 prospects, 50 invitations, one acceptance, seven replies
from 28 DMs, a 649-row dial list) was aimed at the thesis that had already
died. The gate that mattered, ten real conversations with people far from a
parent, stood at **one of ten** on the day I stopped.

## What I wrote when I stopped

Ten conversations. Not a build.

## Back on, briefly

In October I picked it back up under the new name. The first work since
then is two builds on one day, October 12, both on synthetic data and
sharing one core:
[Triage Router](/projects/triage-router/), which routes each caregiving
message to a differently sized model by risk, and
[Night Watch](/projects/night-watch/), an overnight agent that runs its own
model so health data stays on a server I control.

No new calls came out of it, so it is paused again.

## The build, week by week

How the agent setup around NodFirst started, what went wrong, and what each failure turned into.

### Week 1, Jul 27: One session, one engineer

Claude Code in a terminal, me reviewing every diff. Next.js and Postgres on a VPS behind Caddy, an Expo app beside it. Fast at first, and every hour of output cost an hour of my attention.

### Week 2, Aug 10: The thesis dies on a call, the repo does not notice

An agency owner told me the compliance record I was building was not her problem. I logged it and kept building on the old plan for three weeks, because every artifact in the repo pointed at the old plan. *Lesson: a kill gate needs a fast path for "the premise is wrong", separate from "the numbers are bad".*

### Week 4, Aug 19: Split the work by how much judgment it needs

Tightly specified changes go to a cheaper model through a dispatcher that runs several in parallel. A second model reviews the diff before I see it. First bug found: the reviewer was rubber-stamping. *Lesson: a reviewer that never rejects is not a reviewer. Log the rejection reasons and read them.*

### Week 4, Aug 24 to 26: Operations from a phone

A Telegram relay to drive sessions while out, a 07:00 morning brief, a deploy command that arms and then needs a confirm within five minutes, a backup tool that whitelists config into git and scans it for secrets, read-only guards on agents that only look. *Lesson: a prompt rule is not a guardrail. Anything that must not happen gets a hook or a permission.*

### Week 5, Aug 28: The bad day

Three failures in one day. An overnight headless run froze on a macOS consent dialog nobody was there to click. Three parallel browser scouts got the LinkedIn account flagged. Two iOS builds were rejected by Apple after the build service reported them finished. *Lessons: headless work stays out of protected folders; one browser session at a time; "finished" is not "accepted", confirm at the destination.*

### Week 5, Aug 30 to 31: Multiple sessions on one tree

A commander session, a shared board, numbered rounds, deploy on every even round. Peers on one worktree can move each other's branches, so the protocol is small commits on main, pathspec-only adds, and never assume a message between sessions was delivered. Built and deployed an agency demo flow over the weekend this way.

### Week 6, Sep 1: The loop closes

A nightly retro reads the day's call log and email replies and proposes prompt and rule changes. Proposals still need my yes. Same week: a local search index over 62,000 agent messages, so past decisions are recalled at zero token cost instead of re-derived.

### Week 6, Sep 2 to 3: Ship, then stop

Version 1.0 submitted to Apple. The next day I set the project down: the thesis was right and no buyer had both the pain and a reason to pay. The set-down is a written handoff with every scheduled job accounted for, so it can be picked up or closed without rot. The system outlived the product, which was the point.

## What I kept

The kill-gate habit, written before the first call. The agent harness that
built most of the product. And an app live on the App Store that taught me
more about Apple review than I wanted to know.
