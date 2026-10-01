# Agent 6 — Medical Deep Research Plan

**Started:** 2026-09-30T22:35:37Z  
**Repository branch:** `arena/01a0f474-learms`  
**Research standard:** every substantive claim must carry a verifiable primary source, peer-reviewed source, official guideline, or clearly labelled secondary source and access date.

> The task requested `arena/medical-research`, but this Arena session is permanently bound to `arena/01a0f474-learms`. Work will remain on the session branch; no other branch will be created or checked out.

## Scope and order

1. Pakistan medical-program taxonomy and accreditation boundaries.
2. Postgraduate medical, dental, pharmacy, nursing, allied-health, and veterinary pathways.
3. Pakistan colleges, admissions, examinations, and regulation.
4. Medical-student wellbeing and educational problems.
5. Evidence-based interventions and learning science.
6. Books and educational resources.
7. Medical-learning UI/UX and accessibility.
8. Careers, compensation, and migration routes.
9. Pakistan healthcare/public-health context.
10. Tools and platforms.
11. Medical-education papers.
12. Patient/student privacy and research ethics.
13. Communication and documentation.
14. Simulation, virtual patients, VR, and OSCE preparation.
15. Synthesis for Agents 1–4.

## Evidence rules

- Prefer statutes, regulators, official curricula, guidelines, systematic reviews, and original studies.
- Record author/organization, title, year, URL/DOI, access date, evidence type, geography, and limitations.
- Preserve denominators, instruments, uncertainty, and study design with every percentage.
- Do not generalize a single-institution Pakistani survey to all Pakistani students.
- Treat mutable claims—fees, exam formats, eligibility, salaries, recognized institutions—as dated facts that require rechecking at point of use.
- Mark requested claims as **not verified** rather than repeating them without a traceable source.
- Distinguish regulated qualifications from marketing labels and degrees from specialties.
- Never present educational content as personal medical advice.

## Integration targets

### Agent 1 — backend / knowledge graph

Represent `program → phase → discipline → system → concept → competency → assessment`, with typed prerequisite and part-of relationships. Keep regulatory jurisdiction, source provenance, effective dates, evidence spans, confidence, review status, and versioning on nodes/edges.

### Agent 2 — frontend / content

Use curriculum-aligned views; distinguish knowledge, practical skill, communication, and professional behavior. Design low-stimulation wellbeing surfaces, keyboard/screen-reader access, color-independent safety states, clear evidence labels, and Urdu/Roman-Urdu support without translating clinical terms unsafely.

### Agent 3 — security

Assume uploaded clinical material can contain PHI and that wellbeing data is highly sensitive. Enforce least privilege, purpose limitation, retention controls, private caching, auditability, redaction, consent, and breach response. Do not claim HIPAA applicability by analogy.

### Agent 4 — general research

Use the source register and gap log; avoid duplicating mutable factual research without checking its effective date.

## Deliverable map

Research is organized under `docs/medical-research/` in `taxonomy/`, `specializations/`, `pakistan/`, `exams/`, `problems/`, `solutions/`, `books/`, `ui-ux/`, `career/`, `tools/`, `papers/`, `compliance/`, `communication/`, `simulation/`, and `sources/`.

## Validation checklist

- [ ] Source resolves and actually supports the claim.
- [ ] Access date recorded for web material.
- [ ] Publication year and DOI verified where available.
- [ ] Geography/population/study design stated.
- [ ] Contradictions and superseded rules identified.
- [ ] No uncited salary, fee, pass-rate, prevalence, or ranking claim.
- [ ] “Not found” used when authoritative data are unavailable.
- [ ] Research gaps separated from findings.
