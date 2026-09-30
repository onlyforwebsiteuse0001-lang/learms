"""Curated health and medicine syllabi.

Sources: PM&DC (formerly PMDC) MBBS curriculum structure — integrated modular
undergraduate medical education; Pakistan Nursing & Midwifery Council Generic BSN
four-year programme; Pharmacy Council of Pakistan / HEC Pharm-D five-year programme.
These are foundation-year outlines, not clinical practice guidance.
"""

from __future__ import annotations

PMDC = (
    "PM&DC undergraduate MBBS curriculum framework (integrated modular)",
    None,
    "2026-09-30",
)
PNC = (
    "Pakistan Nursing & Midwifery Council, Generic BSN (4-year) curriculum",
    None,
    "2026-09-30",
)
PCP = (
    "Pharmacy Council of Pakistan / HEC Pharm-D (5-year) curriculum",
    None,
    "2026-09-30",
)

COURSES = [
    {
        "id": "mbbs_foundation",
        "field": "health_medicine",
        "category": "mbbs_medicine",
        "title": "MBBS Foundation: Anatomy, Physiology & Biochemistry",
        "title_ur": "ایم بی بی ایس بنیادی علوم",
        "description": (
            "The first-year integrated basic sciences block. Normal structure and normal "
            "function first, because every pathology later is described as a deviation from it."
        ),
        "level": "professional",
        "estimated_hours_override": None,
        "accreditation": "PM&DC — MBBS Year 1 (integrated modular)",
        "source": PMDC,
        "outcomes": [
            "Describe gross and microscopic structure of the major organ systems.",
            "Explain homeostatic control of the cardiovascular, respiratory and renal systems.",
            "Relate biochemical pathways to their clinical consequences when disrupted.",
            "Interpret basic normal values and recognise clinically significant deviation.",
        ],
        "concepts": [
            ("cell_biology", "Cell structure and transport", "Membranes, organelles, diffusion, osmosis and active transport as the basis of all physiology.", "understand", 1, 60, [], "mcq", ["membrane", "osmosis", "ATPase"]),
            ("tissues", "General histology", "The four basic tissue types and how structure follows function in each.", "understand", 2, 55, ["cell_biology"], "mcq", ["epithelium", "connective", "muscle", "nervous"]),
            ("musculoskeletal", "Musculoskeletal anatomy", "Bones, joints and muscle groups of the limbs; attachments, actions and innervation.", "apply", 3, 90, ["tissues"], "practical", ["origin", "insertion", "innervation"]),
            ("cardio_anatomy", "Cardiovascular anatomy", "Chambers, valves, coronary circulation and the conducting system.", "understand", 3, 70, ["tissues"], "mcq", ["atrium", "ventricle", "coronary"]),
            ("cardio_physiology", "Cardiovascular physiology", "Cardiac cycle, output, blood pressure regulation and the baroreceptor reflex.", "analyze", 4, 80, ["cardio_anatomy"], "numerical", ["cardiac output", "preload", "baroreceptor"]),
            ("respiratory", "Respiratory structure and function", "Airways, mechanics of ventilation, gas exchange and the oxygen dissociation curve.", "analyze", 4, 75, ["cardio_physiology"], "numerical", ["ventilation", "V/Q", "dissociation curve"]),
            ("renal", "Renal physiology", "Nephron function, GFR, tubular handling and acid-base balance.", "analyze", 4, 80, ["cardio_physiology"], "numerical", ["GFR", "nephron", "acid-base"]),
            ("gi_system", "Gastrointestinal system", "Motility, secretion, digestion and absorption along the tract.", "understand", 3, 65, ["tissues"], "mcq", ["peristalsis", "absorption", "bile"]),
            ("neuro", "Neuroanatomy and neurophysiology", "CNS organisation, ascending and descending tracts, the reflex arc, action potential.", "analyze", 5, 90, ["cell_biology", "tissues"], "short_answer", ["action potential", "tract", "reflex arc"]),
            ("endocrine", "Endocrine regulation", "Hormone classes, receptor mechanisms and negative feedback axes.", "understand", 3, 60, ["cell_biology"], "mcq", ["hormone", "feedback", "receptor"]),
            ("carbohydrate_metab", "Carbohydrate metabolism", "Glycolysis, TCA cycle, oxidative phosphorylation and regulation of blood glucose.", "analyze", 4, 75, ["cell_biology"], "numerical", ["glycolysis", "TCA", "insulin"]),
            ("protein_lipid_metab", "Protein and lipid metabolism", "Amino acid handling, the urea cycle, beta-oxidation and lipoprotein transport.", "analyze", 4, 70, ["carbohydrate_metab"], "short_answer", ["urea cycle", "beta-oxidation", "LDL"]),
            ("molecular_genetics", "Molecular biology and genetics", "DNA replication, transcription, translation and the basis of inherited disease.", "understand", 4, 65, ["cell_biology"], "mcq", ["replication", "transcription", "mutation"]),
            ("immunology", "Basic immunology", "Innate and adaptive immunity, antigen presentation, and hypersensitivity classes.", "understand", 4, 65, ["tissues"], "mcq", ["antibody", "T cell", "hypersensitivity"]),
            ("clinical_correlation", "Clinical correlation and normal values", "Reading common investigations and recognising clinically significant deviation.", "evaluate", 4, 55, ["renal", "cardio_physiology", "carbohydrate_metab"], "case_study", ["reference range", "interpretation"]),
        ],
    },
    {
        "id": "nursing_fundamentals",
        "field": "health_medicine",
        "category": "nursing",
        "title": "Fundamentals of Nursing",
        "title_ur": "نرسنگ کے بنیادی اصول",
        "description": (
            "The Generic BSN first-year core: the nursing process, patient safety, and the "
            "clinical skills every subsequent rotation assumes."
        ),
        "level": "professional",
        "accreditation": "Pakistan Nursing & Midwifery Council — Generic BSN Year 1",
        "source": PNC,
        "outcomes": [
            "Apply the five-step nursing process to a patient scenario.",
            "Perform and document vital sign assessment accurately.",
            "Apply infection prevention and control precautions correctly.",
            "Calculate and verify medication doses safely.",
        ],
        "concepts": [
            ("nursing_process", "The nursing process", "Assessment, diagnosis, planning, implementation, evaluation as one continuous loop.", "apply", 2, 60, [], "case_study", ["ADPIE", "care plan"]),
            ("communication", "Therapeutic communication", "Active listening, open questions, and communicating across a language or literacy gap.", "apply", 2, 45, ["nursing_process"], "practical", ["active listening", "empathy"]),
            ("vitals", "Vital signs assessment", "Temperature, pulse, respiration, blood pressure and SpO2: technique, normal ranges, and what a trend means.", "apply", 2, 60, ["nursing_process"], "practical", ["blood pressure", "SpO2", "pulse"]),
            ("physical_assessment", "Head-to-toe physical assessment", "Systematic inspection, palpation, percussion and auscultation.", "apply", 3, 75, ["vitals"], "practical", ["auscultation", "palpation"]),
            ("infection_control", "Infection prevention and control", "Chain of infection, hand hygiene moments, PPE sequence, and standard vs transmission-based precautions.", "apply", 2, 55, [], "practical", ["hand hygiene", "PPE", "asepsis"]),
            ("safety", "Patient safety and fall prevention", "Risk assessment, identification checks, and the safe patient environment.", "apply", 2, 45, ["infection_control"], "case_study", ["fall risk", "identification"]),
            ("hygiene_mobility", "Hygiene, positioning and mobility", "Bed bath, pressure area care, safe transfers and pressure ulcer prevention.", "apply", 2, 55, ["safety"], "practical", ["pressure ulcer", "transfer", "positioning"]),
            ("nutrition", "Nutrition and fluid balance", "Dietary assessment, intake/output charting and recognising dehydration.", "apply", 3, 50, ["vitals"], "numerical", ["intake output", "dehydration"]),
            ("medication_admin", "Medication administration", "The rights of administration, routes, and independent double-checking of high-risk drugs.", "apply", 3, 60, ["safety"], "practical", ["rights", "route", "double-check"]),
            ("dose_calculation", "Dosage calculation", "Unit conversion, desired-over-have, IV flow rates and paediatric weight-based dosing.", "apply", 3, 60, ["medication_admin"], "numerical", ["mg/kg", "drip rate", "conversion"]),
            ("wound_care", "Wound care and dressing", "Wound assessment, healing stages and aseptic dressing technique.", "apply", 3, 50, ["infection_control"], "practical", ["debridement", "aseptic", "healing"]),
            ("documentation", "Documentation and handover", "Legal record-keeping, objective charting and structured handover (SBAR).", "apply", 2, 45, ["nursing_process"], "case_study", ["SBAR", "charting", "legal record"]),
            ("ethics_nursing", "Ethics and professional conduct", "Consent, confidentiality, patient autonomy and scope of practice.", "evaluate", 3, 45, ["documentation"], "essay", ["consent", "confidentiality", "autonomy"]),
        ],
    },
    {
        "id": "pharmacy_pharmaceutics",
        "field": "health_medicine",
        "category": "pharmacy",
        "title": "Pharmaceutics & Pharmacology Foundations",
        "title_ur": "فارماسیوٹکس و فارماکولوجی",
        "description": (
            "How a drug is formulated, how it moves through the body, and how it produces an "
            "effect — the Pharm-D core that dispensing and clinical practice rest on."
        ),
        "level": "professional",
        "accreditation": "Pharmacy Council of Pakistan / HEC — Pharm-D core",
        "source": PCP,
        "outcomes": [
            "Select a dosage form appropriate to a drug's properties and route.",
            "Apply pharmacokinetic principles to explain a dosing regimen.",
            "Predict drug action from receptor and dose-response relationships.",
            "Identify clinically significant drug interactions.",
        ],
        "concepts": [
            ("dosage_forms", "Dosage forms and routes", "Solids, liquids, semi-solids and parenterals; matching form to route and to patient.", "understand", 2, 55, [], "mcq", ["tablet", "parenteral", "suspension"]),
            ("pharmaceutical_calc", "Pharmaceutical calculations", "Percentage strength, dilution, alligation, isotonicity and millimoles.", "apply", 3, 65, ["dosage_forms"], "numerical", ["alligation", "w/v", "isotonic"]),
            ("physical_pharmacy", "Physical pharmacy", "Solubility, partition coefficient, dissolution, stability and shelf life.", "analyze", 3, 60, ["dosage_forms"], "numerical", ["solubility", "logP", "dissolution"]),
            ("formulation", "Formulation and excipients", "Why excipients exist and how they change release and bioavailability.", "apply", 3, 55, ["physical_pharmacy"], "case_study", ["excipient", "bioavailability", "release"]),
            ("absorption", "Absorption and bioavailability", "Membrane crossing, first-pass metabolism, and bioavailability differences between routes.", "analyze", 3, 55, ["formulation"], "numerical", ["first-pass", "F", "absorption"]),
            ("distribution", "Distribution and protein binding", "Volume of distribution, protein binding and barrier penetration.", "analyze", 4, 50, ["absorption"], "numerical", ["Vd", "protein binding", "BBB"]),
            ("metabolism_excretion", "Metabolism and excretion", "Phase I/II reactions, cytochrome P450, renal and biliary clearance.", "analyze", 4, 60, ["distribution"], "short_answer", ["CYP450", "clearance", "conjugation"]),
            ("kinetics", "Pharmacokinetic modelling", "Half-life, steady state, loading and maintenance dose; zero vs first-order kinetics.", "analyze", 4, 70, ["metabolism_excretion"], "numerical", ["half-life", "steady state", "loading dose"]),
            ("receptors", "Receptor pharmacology", "Agonists, antagonists, partial agonism, affinity and efficacy.", "understand", 3, 55, [], "mcq", ["agonist", "antagonist", "affinity"]),
            ("dose_response", "Dose-response relationships", "EC50, therapeutic index, and the practical meaning of a narrow window.", "analyze", 4, 50, ["receptors"], "numerical", ["EC50", "therapeutic index"]),
            ("autonomic_drugs", "Autonomic pharmacology", "Cholinergic and adrenergic agents and their predictable side-effect profiles.", "apply", 4, 60, ["dose_response"], "case_study", ["adrenergic", "cholinergic"]),
            ("antimicrobials", "Antimicrobial chemotherapy", "Mechanisms, spectrum, resistance and the principles of stewardship.", "apply", 4, 60, ["dose_response"], "case_study", ["resistance", "spectrum", "stewardship"]),
            ("interactions", "Drug interactions and adverse reactions", "Pharmacokinetic vs pharmacodynamic interactions; ADR classification and reporting.", "evaluate", 4, 55, ["kinetics", "autonomic_drugs"], "case_study", ["interaction", "ADR", "pharmacovigilance"]),
        ],
    },
]
