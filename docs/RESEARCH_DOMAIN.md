# Domain research: personalized learning engine

Research date: 2026-10-01

## Bayesian Knowledge Tracing

BKT is an interpretable per-skill hidden Markov model. Its four operational parameters are prior knowledge `P(L0)`, transition/learning `P(T)`, slip `P(incorrect|known)`, and guess `P(correct|unknown)`. pyBKT supports student/item-conditioned variants and parameter fixing. Research indicates fitting needs meaningful data: learn/slip stabilize earlier than prior/guess; until sufficient interactions exist, conservative documented defaults are preferable to pretending parameters were learned. Individualizing learn rate may be more useful than individualizing prior.

Sources:
- pyBKT repository and variants: https://github.com/CAHLR/pyBKT
- pyBKT paper and parameter definitions: https://arxiv.org/html/2105.00385v2
- Practical data sufficiency review: https://www.mdpi.com/2624-8611/5/3/50

Decision: implement exact online Bayesian updates with visible default parameters; retain pyBKT for later offline fitting after enough real observations.

## FSRS

FSRS models Difficulty, Stability, and Retrievability and schedules toward an explicit desired-retention target. Unlike SM-2’s fixed ease heuristics, FSRS separates difficulty from memory stability and can optimize parameters from review history. Cold-start should use published defaults; per-user optimization should wait for substantial history.

Sources:
- Open scheduler comparison/code summary: https://deepwiki.com/open-spaced-repetition/fsrs-optimizer/7.3-comparison-with-sm-2
- Operational D/S/R explanation: https://www.diane.app/en/guides/fsrs-vs-sm2

Decision: FSRS remains the review scheduler for a later ordered step; no home-grown approximation is labeled FSRS.

## Contextual bandits

Educational contextual bandits select an exercise using learner/exercise context and observe only the selected action’s reward. Recent research directly defines reward as BKT skill gain rather than clicks or next-answer correctness. Linear Thompson Sampling adds context while preserving uncertainty-aware exploration. Cold-start needs conservative priors and prerequisite-safe candidate filtering.

Source: https://doi.org/10.1287/ited.2025.0174

Decision: Batch 2 uses prerequisite gating first, then a transparent Beta Thompson Sampling baseline. It records reward as normalized mastery improvement. Rich LinTS is deferred until context/reward volume exists.

## Socratic tutoring

Structured Socratic tutoring asks for learner reasoning, uses progressive hints, checks misconceptions, and adapts when repeated failure/frustration appears. Pure refusal can itself frustrate learners; escalation should make the task smaller and more explicit. Explain-back is required after any revealed solution.

Sources:
- Guided vs direct programming learning: https://onlinelibrary.wiley.com/doi/10.1002/jcal.70210
- Pedagogical modes and misconception-aware scaffolding: https://arxiv.org/html/2501.06682v1
- OECD outlook on explicit pedagogical models: https://www.oecd.org/content/dam/oecd/en/publications/reports/2026/01/oecd-digital-education-outlook-2026_940e0dd8/062a7394-en.pdf

Decision: later tutor ladder is question → conceptual cue → partial scaffold → one step → full solution + explain-back; frustration escalates support, not direct answer dumping.

## OCR and extraction

Digital PDFs need text parsers; scanned PDFs have no text layer and require rasterization plus OCR. A production path distinguishes pages, uses approximately 300 DPI, grayscale/contrast/denoise and preferably deskew. `pdfplumber` is layout-aware; `pypdf` is a robust simple-text fallback; `pdf2image` + Tesseract handles scans. Urdu/non-Latin OCR remains source-quality sensitive.

Sources:
- Scanned PDF pipeline and 300 DPI guidance: https://subhajitbhar.com/blog/pdf-extraction/extract-data-scanned-pdf-python/
- pdfplumber scanned limitation: https://www.pdfplumber.com/how-does-pdfplumber-handle-text-extraction-from-pdfs/
- OCRmyPDF preprocessing options: https://www.nutrient.io/blog/how-to-ocr-pdfs-in-linux/

Decision: retain page-level provenance/confidence and explicit failure; do not “correct” OCR source silently.

## Educational knowledge graphs

Prerequisite graphs should be DAGs. Candidate edges need direction, confidence and evidence; cycles must be rejected online. Topological sorting provides valid learning order. Expert review remains valuable because automatic prerequisite extraction is uncertain. Centrality can identify foundational bottlenecks, but does not itself prove prerequisite direction.

Sources:
- AI-assisted educational KG and online cycle rejection: https://jedm.educationaldatamining.org/index.php/JEDM/article/download/737/218
- Concept-first extraction improves LLM graph quality: https://link.springer.com/article/10.1007/s42979-024-03341-y
- Graph algorithms overview: https://web.eecs.utk.edu/~leparker/Courses/CS302-fall05/Notes/GraphIntro/

Decision: persist evidence snippets/provider/confidence, validate nodes, reject cycles with NetworkX, expose topological order.

## LLM extraction prompts

Structured schemas, one relevant example, low randomness, source-span evidence, and post-validation reduce hallucination. Extraction should be treated as constrained transformation, not creative generation. Uncertain prerequisite pairs should map to no edge.

Sources:
- Educational concept/prerequisite extraction: https://www.mdpi.com/2504-4990/7/3/103
- Prompt methods evaluation: https://journals.sagepub.com/doi/10.3233/SW-243719

Decision: require strict JSON, evidence quotes and confidence; reject entities/evidence absent from source. Deterministic fallback extracts only source-present headings/terms and labels method honestly.
