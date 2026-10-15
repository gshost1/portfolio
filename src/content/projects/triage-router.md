---
title: Nod First Triage Router
summary: Caregiving chat that sorts each message about an aging parent into routine, logistics or urgent-health and sends it to a differently sized model on DigitalOcean. Urgent messages skip every router and go to the largest model with a call-911 note. It never diagnoses.
period: October 2026
status: workshop build, open source
repo: https://github.com/gshost1/nodfirst-triage-router
order: 10
stack: ["Python", "FastAPI", "SQLite", "DigitalOcean Serverless Inference", "DigitalOcean Inference Router", "OpenAI SDK", "whisper.cpp", "vanilla JS"]
---

## Why it exists

Messages an adult child sends about a parent are not equally urgent. A
question about a visit with a neighbor and "Mom had a fall in the kitchen"
should not get the same model or cost the same. I built this solo for the
OIS Workshop Day (MLH + DigitalOcean) on October 12, 2026, around one idea:
route by caregiving risk.

It is not medical advice. The agent never diagnoses or suggests medication
changes, and anything that could be an emergency gets told to call 911 or
Mom's doctor.

## How it works

A small model labels each message routine, logistics or urgent. A keyword
safety net for falls, chest pain, confusion, a missed dose or not being able
to reach the parent overrides any lower-risk label. Routine and logistics go
through a `nodfirst` Inference Router I set up in the DigitalOcean Control
Panel, with `glm-5.3-flash` for routine and `glm-5.3` for logistics. A
client-side mapping to the same tiers is the fallback, and a mock mode runs
the whole app offline with no key.

The agent works on a shared sibling thread with seven tools: logging
medications, booking appointments, assigning sibling tasks, reading Mom's
record, building a daily digest from the store, and emailing the digest or
a short note. Each reply carries a badge with the route, model, latency and
estimated cost, and a stats panel compares spend against pricing the same
tokens at the large-model rate.

## Urgent never waits on a router

Urgent messages bypass the router in every mode and go straight to the
configured large model, `qwen3.8-max`. Each urgent turn also writes an alert
that stays on screen until a sibling acknowledges it, and can be emailed. If
the classifier call fails, the keyword classifier takes the turn so the
safety net still applies. If the agent call fails, the reply says so and
keeps the 911 note.

## What the live run showed

On the day, the five scripted messages ran through the real DigitalOcean
path. All five were classified as expected, both urgent ones were served by
`qwen3.8-max`, every turn finished under 4 seconds, and the run took 12
calls at about $0.006 estimated. Total spend across every rehearsal and
probe was under $0.10.

Rehearsal found real bugs. The thinking-model tiers returned empty text
until I set `reasoning_effort` to none, urgent replies printed the 911 line
twice, and a 529 overload from the provider surfaced as a server error. All
were fixed and checked again live. The repo has 143 tests, all offline.

## Voice

Spoken questions are transcribed on my own machine with whisper.cpp, since
DigitalOcean had no speech-to-text route. Replies can be read aloud through
DigitalOcean's text-to-speech model. That model does not stream, so the page
splits a reply into sentences, requests them in parallel and plays them in
order.

## What it is not

The brief suggested a Nous Hermes agent. No Hermes model was in the
DigitalOcean catalog, so none was used; the client is provider-neutral and
could take one through configuration. There is no accuracy evaluation, so I
do not quote savings percentages or recall rates. Costs shown in the app
are estimates from DigitalOcean's published prices, not a bill.
