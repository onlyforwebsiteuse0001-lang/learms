# Agent 5 — Decisions

## D001 — Branch Handling

- Date: 2026-09-30
- Decision: Use the Arena-mandated branch `arena/01a0f467-learms` instead of the user-requested `arena/it-research`.
- Reason: Platform instruction explicitly says never switch/create/push another branch in this session.
- Impact: PR, if created, must originate from `arena/01a0f467-learms`.

## D002 — Citation Standard

- Date: 2026-09-30
- Decision: Use a consistent finding block:
  - `## Topic: [name]`
  - `### Source: [Author/Organization, Year]`
  - `### Key Finding: [finding]`
  - `### Relevance to Learms: [how it helps]`
  - `### Citation: [URL/DOI]`
- Reason: Matches user requirement and helps downstream knowledge-graph extraction.

## D003 — Taxonomy Normalization

- Date: 2026-09-30
- Decision: Treat roots as high-level learning/career domains and sub-roots as teachable knowledge clusters, tools, roles, or specialization tracks.
- Reason: ACM CCS is literature-oriented, ACM/IEEE curricula are degree-oriented, and workforce frameworks are role-oriented; Learms needs a combined learning graph.

## D004 — Honest Completeness Labels

- Date: 2026-09-30
- Decision: Mark partial documents as `Status: Draft / In progress` until the requested source depth is achieved.
- Reason: Avoid fake completeness and hallucinated research.
