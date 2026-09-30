# PM&DC Licensing and House-Job Pathways

**Evidence cutoff:** 2026-09-30
**Scope:** MBBS/BDS practitioner registration in Pakistan; not individualized legal advice

## Topic

Local-graduate path from graduation to full registration.

### Source

PM&DC Act 2022, current Laws and Regulations index, Registration Regulations 2023, PM&DC FAQ, and March 2025 provisional-license notice. [MED-059, MED-064, MED-065, MED-066, MED-068]

### Key Finding

The reviewed local-graduate sequence is:

1. The university verifies successful completion and uploads graduation data.
2. The graduate applies for PM&DC provisional registration/license.
3. The graduate starts house job only with a valid provisional license or, under the cited institutional notice, confirmation of an application submitted through the PM&DC portal.
4. The graduate completes one year of assessed hands-on rotational training in an approved hospital/institution.
5. The graduate applies for full registration subject to PM&DC requirements.

The PM&DC Act and regulations define house job/foundation year/internship as post-provisional-registration training and make at least one year mandatory for converting provisional registration into full registration. Training completed before provisional registration is not accepted toward the requirement under the 2023 regulations. [MED-064–MED-066]

### Relevance to Learms

The pathway engine must block edges that skip provisional registration or treat graduation as an unrestricted license. Provide institution/upload troubleshooting without asking learners to disclose identity documents in chat.

### Citation

Government of Pakistan. *Pakistan Medical and Dental Council Act, 2022*, sections 36–37. MED-064.
Pakistan Medical and Dental Council. *Pakistan Registration of Medical and Dental Practitioners Regulations, 2023*, Part III. MED-066.
Pakistan Medical and Dental Council. *Notice to all Colleges, Universities, and Graduating Students Applying for Provisional License*. 21 March 2025. MED-068.

---

## Topic

MBBS and BDS house-job structure.

### Source

PM&DC Registration Regulations 2023 and 2024 house-job hospital accreditation standards. [MED-066, MED-067]

### Key Finding

The 2023 regulations specify the following one-year structures:

**MBBS**

| Module | Duration |
|---|---:|
| Internal medicine | 3 months |
| Medicine allied department | 3 months |
| General surgery | 3 months |
| Surgery allied department | 3 months |

Each medicine/allied or surgery/allied six-month block must be completed in a PM&DC-approved hospital, and experience shorter than three months in a module is not accepted. BLS certification is mandatory during house job for full registration. [MED-066]

**BDS**

| Module | Duration |
|---|---:|
| Prosthodontics and allied | 3 months |
| Operative dentistry and allied | 3 months |
| Orthodontics and allied | 3 months |
| Oral and maxillofacial surgery and allied | 3 months |

The 2024 hospital standards require documented sequence, hands-on active learning, supervision, assessment, logbooks, patient safety, infection control, communication, professionalism, and outcomes. They contain eight outcome categories and 49 skills. [MED-067]

### Relevance to Learms

A house-job portfolio should be competency- and rotation-based. It should not store identifiable patient notes, images, or case details by default.

### Citation

Pakistan Medical and Dental Council. *Pakistan Registration of Medical and Dental Practitioners Regulations, 2023*, regulations 13–16. MED-066.
Pakistan Medical and Dental Council. *Accreditation Standards for Teaching Hospitals for House Job 2024*. MED-067.

---

## Topic

Approved training site and stipend claims.

### Source

PM&DC regulations, FAQ, and dated stand-alone hospital list. [MED-059, MED-066, MED-069]

### Key Finding

House job must be performed in a PM&DC-recognized/approved training setting. PM&DC's 7 November 2025 document lists 59 stand-alone hospitals approved for house job/internship. This list is dated and separate from college-attached teaching hospitals. [MED-069]

The 2023 regulations say parent institutions must provide paid house jobs to their graduates; private-sector hospital remuneration is not to be less than the highest amount paid by any public-sector hospital in that province. PM&DC's current FAQ instead phrases the private minimum as no less than what is paid to house officers in public hospitals of the same province or territory. Exact current province-by-province stipend amounts were **not found** in a consolidated official dataset. [MED-059, MED-066]

### Relevance to Learms

Display approval source/date and stipend rule separately. Do not publish a numeric stipend without a current provincial or federal pay notification.

### Citation

Pakistan Medical and Dental Council. *Stand-Alone Hospitals Approved for the House Job/Internship*. Updated list dated 7 November 2025. MED-069.
Pakistan Medical and Dental Council. Registration Regulations 2023 and current FAQ. MED-059 and MED-066.

---

## Topic

Foreign-graduate path and NRE boundary.

### Source

PM&DC Act 2022, Registration Regulations 2023, and NRE standards. [MED-064, MED-066, MED-073–MED-075]

### Key Finding

For a Pakistani foreign graduate, recognized qualification/institution status, provisional registration, house job, and NRE are distinct checks. Section 18 of the Act makes NRE mandatory before full registration and says there is no attempt limit. The Act allows provisional registration after qualification verification so that house job can be undertaken, with NRE required before full registration. [MED-064]

The Registration Regulations contain a limited exemption wording for a recognized foreign undergraduate qualification plus specified recognized postgraduate qualification, valid foreign license, and good standing. This is a regulator decision, not an equivalence Learms should infer. Any user claiming exemption must verify it directly with PM&DC. [MED-066]

### Relevance to Learms

Do not use one `foreign_graduate` flag. Model institution recognition, degree verification, provisional registration, house job, NRE components, any formally granted exemption, and full registration separately.

### Citation

Government of Pakistan. PM&DC Act 2022, section 18. MED-064.
Pakistan Medical and Dental Council. Registration Regulations 2023, regulations 17 and 27. MED-066.

---

## Topic

Mutable registration fees and conflicting official values.

### Source

PM&DC Registration Regulations 2023 fee schedule and current FAQ. [MED-059, MED-066]

### Key Finding

The 2023 regulation schedule listed PKR 1,000 for local provisional registration and PKR 5,000 for good standing. The current FAQ accessed 2026-09-30 states PKR 3,000 for local provisional license and PKR 7,000 for good standing; both show PKR 10,000 for foreign-graduate provisional registration. [MED-059, MED-066]

The newer mutable FAQ conflicts with the older regulation schedule for two values. This research records the conflict but does not determine legal supersession from webpage recency alone. Applicants should verify the portal-generated amount at transaction time.

### Relevance to Learms

Fees require a versioned display with “verify at payment” and must never be hard-coded as timeless facts.

### Citation

Pakistan Medical and Dental Council. *Pakistan Registration of Medical and Dental Practitioners Regulations, 2023*, Part X. MED-066.
Pakistan Medical and Dental Council. *Frequently Asked Questions*. Accessed 2026-09-30. MED-059.

## Data-minimization note

PM&DC licensing involves CNIC/passport, graduation, and registration records. Learms should track checklist completion, document type, issuer, and verification status—not document images or identity numbers unless a separately justified secure workflow exists.
