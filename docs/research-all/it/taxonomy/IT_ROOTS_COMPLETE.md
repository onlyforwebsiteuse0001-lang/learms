# IT Roots Complete Taxonomy — Agent 5

- Status: Draft v0.1, Area 1 in progress
- Agent: 5 — IT Deep Research
- Date accessed: 2026-09-30 UTC
- Branch note: written on Arena-mandated branch `arena/01a0f467-learms`.

## Purpose for Learms

This document converts major computing curricula, standards, and workforce frameworks into a Learms-friendly taxonomy of IT roots. A **root** is a broad learning/career domain; a **sub-root** is a teachable cluster, skill family, or specialization; a **specialization** is an employable or research-oriented focus.

## Evidence Standard

Each source-backed finding uses the required format:

```text
## Topic: [name]
### Source: [Author/Organization, Year]
### Key Finding: [finding]
### Relevance to Learms: [how it helps]
### Citation: [URL/DOI]
```

Source IDs refer to `docs/it-research/sources/SOURCE_REGISTER.csv`.

---

## Source-Backed Findings

## Topic: Computer Science core must be competency-based, not just course-based
### Source: ACM/IEEE-CS/AAAI Joint Task Force, 2023
### Key Finding: CS2023 frames undergraduate computer science through knowledge areas and competencies, reflecting newer emphasis on AI, security, ethics, HCI, graphics, and specialized platform development.
### Relevance to Learms: Learms should model CS as a competency graph: concepts, practices, dispositions, projects, and prerequisite relations, not as a flat course list.
### Citation: https://csed.acm.org/ ; https://dl.acm.org/doi/10.1145/3649405.3659537

## Topic: ACM CCS is useful as a poly-hierarchical ontology
### Source: ACM, 2012
### Key Finding: The 2012 ACM Computing Classification System is a poly-hierarchical classification/ontology for computing literature and can represent topics that belong to multiple parent domains.
### Relevance to Learms: Learms knowledge graph should allow cross-links, e.g., computer vision belongs under AI, data science, medical imaging, robotics, and HCI.
### Citation: https://www.acm.org/publications/class-2012 ; https://doi.org/10.1145/2366316.2366320

## Topic: Software Engineering has a defined body of knowledge
### Source: IEEE Computer Society, 2024
### Key Finding: SWEBOK v4.0 organizes software engineering into areas including requirements, architecture, design, construction, testing, operations, maintenance, configuration management, management, process, models/methods, quality, security, professional practice, economics, and foundations.
### Relevance to Learms: Learms should separate software engineering from programming; students need process, quality, testing, maintenance, and economics concepts early.
### Citation: https://www.computer.org/education/bodies-of-knowledge/software-engineering

## Topic: IT degree guidance emphasizes operational competencies
### Source: ACM/IEEE-CS, 2017
### Key Finding: IT2017 positions Information Technology around competencies such as information management, platform technologies, system administration/maintenance, networking, security, web/mobile systems, user experience, and integrative programming/scripting.
### Relevance to Learms: Learms should offer an IT operations/admin path distinct from CS theory and software engineering.
### Citation: https://www.acm.org/binaries/content/assets/education/curricula-recommendations/it2017.pdf

## Topic: Information Systems connects computing to organizations
### Source: ACM/AIS, 2020
### Key Finding: IS2020 groups undergraduate IS competencies into foundations, data/information, technology, development, organizational domain, and integration realms, with required areas such as data management, IT infrastructure, secure computing, systems analysis/design, application development, IS management/strategy, project management, ethics, and practicum.
### Relevance to Learms: Learms should include business-process, systems-analysis, and organization-facing tracks for students who want tech-plus-business roles.
### Citation: https://www.acm.org/binaries/content/assets/education/curricula-recommendations/is2020.pdf ; DOI: 10.1145/3460863

## Topic: Data Science is interdisciplinary and lifecycle-based
### Source: ACM Data Science Task Force, 2021
### Key Finding: ACM’s undergraduate data science competencies include analysis/presentation, data acquisition/management/governance, big data systems, AI, machine learning, data mining, programming/data structures/algorithms, software development, security/privacy, and professionalism.
### Relevance to Learms: Data science learning paths should include data lifecycle, statistics, communication, ethics, and engineering, not only notebooks and models.
### Citation: https://dstf.acm.org/

## Topic: Cybersecurity has education and workforce taxonomies
### Source: Joint Task Force on Cybersecurity Education, 2017; NIST, 2020
### Key Finding: CSEC2017 frames cybersecurity knowledge areas around data security, software security, system security, human security, organizational security, and societal security; NICE SP 800-181 Rev. 1 provides workforce task/knowledge/skill terminology.
### Relevance to Learms: Cybersecurity paths should map concepts to roles: SOC analyst, pentester, cloud security, GRC, incident responder, forensics, and secure software engineer.
### Citation: https://dl.acm.org/doi/book/10.1145/3184594 ; https://doi.org/10.6028/NIST.SP.800-181r1

## Topic: Cloud computing requires service-model and deployment-model literacy
### Source: Mell and Grance/NIST, 2011
### Key Finding: NIST defines cloud computing by five essential characteristics, three service models (SaaS, PaaS, IaaS), and four deployment models.
### Relevance to Learms: Cloud modules should start with cloud mental models before vendor services, reducing AWS/Azure/GCP overwhelm.
### Citation: https://doi.org/10.6028/NIST.SP.800-145

## Topic: Cloud-native is not simply “running on cloud”
### Source: CNCF, 2025; NIST, 2019
### Key Finding: CNCF describes cloud-native systems as scalable applications in dynamic environments using containers, service meshes, microservices, immutable infrastructure, and declarative APIs; NIST SP 800-204 analyzes microservices security strategies.
### Relevance to Learms: Learners need the difference between cloud service models and cloud-native architecture patterns.
### Citation: https://github.com/cncf/foundation/blob/main/charter.md ; https://doi.org/10.6028/NIST.SP.800-204

## Topic: DevOps performance should be measured by flow and stability
### Source: DORA/Google Cloud, 2022
### Key Finding: DORA uses deployment frequency and lead time for changes as throughput measures, and time to restore service plus change failure rate as stability measures; later reports also emphasize reliability.
### Relevance to Learms: DevOps learners should build dashboards and postmortems around these measures rather than vanity metrics like lines of code.
### Citation: https://dora.dev/research/2022/dora-report/2022-dora-accelerate-state-of-devops-report.pdf

## Topic: SRE operationalizes reliability with SLOs, error budgets, and toil reduction
### Source: Google SRE Team, 2016
### Key Finding: Site Reliability Engineering applies software engineering to operations, using service-level indicators/objectives, error budgets, automation, and toil reduction to balance reliability and velocity.
### Relevance to Learms: SRE can become an advanced path after Linux, networking, cloud, monitoring, and incident-response foundations.
### Citation: https://sre.google/sre-book/table-of-contents/

## Topic: MLOps extends DevOps with ML-specific lifecycle controls
### Source: Kreuzberger, Kühl, and Hirschl, 2022
### Key Finding: MLOps principles include CI/CD automation, workflow orchestration, reproducibility, versioning of data/model/code, collaboration, continuous ML training/evaluation, metadata tracking, monitoring, and feedback loops.
### Relevance to Learms: AI/ML paths should require deployment, monitoring, drift, and governance modules before claiming job readiness.
### Citation: https://arxiv.org/pdf/2205.02302

## Topic: Blockchain education must address limitations and misconceptions
### Source: Yaga, Mell, Roby, and Scarfone/NIST, 2018
### Key Finding: NISTIR 8202 explains blockchain as a distributed ledger with cryptographic linking, consensus, forks, and smart contracts, while explicitly covering limitations and misconceptions.
### Relevance to Learms: Blockchain learning should be evidence-based and security-aware, not hype-driven.
### Citation: https://doi.org/10.6028/NIST.IR.8202

## Topic: IoT and CPS bridge software, hardware, networking, and safety
### Source: IEEE Internet Initiative, 2015; NIST, 2017; NIST, 2021
### Key Finding: IoT definitions emphasize connected physical/virtual things with identities and interoperable protocols; CPS frameworks emphasize integrated digital, analog, physical, and human components plus concerns such as trustworthiness, timing, data, boundaries, and lifecycle.
### Relevance to Learms: IoT learners need hardware, networking, embedded programming, security, data, and deployment modules.
### Citation: https://iot.ieee.org/images/files/pdf/IEEE_IoT_Towards_Definition_Internet_of_Things_Revision1_27MAY15.pdf ; https://doi.org/10.6028/NIST.SP.1500-201 ; https://doi.org/10.1109/COMPSAC51774.2021.00176

## Topic: Embedded systems belong under computer engineering as well as IT/IoT
### Source: ACM/IEEE-CS, 2016
### Key Finding: CE2016 gives embedded systems a core knowledge area with topics such as embedded platforms, I/O, low-power operation, mobile/networked embedded systems, sensors/actuators, and design constraints.
### Relevance to Learms: Embedded paths should not be treated as “just Arduino”; they require architecture, C/C++, real-time constraints, electronics, and testing.
### Citation: https://www.acm.org/binaries/content/assets/education/ce2016-final-report.pdf

## Topic: Edge/fog computing is a separate architecture pattern from centralized cloud
### Source: NIST, 2018
### Key Finding: NIST’s fog computing model addresses architectures that bring compute, storage, and networking closer to IoT/physical systems and discusses fog versus edge computing.
### Relevance to Learms: Edge AI, IoT analytics, AR/VR, and industrial automation need modules on latency, local processing, intermittent connectivity, and device fleet management.
### Citation: https://doi.org/10.6028/NIST.SP.500-325

## Topic: Privacy Engineering is a first-class computing specialization
### Source: NIST, 2020
### Key Finding: NIST Privacy Framework provides a voluntary enterprise risk-management framework for privacy, and NIST Privacy Engineering applies measurement science and systems engineering to privacy risk.
### Relevance to Learms: Security and data paths should include privacy requirements, data minimization, governance, and risk communication.
### Citation: https://doi.org/10.6028/NIST.CSWP.01162020 ; https://www.nist.gov/privacy-engineering

## Topic: Quantum-related learning has two distinct tracks: quantum computing and post-quantum security
### Source: NIST, 2024
### Key Finding: NIST released principal post-quantum cryptography standards in 2024 and recommends migration planning for quantum-vulnerable algorithms.
### Relevance to Learms: Learms should not conflate quantum programming with post-quantum cryptography; cryptography students need PQC awareness even without quantum hardware.
### Citation: https://csrc.nist.gov/projects/post-quantum-cryptography/post-quantum-cryptography-standardization

## Topic: Green computing includes software, infrastructure, and workload management
### Source: ACM Communications, 2024; Liu et al., 2012
### Key Finding: Green computing reduces environmental impact and maximizes energy efficiency; research on data centers integrates renewable supply, dynamic pricing, cooling supply, and workload planning.
### Relevance to Learms: Sustainability can be attached to cloud, data engineering, systems, and software architecture tracks.
### Citation: https://cacm.acm.org/blogcacm/pioneering-sustainable-it-with-green-computing/ ; https://doi.org/10.1145/2318857.2254779

## Topic: Game development is interdisciplinary
### Source: IGDA, 2008/2025 page
### Key Finding: IGDA’s game education framework treats game programs as interdisciplinary combinations of game studies, design, programming, visual/auditory artifact creation, business, production, and institutional context.
### Relevance to Learms: Game-dev paths must combine programming, math, design, art pipeline, production, and publishing/monetization.
### Citation: https://igda.org/sigs/game-education/

## Topic: HCI is design, evaluation, implementation, and human-use study
### Source: Hewett et al., 1992
### Key Finding: ACM SIGCHI defines HCI as the design, evaluation, and implementation of interactive computing systems for human use and the study of major phenomena surrounding them.
### Relevance to Learms: UI/UX guidance for Agent 2 should use HCI as evidence base rather than only aesthetic preference.
### Citation: https://doi.org/10.1145/2594128

---

## Root Taxonomy Map

Legend:

- **Root type**: Foundation, Engineering, Product, Operations, Data/AI, Security, Hardware/CPS, Sector, Emerging.
- **Source anchor**: primary source IDs from `SOURCE_REGISTER.csv`.
- **Learms node idea**: how Agent 1 can encode the root in a knowledge graph.

| # | IT Root | Root Type | Source Anchor | Scope Definition | Learms Node Idea |
|---:|---|---|---|---|---|
| 1 | Computer Science | Foundation | S001, S002 | Theory, algorithms, systems, software foundations, AI, HCI, security, ethics, and computing principles. | `root:computer_science` with KAs from CS2023. |
| 2 | Algorithms & Data Structures | Foundation | S001, S002 | Abstract data types, algorithmic strategies, complexity, correctness, and performance tradeoffs. | Prerequisite hub for interviews, ML, systems, graphics, robotics. |
| 3 | Discrete Mathematics & Theory of Computation | Foundation | S001, S002 | Logic, proofs, combinatorics, graphs, automata, computability, complexity theory. | Math bridge for algorithms, crypto, compilers, formal methods. |
| 4 | Programming Fundamentals | Foundation | S001 | Basic syntax, control flow, functions, data structures, testing, debugging, and computational thinking. | Universal entry path before language specialization. |
| 5 | Programming Languages & Compilers | Foundation/Engineering | S001, S002 | Language design, paradigms, semantics, type systems, parsing, optimization, runtime systems. | Advanced path after DSA and systems. |
| 6 | Operating Systems | Foundation/Systems | S001, S002 | Processes, concurrency, memory, file systems, scheduling, virtualization, security boundaries. | Core for backend, cloud, DevOps, cybersecurity. |
| 7 | Computer Architecture & Organization | Foundation/Hardware | S001, S017 | Digital logic, instruction sets, CPU/memory hierarchy, parallelism, embedded platforms. | Bridges CS with embedded, performance, systems. |
| 8 | Computer Networks | Foundation/Operations | S001, S017 | Layered architectures, protocols, routing, transport, wireless, performance, security. | Prerequisite for cloud, cyber, IoT, DevOps. |
| 9 | Databases & Data Management | Foundation/Data | S001, S005, S006 | Relational/NoSQL data models, transactions, query processing, storage, governance. | Hub for backend, data engineering, DBA, analytics. |
| 10 | Software Engineering | Engineering | S003 | Requirements, architecture, design, construction, testing, operations, maintenance, quality, process. | Distinct root separate from programming language learning. |
| 11 | Software Architecture | Engineering | S003, S019 | Architecture styles, design decisions, quality attributes, microservices, distributed systems. | Advanced sub-root for backend/full-stack/cloud. |
| 12 | Software Testing & QA | Engineering | S003 | Unit/integration/system/acceptance testing, test design, automation, quality assurance. | Can support QA career path and code-quality curriculum. |
| 13 | Web Development | Product/Engineering | S005, S018, S019 | Client/server web apps, frontend, backend, APIs, browser platform, deployment. | Large Learms root for Pakistan freelancing/job paths. |
| 14 | Frontend Engineering | Product/Engineering | S005, S023 | Browser UI, accessibility, state, performance, UX implementation. | Direct support for Agent 2 UI/UX decisions. |
| 15 | Backend Engineering | Engineering | S003, S008, S019 | Server-side systems, APIs, databases, auth, scalability, reliability, security. | Central career path for web/cloud. |
| 16 | Full-Stack Development | Product/Engineering | S005, S003 | End-to-end web/mobile product engineering across UI, API, data, deploy, testing. | Learner-friendly career path for Pakistan market. |
| 17 | Mobile Development | Product/Engineering | S005 | Native Android/iOS, cross-platform frameworks, mobile UX, app distribution. | Separate path because device constraints and stores differ from web. |
| 18 | Information Technology | Operations | S004 | Platforms, system administration, networks, scripting, support, web/mobile systems, security. | Non-CS degree/job track for IT administrators and support engineers. |
| 19 | Information Systems | Product/Organization | S005 | Technology plus organizational processes, systems analysis, IS strategy, project management, practicum. | Business-tech bridge path. |
| 20 | Systems Administration | Operations | S004 | Linux/Windows servers, identity, storage, backups, patching, automation, monitoring. | Entry path to DevOps/SRE/cloud. |
| 21 | Network Engineering | Operations | S001, S017 | Routing, switching, wireless, WAN, SDN/NFV, network automation, monitoring. | Career root connected to cyber and cloud. |
| 22 | Cloud Computing | Operations/Engineering | S008 | On-demand network access to pooled resources via IaaS/PaaS/SaaS and public/private/hybrid/community deployments. | Vendor-neutral foundation before AWS/Azure/GCP. |
| 23 | Cloud-Native Engineering | Engineering/Operations | S018, S019 | Containers, microservices, service mesh, immutable infrastructure, declarative APIs, observability. | Advanced cloud architecture path. |
| 24 | DevOps | Operations/Engineering | S012, S003 | CI/CD, automation, collaboration, deployment pipelines, infrastructure, delivery performance. | Practical bridge from software engineering to operations. |
| 25 | Site Reliability Engineering | Operations/Engineering | S011 | SLOs, SLIs, error budgets, toil, incident response, automation, reliability. | Advanced operations path requiring cloud, Linux, networking. |
| 26 | Platform Engineering | Operations/Product | S018, S012 | Internal developer platforms, golden paths, self-service infrastructure, developer experience. | Higher-level DevOps path focused on reducing cognitive load. |
| 27 | Data Science | Data/AI | S006 | Data lifecycle, statistics, analytics, visualization, ML, communication, ethics. | Learms path from spreadsheets/Python to applied ML. |
| 28 | Data Engineering | Data/Engineering | S025, S026 | Data generation, ingestion, orchestration, transformation, storage, governance, pipelines, lakehouse. | Separate from data science; supports pipelines and reliability. |
| 29 | Business Intelligence & Analytics | Data/Product | S005, S006 | Dashboards, KPI modeling, SQL, visualization, storytelling, decision support. | Lower-math data path with strong employability. |
| 30 | Artificial Intelligence | Data/AI | S001, S010 | Search, knowledge representation, planning, ML, robotics, perception, NLP, ethics. | Parent root for AI concepts and responsible AI. |
| 31 | Machine Learning | Data/AI | S001, S006, S024 | Supervised/unsupervised/reinforcement learning, evaluation, feature engineering, deployment. | Requires math and data foundations. |
| 32 | Deep Learning | Data/AI | S001, S010 | Neural networks, CNN/RNN/transformers, generative models, hardware, training workflows. | Advanced ML path with compute constraints. |
| 33 | Natural Language Processing | Data/AI | S001, S002 | Text/speech language tasks, tokenization, embeddings, transformers, multilingual NLP. | Pakistan-specific Urdu NLP opportunity. |
| 34 | Computer Vision | Data/AI | S001, S002 | Image/video processing, detection, segmentation, recognition, OCR, reconstruction. | Bridges AI, robotics, health, AR/VR. |
| 35 | Robotics | Hardware/CPS/AI | S001, S015, S017 | Perception, localization, mapping, control, kinematics, planning, HRI, robot platforms. | Requires math, embedded, AI, and hardware labs. |
| 36 | MLOps | Data/AI/Operations | S024, S012 | Model registries, reproducible pipelines, serving, monitoring, retraining, governance. | Turns ML learning into production readiness. |
| 37 | AIOps | Operations/AI | S030, S011 | AI/ML for IT operations: anomaly detection, event correlation, causality, automation. | Advanced operations path after monitoring/SRE. |
| 38 | Cybersecurity | Security | S007, S009 | Defensive/offensive/security governance across data, software, systems, humans, organizations, society. | Root for Agent 3 security graph. |
| 39 | Application Security | Security/Engineering | S003, S009, S019 | Secure SDLC, web/app vulnerabilities, code review, threat modeling, testing. | Cross-link with web/backend/software testing. |
| 40 | Cloud Security | Security/Operations | S007, S008, S019 | IAM, network segmentation, workload protection, logging, compliance, shared responsibility. | Needed for cloud and DevOps tracks. |
| 41 | Digital Forensics & Incident Response | Security/Operations | S007, S009 | Evidence handling, investigation, malware triage, response lifecycle, recovery. | Cybersecurity specialization with labs. |
| 42 | Privacy Engineering | Security/Data | S021 | Privacy risk management, data processing lifecycle, privacy-by-design, controls. | Cross-link with data science, health, legal tech. |
| 43 | Blockchain & Web3 | Emerging/Security | S013 | Distributed ledgers, consensus, cryptocurrencies, smart contracts, forks, limitations. | Treat as specialized domain with security warnings. |
| 44 | Game Development | Product/Creative | S022 | Game design, programming, art/audio pipelines, engines, production, business. | Motivational project path for programming learners. |
| 45 | AR/VR/XR & Spatial Computing | Emerging/HCI | S023, S001 | Immersive interaction, 3D UI, tracking, latency, human factors, content pipelines. | Needs HCI, graphics, game engines, mobile/edge. |
| 46 | Computer Graphics & Visualization | Foundation/Product | S001, S002 | Rendering, geometry, animation, shaders, visualization, GPU programming. | Prerequisite for game, AR/VR, CV visualization. |
| 47 | Human-Computer Interaction | Product/Human | S023, S001 | User research, interaction design, usability evaluation, accessibility, human factors. | Core for frontend, UI/UX, learning-platform design. |
| 48 | Embedded Systems | Hardware/CPS | S017, S015 | Firmware, microcontrollers, RTOS, hardware interfaces, low-power design, testing. | Hardware-oriented path for Pakistan labs/IoT. |
| 49 | Internet of Things | Hardware/CPS/Cloud | S016, S015, S029 | Connected sensors/actuators, protocols, gateways, edge/cloud integration, security. | Cross-domain project path with low-cost hardware. |
| 50 | Edge/Fog Computing | Operations/CPS | S014, S029 | Compute near data sources for latency, bandwidth, autonomy, and local analytics. | Important for IoT, AR/VR, robotics, smart cities. |
| 51 | Serverless Computing | Cloud/Operations | S008, S019 | Event-driven FaaS/BaaS patterns, managed services, scaling, observability, vendor limits. | Useful beginner deployment path if tradeoffs are taught. |
| 52 | Database Administration | Data/Operations | S001, S005 | Operational database setup, backup/recovery, performance tuning, replication, security. | Career path distinct from database theory. |
| 53 | Big Data Systems | Data/Engineering | S006, S026 | Distributed storage/compute, streaming, lakehouse, governance, performance. | Supports data engineering and analytics at scale. |
| 54 | Quantum Computing | Emerging/Foundation | S020 | Quantum computation concepts plus post-quantum security implications. | Future-facing but should be separated from immediate career paths. |
| 55 | Post-Quantum Cryptography | Security/Emerging | S020 | Quantum-resistant key establishment/signatures and migration planning. | Advanced cyber/crypto topic with near-term relevance. |
| 56 | Neuromorphic Computing | Emerging/Hardware | S002 | Brain-inspired computing architectures and event/spiking approaches. | Research-only/advanced path; source depth pending. |
| 57 | DNA/Molecular Computing | Emerging/Foundation | S002 | Computation using biological/molecular substrates. | Research-only/advanced path; source depth pending. |
| 58 | Green/Sustainable Computing | Emerging/Systems | S027, S028 | Energy-efficient software/infrastructure, data-center sustainability, e-waste awareness. | Cross-cutting tag for cloud, systems, software architecture. |
| 59 | Educational Technology | Sector/Product | S023, S005 | Learning platforms, learning analytics, instructional design, accessibility. | Direct relevance to Learms product design. |
| 60 | Health Informatics | Sector/Data | S005, S021 | Clinical/health data, privacy, standards, decision support, analytics. | Sector specialization after data/security foundations. |
| 61 | Bioinformatics | Sector/Data/AI | S006, S002 | Computational biology, sequence analysis, genomics data, ML for bio data. | Advanced data/AI specialization with science prerequisites. |
| 62 | FinTech | Sector/Product/Security | S005, S007, S021 | Payments, risk, compliance, data, security, financial products. | Pakistan-relevant startup/freelancing specialization; source depth pending. |
| 63 | Legal Tech | Sector/Product/AI | S005, S021 | Legal workflows, documents, compliance, privacy, NLP for legal text. | Advanced domain after NLP/data/privacy. |
| 64 | AgriTech | Sector/IoT/Data | S016, S029 | Farm sensors, remote monitoring, decision support, weather/soil analytics. | Pakistan-relevant IoT/data opportunity; source depth pending. |
| 65 | Product Management for Technical Products | Product/Organization | S005, S012 | Requirements, prioritization, metrics, delivery coordination, stakeholder communication. | Non-coding IT career path for learners with business skills. |
| 66 | Technical Writing & Developer Relations | Product/Communication | S003, S023 | Documentation, tutorials, API communication, community education, advocacy. | Supports Learms content quality and career alternatives. |

> Note: Entries marked “source depth pending” are included because they appear in ACM CCS or cross-domain industry practice, but they still need the requested 10+ sources per root before final status.

---

## Root Grouping for Learms UI

## Topic: Learms top-level navigation should not show 66 roots at once
### Source: HCI curriculum tradition (Hewett et al., 1992) and CS2023 competency model (ACM/IEEE-CS/AAAI, 2023)
### Key Finding: Human-facing learning systems should organize complex domains into meaningful groups and progressively reveal detail; CS2023 also shows that computing can be decomposed into knowledge areas rather than one huge list.
### Relevance to Learms: Agent 2 should present 8–12 top-level clusters and let students drill into roots/sub-roots.
### Citation: https://doi.org/10.1145/2594128 ; https://csed.acm.org/

Recommended UI clusters:

1. **Foundations**: Programming Fundamentals, DSA, Discrete Math, OS, Networks, Architecture, PL/Compilers.
2. **Software & Product Engineering**: Software Engineering, Architecture, Testing/QA, Web, Mobile, Backend, Frontend, Full-stack.
3. **IT Operations & Cloud**: IT, SysAdmin, Network Engineering, Cloud, Cloud-Native, DevOps, SRE, Platform Engineering, Serverless.
4. **Data & AI**: Databases, Data Science, Data Engineering, BI, AI, ML, DL, NLP, CV, MLOps, Big Data.
5. **Security & Trust**: Cybersecurity, AppSec, Cloud Security, DFIR, Privacy Engineering, Post-Quantum Crypto.
6. **Hardware, CPS & Immersive**: Embedded, IoT, Edge/Fog, Robotics, Graphics, AR/VR/XR.
7. **Creative & Emerging**: Game Development, Blockchain/Web3, Quantum Computing, Neuromorphic, DNA Computing, Green Computing.
8. **Sector Applications**: EdTech, Health Informatics, Bioinformatics, FinTech, LegalTech, AgriTech.
9. **Non-Coding/Hybrid Careers**: Information Systems, Product Management, Technical Writing, Developer Relations.

---

## Initial Contradictions and Ambiguities

## Topic: “IT” means different things in curricula, workplaces, and Pakistani usage
### Source: ACM/IEEE-CS IT2017; ACM/AIS IS2020; ACM/IEEE-CS/AAAI CS2023
### Key Finding: Formal curricula distinguish CS, IT, IS, SE, and CE, but Pakistani students and job ads often use “IT” broadly for all computing. Source-backed Pakistan job-ad analysis still pending.
### Relevance to Learms: Learms should allow broad search terms but route learners into clearer roots after diagnosis.
### Citation: https://www.acm.org/binaries/content/assets/education/curricula-recommendations/it2017.pdf ; https://www.acm.org/binaries/content/assets/education/curricula-recommendations/is2020.pdf ; https://csed.acm.org/

## Topic: Web/mobile roles blend multiple formal roots
### Source: ACM/AIS, 2020; IEEE Computer Society, 2024
### Key Finding: IS2020 lists web/mobile/UI in development competencies, while SWEBOK treats many underlying practices—requirements, design, construction, testing, maintenance—as software engineering.
### Relevance to Learms: Learms should model web/mobile as career domains that depend on software-engineering practices, not as isolated framework tracks.
### Citation: https://www.acm.org/binaries/content/assets/education/curricula-recommendations/is2020.pdf ; https://www.computer.org/education/bodies-of-knowledge/software-engineering

## Topic: AI education must balance capability and risk
### Source: ACM/IEEE-CS/AAAI, 2023; NIST, 2023
### Key Finding: CS2023 adds substantial AI curricular coverage, while NIST AI RMF emphasizes risks and trustworthy/responsible development and use.
### Relevance to Learms: AI modules should pair technical tasks with bias, privacy, explainability, evaluation, and safety prompts.
### Citation: https://csed.acm.org/ ; https://doi.org/10.6028/NIST.AI.100-1

---

## Gaps to Fill Before Final

- Need Pakistan-specific validation for which roots have highest learner demand and job demand.
- Need 10+ sources per major root; current v0.1 focuses on authoritative framework anchors.
- Need salary, job posting, and freelancing evidence from PSEB/P@SHA/LinkedIn/Indeed/Upwork/Fiverr where accessible.
- Need more formal sources for AR/VR/XR, health informatics, bioinformatics, fintech, legal tech, agritech, neuromorphic, DNA computing.
- Need contradiction matrix: academic taxonomy vs employer roles vs bootcamp marketing vs Pakistani student vocabulary.
