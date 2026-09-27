---
title: Keysrs
summary: Free, open-source Mac menu bar app that shows Claude Code, Codex and Grok plan limits and keeps API keys in the Keychain behind Touch ID. Agents get a scoped grant, never the key, and nothing leaves the machine.
period: September 2026 to now
status: live, v0.10.1, free and MIT
site: https://keysrs.com
repo: https://github.com/gshost1/Keysreallysafe
order: 5
stack: ["Swift", "macOS Keychain", "Touch ID", "menu bar", "loopback gateway"]
---

## Why it exists

Running a fleet of coding agents means a drawer full of API keys and no idea
how close any plan is to its limit this week. Every provider shows a different
number in a different place, and half of them do not show local usage at all.

Keysrs started as a command-line tool called Keysreallysafe and is now a
signed, notarized Mac app you drag to Applications, live at
[keysrs.com](https://keysrs.com). It does three jobs.

## The meter

The menu bar shows each tool's plan windows as percent used and time to reset:
Claude's five-hour, weekly and Fable windows, Codex and Grok weekly. The
numbers come from the files Claude Code, Codex and Grok already write on the
Mac. No logins, no scraping, no provider websites. A reading that is stale,
from another account or past its reset shows as a dash rather than a
substitute number.

The dashboard charts usage by day, model and source, in tokens and requests
by default. Dollars appear only when asked for, because a list price applied
to a token count is an estimate, not a bill, and a call nobody reported usage
for is unknown, not zero.

## The vault

Keys live in the macOS Keychain, never in a file. `keys env NAME VAR -- cmd`
unlocks a key with Touch ID, injects it into the child process and never
prints or copies it. API keys can be sorted by name, recent use, monthly use
or age.

## The gateway

An agent that needs a key does not get the key. It gets a grant: one Touch ID
per task, then a short-lived token bound to that key, its provider host, a
method and path scope, an expiry, and optional request and dollar caps. The
agent uses the token against a gateway on 127.0.0.1, which swaps in the real
secret on the way out. A request with no grant gets a 401, an out-of-scope one
a named 403 or 429, and screen lock or `keys revoke` kills every grant.

The 0.9.2 release fixed two gateway bugs: grant tokens in a secondary header
or query parameter were forwarded upstream, and an oversized chunked request
could crash the app before authentication; it now gets a 413.

## Paid, then free

Versions 0.6 to 0.8 had a 14-day trial, a license key and Stripe checkout.
0.9.0 removed all of it: Keysrs is MIT licensed and needs no account. The only
outbound calls are opt-in: an update check against GitHub releases, off by
default, and an anonymous usage comparison whose box starts unticked.

## What I learned

Honest metering is mostly about labelling: a token count is not a dollar, an
estimate is not a bill, and a local usage figure is not a subscription
balance. The tool keeps those apart in the schema, so the display cannot
conflate them.
