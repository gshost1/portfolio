---
title: Meow Chess
summary: iPhone app that reviews Chess.com games and explains each mistake in plain English. The chess engine is written from scratch in Rust and runs on the phone, with no server.
period: October 2026
status: TestFlight beta in review, open source
repo: https://github.com/gshost1/meow-chess
order: 3
stack: ["Rust", "SwiftUI", "C FFI", "Chess.com API", "OpenAI-compatible APIs", "Jev"]
---

## Why it exists

A grade on a move does not tell a beginner what went wrong. Meow Chess is
built for a player rated around 500 on Chess.com. It downloads
their recent games, grades every move, and says in short sentences what the
move did, what it allowed, and what was better. The pieces are cats drawn in
code, with moods and meow sounds, because the review should be something a
beginner wants to open.

## The engine

The engine lives in `core/` and depends only on `serde` and `serde_json`.
It has bitboards and attack tables, legal move generation, SAN and PGN
parsing, a tapered evaluation with piece-square tables, and an alpha-beta
search with iterative deepening, a transposition table, quiescence,
null-move pruning, late move reductions and killer and history ordering.

Move generation is checked with perft against five standard positions,
including Kiwipete to depth 3 (97,862 nodes) and the start position to
depth 4 (197,281). All 21 engine tests pass. The SwiftUI app calls the
engine through a small C interface that exchanges JSON, and any error comes
back as JSON rather than a panic, since a panic in a release build would
crash the app.

## Explaining moves

The review layer finds hanging pieces, forks, pins, missed mates and missed
free material, and a separate pass describes what a move is trying to do:
attack, defend, develop, castle, push a passed pawn, or answer a threat
found with a null-move search. A plain pawn move gets a reason such as
"opens a diagonal for the bishop" instead of "pushes a pawn".

On the player's own moves the app can ask "What was your idea?" and then
say whether the move really did that, and which move would have. Mistakes
become practice puzzles. The coach tab estimates playing strength from
average centipawn loss. The first formula rated real ~400 games at about
1,600, so I recalibrated it on those games.

## Optional AI

Everything above works offline. For chatting about a move or an AI
training plan, the user can point the app at any OpenAI-compatible server,
OpenRouter by default or a local model such as Ollama, with their own key
stored in the iPhone Keychain. Jev, a decision model served through
OpenRouter, can read what the player typed in the idea quiz and pick which
idea they meant. Jev requests carry no usernames.

## What leaves the phone

I run no server, and the app has no accounts, analytics or
ads. Games come from Chess.com's public API. Reviews, quiz answers and
settings stay on the phone. The AI features are off until a key is
entered, and the privacy policy lists exactly what each one sends.

## Where it stands

The v2 task list is complete, and the beta is submitted to TestFlight and
waiting for Apple's review. Getting there took an icon without an alpha
channel, the export compliance key set, and a privacy policy written for
testers. Two end-to-end UI tests
drive the app against the real Chess.com API and a mock AI server. Next on
the list are optional Stockfish checks and recalibrating the rating
formula with games at other ratings.
