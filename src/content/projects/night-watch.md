---
title: Night Watch
summary: Overnight elder-care agent that runs its own model with vLLM on Akamai Cloud, keeps health data on that host, and decides how much inference to spend from its own server's telemetry. A hackathon build on synthetic data.
period: October 2026
status: hackathon build, open source
repo: https://github.com/gshost1/nodfirst-night-watch
order: 9
stack: ["Python", "FastAPI", "vLLM", "Qwen3-4B", "Akamai Cloud", "MCP", "Chart.js"]
---

## Why it exists

I built this for the HackerSquad and Akamai hackathon on October 12, whose
theme was agents that own their inference. The scenario: overnight, an agent
reads 40 check-in events for an 81-year-old parent, such as a missed evening
dose, bathroom trips, a confusion episode and a loud thud at 03:12 with no
verbal response. In the morning it writes a digest for her two children with
a task assigned to each, urgent alerts first. All of the data is synthetic,
generated from a fixed seed.

Data like this usually goes to someone else's API. Here the model, Qwen3-4B,
is served by vLLM on Akamai Cloud, and the privacy rule is enforced in code.

## How it works

Each event is classified, urgent ones are moved to the front in every mode,
and the rest are summarized. Qwen3-4B was unreliable with tool calling, so
every structured step asks for JSON, retries once with a repair instruction,
and falls back to a canned summary rather than crashing. A keyword safety net
("fall", "thud", "no response", "missed dose" and others) forces an event to
urgent whatever the model says.

Before each step the agent reads vLLM's own metrics: queue depth, KV cache
use and time to first token. A policy picks NORMAL, CONSERVE or SURGE from
fixed thresholds. Under SURGE it cuts max tokens from 512 to 128 and context
from 12 items to 3, and defers non-urgent summaries into one batch that the
digest lists explicitly. Every call is logged with its mode, latency and
tokens, and a local dashboard shows all of it live.

## The egress guard

Every completion goes through a guard. A call tagged as health data may
only reach a host on an allowlist, which is the owned vLLM server. Any
other host raises an error before the client is touched, so nothing is
sent. A dashboard button tries a call to a third-party API and shows it
blocked with zero bytes out. A non-health-data fallback endpoint is
configured and displayed, but no code path calls it.

## On the real GPU

On site the agent ran against Qwen3-4B in Akamai's GPU sandbox: 40 of 40
events, 5 urgent alerts with the 03:12 possible fall first, and the one
third-party call blocked. To give the policy something to react to, I held
192 concurrent long, non-health-data requests against the same server for
100 seconds. KV cache peaked at 98.2% and the agent switched itself to
SURGE. The run still finished 40 of 40 with the three safety-critical alerts
intact, but those alerts only appeared once the queue drained.

So I added a fast lane: every run now pre-scans all events with the keyword
safety net and publishes urgent alerts before the first model call. Re-run at
98% KV cache, the fall alert was raised at 0 ms while the model had processed
none of the 40 events. On 20 labeled events, urgent recall was 1.000 in both
NORMAL and SURGE, and SURGE used 65% fewer tokens.

## How it was built

I built it alone, with an AI coding agent, against an offline mock mode with
canned replies and a synthetic load curve, so nothing called a real model or
cost money until the event. Most of the code was written the night before,
which the README discloses under the build-on-site rule. On the day I swapped
in the real endpoint through configuration, with no code changes, and added
the fast lane after the stress run showed alerts waiting on the queue.
