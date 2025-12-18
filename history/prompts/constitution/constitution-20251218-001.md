---
id: constitution-20251218-001
title: Physical AI Constitution
stage: constitution
date: 2025-12-18
surface: sp.constitution
model: grok-code-fast-1
feature:
branch: main
user: Pc
command: sp.constitution
labels: [constitution, physical-ai, robotics]
links:
  spec:
  ticket:
  adr:
  pr:
files:
  - path: .specify/memory/constitution.md
    type: updated
    description: Created constitution for Physical AI & Humanoid Robotics project
  - path: .specify/templates/plan-template.md
    type: updated
    description: Added constitution checks for robotics project
  - path: .specify/templates/spec-template.md
    type: updated
    description: Updated examples for robotics domain
  - path: .specify/templates/tasks-template.md
    type: updated
    description: Updated foundational tasks for robotics development
tests:
---

## Prompt

You are an expert curriculum architect, technical author, and AI systems engineer specializing in Physical AI, Humanoid Robotics, and Embodied Intelligence.

Define the constitution and governing principles for a unified book project titled:

"Physical AI & Humanoid Robotics: From Digital Intelligence to Embodied Systems"

Constitutional Constraints

The book must be completed in maximum 5 chapters

Content must be academically rigorous yet industry-practical

Target audience:

Advanced AI students

Robotics engineers

ROS 2 & NVIDIA Isaac practitioners

Writing style:

Clear, precise, systems-thinking oriented

No marketing language

No oversimplification

Technology & Platform Rules

Primary platform: Docusaurus

Deployment: GitHub Pages

Spec-driven workflow using Spec-Kit Plus

Code tooling (only if required):

Next.js (App Router)

React

TypeScript

Tailwind CSS

shadcn/ui (only if a UI component is unavoidable)

No other external libraries unless explicitly justified

Design & UX Principles

Modern, institutional, minimal

Mobile-perfect responsive

Documentation-first layout

Visual hierarchy optimized for long-form technical reading

Define:

Core philosophy of the book

Non-negotiable quality standards

Structural rules for chapters and modules

Documentation, code, and diagram consistency rules

Accessibility and responsiveness principles

Output must read like a constitution, not a tutorial.

--- Cursor Command: sp.constitution.md ---
---
description: Create or update the project constitution from interactive or provided principle inputs, ensuring all dependent templates stay in sync.
handoffs:
  - label: Build Specification
    agent: sp.specify
    prompt: Implement the feature specification based on the updated constitution. I want to build...
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

You are updating the project constitution at `.specify/memory/constitution.md`. This file is a TEMPLATE containing placeholder tokens in square brackets (e.g. `[PROJECT_NAME]`, `[PRINCIPLE_1_NAME]`). Your job is to (a) collect/derive concrete values, (b) fill the template precisely, and (c) propagate any amendments across dependent artifacts.

Follow this execution flow:

1. Load the existing constitution template at `.specify/memory/constitution.md`.
   - Identify every placeholder token of the form `[ALL_CAPS_IDENTIFIER]`.
   **IMPORTANT**: The user might require less or more principles than the ones used in the template. If a number is specified, respect that - follow the general template. You will update the doc accordingly.

2. Collect/derive values for placeholders:
   - If user input (conversation) supplies a value, use it.
   - Otherwise infer from existing repo context (README, docs, prior constitution versions if embedded).
   - For governance dates: `RATIFICATION_DATE` is the original adoption date (if unknown ask or mark TODO), `LAST_AMENDED_DATE` is today if changes are made, otherwise keep previous.
   - `CONSTITUTION_VERSION` must increment according to semantic versioning rules:
     - MAJOR: Backward incompatible governance/principle removals or redefinitions.
     - MINOR: New principle/section added or materially expanded guidance.
     - PATCH: Clarifications, wording, typo fixes, non-semantic refinements.
   - If version bump type ambiguous, propose reasoning before finalizing.

3. Draft the updated constitution content:
   - Replace every placeholder with concrete text (no bracketed tokens left except intentionally retained template slots that the project has chosen not to define yet—explicitly justify any left).
   - Preserve heading hierarchy and comments can be removed once replaced unless they still add clarifying guidance.
   - Ensure each Principle section: succinct name line, paragraph (or bullet list) capturing non‑negotiable rules, explicit rationale if not obvious.
   - Ensure Governance section lists amendment procedure, versioning policy, and compliance review expectations.

4. Consistency propagation checklist (convert prior checklist into active validations):
   - Read `.specify/templates/plan-template.md` and ensure any "Constitution Check" or rules align with updated principles.
   - Read `.specify/templates/spec-template.md` for scope/requirements alignment—update if constitution adds/removes mandatory sections or constraints.
   - Read `.specify/templates/tasks-template.md` and ensure task categorization reflects new or removed principle-driven task types (e.g., observability, versioning, testing discipline).
   - Read each command file in `.specify/templates/commands/*.md` (including this one) to verify no outdated references (agent-specific names like CLAUDE only) remain when generic guidance is required.
   - Read any runtime guidance docs (e.g., `README.md`, `docs/quickstart.md`, or agent-specific guidance files if present). Update references to principles changed.

5. Produce a Sync Impact Report (prepend as an HTML comment at top of the constitution file after update):
   - Version change: old → new
   - List of modified principles (old title → new title if renamed)
   - Added sections
   - Removed sections
   - Templates requiring updates (✅ updated / ⚠ pending) with file paths
   - Follow-up TODOs if any placeholders intentionally deferred.

6. Validation before final output:
   - No remaining unexplained bracket tokens.
   - Version line matches report.
   - Dates ISO format YYYY-MM-DD.
   - Principles are declarative, testable, and free of vague language ("should" → replace with MUST/SHOULD rationale where appropriate).

7. Write the completed constitution back to `.specify/memory/constitution.md` (overwrite).

8. Output a final summary to the user with:
   - New version and bump rationale.
   - Any files flagged for manual follow-up.
   - Suggested commit message (e.g., `docs: amend constitution to vX.Y.Z (principle additions + governance update)`).

Formatting & Style Requirements:

- Use Markdown headings exactly as in the template (do not demote/promote levels).
- Wrap long rationale lines to keep readability (<100 chars ideally) but do not hard enforce with awkward breaks.
- Keep a single blank line between sections.
- Avoid trailing whitespace.

If the user supplies partial updates (e.g., only one principle revision), still perform validation and version decision steps.

If critical info missing (e.g., ratification date truly unknown), insert `TODO(<FIELD_NAME>): explanation` and include in the Sync Impact Report under deferred items.

Do not create a new template; always operate on the existing `.specify/memory/constitution.md` file.

---

As the main request completes, you MUST create and complete a PHR (Prompt History Record) using agent‑native tools when possible.

1) Determine Stage
   - Stage: constitution | spec | plan | tasks | red | green | refactor | explainer | misc | general

2) Generate Title and Determine Routing:
   - Generate Title: 3–7 words (slug for filename)
   - Route is automatically determined by stage:
     - `constitution` → `history/prompts/constitution/`
     - Feature stages → `history/prompts/<feature-name>/` (spec, plan, tasks, red, green, refactor, explainer, misc)
     - `general` → `history/prompts/general/`

3) Create and Fill PHR (Shell first; fallback agent‑native)
   - Run: `.specify/scripts/bash/create-phr.sh --title "<title>" --stage <stage> [--feature <name>] --json`
   - Open the file and fill remaining placeholders (YAML + body), embedding full PROMPT_TEXT (verbatim) and concise RESPONSE_TEXT.
   - If the script fails:
     - Read `.specify/templates/phr-template.prompt.md` (or `templates/…`)
     - Allocate an ID; compute the output path based on stage from step 2; write the file
     - Fill placeholders and embed full PROMPT_TEXT and concise RESPONSE_TEXT

4) Validate + report
   - No unresolved placeholders; path under `history/prompts/` and matches stage; stage/title/date coherent; print ID + path + stage + title.
   - On failure: warn, don't block. Skip only for `/sp.phr`.

--- End Command ---

## Response snapshot

Created constitution for "Physical AI & Humanoid Robotics: From Digital Intelligence to Embodied Systems" with 6 core principles:

1. Embodied Systems Architecture - prioritizes physical embodiment over purely computational approaches
2. Chapter Structure Constraint - maximum 5 chapters with architectural layer progression  
3. Academic-Industrial Rigor - maintains academic depth while ensuring industry applicability
4. Systems-Thinking Documentation - clear boundaries, data flows, and architectural relationships
5. Platform-Specific Implementation - validated against ROS 2 and NVIDIA Isaac platforms
6. Accessibility & Performance Standards - mobile-perfect responsive with real-time constraints

Updated dependent templates:
- plan-template.md: Added constitution checks specific to robotics project principles
- spec-template.md: Updated examples from generic web app to robotics-focused requirements
- tasks-template.md: Updated foundational tasks from database/API to ROS 2 workspace and sensor pipelines

Constitution version: 1.0.0 (new constitution)
Ratified: 2025-12-18

## Outcome

- ✅ Impact: Established governing framework for unified book project with clear technical constraints and quality standards
- 🧪 Tests: Constitution principles validated against dependent templates
- 📁 Files: 4 files updated (constitution + 3 templates)
- 🔁 Next prompts: Ready for sp.specify to implement feature specifications
- 🧠 Reflection: Constitution effectively captures the balance between academic rigor and industry practicality required for advanced robotics education

## Evaluation notes (flywheel)

- Failure modes observed: None - clean implementation of constitution framework
- Graders run and results (PASS/FAIL): Template validation passed
- Prompt variant (if applicable): Standard constitution command execution
- Next experiment (smallest change to try): Monitor constitution compliance in first specification phase
