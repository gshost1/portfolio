---
title: Upstream reports and fixes
summary: Bugs I found in other people's open-source agent infrastructure and reported with a minimal reproduction. Six to Vercel's eve, three fixed by the eve team so far and one more in review, and a fix PR open on Infisical.
period: October 2026 to now
status: three fixed upstream, more open
order: 3
stack: ["vercel/eve", "Infisical", "TypeScript", "Postgres"]
---

## How I report

Each report comes with a repository anyone can run, usually offline with a
mock model, that shows the bug in a few minutes. The aim is that a
maintainer can confirm it without trusting my description.

## vercel/eve

Six issues, found while building [eve-tokyo](/projects/eve-tokyo/). The
fixes were written and merged by the eve team.

| Issue | What it was | State |
|---|---|---|
| [#4769](https://github.com/vercel/eve/issues/4769) | Compaction re-capped already-capped tool results, shrinking them every round | Fixed in [#4771](https://github.com/vercel/eve/pull/4771), Oct 15 |
| [#4772](https://github.com/vercel/eve/issues/4772) | Compaction kept only the head of large tool results, dropping test failures and exit codes | Fixed in [#4773](https://github.com/vercel/eve/pull/4773), Oct 15 |
| [#5350](https://github.com/vercel/eve/issues/5350) | A 429 on the compaction call inside a turn ended the whole session | Fixed in [#5355](https://github.com/vercel/eve/pull/5355), Oct 27; credited in the 0.84.1 release notes |
| [#5752](https://github.com/vercel/eve/issues/5752) | Cancel or `/clear` during `ask_question` left a stale question that failed the next message | Fix in review, [#5754](https://github.com/vercel/eve/pull/5754) |
| [#5386](https://github.com/vercel/eve/issues/5386) | A step interrupted by a crash stays frozen for about 14 minutes after restart | Open |
| [#5936](https://github.com/vercel/eve/issues/5936) | Compaction checkpoints refer to discarded summaries and lose user rules | Open, reported Nov 4 |

## Infisical

[Infisical#9073](https://github.com/Infisical/infisical/pull/9073), opened
October 31 and still open. When several requests create the same secret
at once, they all pass the existence check, the database's unique index
keeps exactly one, and every other caller gets a 500 instead of the 400
"already exists" a sequential duplicate gets. CI pipelines, Terraform and
SDK clients that create in parallel or retry after a timeout see that as a
server error.

The PR catches that one constraint violation around both insert paths and
returns the existing "already exists" error; other errors pass through
unchanged. Against a local stack, 8 concurrent creates of the same key went
from one 200 and seven 500s to one 200 and seven 400s, on all three create
endpoints.
