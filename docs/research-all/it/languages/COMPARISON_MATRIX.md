# Programming Languages Comparison Matrix — Agent 5

- Status: Draft v0.1, Area 2 in progress
- Date accessed: 2026-09-30 UTC
- Scope: 35 languages requested by user.
- Caveat: This is an initial triangulation using global surveys, official docs, and limited public Pakistan salary data. It is **not yet** the final research-grade difficulty/demand ranking.

---

## Source-Backed Findings

## Topic: Global language popularity differs by measurement source
### Source: Stack Overflow, 2024; GitHub, 2024; JetBrains, 2024
### Key Finding: Stack Overflow 2024 reports JavaScript, HTML/CSS, and Python at the top among survey respondents; GitHub Octoverse 2024 reports Python overtaking JavaScript by overall GitHub activity; JetBrains 2024 reports JavaScript and Python as the two most-used languages in its survey and highlights TypeScript, Rust, and Python in its language promise framing.
### Relevance to Learms: Learms should not show a single universal “best language” ranking; it should show rankings by goal: beginner learning, web jobs, AI/data, systems, mobile, enterprise, and Pakistan market.
### Citation: https://survey.stackoverflow.co/2024/ ; https://github.blog/news-insights/octoverse/octoverse-2024/ ; https://www.jetbrains.com/lp/devecosystem-2024/

## Topic: Pakistan public salary data is available but not current enough for final ranking
### Source: P@SHA, 2021
### Key Finding: Public P@SHA Salary Survey 2021 excerpts include role/language categories such as Python, Java, .NET, C++, PHP/Laravel, Ruby, Node, Android, iOS, Unity, frontend JS frameworks, and full-stack, but this public source is older and must be updated with 2023-24/2024-25 data if accessible.
### Relevance to Learms: Pakistan salary displays should include a freshness warning and should not overfit to old salary numbers.
### Citation: https://www.pasha.org.pk/wp-content/uploads/Salary-Survey-2021-1.pdf

## Topic: Pakistan IT industry scale supports language-job research priority
### Source: PSEB, 2024
### Key Finding: PSEB’s 2024 annual report describes Pakistan’s IT exports and workforce context, including claims of strong export growth and a large IT/ITeS workforce.
### Relevance to Learms: Pakistan-specific language recommendations should prioritize employability in export-oriented software, freelancing, and IT services.
### Citation: https://www.techdestination.com/wp-content/uploads/2025/01/PSEB-ANNUAL-REPORT-7_compressed.pdf

---

## Global Demand Snapshot

| Language | Stack Overflow 2024 signal | GitHub Octoverse 2024 signal | JetBrains 2024 signal | Initial Learms interpretation |
|---|---|---|---|---|
| Python | Top 3; most desired per SO blog summary | #1 by overall GitHub activity in 2024 | #2 with 57% in secondary report summary | Best general beginner + AI/data language. |
| JavaScript | #1 with about 62% in SO blog summary | #2 by overall GitHub activity in 2024 | #1 with 61% in secondary report summary | Best web/frontend entry language. |
| TypeScript | Desired/growing; exact SO figure pending | #3 in 2024; continued growth | High promise; 37% usage in secondary summary | Best modern web/full-stack professional upgrade after JS. |
| Java | Common enterprise language | #4 in GitHub 2024 top list | 46% in secondary JetBrains summary | Strong enterprise/backend and university language. |
| C# | Common professional language | #5 in GitHub 2024 top list | Source detail pending | Strong .NET/Unity path. |
| C++ | Systems/games language | #6 in GitHub 2024 top list | Source detail pending | Strong systems/game/embedded path; harder beginner path. |
| PHP | Web backend legacy + WordPress/Laravel | #7 in GitHub 2024 top list | Source detail pending | Pakistan freelancing relevance likely; validate current demand. |
| Shell | DevOps/sysadmin scripting | #8 in GitHub 2024 top list | Source detail pending | Required support skill for Linux/cloud. |
| C | Systems/embedded | #9 in GitHub 2024 top list | Source detail pending | Foundation for low-level/embedded/security. |
| Go | Cloud-native/backend | #10 in GitHub 2024 top list | Source detail pending | Strong cloud/backend niche; not first beginner default. |
| Rust | Most admired in SO 2024 blog summary | Growing systems language | High promise in JetBrains secondary summary | Excellent advanced systems/security path after foundations. |

Sources: S031, S032, S033.

---

## Pakistan Salary Evidence Snapshot — Public 2021 Only

> Warning: PKR figures below are from public P@SHA 2021 excerpts and are **not current salaries**. Use only as historical baseline until newer reports/job-posting data are collected.

| Language / Stack Category | Public P@SHA 2021 national average PKR | Learms interpretation | Source |
|---|---:|---|---|
| Node | 121,406 | Backend JS/Node appeared relatively strong in old public table. | S034 |
| Python | 105,417 | Python had strong historical salary signal. | S034 |
| MEAN/MERN/Full Stack | 101,111 | Full-stack web had strong employability signal. | S034 |
| Ruby | 100,833 | Ruby niche paid well historically but current demand needs validation. | S034 |
| Java | 98,261 | Java enterprise/backend remained solid. | S034 |
| Backend Developer | 90,946 | Backend path should remain a core Learms track. | S034 |
| .NET | 89,038 | C#/.NET had solid Pakistan enterprise demand historically. | S034 |
| C++ | 88,542 | C++ had hardware/systems/game niche signal. | S034 |
| Android | 85,500 | Mobile Android remains relevant; Kotlin/Java split needs current validation. | S034 |
| React Native/JS/Vue/Angular | 85,135 | Frontend/cross-platform JS frameworks had mainstream demand. | S034 |
| iOS | 83,065 | Swift/iOS demand exists but ecosystem/access costs may be barriers. | S034 |
| PHP/Laravel/CodeIgnitor/Yii | 78,929 | PHP remains important for freelancing/CMS/Laravel, but salary lower in old table. | S034 |
| HTML Front End | 66,357 | HTML-only/frontend junior work paid lower historically; needs JS/TS upgrade. | S034 |

---

## Initial Beginner Suitability Matrix

This is a **draft pedagogical ranking**, not final research. “High” means easier first projects and lower setup friction; “Low” means strong prerequisites or niche tooling.

| Language | Beginner Suitability | Main Risk for Beginners | Best First Learms Track | Source Anchor |
|---|---|---|---|---|
| Python | High | Environment/package confusion after basics | Programming fundamentals, data, automation | S037, S031-S033 |
| JavaScript | High | Browser vs Node confusion, async, dynamic types | Web/front-end | S038, S031-S033 |
| TypeScript | Medium | Type system plus JS ecosystem | Modern frontend/full-stack after JS | S039 |
| Java | Medium | Verbosity, OOP abstractions, build tools | CS university, enterprise backend | S040 |
| C | Low-Medium | Memory, pointers, compiler/toolchain | Systems/embedded after basics | S041 |
| C++ | Low | Complexity, memory, templates, build systems | Games/systems after C/DSA | S042 |
| C# | Medium | .NET ecosystem choices | .NET backend, Unity | S043 |
| Go | Medium | Interfaces/concurrency mental model | Backend/cloud tools | S044 |
| Rust | Low-Medium | Ownership/borrowing; compiler model | Advanced systems/security | S045 |
| Kotlin | Medium | Android toolchain; JVM concepts | Android/mobile | S046 |
| Swift | Medium | Apple ecosystem access/tooling | iOS/macOS | S047 |
| PHP | High-Medium | Legacy vs modern PHP confusion | Web/Laravel/freelancing | S048 |
| Ruby | High-Medium | Magic/metaprogramming in Rails | Rails/web after basics | S049 |
| Dart | Medium | Flutter framework before language depth | Flutter/mobile | S050 |
| R | Medium | Statistics prerequisite | Data/statistics | S051 |
| MATLAB | Medium | Licensing and numeric thinking | Engineering/numerical computing | S052 |
| Scala | Low | FP plus JVM ecosystem | Big data/advanced backend | S053 |
| Perl | Medium | Syntax density; legacy idioms | Scripting/legacy/bioinformatics | S054 |
| Lua | Medium-High | Tables/metatables mental model | Game/plugin scripting | S055 |
| Haskell | Low | Pure FP abstractions | Theory/FP advanced | S056 |
| Elixir | Medium | Functional + OTP concepts | Real-time distributed apps | S057 |
| Erlang | Low-Medium | Syntax and OTP model | Telecom/distributed systems | S058 |
| Clojure | Low-Medium | Lisp syntax, immutable FP | JVM FP/data apps | S059 |
| F# | Medium | FP concepts in .NET | Domain/data-heavy .NET | S060 |
| Julia | Medium | Scientific/math prerequisite | Scientific computing | S061 |
| Groovy | Medium | JVM/Gradle/Jenkins context | DevOps/JVM scripting | S062 |
| Visual Basic | High-Medium | Legacy relevance vs modern demand | Legacy .NET maintenance | S063 |
| Assembly x86/ARM | Low | CPU architecture and debugging | Reverse engineering/embedded | S064, S065 |
| SQL | High-Medium | Set-based thinking vs loops | Data/backend/BI | S066 |
| Shell Bash/Zsh | Medium | Quoting, pipes, environment | Linux/DevOps | S067 |
| Solidity | Low-Medium | Security risk, gas, blockchain concepts | Web3 after JS/security | S068, S013 |
| Move | Low | Small ecosystem, resource model | Web3 advanced | S069 |
| Cairo | Low | ZK/STARK context | Starknet/ZK advanced | S070 |
| Zig | Low-Medium | Manual memory/systems concepts | Systems after C basics | S071 |
| Nim | Medium | Smaller ecosystem | Systems/scripting niche | S072 |

---

## Learms UI Recommendation

## Topic: Language comparison UI should be goal-filtered
### Source: Stack Overflow 2024; GitHub Octoverse 2024; P@SHA 2021
### Key Finding: A learner choosing a language needs different evidence depending on goal: Python wins beginner/data/AI contexts; JavaScript/TypeScript dominate web; Java/C# remain enterprise; C/C++/Rust/Zig fit systems; SQL/Shell are cross-cutting employability skills; Pakistan public salary evidence is incomplete and older.
### Relevance to Learms: Agent 2 should implement comparison filters: Beginner, Pakistan jobs, Freelancing, AI/data, Web, Mobile, Cloud/DevOps, Systems, Security, Blockchain.
### Citation: https://survey.stackoverflow.co/2024/ ; https://github.blog/news-insights/octoverse/octoverse-2024/ ; https://www.pasha.org.pk/wp-content/uploads/Salary-Survey-2021-1.pdf

---

## Gaps

- Need current Pakistan job-posting scrape/manual count for each language.
- Need current P@SHA salary survey if public/available; 2021 public table is too old for final salary display.
- Need Upwork/Fiverr keyword demand and rate sampling.
- Need language-specific beginner misconception studies beyond generic programming education research.
- Need official history source verification for many languages where current docs do not include creator/year.
