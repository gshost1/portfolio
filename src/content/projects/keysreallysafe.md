---
title: Keysreallysafe
summary: Local API-key vault, grant-gated gateway and token spend meter for a Mac. Keys live in the Keychain, agents get one Touch ID per task, usage comes from local agent logs, and nothing ever leaves the machine.
period: September 2026
status: in use, open source
repo: https://github.com/gshost1/Keysreallysafe
order: 5
stack: ["Swift", "macOS Keychain", "Touch ID", "menu bar", "loopback gateway"]
---

## Why it exists

Running a fleet of coding agents means a drawer full of API keys and no idea
what any of them cost this week. Every provider dashboard shows a different
number in a different place, and half of them do not show local spend at all.

Keysreallysafe is one command, `keys`, that does three jobs.

## The vault

Keys are stored in the macOS Keychain, never in a file. `keys env NAME VAR --
cmd` unlocks a key with Touch ID, injects it into the child process's
environment, runs the command, and never prints or copies the secret. The
binary is codesigned so the Keychain prompt names the tool, not "an unsigned
process".

## The gateway

An agent that needs a key does not get the key. It gets a grant: `keys grant
NAME` asks for Touch ID once, then hands back a short-lived token bound to
that key, its provider host, a method and path scope, an expiry, and optional
request and dollar caps. The agent uses the token as its API key against the
local gateway, which swaps in the real secret on the way out. A request with
no grant gets a 401, an out-of-scope one a named 403 or 429. Screen lock,
`keys revoke`, turning the gateway off or editing the key kills every grant.
Long-lived clients for cron jobs work the same way, minted from the dashboard
or `keys client issue`, with only a hash kept on disk.

`keys test` and `keys models` check a key against its provider with a
read-only call, never a generation, and a redirect is reported as its own
outcome so the key is never sent to a host it was not bound to.

## The meter

`keys ingest` reads the local logs that agent tools already write (Grok,
Claude Code, Codex) and turns them into a spend table by day, model and
session. `keys spend --week` prints it. `keys menubar` puts a spend sparkline
in the macOS menu bar, with one tab per subscription showing usage and the
reset time, and `keys dashboard` serves a local web view. For Claude it shows
the five-hour, Fable and weekly windows, read from Claude Code's own `/usage`
cache and refreshed through the existing login without a model request. A
reading that is over an hour old, from another account, or past its reset is
shown as a dash rather than substituted with a different number.

The dashboard binds to 127.0.0.1 only and refuses any LAN or public bind.
Nothing is scraped from provider websites, and numbers that cannot be derived
from local files are not shown rather than guessed.

## What I learned

Honest metering is mostly about labelling: a token count is not a dollar, an
estimate is not a bill, and a local spend figure is not a subscription
balance. The tool keeps those apart in the schema, so the display cannot
conflate them.
