---
title: Keysrs
summary: Free, open-source API-key vault for coding agents on a Mac. Keys stay in the Keychain behind Touch ID; agents, cloud VMs and sandboxes get short-lived, scoped tokens, and the real key is swapped in on the Mac.
period: September 2026 to now
status: live, v0.15.0, free and MIT
site: https://keysrs.com
repo: https://github.com/gshost1/Keysreallysafe
order: 1
stack: ["Swift", "macOS Keychain", "Touch ID", "MCP", "loopback gateway", "Cloudflare Workers relay"]
---

## Why it exists

A coding agent that needs an API key usually gets the key: pasted into a
chat, read from an `.env` file, or copied into a VM. From then on the key is
in transcripts, logs and terminals, for as long as anyone keeps them.

Keysrs keeps the real keys in the macOS Keychain and hands agents something
weaker instead: a token scoped to one key, one host and a time limit, which
a gateway on the Mac swaps for the real key on the way out. It is a signed,
notarized Mac app, live at [keysrs.com](https://keysrs.com), and
installable with `brew install --cask gshost1/keysrs/keysrs`. It started as
a command-line tool called Keysreallysafe on September 4 and has shipped 22
releases since.

## Agents ask, you approve

Since 0.14 agents talk to Keysrs over MCP. `keys setup mcp` registers it
with Claude Code, Codex, Cursor, Droid and Claude Desktop, and from then on
the agent is asked in plain words:

- **Scan a project.** It finds credential-shaped variables in env files and
  reports names and last-four hints, never values.
- **Import and wrap.** One Touch ID moves a project's keys into the
  Keychain and rewrites the env files to a 30-day project token. `keys
  unwrap` puts the originals back.
- **Ask for a grant.** The agent requests access to one key; a Touch ID
  prompt in the app names the key and its host; the agent gets a token that
  expires in minutes to hours, with optional request and dollar caps.
- **Revoke everything.** One call ends every grant and project token.
  Locking the screen ends every grant.

No value crosses the agent at any step. `keys agent <agent> <key>` does the
same for launching Droid, Codex, Grok or Claude Code from a terminal: the
agent's config names an environment variable, the launcher fills it with a
fresh grant, and the grant is revoked when the agent exits.

## Cloud VMs and sandboxes

A VM gets a token, never the key. Its calls come back to the gateway on the
Mac over SSH (`keys tunnel`), or, for a sandbox you cannot SSH into, over a
relay: a Cloudflare Worker you deploy into your own account. Keys never
travel over the relay; only requests do, and the Mac swaps the key in.

0.12 moved the relay into the app, 0.13 let it require paired agents, and
0.15 added `keys share`, which hands a machine several keys at once with one
token and one pairing, printed as env lines to paste. The Mac can stay awake
for it, so an agent's call does not find it asleep.

## What testing with real agents changed

The 0.14 release was tested hands-on with an agent driving it. When a
provider answered 401 to a deliberately fake stored key, the agent told the
user the gateway had rejected its grant: the gateway's own refusals and a
provider's answers share status codes. Since 0.14.1 every gateway response
carries a header that says which side wrote it.

The same test showed the agent running its own `git` to see which env files
git had seen, instead of calling the tool built for that, so the MCP
server's instructions now name the steps agents skipped.

## Removed in 0.15

Keysrs used to open with a usage meter: plan windows for Claude, Codex,
Grok and Droid as percent used and time to reset. Once the app ran headless
the meter had no screen worth keeping, and it still cost a background
`claude /usage` run and a credit poll every 15 minutes, so 0.15 removed it.
The opt-in usage comparison went too, because it had no users. What stays
is `keys spend`: what each tool spent, from the files these tools already
write.

## Paid, then free

Versions 0.6 to 0.8 had a 14-day trial, a license key and Stripe checkout.
0.9.0 removed all of it: Keysrs is MIT licensed and needs no account. The
app listens on `127.0.0.1` only, sends no analytics, and its update check is
one cookieless request to GitHub's release API.

## What I learned

The hard part of a vault for agents is not the crypto. It is that agents
improvise: they read the file you meant them to ask about, and they explain
an error with the nearest plausible story. Every tool and every error has
to say plainly what it is and who produced it, because the agent will act
on whatever it guesses.
