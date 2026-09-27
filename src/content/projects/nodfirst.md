---
title: NodFirst
summary: HR onboarding agent that sorts new-hire requests, suggests who should handle each one and how sensitive it is, and then waits for a person to approve. Evaluated on 259 human-written HR requests.
period: September 2026
status: paused, open source
repo: https://github.com/gshost1/nodfirst
order: 7
stack: ["Node.js", "SQLite", "Claude", "Jev", "Ollama", "vanilla JS"]
---

## Why it exists

New hires ask for unusual things during onboarding: a home-office stipend,
temporary production access, a payroll change. At a small company those
requests arrive in Slack or email with no clear owner. An agent could sort
them, but an agent that grants access or changes payroll on its own is the
wrong shape for HR.

NodFirst does the routine onboarding tasks, reads each unusual request,
suggests where it should go, and then stops. Nothing happens until an admin
approves.

## How it works

The model answers three typed questions about each request: which team
should handle it (IT, People Ops, Payroll and Benefits, Security, or a
human), what category it is, and whether it needs confidential handling. It
returns probabilities, not prose. Code checks every answer against a schema
and marks anything below 75% confidence as needing a human.

The same contract runs on Claude, any OpenAI-compatible API, a local Ollama
model, Jev, or an offline Naive Bayes baseline, so the demo works with no
API key at all. An admin can switch providers at runtime, and the switch is
recorded.

## The approval gate

The model only proposes. An approval creates exactly one follow-up; a
rejection creates nothing. A database trigger refuses any follow-up without
an admin decision, so a bug in the app code cannot skip the gate. Every step
goes into an append-only record with who acted, on what, and why.

## Measured, not assumed

Providers are scored on 259 human-written requests from SAP's public HR
request dataset. The offline baseline routes 98.1% correctly under 5-fold
cross-validation, and 91.5% when none of the survey's own tickets are in its
training data. The harder cross-source number is the honest one, and the
README leads with both.

## What leaves the machine

Only the role, location, work mode, the request and the relevant policy
reach a model. Names and dates never do. Hosted providers must use HTTPS
origins set explicitly, redirects are refused, and Ollama is restricted to
loopback. The server binds to localhost with CSRF tokens and a strict CSP.

## Where it stands

Paused before any outreach went out. I built it around a problem I could
describe but don't have myself, and customer discovery works better when
you do. The code, the evaluation and the demo are complete and open source.
