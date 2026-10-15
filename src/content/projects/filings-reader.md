---
title: Filings reader
summary: A tool that reads SEC filings and credit documents so an analyst does not have to. Explored in customer discovery, then set aside for NodFirst.
period: September to October 2026
status: moved on
order: 11
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

Before writing more code I set out to ask ten people who do this work one
question:

> What did you read by hand last week, and what did it cost you, in hours or
> in things you missed?

If fewer than three of ten named a document type and a cost, the idea would
be dropped.

## Where it comes from

A year of building a distressed-credit screener, where the bottleneck was
never the math. It was that credit agreements have no structured tags and
someone has to read them.

## Where it stands

In October I moved on to put my time back into
[NodFirst](/projects/nodfirst/).
