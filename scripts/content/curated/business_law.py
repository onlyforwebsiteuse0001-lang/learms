"""Curated business, accountancy and law syllabi.

Sources: ACCA Applied Knowledge/Skills syllabus (Financial Accounting FA/F3);
ICMA Pakistan (ICMAP) Management Accounting syllabus; ICAP CAF Financial Accounting
and Reporting; HEC / Pakistan Bar Council five-year LLB scheme of studies.
"""

from __future__ import annotations

ACCA = ("ACCA Financial Accounting (FA/F3) syllabus and study guide", "https://www.accaglobal.com/", "2026-09-30")
ICMAP = ("ICMA Pakistan — Management Accounting syllabus", "https://www.icmap.com.pk/", "2026-09-30")
ICAP = ("ICAP Certificate in Accounting and Finance — Financial Accounting and Reporting", "https://www.icap.org.pk/", "2026-09-30")
LLB = ("HEC / Pakistan Bar Council five-year LLB scheme of studies", None, "2026-09-30")

COURSES = [
    {
        "id": "acca_financial_accounting",
        "field": "business_accounting",
        "category": "accounting_acca",
        "title": "ACCA FA — Financial Accounting",
        "title_ur": "اے سی سی اے مالیاتی اکاؤنٹنگ",
        "description": (
            "Double entry through to a set of published financial statements, including "
            "consolidation basics and interpretation."
        ),
        "level": "professional",
        "accreditation": "ACCA Applied Knowledge — Financial Accounting (FA/F3)",
        "source": ACCA,
        "outcomes": [
            "Record transactions using double-entry bookkeeping.",
            "Prepare a trial balance and correct errors found through it.",
            "Prepare a statement of profit or loss and a statement of financial position.",
            "Interpret financial statements using standard ratios.",
        ],
        "concepts": [
            ("accounting_framework", "The regulatory framework", "Purpose of financial reporting, IFRS, and the qualitative characteristics of useful information.", "understand", 1, 45, [], "mcq", ["IFRS", "relevance", "faithful representation"]),
            ("accounting_equation", "The accounting equation", "Assets = capital + liabilities, and why every transaction preserves it.", "understand", 1, 40, ["accounting_framework"], "numerical", ["assets", "liabilities", "capital"]),
            ("double_entry", "Double-entry bookkeeping", "Debits and credits, ledger accounts, and balancing off.", "apply", 2, 70, ["accounting_equation"], "numerical", ["debit", "credit", "ledger"]),
            ("books_of_prime_entry", "Books of prime entry and control accounts", "Day books, the cash book, and reconciling receivables/payables control accounts.", "apply", 2, 60, ["double_entry"], "numerical", ["day book", "control account"]),
            ("trial_balance", "Trial balance and error correction", "Errors the trial balance catches, errors it cannot, and the suspense account.", "analyze", 3, 55, ["double_entry"], "numerical", ["suspense", "compensating error"]),
            ("accruals", "Accruals and prepayments", "The accruals concept and matching expense to the period it belongs to.", "apply", 3, 50, ["trial_balance"], "numerical", ["accrual", "prepayment", "matching"]),
            ("depreciation", "Non-current assets and depreciation", "Capital vs revenue expenditure, straight-line and reducing balance, and disposal.", "apply", 3, 65, ["accruals"], "numerical", ["depreciation", "carrying amount", "disposal"]),
            ("inventory", "Inventory valuation", "Lower of cost and net realisable value; FIFO and AVCO.", "apply", 3, 50, ["accruals"], "numerical", ["FIFO", "AVCO", "NRV"]),
            ("receivables", "Receivables and irrecoverable debts", "Irrecoverable debts, allowances, and the effect on profit.", "apply", 3, 45, ["accruals"], "numerical", ["allowance", "irrecoverable"]),
            ("bank_rec", "Bank reconciliation", "Timing differences, unpresented cheques, and correcting the cash book.", "apply", 2, 45, ["books_of_prime_entry"], "numerical", ["reconciliation", "unpresented"]),
            ("financial_statements", "Preparing financial statements", "From adjusted trial balance to statement of profit or loss and financial position.", "apply", 4, 80, ["depreciation", "inventory", "receivables"], "numerical", ["SOFP", "SOPL", "statement of changes in equity"]),
            ("cash_flow", "Statement of cash flows", "Operating, investing and financing; the indirect method reconciliation.", "analyze", 4, 65, ["financial_statements"], "numerical", ["indirect method", "operating activities"]),
            ("consolidation", "Introduction to consolidation", "Control, goodwill on acquisition, and non-controlling interests.", "analyze", 5, 70, ["financial_statements"], "numerical", ["goodwill", "NCI", "control"]),
            ("interpretation", "Interpreting financial statements", "Profitability, liquidity, efficiency and gearing ratios, and their limitations.", "evaluate", 4, 55, ["financial_statements"], "case_study", ["ROCE", "current ratio", "gearing"]),
        ],
    },
    {
        "id": "cma_management_accounting",
        "field": "business_accounting",
        "category": "management_accounting_cma",
        "title": "CMA — Management Accounting",
        "title_ur": "مینجمنٹ اکاؤنٹنگ",
        "description": (
            "Accounting for decisions rather than for reporting: costing, budgeting, variance "
            "analysis and short-run decision making."
        ),
        "level": "professional",
        "accreditation": "ICMA Pakistan — Management Accounting",
        "source": ICMAP,
        "outcomes": [
            "Classify costs by behaviour, traceability and relevance.",
            "Apply absorption and marginal costing and reconcile the profit difference.",
            "Prepare a functional budget and compute standard cost variances.",
            "Make a short-run decision using only relevant costs.",
        ],
        "concepts": [
            ("cost_classification", "Cost classification", "Fixed/variable, direct/indirect, product/period, and relevant/irrelevant.", "understand", 1, 45, [], "mcq", ["fixed", "variable", "direct"]),
            ("cost_behaviour", "Cost behaviour and estimation", "High-low method, linear cost functions, and the relevant range.", "apply", 2, 50, ["cost_classification"], "numerical", ["high-low", "relevant range"]),
            ("material_labour", "Material and labour costing", "Valuing issues, labour efficiency, idle time and overtime treatment.", "apply", 2, 55, ["cost_classification"], "numerical", ["FIFO", "idle time", "efficiency"]),
            ("overhead_absorption", "Overhead allocation and absorption", "Allocation, apportionment, reapportionment, absorption rates, over/under absorption.", "apply", 3, 70, ["material_labour"], "numerical", ["OAR", "apportionment", "under-absorption"]),
            ("abc", "Activity-based costing", "Cost pools and drivers, and when ABC changes the answer versus traditional absorption.", "analyze", 4, 55, ["overhead_absorption"], "case_study", ["cost driver", "cost pool"]),
            ("marginal_absorption", "Marginal vs absorption costing", "Contribution, and reconciling the profit difference caused by inventory movement.", "analyze", 3, 60, ["overhead_absorption"], "numerical", ["contribution", "reconciliation"]),
            ("cvp", "Cost-volume-profit analysis", "Break-even, margin of safety, target profit and the multi-product weighted average.", "apply", 3, 60, ["marginal_absorption"], "numerical", ["break-even", "margin of safety", "C/S ratio"]),
            ("job_process", "Job, batch and process costing", "Choosing a system by production type; equivalent units, normal and abnormal loss.", "apply", 4, 70, ["overhead_absorption"], "numerical", ["equivalent units", "abnormal loss"]),
            ("budgeting", "Budgeting", "Functional budgets, the master budget, and fixed versus flexed comparison.", "apply", 3, 65, ["cost_behaviour"], "numerical", ["master budget", "flexed budget"]),
            ("standard_costing", "Standard costing and variances", "Material, labour, overhead and sales variances, and operating statement reconciliation.", "analyze", 4, 80, ["budgeting"], "numerical", ["variance", "operating statement"]),
            ("variance_investigation", "Variance interpretation", "Controllability, interdependence between variances, and when to investigate.", "evaluate", 4, 50, ["standard_costing"], "case_study", ["controllability", "interdependence"]),
            ("relevant_costing", "Relevant costing for decisions", "Make-or-buy, accept-or-reject, shutdown; sunk and opportunity costs.", "evaluate", 4, 60, ["cvp"], "case_study", ["sunk cost", "opportunity cost", "make or buy"]),
            ("limiting_factor", "Limiting factor analysis", "Contribution per unit of scarce resource and the linear programming extension.", "analyze", 4, 50, ["relevant_costing"], "numerical", ["scarce resource", "shadow price"]),
        ],
    },
    {
        "id": "ca_financial_reporting",
        "field": "business_accounting",
        "category": "chartered_accountancy_ca",
        "title": "CA — Financial Accounting & Reporting",
        "title_ur": "مالیاتی رپورٹنگ",
        "description": (
            "IFRS-based reporting at CAF level: the standards most frequently examined and "
            "most frequently applied in Pakistani practice."
        ),
        "level": "professional",
        "accreditation": "ICAP — Certificate in Accounting and Finance (CAF)",
        "source": ICAP,
        "outcomes": [
            "Apply the IASB Conceptual Framework to a recognition question.",
            "Account for property, plant and equipment including revaluation.",
            "Apply IFRS 15 and IFRS 16 to common transactions.",
            "Prepare a complete set of IAS 1 compliant financial statements.",
        ],
        "concepts": [
            ("conceptual_framework", "The IASB Conceptual Framework", "Objective of reporting, elements, recognition and measurement bases.", "understand", 2, 55, [], "short_answer", ["framework", "recognition", "measurement"]),
            ("ias1_presentation", "IAS 1 presentation", "Required statements, the current/non-current split and the going concern assumption.", "apply", 3, 60, ["conceptual_framework"], "numerical", ["IAS 1", "going concern"]),
            ("ias16_ppe", "IAS 16 property, plant and equipment", "Initial cost, subsequent expenditure, depreciation, the revaluation model and the surplus.", "apply", 4, 75, ["ias1_presentation"], "numerical", ["IAS 16", "revaluation surplus"]),
            ("ias38_intangibles", "IAS 38 intangible assets", "Recognition criteria, the research/development split and amortisation.", "apply", 4, 50, ["ias16_ppe"], "numerical", ["IAS 38", "development costs"]),
            ("ias36_impairment", "IAS 36 impairment", "Indicators, recoverable amount as higher of value in use and fair value less costs.", "analyze", 4, 55, ["ias16_ppe"], "numerical", ["IAS 36", "recoverable amount", "CGU"]),
            ("ias2_inventories", "IAS 2 inventories", "Cost formulas, net realisable value and the write-down entry.", "apply", 3, 45, ["ias1_presentation"], "numerical", ["IAS 2", "NRV"]),
            ("ifrs15_revenue", "IFRS 15 revenue", "The five-step model and identifying distinct performance obligations.", "analyze", 4, 70, ["conceptual_framework"], "case_study", ["IFRS 15", "performance obligation"]),
            ("ifrs16_leases", "IFRS 16 leases", "Right-of-use asset and lease liability measurement; lessee recognition exemptions.", "analyze", 5, 70, ["ias16_ppe"], "numerical", ["IFRS 16", "right-of-use", "lease liability"]),
            ("ias37_provisions", "IAS 37 provisions and contingencies", "Present obligation, probable outflow, reliable estimate; contingent assets and liabilities.", "analyze", 4, 50, ["conceptual_framework"], "case_study", ["IAS 37", "contingent liability"]),
            ("ias12_tax", "IAS 12 income taxes", "Current tax, temporary differences and deferred tax measurement.", "analyze", 5, 65, ["ias16_ppe"], "numerical", ["deferred tax", "temporary difference"]),
            ("ias7_cashflows", "IAS 7 statement of cash flows", "Classification and preparation using the indirect method.", "apply", 4, 60, ["ias1_presentation"], "numerical", ["IAS 7", "indirect method"]),
            ("ias8_policies", "IAS 8 policies, estimates and errors", "Retrospective restatement versus prospective application.", "analyze", 4, 45, ["ias1_presentation"], "case_study", ["IAS 8", "restatement"]),
            ("consolidated_statements", "Consolidated financial statements", "Goodwill, non-controlling interest, and eliminating intra-group transactions.", "analyze", 5, 80, ["ias1_presentation"], "numerical", ["consolidation", "goodwill", "intra-group"]),
        ],
    },
    {
        "id": "llb_constitutional_law",
        "field": "law",
        "category": "constitutional_law",
        "title": "LLB — Constitutional Law of Pakistan",
        "title_ur": "آئینی قانون",
        "description": (
            "The 1973 Constitution: how state power is allocated and limited, how fundamental "
            "rights are enforced, and how the courts have interpreted both."
        ),
        "level": "undergraduate",
        "accreditation": "HEC / Pakistan Bar Council — five-year LLB",
        "source": LLB,
        "outcomes": [
            "Explain the structure and salient features of the 1973 Constitution.",
            "Apply fundamental rights provisions to a factual scenario.",
            "Analyse the distribution of legislative power between Federation and Provinces.",
            "Evaluate the scope of judicial review and writ jurisdiction.",
        ],
        "concepts": [
            ("constitutionalism", "Constitutionalism and rule of law", "Limited government, supremacy of the constitution, and the rule of law as a constraint on power.", "understand", 2, 55, [], "essay", ["rule of law", "supremacy", "limited government"]),
            ("constitutional_history", "Constitutional history of Pakistan", "1935 Act, Objectives Resolution, the 1956 and 1962 constitutions, and the making of the 1973 Constitution.", "understand", 2, 60, ["constitutionalism"], "essay", ["Objectives Resolution", "1973"]),
            ("salient_features", "Salient features of the 1973 Constitution", "Federal parliamentary form, bicameralism, Islamic provisions and the amendment procedure.", "understand", 3, 55, ["constitutional_history"], "short_answer", ["federal", "parliamentary", "Article 239"]),
            ("fundamental_rights", "Fundamental rights", "Articles 8-28, permissible restrictions, and rights during an emergency.", "apply", 3, 75, ["salient_features"], "case_study", ["Article 8", "Article 25", "restriction"]),
            ("enforcement_rights", "Enforcement of fundamental rights", "Article 199 writs and Article 184(3) original jurisdiction of the Supreme Court.", "apply", 4, 60, ["fundamental_rights"], "case_study", ["Article 199", "Article 184(3)", "writ"]),
            ("principles_policy", "Principles of policy", "Articles 29-40 and why they are not judicially enforceable in the same way as rights.", "understand", 2, 40, ["fundamental_rights"], "short_answer", ["principles of policy", "non-justiciable"]),
            ("federalism", "Federalism and legislative lists", "Distribution of powers, the Federal Legislative List, and the 18th Amendment's effect.", "analyze", 4, 65, ["salient_features"], "case_study", ["18th Amendment", "legislative list", "CCI"]),
            ("parliament", "Parliament and legislative process", "Composition of the National Assembly and Senate; money bills and the passage of legislation.", "understand", 3, 55, ["salient_features"], "short_answer", ["money bill", "Senate", "joint sitting"]),
            ("executive", "The executive", "President, Prime Minister, Cabinet and the scope of executive authority.", "understand", 3, 50, ["parliament"], "short_answer", ["President", "Cabinet", "Article 90"]),
            ("judiciary", "The judiciary and independence", "Court structure, appointment of judges, security of tenure and separation of powers.", "analyze", 4, 60, ["executive"], "essay", ["independence", "appointment", "separation of powers"]),
            ("judicial_review", "Judicial review", "Grounds of review, the basic structure debate, and the limits of the political question.", "evaluate", 5, 65, ["judiciary", "enforcement_rights"], "essay", ["judicial review", "basic structure"]),
            ("emergency", "Emergency provisions", "Articles 232-237, suspension of rights and the constitutional limits on emergency power.", "analyze", 4, 50, ["fundamental_rights"], "case_study", ["Article 232", "emergency"]),
            ("islamic_provisions", "Islamic provisions", "Article 227, the Council of Islamic Ideology and the Federal Shariat Court's jurisdiction.", "understand", 3, 50, ["salient_features"], "essay", ["Article 227", "Federal Shariat Court"]),
        ],
    },
]
