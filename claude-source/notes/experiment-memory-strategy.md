# Experiment Memory Strategy

## Goal

The goal is to keep a living document system that:

- records each experiment iteration faithfully
- extracts useful constraints and error patterns automatically
- avoids repeating the same mistakes
- gets more accurate as more experiments accumulate
- becomes good enough that old logs rarely need to be re-read by hand

The key problem to avoid is premature generalization.

Example:

- true constraint: `a * b * c <= 64`
- observed run: `a * b = 32`, `c = 2`, failure
- bad summary: `a * b <= 32`

That summary is wrong because it silently dropped a fixed variable.

## Core Principle

Separate `raw observation` from `generalized knowledge`.

Do not let a single failed run turn directly into a global rule.

A good system should have at least three layers:

1. `raw`
   Each iteration is recorded as-is.
2. `candidate`
   Hypotheses or tentative constraints inferred from one or a few runs.
3. `validated`
   Constraints that survived multiple runs, broader checks, or mechanism-level understanding.

This is the most important structural decision. Without it, the document will keep collapsing narrow observations into overconfident rules.

## Recommended Structure

Use a directory layout like this:

```text
worklogs/
  iterations/
    it-001.md
    it-002.md
    it-003.md

knowledge/
  constraints/
    constraint-slot-product-001.md
    constraint-memory-layout-001.md
  errors/
    error-slot-overflow-001.md
  questions/
    question-boundary-condition-001.md
  decisions/
    decision-search-space-reduction-001.md
  INDEX.md
```

### Layer roles

`worklogs/iterations/`

- append-only
- one file per experiment iteration
- records parameters, derived values, result, error, environment, notes

`knowledge/constraints/`

- durable rules
- candidate or validated constraints
- should link back to supporting iterations

`knowledge/errors/`

- recurring failure modes
- error signatures and likely causes
- quick pre-checks before rerunning

`knowledge/questions/`

- unresolved hypotheses
- conflicting evidence

`knowledge/decisions/`

- why the experiment strategy changed
- what was ruled out

`knowledge/INDEX.md`

- short pointers only
- no long prose
- acts like an index, not the full knowledge dump

This is similar to the Claude memory design pattern:

- short index
- detailed topic files
- selective retrieval of relevant files
- periodic consolidation

The architectural pattern is useful. The exact memory taxonomy in Claude Code is not. For experiments, you want experiment-specific types instead.

## Recommended Document Types

Use these types in frontmatter:

- `observation`
- `constraint_candidate`
- `constraint_validated`
- `error_pattern`
- `decision`
- `open_question`

### Why these types

`observation`

- one iteration
- factual
- minimal interpretation

`constraint_candidate`

- a possible rule inferred from incomplete evidence
- must preserve fixed variables and scope

`constraint_validated`

- a rule that is strong enough to reuse confidently

`error_pattern`

- a repeated failure signature with likely causes

`decision`

- records experiment strategy changes and rationale

`open_question`

- unresolved ambiguity or conflicting results

## What to Record Per Iteration

Every iteration should explicitly capture:

- input variables
- derived variables
- result: success or failure
- exact error signature
- environment or config
- code version or commit
- short notes

Most importantly, derived values should be recorded explicitly.

If the real failure condition depends on `a * b * c`, then store:

- `a`
- `b`
- `c`
- `ab`
- `abc`

Do not rely on later summarization to recompute all of that correctly.

## Example Iteration File

```md
---
id: it-024
type: observation
a: 32
b: 2
c: 1
derived:
  ab: 64
  abc: 64
result: fail
error_signature: SLOT_PRODUCT_LIMIT
env: kernel_x / config_y
commit: abc1234
description: Boundary case failed with total product 64.
---

Observed:
Run failed with SLOT_PRODUCT_LIMIT.

Notes:
This weakens the narrower working hypothesis `a * b <= 32` if `c` is not fixed.
```

This file should stay close to the raw run and avoid over-generalizing.

## Example Constraint File

```md
---
id: constraint-slot-product-001
type: constraint_validated
status: active
expression: a * b * c <= 64
variables: [a, b, c]
scope: kernel_x / config_y
confidence: high
evidence_iterations: [it-017, it-021, it-024]
counterexamples: []
supersedes: [constraint-slot-ab-001]
description: Total slot product must stay within 64 for this kernel/config.
last_checked: 2026-04-01
---

Rule:
a * b * c <= 64

Why:
Failures previously attributed to `a * b <= 32` were observed only when `c = 2`.
Broader evidence later showed the real bound is on the total product.

How to apply:
Before launching a run, compute the total product first.
If near the boundary, log both the total product and remaining slack.
```

This is the right place for generalized knowledge.

## Summarization Rules

These rules matter more than wording quality.

### Rule 1: Never drop fixed variables silently

If a candidate rule is inferred under a fixed condition, the condition must remain attached.

Good:

- `observed failure when a * b = 32 and c = 2`
- `candidate: maybe total product is bounded`

Bad:

- `a * b <= 32`

### Rule 2: One failed run does not create a validated constraint

One run can create:

- an `observation`
- maybe a `constraint_candidate`

One run should not create:

- a `constraint_validated`

### Rule 3: Candidate constraints must encode scope

Every candidate rule should include:

- scope
- fixed variables
- evidence iterations
- confidence

Without scope, the document will drift into false universals.

### Rule 4: Conflicts should not overwrite history

If new evidence conflicts with an old rule, do not silently replace it.

Use one of:

- `superseded`
- `split_scope`
- `downgraded`

This preserves reasoning history and makes the knowledge base self-correcting instead of self-erasing.

### Rule 5: Error records need more than the message

An error document should include:

- `error_signature`
- likely causes
- triggering pattern
- quick pre-check
- linked iterations

Example:

- `SLOT_PRODUCT_LIMIT`
- likely cause: `a * b * c > 64`
- quick pre-check: compute total product before launch

### Rule 6: Durable knowledge needs freshness tracking

Constraints can go stale if the code, kernel, environment, or implementation changes.

Each durable rule should have:

- `last_checked`
- `confidence`
- evidence links

Claude Code does this kind of thing conceptually by treating recalled memory as potentially stale and warning when it is old. That idea transfers well to experiments.

## Promotion and Downgrade Workflow

Use a clear promotion path:

1. Iteration is recorded as `observation`
2. Extractor may create or update a `constraint_candidate`
3. Consolidator reviews multiple iterations
4. Only then promote to `constraint_validated`

A reverse path should also exist:

1. New evidence contradicts a validated rule
2. Rule is downgraded to candidate or split by scope
3. Superseding rule is created if needed

This makes the knowledge base improve over time instead of accumulating brittle folklore.

## Suggested Automation Flow

### After each iteration

Run a lightweight extractor that:

- writes the iteration file
- updates candidate constraints
- updates error patterns
- does not promote to validated yet

### Periodically

Run a consolidation pass after:

- every N iterations
- or once per day
- or when a topic accumulates enough new evidence

This pass should:

- merge duplicate candidates
- split over-broad candidates by scope
- promote strong candidates to validated
- mark old rules as superseded or downgraded
- refresh `knowledge/INDEX.md`

This is similar to how Claude's auto-dream consolidation works:

- recent signals are collected first
- then durable memory files are rewritten
- then the index is pruned

For your case, the consolidation pass is where narrow local patterns should be corrected into broader real constraints.

## Retrieval Before Running New Experiments

Before a new experiment, do not load the entire history.

Instead, retrieve only:

- constraints relevant to the current variables
- error patterns matching the current configuration or error signature
- unresolved questions related to the same subsystem

That is the equivalent of "relevant memory recall" in Claude Code:

- scan headers
- select only useful files
- load only those files

This keeps the system focused and avoids overwhelming the user with stale or irrelevant detail.

## Practical Recommendation

If you want this system to work reliably, do not rely on prose-only summarization.

The important thing is:

1. structure the iteration records
2. preserve fixed variables
3. separate candidate from validated knowledge
4. require promotion rules
5. periodically consolidate

The architecture should be:

- append-only raw log
- topic-based knowledge files
- short index
- selective retrieval
- periodic consolidation

That combination is strong enough to prevent repeated mistakes while still allowing the knowledge base to evolve correctly.

## Most Important Rule

If a summary discards a variable, it must justify why that variable is irrelevant.

If it cannot justify that, the variable stays.

That one rule alone would have prevented the bad jump from:

- `a * b = 32 failed when c = 2`

to:

- `a * b <= 32`

and would have pushed the system toward the better abstraction:

- `a * b * c <= 64`
