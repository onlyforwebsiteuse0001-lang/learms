# Navigation and Learning Path UX — Agent 5

- Status: Draft v0.1, Area 7 in progress
- Source anchors: S001-S006, S091, S105, S109

## Topic: Too many options can discourage action in some contexts
### Source: Iyengar and Lepper, 2000
### Key Finding: Choice overload research found that extensive choices can sometimes reduce motivation/action compared with limited choices; the effect is context-dependent and should be applied cautiously.
### Relevance to Learms: Avoid presenting all languages/frameworks/subdomains at once to beginners.
### Citation: https://doi.org/10.1037/0022-3514.79.6.995

## Topic: Computing has multiple legitimate path structures
### Source: ACM/IEEE curriculum reports
### Key Finding: CS, SE, IT, IS, cybersecurity, and data science curricula define distinct competence profiles.
### Relevance to Learms: Navigation should be role/path-based, not a flat list of technologies.
### Citation: https://csed.acm.org/ ; https://www.acm.org/binaries/content/assets/education/curricula-recommendations/it2017.pdf ; https://dstf.acm.org/

## Learms Navigation Model

| Stage | UI Goal | Recommended Choice Count |
|---|---|---|
| New learner | identify broad goal | 3-5 cards |
| After quiz | show top 2-3 paths | 2-3 recommendations |
| Inside path | show current module + next milestone | 1 primary action |
| Exploration | allow browsing with filters | many, but organized |
| Switching | show overlap and cost | transition map |

## Path Card Fields

- Name: e.g., Web Developer, Data Analyst, SOC Analyst.
- Daily work.
- First language/tool.
- Prerequisites.
- First project.
- Time-to-first-portfolio estimate.
- Pakistan evidence confidence.
- Market source date.
- Related paths.

## Agent 1 Knowledge Graph Notes

- `Path` nodes should connect to `Concept`, `Tool`, `Language`, `Project`, `Role`, and `EvidenceSource` nodes.
- `Prerequisite` edges should support both hard prerequisites and soft co-requisites.
- Navigation should query graph depth gradually.

## Gaps

- Need user research with Pakistani students to validate card labels.
- Need current local job data before market confidence appears in UI.
