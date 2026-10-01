# MBBS/BDS Fee Structures — PM&DC Rules and Versioned Caps

**Evidence cutoff:** 2026-09-30
**Currency:** Pakistani rupees (PKR) unless stated otherwise
**Warning:** Fee facts are session- and institution-sensitive. A cap is not the same as the student's complete payable cost.

## Topic

The March 2025 baseline private-college tuition decision.

### Source

Committee on Medical Education Reforms / PM&DC announcement dated 27 March 2025. [MED-056]

### Key Finding

The announcement set annual private MBBS/BDS tuition at **PKR 1,800,000**, with annual increases based on CPI, and allowed an institution to seek PM&DC approval for a justified fee up to **PKR 2,500,000**. It described the cap as applying for five years for MBBS and four years for BDS. This was an announcement of the baseline framework, not proof that every college's current payable tuition remained PKR 1.8 million after later institution-specific notifications.

### Relevance to Learms

Do not show “all private colleges cost PKR 1.8 million.” Show the announcement date, session, later notifications, and the institution-specific result where available.

### Citation

Committee on Medical Education Reforms / Pakistan Medical and Dental Council. *Tuition Fee Cap for Private Medical Colleges*. 27 March 2025. <https://pmdc.pk/Documents/press/Tuition%20Fee%20Cap%20for%20Private%20Medical%20Colleges.pdf>. Accessed 2026-09-30. MED-056.

---

## Topic

Institution-specific PM&DC cap notification dated 11 March 2026.

### Source

PM&DC Tuition Fee Notification No. PF.I-A(B&A)(Tuition Fee)-2026/60, dated 11 March 2026. [MED-057]

### Key Finding

PM&DC published 19 institution-name records with approved enhanced caps ranging from **PKR 1,720,000 to PKR 2,147,483** as written in that notification. The document also states:

- the approved enhancement applies from session 2024–25 and across all professional years;
- it is a one-time enhancement for the remaining duration of currently enrolled students;
- institutions granted enhancement cannot add a further 5% for session 2025–26;
- CPI adjustment from session 2026–27 onward is to be separately notified and subject to regulatory approval;
- excess amounts must be refunded or adjusted within one month;
- advertised or charged amounts above notified caps are unlawful under the stated terms;
- complaints may be lodged through PM&DC's complaint portal.

For deferred institutions and those that failed to apply or submit the required audited statements, the notification says the maximum inclusive tuition was **PKR 1,800,000 for session 2024–25** and **PKR 1,890,000 for session 2025–26**. Institution names and exact approved values are preserved in `PRIVATE_FEE_CAPS_2026.csv`.

### Relevance to Learms

The fee engine needs versioned rules and institution-name evidence. It must not apply the largest observed cap to every college or infer a separate medical/dental value when the notification uses one combined institution label.

### Citation

Pakistan Medical and Dental Council. *Tuition Fee-Notification*, No. PF.I-A(B&A)(Tuition Fee)-2026/60. 11 March 2026. <https://pmdc.pk/Documents/Others/tution%20fee%20notfication%2011-03-2026.pdf>. Accessed 2026-09-30. MED-057.

---

## Topic

Later institution-specific notification dated 4 August 2026.

### Source

PM&DC Tuition Fee Notification No. PF.I-A(B&A)(Tuition Fee)-2026/100, dated 4 August 2026. [MED-058]

### Key Finding

PM&DC approved 16 further institution-name records with caps ranging from **PKR 1,800,000 to PKR 2,160,000**. The notification makes the earlier 11 March 2026 terms and conditions applicable *mutatis mutandis*.

Al Aleem Medical College appears in both documents: PKR 1,720,000 in the March table and PKR 1,800,000 in the August table. The source register therefore retains both dated observations; as of the evidence cutoff, the later dated value is the newer official record. This is a concrete example of why fee values need effective/version dates rather than destructive overwrite.

### Relevance to Learms

A fee screen should display the latest matched notification and expose prior values in an audit trail. Institution-name matching must be reviewed, not automated through loose string similarity alone.

### Citation

Pakistan Medical and Dental Council. *Tuition Fee-Notification*, No. PF.I-A(B&A)(Tuition Fee)-2026/100. 4 August 2026. <https://pmdc.pk/Documents/Others/Tuition%20Fee%20notification%2004-08-2026.pdf>. Accessed 2026-09-30. MED-058.

---

## Topic

General admission and payment rules.

### Source

PM&DC 2025 admissions regulations and current FAQs. [MED-002, MED-059]

### Key Finding

For private-college applications, the 2025 regulations cap the application fee at **PKR 2,000** and require the prospectus to be placed online without a prospectus charge. PM&DC's FAQ states that colleges must prescribe tuition for the whole program, divided annually, and may not increase an enrolled student's tuition while the student remains in the program. The FAQ also describes payment options and discounts of **2% for six-monthly payment** and **4% for annual payment**.

The regulations specify an overseas-category annual tuition ceiling of **USD 15,000**, with up to **USD 20,000** if justified by the institution and approved by PM&DC; the regulation contains category-specific conditions and exceptions. These foreign-currency limits must not be applied to open-merit domestic seats.

### Relevance to Learms

A total-cost view must distinguish application fee, annual tuition, student-registration fee, hostel, transport, security/deposit, examination, and other charges. **A consolidated official national table of every non-tuition charge was not found.**

### Citation

Pakistan Medical and Dental Council. *Medical and Dental Undergraduate Education (Admissions, Curriculum and Conduct) Policy and Regulations 2025*, regulations 4–5. MED-002.
Pakistan Medical and Dental Council. *Frequently Asked Questions*. Accessed 2026-09-30. <https://pmdc.pk/Home/FAQs>. MED-059.

---

## Topic

Safe fee estimate and display model.

### Source

PM&DC fee notifications, admissions regulations, and FAQ. [MED-002, MED-056–MED-059]

### Key Finding

For an exact college and session, Learms should show:

| Field | Rule |
|---|---|
| Institution/program | Match exact regulator/notification wording; do not infer a dental cap from medical naming or vice versa |
| Admission session | Required |
| Tuition cap | Latest applicable PM&DC notification, with issue date and source |
| College-published tuition | Show separately; flag when above known cap rather than silently accepting it |
| Other charges | Itemize only from a current official college schedule; otherwise `not found` |
| Payment cadence/discount | Show PM&DC rule and institution implementation separately |
| Refund/adjustment | Quote applicable rule and session; do not promise an outcome |
| Total program estimate | Calculate only when all included years and charges are explicit; label assumptions |
| Complaint route | PM&DC official complaint portal; do not provide individualized legal advice |

### Relevance to Learms

This avoids the common error of multiplying one year's tuition by five while ignoring frozen-fee rules, dated enhancements, one-time charges, refunds, and missing non-tuition costs.

### Citation

PM&DC source set MED-002 and MED-056–MED-059, reviewed 2026-09-30.

## Unresolved fee gaps

- A separately notified CPI adjustment for session 2026–27 was referenced in the March 2026 document, but an exact nationwide adjustment document was **not found** in this checkpoint.
- Complete current college-published schedules for tuition plus every ancillary charge were **not collected**.
- The notifications use institution names that sometimes combine medical and dental identity; program-level allocation should remain unresolved unless the document is explicit.
- Scholarship, financial-aid, hostel, transport, and refund implementation are institution-specific and remain **not found** in a consolidated official national dataset.
