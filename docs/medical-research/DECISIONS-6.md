# Agent 6 Research Decisions

**Last updated:** 2026-09-30T23:05:00Z

## D-001 — Evidence hierarchy

Use official Pakistan regulators/statutes and current curricula for regulatory facts; systematic reviews for intervention effects; original Pakistani studies for local prevalence; and institutional pages only for institution-specific mutable facts. Secondary blogs cannot establish accreditation, fees, ranks, or licensing rules.

## D-002 — Atomic claims

A citation at the end of a long paragraph is insufficient where the paragraph contains multiple findings. Tables and finding blocks must map each claim to one or more source IDs.

## D-003 — Taxonomy is multi-axial

Do not force all healthcare education into a single “medical” hierarchy. Model profession/program, regulator, qualification level, specialty, competency, body system, care setting, population, and jurisdiction as separate axes.

## D-004 — Specialty versus subject

An undergraduate subject, postgraduate academic discipline, clinical specialty, subspecialty, technology, job role, and credential are different entity types. Preserve those distinctions in the knowledge graph and UI.

## D-005 — Mutable facts

Fees, recognized institutions, seat counts, exam patterns, pass rates, salaries, and migration rules require an `effective_date` or `accessed_at` field and should expire into review rather than remain evergreen.

## D-006 — Safety boundary

Learms may support education, practice, and source-grounded explanation. It must not present generated content as diagnosis, prescribe individualized treatment, conceal uncertainty, or fabricate patient records.

## D-007 — Precedence-aware prerequisites

Curricular sequence is evidence for teaching order, not proof of universal cognitive prerequisite. Knowledge-graph edges should label relation type and evidence, and remain reviewable.

## D-008 — No implied legal equivalence

HIPAA, GDPR, and FERPA can inform control design but are not automatically applicable in Pakistan. Compliance documents must distinguish legal applicability from voluntary good practice.

## D-009 — Credential-path separation

Model specialty, qualification route, program offering, awarding body, training site, supervisor, and regulator recognition as separate objects. FCPS, MCPS, MD, MS, MDS, and diploma labels do not establish interchangeable credentials or site recognition.

## D-010 — Preserve official-source count conflicts

Store an authority's stated total and the count enumerated on its page as separate facts when they disagree. The current CPSP page states 98 fellowships but visibly lists 48 first plus 44 second fellowships; neither will be silently selected as the definitive total.
