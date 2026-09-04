---
title: Filings reader
summary: A tool that reads SEC filings and credit documents so an analyst does not have to. In customer discovery.
period: September 2026 to now
status: in test
order: 1
stack: ["Python", "LLM extraction", "SEC EDGAR"]
---

## The bet

Analysts at small funds still read long documents by hand: 10-Ks, credit
agreements, indentures, prospectuses. Large language models can now extract
verbatim, cited answers from a 600-page filing for roughly a hundredth of what
it costs to read it in context, and the extraction can be verified against
the source mechanically.

The tool is the verifying reader: ask a question, get quotes with locations,
have every quote re-checked against the document before it reaches a
spreadsheet. Anything that becomes a number stays in deterministic code.

## The gate

Before writing more code I am asking ten people who do this work one question:

> What did you read by hand last week, and what did it cost you, in hours or
> in things you missed?

If fewer than three of ten name a document type and a cost, the idea is
dropped. This site will say so either way.

## Where it comes from

A year of building a distressed-credit screener, where the bottleneck was
never the math. It was that credit agreements have no structured tags and
someone has to read them.
