# Root Prerequisites and Relationship Graph — Agent 5

- Status: Draft v0.1, Area 1 in progress
- Date accessed: 2026-09-30 UTC
- Source registry: `docs/it-research/sources/SOURCE_REGISTER.csv`

## Purpose

This file translates the IT taxonomy into prerequisite, co-requisite, and career-transition relationships for a Learms knowledge graph. It is intentionally **not** a rigid university degree plan. It is a graph for adaptive routing: a learner may enter from programming, IT support, design, math, data, or cybersecurity, then move along evidence-based dependencies.

---

## Source-Backed Findings

## Topic: Foundation-first routing reduces false specialization
### Source: ACM/IEEE-CS/AAAI Joint Task Force, 2023
### Key Finding: CS2023 models computer science as knowledge areas with competencies; core foundations such as algorithms, architecture, operating systems, networks, programming, software engineering, security, HCI, and AI are interdependent rather than isolated courses.
### Relevance to Learms: Learms should diagnose missing foundations before recommending advanced paths like ML, cloud, SRE, or cybersecurity.
### Citation: https://csed.acm.org/

## Topic: Software engineering depends on both computing foundations and professional practice
### Source: IEEE Computer Society, 2024
### Key Finding: SWEBOK v4.0 includes construction, testing, operations, maintenance, quality, economics, process, management, security, and professional practice alongside computing/mathematical/engineering foundations.
### Relevance to Learms: A student who can write code is not automatically software-engineering ready; Learms should add requirements, testing, design, and maintenance milestones.
### Citation: https://www.computer.org/education/bodies-of-knowledge/software-engineering

## Topic: Cloud prerequisites should be vendor-neutral before vendor-specific
### Source: Mell and Grance/NIST, 2011
### Key Finding: NIST defines cloud by essential characteristics, service models, and deployment models, independent of AWS, Azure, or GCP branding.
### Relevance to Learms: Teach networking, Linux, virtualization, storage, security, and NIST cloud concepts before vendor certification tracks.
### Citation: https://doi.org/10.6028/NIST.SP.800-145

## Topic: DevOps/SRE require operational feedback loops
### Source: DORA/Google Cloud, 2022; Google SRE Team, 2016
### Key Finding: DORA measures software delivery by throughput and stability, while SRE uses SLOs, error budgets, automation, and toil reduction to keep systems reliable.
### Relevance to Learms: DevOps/SRE paths should require monitoring, incident response, and delivery metrics, not only CI/CD syntax.
### Citation: https://dora.dev/research/2022/dora-report/2022-dora-accelerate-state-of-devops-report.pdf ; https://sre.google/sre-book/table-of-contents/

## Topic: ML readiness requires data, math, evaluation, and operations
### Source: ACM Data Science Task Force, 2021; Kreuzberger/Kühl/Hirschl, 2022
### Key Finding: Data science competencies include data acquisition/management/governance, machine learning, AI, programming, security/privacy, and professionalism; MLOps adds reproducibility, versioning, continuous training/evaluation, metadata tracking, monitoring, and feedback loops.
### Relevance to Learms: Learms should prevent “notebook-only ML” by adding prerequisite checks for statistics, data quality, model evaluation, deployment, and monitoring.
### Citation: https://dstf.acm.org/ ; https://arxiv.org/pdf/2205.02302

## Topic: Cybersecurity paths require technical and human/organizational lenses
### Source: Joint Task Force on Cybersecurity Education, 2017; NIST, 2020
### Key Finding: Cybersecurity curricula include data, software, system, human, organizational, and societal security; NICE defines cybersecurity work with task/knowledge/skill terminology.
### Relevance to Learms: Learms should route students differently for pentesting, SOC, GRC, forensics, secure coding, and cloud security.
### Citation: https://dl.acm.org/doi/book/10.1145/3184594 ; https://doi.org/10.6028/NIST.SP.800-181r1

## Topic: IoT/robotics/embedded require physical-world constraints
### Source: ACM/IEEE-CS, 2016; NIST, 2017; IEEE Internet Initiative, 2015
### Key Finding: Embedded and CPS learning includes hardware/software interfaces, sensors/actuators, timing, trustworthiness, low-power design, and networked physical systems.
### Relevance to Learms: Learms should require hardware labs or simulations before advanced robotics/IoT capstones.
### Citation: https://www.acm.org/binaries/content/assets/education/ce2016-final-report.pdf ; https://doi.org/10.6028/NIST.SP.1500-201 ; https://iot.ieee.org/images/files/pdf/IEEE_IoT_Towards_Definition_Internet_of_Things_Revision1_27MAY15.pdf

---

## Relationship Types

| Relationship | Meaning | Example |
|---|---|---|
| `requires` | Strong prerequisite; skipping causes high failure risk. | ML requires probability/statistics. |
| `recommended_before` | Helpful sequence but not mandatory for all students. | SQL recommended before backend ORMs. |
| `co_requisite` | Best learned alongside. | Web security alongside backend auth. |
| `specializes_into` | Career/deepening relation. | Backend specializes into cloud-native engineering. |
| `transitions_to` | Career movement path after foundation overlap. | SysAdmin transitions to DevOps. |
| `cross_cuts` | Topic applies across many roots. | Privacy cross-cuts data, health, fintech. |

---

## Core Foundation Graph

| From | To | Relation | Why | Source |
|---|---|---|---|---|
| Digital literacy | Programming Fundamentals | recommended_before | Learners need files, terminal, browser, editor basics before code. | S001, S004 |
| Programming Fundamentals | Algorithms & Data Structures | requires | DSA assumes variables, functions, control flow, and basic debugging. | S001 |
| Programming Fundamentals | Software Engineering | recommended_before | Engineering practice builds on ability to construct and read programs. | S003 |
| Programming Fundamentals | Web Development | requires | Web scripting and backend frameworks require programming concepts. | S005 |
| Programming Fundamentals | Data Science | requires | Data analysis tools require programming/scripting foundations. | S006 |
| Programming Fundamentals | Cybersecurity | recommended_before | Security labs often require scripting and code comprehension. | S007, S009 |
| Discrete Mathematics & Theory | Algorithms & Data Structures | co_requisite | Complexity, graphs, proof, and combinatorics support algorithm reasoning. | S001 |
| Algorithms & Data Structures | Technical Interviews | specializes_into | DSA remains a common hiring screen in software roles; job-market evidence pending. | S001 |
| Computer Architecture | Operating Systems | requires | OS requires understanding CPU, memory, interrupts, and hardware abstractions. | S001, S017 |
| Operating Systems | Systems Administration | recommended_before | Admin tasks depend on processes, filesystems, permissions, and networking. | S004 |
| Operating Systems | Cybersecurity | recommended_before | Security analysis depends on processes, memory, isolation, and privilege. | S009 |
| Computer Networks | Cloud Computing | requires | Cloud networking, load balancing, VPCs, DNS, and security groups depend on networking. | S008, S017 |
| Computer Networks | Cybersecurity | requires | Network security depends on protocols, routing, traffic analysis, and firewalls. | S009 |
| Databases & Data Management | Backend Engineering | requires | Backend systems depend on persistence, transactions, query design, and data integrity. | S003, S005 |
| Databases & Data Management | Data Engineering | requires | Pipelines and warehouses/lakehouses depend on data models, storage, and governance. | S006, S025, S026 |
| Software Testing & QA | Software Engineering | co_requisite | SWEBOK treats testing/quality as core areas of software engineering. | S003 |
| Human-Computer Interaction | Frontend Engineering | recommended_before | Accessible and usable interfaces require HCI principles. | S023 |
| Privacy Engineering | Data Science | cross_cuts | Data processing can create privacy risks that require governance controls. | S021, S006 |

---

## Software/Product Engineering Pathways

| From | To | Relation | Why | Source |
|---|---|---|---|---|
| Programming Fundamentals | Frontend Engineering | requires | Components, state, and browser logic require programming basics. | S005 |
| HTML/CSS/JS basics | Frontend Engineering | requires | Frontend specialization builds on browser platform primitives. | S005, S023 |
| Frontend Engineering | Full-Stack Development | recommended_before | Full-stack learners need at least one side of the stack deeply. | S005 |
| Backend Engineering | Full-Stack Development | recommended_before | Full-stack requires API/database/server competence. | S003, S005 |
| Databases & Data Management | Full-Stack Development | requires | End-to-end apps require persistence, data modeling, and queries. | S005 |
| Software Engineering | Backend Engineering | recommended_before | API design, maintainability, testing, and architecture are engineering practices. | S003 |
| Software Architecture | Backend Engineering | specializes_into | Architecture handles quality attributes and distributed service design. | S003, S019 |
| Software Architecture | Cloud-Native Engineering | requires | Cloud-native systems require distributed architecture patterns. | S018, S019 |
| Application Security | Backend Engineering | co_requisite | Auth, APIs, dependencies, and input handling must be secured during development. | S009, S019 |
| Software Testing & QA | Web Development | co_requisite | Testing reduces regressions and supports safe delivery. | S003 |
| HCI | Mobile Development | recommended_before | Mobile apps require touch, accessibility, small-screen, and human-factor design. | S005, S023 |
| Mobile Development | Full-Stack Development | transitions_to | Mobile apps commonly require APIs, auth, storage, and cloud backends. | S005 |
| Game Development | Computer Graphics | co_requisite | Games need rendering, animation, GPU, and geometry concepts. | S001, S022 |
| Game Development | Software Engineering | co_requisite | Production game work needs version control, testing, architecture, and team processes. | S003, S022 |
| AR/VR/XR | HCI | requires | Immersive systems require interaction design and evaluation. | S023 |
| AR/VR/XR | Computer Graphics | requires | XR relies on 3D rendering, geometry, animation, and performance. | S001 |

---

## IT Operations, Cloud, DevOps, and SRE Pathways

| From | To | Relation | Why | Source |
|---|---|---|---|---|
| Operating Systems | Systems Administration | requires | Admin work depends on OS services, permissions, users, storage, and processes. | S004 |
| Computer Networks | Network Engineering | requires | Network engineering extends protocol/routing/switching fundamentals. | S017 |
| Systems Administration | Cloud Computing | recommended_before | Cloud resources abstract servers, storage, identity, and networks. | S004, S008 |
| Network Engineering | Cloud Computing | recommended_before | Cloud VPC/VNet design depends on routing, CIDR, DNS, and security. | S008, S017 |
| Cloud Computing | Cloud-Native Engineering | recommended_before | Cloud-native uses cloud environments plus containers/microservices. | S008, S018 |
| Linux and scripting | DevOps | requires | CI/CD, IaC, and automation require shell, scripting, and OS fluency. | S004, S012 |
| Software Engineering | DevOps | co_requisite | DevOps optimizes delivery of software systems; understanding SDLC matters. | S003, S012 |
| Cloud Computing | DevOps | recommended_before | DevOps often automates cloud infrastructure and deployments. | S008, S012 |
| DevOps | Site Reliability Engineering | recommended_before | SRE builds on automation, deployment, monitoring, and operations. | S011, S012 |
| Monitoring/Observability | Site Reliability Engineering | requires | SRE requires SLIs, SLOs, incidents, and reliability signals. | S011 |
| Site Reliability Engineering | AIOps | recommended_before | AIOps automates/analyzes operational signals; SRE gives domain context. | S011, S030 |
| Cloud-Native Engineering | Platform Engineering | recommended_before | IDPs and golden paths abstract cloud-native delivery. | S018, S012 |
| DevOps | Platform Engineering | specializes_into | Platform teams productize DevOps patterns for internal developers. | S012, S018 |
| Cloud Security | Cloud Computing | co_requisite | Cloud adoption requires IAM, logging, network controls, and shared responsibility. | S007, S008, S019 |
| Serverless Computing | Cloud Computing | requires | FaaS/BaaS are cloud service models and event patterns. | S008 |

---

## Data, AI, and ML Pathways

| From | To | Relation | Why | Source |
|---|---|---|---|---|
| Programming Fundamentals | Data Science | requires | Data tools require scripting, libraries, and debugging. | S006 |
| Statistics | Data Science | requires | Data analysis and inference depend on probability/statistical reasoning. | S006 |
| SQL | Business Intelligence & Analytics | requires | BI dashboards and reporting depend on querying structured data. | S005, S006 |
| Databases & Data Management | Business Intelligence & Analytics | requires | BI uses modeled and governed data. | S005 |
| Data Science | Machine Learning | recommended_before | ML is one part of the data science lifecycle and requires data/evaluation context. | S006 |
| Linear Algebra | Machine Learning | requires | Models, vectors, matrices, embeddings, and optimization require linear algebra. | S001, S006 |
| Probability & Statistics | Machine Learning | requires | Evaluation, uncertainty, loss, and inference require probability/statistics. | S006 |
| Calculus/Optimization | Deep Learning | recommended_before | Gradient-based training depends on optimization concepts. | S001 |
| Machine Learning | Deep Learning | requires | Deep learning is an advanced subset of ML methods. | S001 |
| Machine Learning | MLOps | recommended_before | Operationalizing models requires understanding models and evaluation. | S024 |
| Data Engineering | MLOps | co_requisite | Model pipelines depend on data pipelines, versioning, and orchestration. | S024, S025 |
| Data Engineering | Big Data Systems | specializes_into | Big data systems scale ingestion, processing, and storage. | S006, S026 |
| Big Data Systems | Data Science | co_requisite | Large-scale analytics needs distributed data processing. | S006 |
| NLP | Machine Learning | requires | Modern NLP relies on ML and deep learning models. | S001 |
| Computer Vision | Machine Learning | requires | Modern vision uses ML/DL for recognition/detection/segmentation. | S001 |
| AI Ethics/Risk | Artificial Intelligence | co_requisite | AI systems require risk and trustworthiness considerations. | S010 |
| Privacy Engineering | Machine Learning | cross_cuts | ML can process personal/sensitive data and requires privacy controls. | S021, S024 |
| MLOps | AI Engineering | specializes_into | Production AI requires serving, monitoring, retraining, and governance. | S024 |

---

## Cybersecurity Pathways

| From | To | Relation | Why | Source |
|---|---|---|---|---|
| Computer Networks | Network Security | requires | Firewalls, IDS/IPS, scanning, and traffic analysis require protocol knowledge. | S009 |
| Operating Systems | System Security | requires | Privilege, processes, memory, and file permissions underpin system security. | S009 |
| Programming Fundamentals | Application Security | requires | Secure coding and code review require program understanding. | S003, S009 |
| Web Development | Application Security | co_requisite | Web apps expose auth, input, session, browser, and API vulnerabilities. | S009, S019 |
| Cloud Computing | Cloud Security | requires | Cloud security requires cloud architecture, IAM, networking, and logging. | S008, S019 |
| Cryptography Math | Cybersecurity | recommended_before | Data security uses symmetric/asymmetric crypto, hashing, signatures. | S009, S020 |
| Cybersecurity | Digital Forensics & Incident Response | specializes_into | DFIR is a cybersecurity work specialty with evidence and response practices. | S007 |
| Cybersecurity | Governance Risk Compliance | specializes_into | Organizational security includes policy, risk, compliance, and governance. | S007, S009 |
| Application Security | Secure Software Engineering | specializes_into | Secure SDLC integrates security into requirements, design, construction, testing. | S003, S009 |
| Blockchain & Web3 | Application Security | co_requisite | Smart contracts and wallets require security review and threat modeling. | S013, S009 |
| Post-Quantum Cryptography | Cryptography | specializes_into | PQC is advanced cryptography focused on quantum-resistant algorithms. | S020 |
| Privacy Engineering | Cybersecurity | cross_cuts | Privacy and cybersecurity risks overlap but are not identical. | S021 |

---

## Hardware, CPS, IoT, and Robotics Pathways

| From | To | Relation | Why | Source |
|---|---|---|---|---|
| Computer Architecture | Embedded Systems | requires | Firmware interacts with CPU, memory, I/O, and device architecture. | S017 |
| C/C++ Programming | Embedded Systems | recommended_before | Embedded software commonly uses low-level languages and memory control. | S017 |
| Electronics Basics | Embedded Systems | recommended_before | Sensors, actuators, voltage, timing, and interfaces require electronics literacy. | S017 |
| Embedded Systems | Internet of Things | recommended_before | IoT devices often run embedded firmware and interface with sensors. | S016, S017 |
| Computer Networks | Internet of Things | co_requisite | IoT depends on network protocols and constrained communications. | S016 |
| Cloud Computing | Internet of Things | co_requisite | IoT commonly connects devices to cloud ingestion, storage, and analytics. | S008, S029 |
| IoT | Edge/Fog Computing | recommended_before | Edge/fog architectures process IoT data near sources. | S014, S029 |
| Embedded Systems | Robotics | recommended_before | Robots combine control software with sensors, actuators, and real-time constraints. | S017, S015 |
| Linear Algebra | Robotics | requires | Kinematics, coordinate frames, perception, and control use linear algebra. | S001 |
| Calculus/Control | Robotics | recommended_before | Dynamics and control rely on calculus/control theory. | S001, S015 |
| Computer Vision | Robotics | co_requisite | Robot perception often uses vision and sensor fusion. | S001 |
| AI Planning | Robotics | co_requisite | Navigation and task planning require search/planning. | S001 |
| IoT Security | Internet of Things | co_requisite | Connected devices expand attack surfaces and require security controls. | S009, S016 |

---

## Sector and Hybrid Career Transitions

| From | To | Relation | Why | Source |
|---|---|---|---|---|
| Information Systems | Product Management | transitions_to | IS builds business-process, project, and organizational understanding. | S005 |
| Software Engineering | Product Management | transitions_to | Technical PMs benefit from SDLC, architecture, and tradeoff literacy. | S003 |
| HCI | Educational Technology | recommended_before | Learning platforms need human-centered design and accessibility. | S023 |
| Data Science | Health Informatics | transitions_to | Health analytics builds on data handling, modeling, and communication. | S006, S021 |
| Privacy Engineering | Health Informatics | requires | Health data is sensitive and privacy-risk heavy. | S021 |
| Data Science | Bioinformatics | transitions_to | Bioinformatics uses computational data analysis and statistics. | S006 |
| NLP | Legal Tech | transitions_to | Legal search, contract analytics, and e-discovery use text processing. | S001, S021 |
| Security | FinTech | co_requisite | Payments and financial APIs require security, fraud, and compliance controls. | S007, S021 |
| IoT | AgriTech | transitions_to | Precision agriculture uses sensors, gateways, and analytics. | S016, S029 |
| Data Engineering | FinTech | co_requisite | Financial products require reliable data pipelines and governance. | S025, S021 |
| Technical Writing | Developer Relations | specializes_into | Developer advocacy builds on documentation, communication, and community. | S003, S023 |

---

## Beginner Routing Recommendations

## Topic: Recommended first 90 days for absolute beginners
### Source: ACM/IEEE-CS/AAAI, 2023; IEEE Computer Society, 2024
### Key Finding: Foundational programming, problem solving, debugging, basic DSA, software practice, and ethical/social awareness are common entry competencies across many computing paths.
### Relevance to Learms: A common starter path can reduce career confusion before specialization.
### Citation: https://csed.acm.org/ ; https://www.computer.org/education/bodies-of-knowledge/software-engineering

Suggested default path:

1. Digital literacy: files, browser, terminal basics, editor basics.
2. Programming fundamentals in one beginner language.
3. Debugging and error-message reading.
4. Git/version-control concepts.
5. Basic DSA: arrays, strings, maps, stacks, queues.
6. Basic web: HTML/CSS/HTTP mental model.
7. Basic SQL and data modeling.
8. Mini-project with tests and deployment.
9. Career diagnosis: web, mobile, data, IT ops, cyber, design, hardware, or hybrid.
10. Ethics/security/privacy basics.

---

## Pakistan-Specific Hypotheses Requiring Validation

These are **not final findings** until Pakistan-specific sources are collected.

| Hypothesis | Status | Evidence Needed |
|---|---|---|
| Web development, mobile development, QA, and freelancing paths are high-demand among Pakistani beginners. | Pending | PSEB/P@SHA reports, job boards, freelance platform data. |
| Many students use “IT” to mean any computing field. | Pending | Student survey, university program names, social media/job posting language analysis. |
| Cloud/DevOps salaries may rise faster than generic web roles in export-focused firms. | Pending | Salary reports, job postings, recruiter interviews. |
| AI/ML interest is high but math/data foundations are major blockers. | Pending | CS education literature plus Pakistan university/student evidence. |
| Cybersecurity interest is rising but lab cost and ethics guidance are blockers. | Pending | Local training provider data, PTA/cyber law sources, student interviews. |

---

## Backend Knowledge-Graph Schema Suggestions for Agent 1

- `Root` nodes: 66 top-level roots from `IT_ROOTS_COMPLETE.md`.
- `SubRoot` nodes: 660 sub-root seeds from `IT_SUBROOTS_COMPLETE.md`.
- `Concept` nodes: fine-grained topics to be extracted in later areas.
- `Source` nodes: source registry IDs.
- `Role` nodes: frontend developer, SOC analyst, data engineer, etc.
- `Tool` nodes: Git, Linux, Docker, Kubernetes, Pandas, React, etc.
- Edges:
  - `REQUIRES`
  - `RECOMMENDED_BEFORE`
  - `CO_REQUISITE`
  - `SPECIALIZES_INTO`
  - `TRANSITIONS_TO`
  - `CROSS_CUTS`
  - `SUPPORTED_BY_SOURCE`
  - `HAS_PROJECT`
  - `HAS_COMMON_ERROR`

## Frontend UI Suggestions for Agent 2

- Use grouped clusters first; reveal root/sub-root details progressively.
- Show “foundation debt” badges when a learner selects advanced tracks without prerequisites.
- Show multiple entry modes: “I want a job”, “I like math/AI”, “I like design”, “I like hardware”, “I want freelancing”, “I want security”.
- Display prerequisite chains as short paths, not full graph hairballs.
- Add warnings for hype-heavy tracks: AI, blockchain, quantum, cybersecurity.

## Security Suggestions for Agent 3

- Treat cybersecurity as a root plus cross-cutting module for every software/data/cloud path.
- Add secure-by-default modules in web, backend, cloud, mobile, IoT, data, and AI.
- Add legal/ethical guardrails before offensive security labs.

## General Research Suggestions for Agent 4

- Complement with Pakistan learner interviews, university curriculum comparison, and employer surveys.
- Validate the taxonomy against actual Pakistani student vocabulary and job ads.
