---
title: Rowanstead
summary: Coordination app for families caring for a parent from far away. Shipped to the App Store, set down after the buyer question failed twice.
period: 2025 to September 2026
status: set down, post-mortem
order: 2
---

## What it was

A web and iOS app for the adult child who lives far from an aging parent and is
coordinating care through siblings, a home-care agency and a phone. Tasks, rides,
a shared log, a digest, voice notes, and later a version aimed at the agencies
themselves.

I built it solo: Next.js and Postgres on a VPS, an Expo mobile app, a
Playwright test suite, and a small fleet of coding agents doing most of the
typing. Version 1.0 went to Apple for review on September 2, 2026.

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

## Why it was set down

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

## What I would do first if I picked it back up

Ten conversations. Not a build.

## What I kept

The kill-gate habit, written before the first call. The agent harness that
built most of the product. And a working App Store submission that taught me
more about Apple review than I wanted to know.
