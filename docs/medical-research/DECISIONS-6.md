# Agent 6 Research Decisions

**Last updated:** 2026-09-30 (Area 2 checkpoint)

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

## D-011 — College evidence is claim-specific

A PM&DC directory entry, seat allocation, teaching-hospital relationship, university affiliation, session intake permission, fee cap, admission outcome, and quality rank are separate dated claims. No one field implies another.

## D-012 — No fabricated completeness from paginated registers

When an official page reports a total but the retrieval path exposes only part of the table, store the reported total and captured rows with an explicit incomplete flag. Do not fill missing rows from stale search snippets or memory.

## D-013 — No opaque college league table

Until a current official or independently validated comparable dataset exists, Learms will provide source-separated college filters rather than an ordinal “best college” score. User preferences are not objective quality weights.

## D-014 — Admission chance requires matched dimensions

Eligibility, calculated aggregate, and historical selection are separate outputs. Historical comparison requires the same session, authority, program, college, category/quota, domicile scope, and final list type. A probability is withheld unless a calibrated validated dataset exists.

## D-015 — Fee records are append-only dated observations

Later PM&DC fee notifications do not erase older values. Store notification date, exact institution wording, cap, and source; select the applicable record only after resolving session and institution/program identity.

## D-016 — Exam standards are versioned independently from sittings

An exam's law, syllabus/standard, registration notice, reschedule, admit-card date, component result, and credential outcome are separate records. A date passing does not prove the event occurred.

## D-017 — Exam milestones are not interchangeable credentials

MDCAT pass, admission eligibility, selection, graduation, provisional registration, house job, NRE/NEB, FCPS-I, induction, IMM, FCPS-II, CPSP election, and PM&DC additional-qualification registration remain separate graph states.

## D-018 — Later standards do not erase contradictions

Use later, more specific official exam standards for current guidance while retaining earlier values and arithmetic/text conflicts in provenance. Never add missing questions or silently repair a regulator table.

## D-019 — Jurisdiction-specific international pathways

USMLE/ECFMG, PLAB/GMC, and PM&DC/CPSP are separate authority graphs. Exam passage never implies residency match, employment, immigration status, or a licence in another jurisdiction.
