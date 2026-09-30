"""Curated computing syllabi.

Source: HEC & NCEAC, *Curriculum of Computing Disciplines (Revised 2023)*,
Ref. No. 5-4/HEC/CURR/COMP/2023/4394, 16 Feb 2023 — Computing Core / Domain Core /
Domain Elective structure, with course-level topic lists cross-checked against the
PUCIT BS CS 2024 and UET Narowal BSCS 2023/24 implementations of the same curriculum.
Credit hours use the HEC `total (theory-lab)` convention.
"""

from __future__ import annotations

HEC_COMPUTING = (
    "HEC & NCEAC, Curriculum of Computing Disciplines (Revised 2023)",
    "https://nceac.org.pk/Documents/Curriculums/BS%20Curriculm%20Computing%20Disciplines-2023.pdf",
    "2026-09-30",
)

COURSES = [
    {
        "id": "programming_fundamentals",
        "field": "it_computing",
        "category": "computer_science",
        "title": "Programming Fundamentals (Python)",
        "title_ur": "پروگرامنگ کے بنیادی اصول",
        "description": (
            "The Computing Core entry course. Problem decomposition, control flow, data "
            "structures built into the language, and writing programs that are correct "
            "before they are clever."
        ),
        "level": "undergraduate",
        "credit_hours": (4, 3, 1),
        "accreditation": "HEC/NCEAC Computing Core (CS1xx)",
        "source": HEC_COMPUTING,
        "outcomes": [
            "Translate a stated problem into an algorithm before writing any code.",
            "Implement programs using selection, iteration and functions.",
            "Choose an appropriate built-in data structure for a given task.",
            "Trace and debug a program's execution without a debugger.",
        ],
        "concepts": [
            ("values_types", "Values, variables and data types", "Integers, floats, strings and booleans; assignment as binding a name to a value, not a memory cell.", "understand", 1, 45, [], "mcq", ["int", "float", "str", "bool", "assignment"]),
            ("operators", "Arithmetic, comparison and logical operators", "Operator precedence, integer vs float division, short-circuit evaluation of and/or.", "apply", 1, 40, ["values_types"], "mcq", ["precedence", "short-circuit", "modulo"]),
            ("io_basics", "Input and output", "Reading input, converting types, formatting output for humans.", "apply", 1, 30, ["values_types"], "practical", ["input", "print", "f-string"]),
            ("conditionals", "Conditional statements", "if/elif/else, nesting, and why a chain of conditions is often a lookup table in disguise.", "apply", 2, 50, ["operators"], "mcq", ["if", "elif", "branching"]),
            ("loops", "Repetition and loop control", "for vs while, loop invariants, break and continue, and off-by-one errors.", "apply", 2, 60, ["conditionals"], "practical", ["for", "while", "break", "invariant"]),
            ("lists", "Lists and indexing", "Ordered mutable sequences, slicing, and how list memory organisation affects cost.", "apply", 2, 55, ["loops"], "practical", ["list", "slice", "index", "mutable"]),
            ("nested_lists", "Multi-dimensional lists", "Lists of lists, row/column traversal, and the aliasing trap when copying them.", "apply", 3, 45, ["lists"], "practical", ["matrix", "nested", "aliasing"]),
            ("strings", "Strings and string operations", "Immutability, slicing, common methods, and why concatenation in a loop is quadratic.", "apply", 2, 45, ["lists"], "practical", ["immutable", "split", "join"]),
            ("functions", "Functions and modular programming", "Definition, arguments, return values, scope, and designing a function with one job.", "apply", 2, 60, ["loops"], "practical", ["parameter", "return", "scope"]),
            ("call_stack", "The call stack", "How calls nest, what a stack frame holds, and what recursion costs.", "understand", 3, 45, ["functions"], "short_answer", ["stack frame", "recursion", "unwinding"]),
            ("dicts_sets", "Dictionaries and sets", "Key-value mapping, hashing intuition, and choosing a dict over a list of pairs.", "apply", 3, 50, ["lists"], "practical", ["dict", "set", "hash", "key"]),
            ("file_io", "File input and output", "Reading and writing text files, context managers, and handling missing files.", "apply", 2, 40, ["strings"], "practical", ["open", "with", "read", "write"]),
            ("errors", "Errors and exception handling", "Syntax vs runtime vs logic errors; try/except that catches what you can actually handle.", "analyze", 3, 45, ["functions"], "short_answer", ["exception", "traceback", "try"]),
            ("debugging", "Systematic debugging", "Reproduce, isolate, hypothesise, test. Reading a traceback from the bottom up.", "analyze", 3, 50, ["errors", "call_stack"], "practical", ["traceback", "bisect", "print debugging"]),
        ],
    },
    {
        "id": "web_development",
        "field": "it_computing",
        "category": "web_development",
        "title": "Full-Stack Web Development",
        "title_ur": "فل اسٹیک ویب ڈویلپمنٹ",
        "description": (
            "How a request becomes a rendered page and a stored record. Covers the browser "
            "platform, HTTP, server-side APIs, persistence and the security baseline every "
            "public web application needs."
        ),
        "level": "undergraduate",
        "credit_hours": (3, 2, 1),
        "accreditation": "HEC/NCEAC Domain Elective — Computing",
        "source": HEC_COMPUTING,
        "outcomes": [
            "Explain the full request/response lifecycle of a web page.",
            "Build a semantic, accessible, responsive interface.",
            "Design and implement a REST API backed by a database.",
            "Identify and mitigate the OWASP Top 10 risks in a small application.",
        ],
        "concepts": [
            ("http_model", "HTTP request/response model", "Methods, status codes, headers, and why HTTP being stateless shapes everything above it.", "understand", 2, 50, [], "mcq", ["GET", "POST", "status code", "stateless"]),
            ("html_semantics", "Semantic HTML and document structure", "Elements that carry meaning, heading hierarchy, landmarks, and the accessibility tree they produce.", "apply", 1, 45, [], "practical", ["semantic", "landmark", "heading"]),
            ("css_layout", "CSS layout: flexbox and grid", "The box model, normal flow, and choosing between flexbox (one axis) and grid (two).", "apply", 2, 70, ["html_semantics"], "practical", ["flexbox", "grid", "box model"]),
            ("responsive", "Responsive and mobile-first design", "Fluid units, min-width media queries, and designing the small layout first.", "apply", 2, 50, ["css_layout"], "practical", ["media query", "viewport", "mobile-first"]),
            ("js_dom", "JavaScript and the DOM", "Selecting, creating and updating nodes; event delegation; why layout thrashing is slow.", "apply", 2, 60, ["html_semantics"], "practical", ["DOM", "event", "delegation"]),
            ("async_js", "Asynchronous JavaScript", "The event loop, promises, async/await, and why blocking the main thread freezes the UI.", "analyze", 3, 60, ["js_dom"], "short_answer", ["event loop", "promise", "async"]),
            ("fetch_api", "Consuming APIs from the browser", "fetch, JSON, CORS, and handling failure as a normal case rather than an exception.", "apply", 3, 50, ["async_js", "http_model"], "practical", ["fetch", "CORS", "JSON"]),
            ("components", "Component-based UI", "Composition, props, unidirectional data flow, and keeping state as close to its use as possible.", "apply", 3, 70, ["js_dom"], "practical", ["component", "props", "state"]),
            ("rest_api", "Designing a REST API", "Resources, verbs, status codes, pagination and versioning that survives a breaking change.", "analyze", 3, 60, ["http_model"], "case_study", ["REST", "resource", "pagination"]),
            ("server_framework", "Server-side application structure", "Routing, middleware, request validation, and separating transport from domain logic.", "apply", 3, 60, ["rest_api"], "practical", ["routing", "middleware", "validation"]),
            ("persistence", "Persistence and ORM basics", "Mapping objects to relations, migrations, and the N+1 query problem.", "apply", 3, 55, ["server_framework"], "practical", ["ORM", "migration", "N+1"]),
            ("authn_authz", "Authentication and authorisation", "Password hashing, sessions vs tokens, and why authorisation is always checked server-side.", "analyze", 4, 60, ["persistence"], "case_study", ["JWT", "session", "bcrypt", "RBAC"]),
            ("web_security", "Web security baseline", "XSS, CSRF, SQL injection, insecure direct object references, and the headers that help.", "evaluate", 4, 70, ["authn_authz"], "case_study", ["XSS", "CSRF", "SQLi", "OWASP"]),
            ("deployment", "Build, deploy and observe", "Bundling, static hosting behind a reverse proxy, environment configuration, logs and health checks.", "apply", 3, 50, ["server_framework"], "practical", ["build", "nginx", "env", "health check"]),
        ],
    },
    {
        "id": "ai_machine_learning",
        "field": "it_computing",
        "category": "data_science_ai",
        "title": "Artificial Intelligence & Machine Learning",
        "title_ur": "مصنوعی ذہانت و مشین لرننگ",
        "description": (
            "Supervised and unsupervised learning from first principles: how a model is fit, "
            "how it is honestly evaluated, and how it fails."
        ),
        "level": "undergraduate",
        "credit_hours": (3, 3, 0),
        "accreditation": "HEC/NCEAC Domain Core — Artificial Intelligence specialisation",
        "source": HEC_COMPUTING,
        "outcomes": [
            "Frame a problem as supervised, unsupervised or reinforcement learning.",
            "Fit and tune standard models without leaking the test set.",
            "Diagnose underfitting and overfitting from learning curves.",
            "Report metrics appropriate to the class balance and the cost of each error.",
        ],
        "concepts": [
            ("ml_framing", "Framing a learning problem", "Supervised vs unsupervised vs reinforcement; when a rule-based solution is simply better.", "understand", 2, 45, [], "short_answer", ["supervised", "unsupervised", "framing"]),
            ("data_prep", "Data preparation and leakage", "Cleaning, encoding, scaling — and why fitting a scaler before splitting leaks the test set.", "analyze", 3, 60, ["ml_framing"], "practical", ["encoding", "scaling", "leakage"]),
            ("train_test", "Train/validation/test and cross-validation", "Why three splits, k-fold, and stratification for imbalanced targets.", "apply", 3, 50, ["data_prep"], "mcq", ["holdout", "k-fold", "stratify"]),
            ("linear_regression", "Linear regression", "Least squares, the normal equation vs gradient descent, and reading the residuals.", "apply", 2, 60, ["train_test"], "numerical", ["least squares", "residual", "MSE"]),
            ("gradient_descent", "Gradient descent", "Loss surfaces, learning rate, batch vs stochastic, and how to tell it is diverging.", "analyze", 3, 55, ["linear_regression"], "numerical", ["learning rate", "SGD", "convergence"]),
            ("logistic_regression", "Logistic regression and classification", "The sigmoid, log-loss, decision thresholds, and why accuracy misleads on imbalanced data.", "apply", 3, 55, ["gradient_descent"], "numerical", ["sigmoid", "log-loss", "threshold"]),
            ("evaluation", "Classification metrics", "Confusion matrix, precision, recall, F1, ROC-AUC, and choosing by the cost of each error type.", "evaluate", 3, 50, ["logistic_regression"], "case_study", ["precision", "recall", "ROC", "F1"]),
            ("bias_variance", "Bias, variance and regularisation", "Diagnosing underfit vs overfit from learning curves; L1/L2 and what each does to weights.", "analyze", 4, 60, ["evaluation"], "short_answer", ["overfitting", "L1", "L2", "learning curve"]),
            ("trees_ensembles", "Decision trees and ensembles", "Impurity splitting, pruning, bagging vs boosting, and where random forests beat a single tree.", "apply", 3, 60, ["bias_variance"], "practical", ["gini", "random forest", "boosting"]),
            ("clustering", "Unsupervised learning and clustering", "k-means, choosing k, hierarchical clustering, and why clusters are not labels.", "apply", 3, 50, ["data_prep"], "practical", ["k-means", "elbow", "silhouette"]),
            ("dim_reduction", "Dimensionality reduction", "PCA as variance-preserving projection; when reduction helps and when it destroys signal.", "analyze", 4, 50, ["clustering"], "numerical", ["PCA", "variance", "projection"]),
            ("neural_nets", "Neural networks and backpropagation", "Layers, activations, the chain rule through a computation graph, and vanishing gradients.", "analyze", 4, 75, ["gradient_descent"], "numerical", ["backprop", "activation", "layer"]),
            ("cnn_seq", "Convolutional and sequence models", "Weight sharing for images; recurrence and attention for sequences.", "understand", 4, 60, ["neural_nets"], "short_answer", ["CNN", "RNN", "attention"]),
            ("ml_ethics", "Evaluation ethics and dataset bias", "Where bias enters, why a held-out metric is not a deployment guarantee, and documenting limits.", "evaluate", 4, 45, ["evaluation"], "essay", ["bias", "fairness", "model card"]),
        ],
    },
    {
        "id": "cyber_security",
        "field": "it_computing",
        "category": "cyber_security",
        "title": "Information & Cyber Security",
        "title_ur": "انفارمیشن و سائبر سیکیورٹی",
        "description": (
            "The Computing Core information-security course: threat modelling, cryptographic "
            "building blocks, and the controls that actually reduce risk."
        ),
        "level": "undergraduate",
        "credit_hours": (3, 3, 0),
        "accreditation": "HEC/NCEAC Computing Core — Information Security",
        "source": HEC_COMPUTING,
        "outcomes": [
            "Apply the CIA triad to evaluate a system's security posture.",
            "Select appropriate cryptographic primitives for a stated goal.",
            "Model threats against a system and rank them by risk.",
            "Explain the legal and ethical boundaries of security testing.",
        ],
        "concepts": [
            ("cia_triad", "CIA triad and security goals", "Confidentiality, integrity and availability, and the trade-offs between them.", "understand", 1, 35, [], "mcq", ["confidentiality", "integrity", "availability"]),
            ("threat_modeling", "Threat modelling", "Assets, adversaries, attack surface and trust boundaries; STRIDE as a checklist.", "analyze", 3, 55, ["cia_triad"], "case_study", ["STRIDE", "attack surface", "trust boundary"]),
            ("symmetric_crypto", "Symmetric cryptography", "Block vs stream ciphers, AES, modes of operation, and why ECB leaks structure.", "understand", 3, 55, ["cia_triad"], "mcq", ["AES", "CBC", "GCM", "IV"]),
            ("asymmetric_crypto", "Public-key cryptography", "RSA and elliptic curves, key exchange, and what a digital signature actually proves.", "understand", 4, 60, ["symmetric_crypto"], "short_answer", ["RSA", "ECC", "Diffie-Hellman"]),
            ("hashing", "Hash functions and password storage", "Preimage and collision resistance; salting and slow KDFs (bcrypt/argon2) versus raw SHA.", "apply", 3, 45, ["symmetric_crypto"], "practical", ["SHA-256", "salt", "bcrypt", "argon2"]),
            ("pki_tls", "PKI and TLS", "Certificates, chains of trust, the handshake, and what a browser padlock does and does not mean.", "understand", 4, 55, ["asymmetric_crypto", "hashing"], "short_answer", ["certificate", "CA", "TLS", "handshake"]),
            ("access_control", "Authentication and access control", "Factors, MFA, RBAC vs ABAC, and least privilege as a default.", "apply", 3, 50, ["hashing"], "case_study", ["MFA", "RBAC", "least privilege"]),
            ("network_attacks", "Network attacks and defences", "Sniffing, spoofing, MITM, DDoS; firewalls, segmentation and IDS placement.", "analyze", 3, 55, ["pki_tls"], "case_study", ["MITM", "firewall", "IDS", "segmentation"]),
            ("app_security", "Application security", "Injection, XSS, CSRF, broken access control, and input validation as a boundary discipline.", "analyze", 4, 60, ["access_control"], "practical", ["OWASP", "injection", "XSS"]),
            ("malware", "Malware and endpoint defence", "Classes of malware, persistence mechanisms, and detection versus prevention.", "understand", 2, 40, ["network_attacks"], "mcq", ["ransomware", "rootkit", "EDR"]),
            ("incident_response", "Incident response", "Preparation, detection, containment, eradication, recovery, lessons learned.", "apply", 3, 45, ["malware"], "case_study", ["IR", "containment", "forensics"]),
            ("security_ethics", "Law, ethics and responsible disclosure", "Authorised testing, Pakistan's PECA framework, and coordinated vulnerability disclosure.", "evaluate", 3, 40, ["threat_modeling"], "essay", ["PECA", "disclosure", "authorisation"]),
        ],
    },
    {
        "id": "data_science",
        "field": "it_computing",
        "category": "data_science_ai",
        "title": "Data Science",
        "title_ur": "ڈیٹا سائنس",
        "description": (
            "Turning raw data into a defensible conclusion: acquisition, cleaning, exploratory "
            "analysis, statistical inference and honest communication of uncertainty."
        ),
        "level": "undergraduate",
        "credit_hours": (3, 2, 1),
        "accreditation": "HEC/NCEAC Domain Core — Data Science specialisation",
        "source": HEC_COMPUTING,
        "outcomes": [
            "Acquire and reshape data from heterogeneous sources.",
            "Perform exploratory analysis that surfaces problems before modelling.",
            "Apply and correctly interpret a hypothesis test.",
            "Communicate a result with its uncertainty rather than a single number.",
        ],
        "concepts": [
            ("data_sources", "Data acquisition", "Files, APIs, scraping and databases; provenance and licensing as part of the data.", "apply", 2, 45, [], "practical", ["API", "CSV", "provenance"]),
            ("tabular_ops", "Tabular data manipulation", "Select, filter, group, aggregate, join — the five verbs most analysis reduces to.", "apply", 2, 60, ["data_sources"], "practical", ["dataframe", "groupby", "join"]),
            ("cleaning", "Data cleaning and missingness", "Types, duplicates, outliers; MCAR/MAR/MNAR and why the mechanism decides the fix.", "analyze", 3, 55, ["tabular_ops"], "case_study", ["missing data", "outlier", "imputation"]),
            ("descriptive", "Descriptive statistics", "Centre, spread, shape; when the median is the only honest summary.", "apply", 2, 45, ["cleaning"], "numerical", ["mean", "median", "IQR", "skew"]),
            ("visualisation", "Exploratory visualisation", "Matching chart to question; truncated axes and other ways charts lie.", "evaluate", 2, 50, ["descriptive"], "practical", ["histogram", "boxplot", "scatter"]),
            ("probability", "Probability foundations", "Random variables, common distributions, expectation and variance.", "understand", 3, 55, ["descriptive"], "numerical", ["distribution", "expectation", "variance"]),
            ("sampling", "Sampling and the central limit theorem", "Sampling distributions, standard error, and why n matters more than N.", "understand", 3, 50, ["probability"], "numerical", ["CLT", "standard error", "sampling"]),
            ("estimation", "Confidence intervals", "Interval estimation and what 95% confidence does and does not mean.", "apply", 3, 45, ["sampling"], "numerical", ["confidence interval", "margin of error"]),
            ("hypothesis", "Hypothesis testing", "Null and alternative, p-values, type I/II error, power, and multiple-comparison inflation.", "analyze", 4, 60, ["estimation"], "numerical", ["p-value", "type I", "power"]),
            ("regression_analysis", "Regression analysis", "Fitting, interpreting coefficients, checking assumptions, and confounding.", "analyze", 4, 60, ["hypothesis"], "numerical", ["OLS", "coefficient", "confounder"]),
            ("timeseries", "Time series basics", "Trend, seasonality, stationarity, and why random splits are invalid for time data.", "apply", 4, 50, ["regression_analysis"], "practical", ["trend", "seasonality", "stationarity"]),
            ("communication", "Communicating results", "Narrative structure, uncertainty in plain language, and stating limitations up front.", "evaluate", 3, 45, ["visualisation", "hypothesis"], "essay", ["reporting", "uncertainty", "limitations"]),
        ],
    },
]
