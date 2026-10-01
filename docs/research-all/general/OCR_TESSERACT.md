# OCR — Engine Selection for Learms

**Agent 4 — Area 10.1** · Last updated 2026-09-30
**Primary consumer: Agent 1 (ingestion pipeline).**

Covers the Tesseract-vs-VLM decision for the two distinct OCR jobs Learms has. `OCR_PDF_LIBRARIES.md`
and `OCR_GEMINI_VISION.md` are not yet written; the routing conclusion here supersedes their scope.

---

## 0. Recommendation up front

**Learms has two OCR problems, and they need two different engines.**

| Job | Input | Engine | Why |
|---|---|---|---|
| **A — Content ingestion** | Printed past papers, textbook pages, HEC curriculum PDFs | **Tesseract 5 with preprocessing** (batch), VLM fallback on low-confidence pages | >95% on clean printed text, 50–200 ms/page, free, deterministic, runs locally |
| **B — Student work capture** | Photographed handwritten working, homework, answer sheets | **A frontier VLM (Gemini/GPT/Claude)** | **Tesseract is 20–40% accurate on handwriting. It is unusable.** |

Getting this backwards in either direction is expensive: a VLM on 50,000 printed pages is a wasted
budget; Tesseract on handwriting produces garbage.

---

## 1. Printed text — Tesseract is still correct

### Source: Parsli LLM-OCR-vs-Traditional-OCR benchmark (2026, citing Koncile); *Natural Language Processing Journal* (2025), "A comparison study on OCR models in mathematical equations and in any language"; Eklavvya OCR comparison (2026)
### Key Finding **[MED — vendor and industry benchmarks, mutually consistent; no single peer-reviewed head-to-head]**

| Dimension | **Tesseract 5** | **LLM OCR (Gemini 2.5 Pro)** |
|---|---|---|
| Clean printed text | **>95%** | 96–98% |
| Scanned / degraded | 80–85% **with preprocessing** | **94%** |
| Handwriting | **near-zero on cursive** | **93%** |
| **Latency per page** | **50–200 ms (local)** | **5–30 s (API)** |
| Output | Raw text + **bounding boxes** | **Structured JSON in your schema** |
| Determinism | **Deterministic** | Probabilistic |
| Cost | **Free / self-hosted** | Per-token API |

On clean printed input the accuracy gap is **1–3 points** while the speed gap is **~100×** and the
cost gap is effectively infinite. **For Learms' bulk ingestion of printed Pakistani past papers and
HEC PDFs, Tesseract is the right default.**

⚠ **But the gap widens fast as quality degrades** (95% → 80–85% for Tesseract vs 96–98% → 94% for
a VLM). Pakistani past papers are frequently poor-quality photocopies and scans.
→ **Decision O1: run Tesseract first, score confidence per page, and route low-confidence pages to
a VLM.** "Most production pipelines in 2026 run both."

Independent corroboration of Tesseract's weakness on messy real-world input: one head-to-head on
a difficult corpus found **Tesseract WER 0.69 / CER 0.43 vs Gemini WER 0.04 / CER 0.02.** That is
not a small difference — it is the difference between usable and unusable. **Confidence-based
routing is therefore not an optimisation; it is required.**

### Citation
- https://parsli.co/blog/llm-ocr-vs-traditional-ocr
- https://dev.to/unbrokencocoon/comparing-llms-and-python-ocr-packages-opportunities-and-challenges-in-ocr-accuracy-3ppa
- https://www.sciencedirect.com/science/article/pii/S2666720725000189

---

## 2. Handwriting — Tesseract is disqualified

### Source: Eklavvya (2026), OCR for answer-sheet evaluation; Codesota handwriting OCR rankings (2026); arXiv 2503.15195 (March 2025)
### Key Finding **[HIGH — the numbers are extreme and consistent across sources]**

**Accuracy by handwriting style:**

| Style | Google Vision | EasyOCR | **Tesseract** |
|---|---|---|---|
| Clear printed style | 95% | 80% | 70% |
| Mixed print & cursive | 90% | 70% | **40%** |
| Full cursive | 85% | 60% | **25%** |
| Poor / challenging | 80% | 55% | **20%** |
| **Average** | **87.5%** | 66.25% | **38.75%** |

> "**Tesseract's 38.75% average accuracy on handwriting makes it unsuitable for answer sheet
> evaluation. You'd spend more time correcting errors than manual grading.**"

**Character Error Rate rankings (2026):**

| Model | CER | WER | Cost/1K pages |
|---|---|---|---|
| GPT-5 | **~1.22%** | — | — |
| Claude Opus 4.7 | ~1.31% | — | — |
| **Gemini 3** | **~1.44%** | ~3.1% | **~$8** |
| Qwen2.5-VL | 2.89% | — | — |
| DTrOCR (best specialised HTR) | 2.38% | — | — |
| TrOCR-Large | 2.95% | — | — |
| PaddleOCR | 5.8% | — | — |
| **Tesseract 5** | **12.5%** | **~35%** | $0 |

Frontier vision-language models now beat *specialised* handwriting-recognition models. GPT-4o's
1.69% CER on IAM (arXiv 2503.15195, March 2025) "marked the moment VLMs dethroned specialized HTR
models — the gap has only widened since."

**Cost note:** at **~$8 per 1,000 pages**, a VLM on student handwriting is affordable *if* it is
triggered by the student (a photo of their working), not run in bulk. Google Cloud Vision at
**$1.50/1,000 pages** with 87.5% handwriting average is the cheaper middle option.

### Relevance to Learms — **decision O2: never run Tesseract on student handwriting**
Photographed handwritten working is a genuinely valuable Learms feature — it is how a Pakistani
student actually does a maths or physics problem, and it is the input a step-level tutor
(`SOCRATIC_DEEP.md` SO2) most wants. But it **must** go to a VLM. Using the free engine here
produces a product that misreads two out of five characters and blames the student.

### Citation
- https://www.eklavvya.com/blog/best-ocr-answersheet-evaluation/
- https://www.codesota.com/ocr/best-for-handwriting

---

## 3. Maths equations — the weakest evidence, and it matters most

### Key Finding **[LOW–MED — thin evidence]**
A 2025 comparison study of OCR models on mathematical equations reports Tesseract at
**accuracy 0.6666–0.6868, precision ~0.685, recall ~0.693, F1 ~0.686, 7 s** per item — i.e.
**roughly a third of maths content misread**. The same study rates Tesseract and i2OCR best on
*speed*, and PaddleOCR best on *prediction*, while noting Google Document AI / AWS Textract give
the best accuracy overall.

⚠ **This is a serious problem for Learms.** MDCAT, engineering, and FSc physics/chemistry content
is equation-dense. A ~68% accuracy on equations means ingested content will be silently wrong.

→ **Decision O3: treat mathematical content as a distinct pipeline with mandatory human review.**
Do not trust any OCR engine on equations. Options to evaluate (none researched here):
specialised maths OCR (Mathpix, pix2tex/LaTeX-OCR), VLM-to-LaTeX prompting with verification, or
authoring equations natively rather than extracting them.
**For a product whose credibility rests on correct content, silently wrong formulae are the worst
possible failure mode.**

---

## 4. ⚠ Urdu / Nastaliq — no evidence found

**NOT FOUND.** Despite a targeted search, **no benchmark of Tesseract or any VLM on Urdu Nastaliq
script was located.** This is a significant gap, because:
- Nastaliq is cursive, highly context-dependent, and **structurally the hardest major script for
  OCR**. Tesseract's Urdu support exists but its quality is unquantified here.
- The bilingual thesis (`PROBLEMS_BUSINESS.md` B5) assumes Learms can work with Urdu content.
- Much Pakistani educational material — especially Urdu-medium board papers and Islamiat/Urdu
  textbooks — exists only as scans.

**Logged as a P0 gap alongside G23 (no data on LLM Urdu *generation* capability). Both must be
tested empirically before the bilingual roadmap is committed.**

---

## 5. Pipeline recommendation

```
┌─ Job A: bulk printed ingestion (past papers, HEC PDFs, textbooks)
│    1. Native PDF text layer?  → extract directly, skip OCR entirely
│    2. Preprocess (deskew, denoise, binarise, upscale)
│    3. Tesseract 5  →  per-page confidence score
│    4. confidence < threshold  →  route page to VLM  (Batch API, see APIS_COMPARISON.md AP5)
│    5. equations present       →  MANDATORY human review queue  (O3)
│    6. Urdu/Nastaliq present   →  UNVALIDATED — human review until benchmarked  (§4)
│
└─ Job B: student-submitted handwriting (photo of working)
     1. VLM directly. Never Tesseract.  (O2)
     2. Ask for structured JSON in Learms' schema, not raw text
     3. Show the student what was read, and let them correct it before grading
```

**Decision O4 — always surface and allow correction of what was read.** Handwriting OCR is 85–95%
at best. Grading a student on a misread character is a trust-destroying failure, and the fix is
trivial: show the transcription, let them edit it. This also generates labelled correction data.

**Decision O5 — check for a native PDF text layer first.** HEC curriculum PDFs and many official
documents are digitally generated. Running OCR on a text-layer PDF is pure waste and *loses*
accuracy.

---

## 6. Actionable summary

| # | Decision | Detail | Owner |
|---|---|---|---|
| **O1** | **Tesseract first + confidence-based VLM fallback** | 1–3 pt accuracy gap on clean print, ~100× speed gap, zero cost. Gap explodes on degraded scans (WER 0.69 vs 0.04). | **Agent 1** |
| **O2** | **Never Tesseract on handwriting** | 38.75% average; 12.5% CER vs ~1.44% for Gemini 3. Unusable. | **Agent 1** |
| **O3** | **Equations = separate pipeline + mandatory human review** | Tesseract ~68% accuracy on maths. Silently wrong formulae are the worst failure mode for a learning product. | **Agent 1 + 2** |
| **O4** | **Always show and allow correction of the transcription** | 85–95% is the ceiling; never grade a student on a misread | **Agent 2** |
| **O5** | **Check for a native PDF text layer before OCR** | Many HEC/official PDFs are digital; OCR would be pure loss | Agent 1 |
| O6 | **Batch API for all bulk OCR** | ~50% saving; ingestion is not interactive | Agent 1 |
| O7 | Request **structured JSON**, not raw text, from the VLM | It is the VLM's main advantage over Tesseract | Agent 1 |
| **O8** | **Benchmark Urdu/Nastaliq before committing to the bilingual roadmap** | **No evidence exists.** Nastaliq is the hardest major script for OCR. | **Agent 4 / Agent 1** |

## Gaps / Not found
- **Urdu / Nastaliq OCR accuracy — no benchmark found for any engine. P0.**
- No evidence on **Pakistani past-paper scan quality** specifically, which determines how often the
  VLM fallback fires and therefore the real cost.
- **Mathematical OCR is thinly evidenced** (one 2025 study). Mathpix / pix2tex / LaTeX-OCR were
  **not researched**.
- Most sources here are **vendor or industry benchmarks**, not peer-reviewed; several have a
  commercial interest in the conclusion. Labelled `[MED]`. The handwriting numbers are consistent
  across three independent sources, so confidence there is higher.
- Tesseract 5's LSTM-based accuracy on *modern* preprocessing pipelines may be understated by
  sources marketing paid alternatives.
- Layout analysis / table extraction for structured past papers: **not researched.**

---

## Sources

| Type | Source | URL |
|---|---|---|
| Industry benchmark | Parsli (2026) — LLM OCR vs traditional OCR, Tesseract-vs-Gemini table | https://parsli.co/blog/llm-ocr-vs-traditional-ocr |
| Practitioner benchmark | DEV Community — Tesseract WER 0.69/CER 0.43 vs Gemini 0.04/0.02 | https://dev.to/unbrokencocoon/comparing-llms-and-python-ocr-packages-opportunities-and-challenges-in-ocr-accuracy-3ppa |
| Peer-reviewed | *Natural Language Processing Journal* (2025) — OCR on mathematical equations and multiple languages | https://www.sciencedirect.com/science/article/pii/S2666720725000189 |
| Industry benchmark | Eklavvya (2026) — answer-sheet OCR, handwriting accuracy by style, cost per page | https://www.eklavvya.com/blog/best-ocr-answersheet-evaluation/ |
| Industry benchmark | Codesota (2026) — handwriting CER rankings, VLMs vs specialised HTR | https://www.codesota.com/ocr/best-for-handwriting |
| Peer-reviewed (cited) | arXiv 2503.15195 (Mar 2025) — GPT-4o 1.69% CER on IAM | https://arxiv.org/abs/2503.15195 |
