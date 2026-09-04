---
title: Asymmetry screener
summary: Research tool for levered small-caps, built on the SEC bulk XBRL archive. Used daily by a fund.
period: 2025 to now
status: in use
order: 3
---

## What it does

Finds companies where the equity is a thin slice of a large enterprise value,
so a small move in the enterprise produces an outsized move in the stock. Both
directions. Every row shows the upside multiplier and, beside it, the
percentage fall in enterprise value that takes the equity to zero, because
they are the same fact and showing only one of them makes the trade look like
something it is not.

It is a research tool. No trading logic, no sizing, no recommendations.

## The hard part

Filers tag debt differently, and the naive screener gets it wrong in both
directions at once. Some companies carry hundreds of millions in convertible
notes under a tag the usual query never asks for, so they show zero debt and
never appear. Others tag the same borrowing under five overlapping concepts,
so a sum double- or triple-counts. Lengthening the tag list fixes one case and
worsens the other.

Debt therefore resolves by **ladders**: prefer a single total tag, fall back to
component tags in a fixed order, never mix rungs. Every rule was confirmed
against live filings before it became code, and a validation suite replays
those filings on every change.

## What I learned about tools that produce numbers

- A ranked list with no trigger is a reading list. The screen is paired with a
  filings monitor and an append-only ledger of what was flagged and what
  happened next, so the tool keeps score against itself.
- Citations rot. A command re-fetches every cited filing and confirms the
  quoted text is still there.
- The expensive input is analyst reading time, not compute. That observation
  became the next project.

Details of the fund, the names screened and the curated registries are not
published.
