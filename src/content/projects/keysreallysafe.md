---
title: Keysreallysafe
summary: Local API-key vault and token spend meter for a Mac. Keys live in the Keychain, usage comes from local agent logs, and nothing ever leaves the machine.
period: September 2026
status: in use, private repo
order: 5
stack: ["Swift", "macOS Keychain", "Touch ID", "menu bar"]
---

## Why it exists

Running a fleet of coding agents means a drawer full of API keys and no idea
what any of them cost this week. Every provider dashboard shows a different
number in a different place, and half of them do not show local spend at all.

Keysreallysafe is one command, `keys`, that does two jobs.

## The vault

Keys are stored in the macOS Keychain, never in a file. `keys env NAME VAR --
cmd` unlocks a key with Touch ID, injects it into the child process's
environment, runs the command, and never prints or copies the secret. The
binary is codesigned so the Keychain prompt names the tool, not "an unsigned
process".

## The meter

`keys ingest` reads the local logs that agent tools already write (Grok,
Claude Code, Codex) and turns them into a spend table by day, model and
session. `keys spend --week` prints it. `keys menubar` puts a spend sparkline
in the macOS menu bar, and `keys dashboard` serves a local web view.

The dashboard binds to 127.0.0.1 only and refuses any LAN or public bind.
Nothing is scraped from provider websites, and numbers that cannot be derived
from local files are not shown rather than guessed.

## What I learned

Honest metering is mostly about labelling: a token count is not a dollar, an
estimate is not a bill, and a local spend figure is not a subscription
balance. The tool keeps those apart in the schema, so the display cannot
conflate them.
