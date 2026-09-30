# Programming Language Learning Paths — Agent 5

- Status: Draft v0.1, Area 2 in progress
- Date accessed: 2026-09-30 UTC
- Scope: 35 requested languages.
- Caveat: Time estimates are provisional bands, not final research-grade findings. Exact estimates require learner studies and Pakistan student validation.

---

## Source-Backed Findings

## Topic: Language path should depend on learner goal
### Source: Stack Overflow, 2024; GitHub, 2024; JetBrains, 2024
### Key Finding: Global popularity signals differ: Stack Overflow survey usage, GitHub repository activity, and JetBrains ecosystem survey do not produce identical rankings.
### Relevance to Learms: Learms should recommend languages by target outcome rather than “one best language.”
### Citation: https://survey.stackoverflow.co/2024/ ; https://github.blog/news-insights/octoverse/octoverse-2024/ ; https://www.jetbrains.com/lp/devecosystem-2024/

## Topic: Official documentation should be part of every language path
### Source: Language official documentation set, 2026
### Key Finding: Each language ecosystem maintains official documentation or manuals that define syntax, standard libraries, tooling, and idioms; tutorial-only learning risks shallow copy-paste behavior.
### Relevance to Learms: Every Learms language module should include “read docs and apply” tasks, not only videos.
### Citation: See source IDs S037-S072 in `docs/it-research/sources/SOURCE_REGISTER.csv`.

---

## Universal Language Learning Framework

| Stage | Goals | Evidence / Source Anchor | Learms Assessment |
|---|---|---|---|
| Beginner | Syntax, variables, control flow, functions, basic data structures, errors, docs reading | S001, S037-S072 | 10 small tasks + one mini-project |
| Early Intermediate | Modules/packages, files, APIs, testing, debugging, style, standard library | S003, S037-S072 | Project with tests and README |
| Intermediate | Framework/library in chosen domain, database or external service, deployment or packaging | S003, S005, S008 | End-to-end domain project |
| Advanced | Performance, architecture, security, concurrency, maintainability, observability | S003, S007, S011, S012 | Capstone + code review + postmortem |
| Professional | Team workflow, CI/CD, monitoring, documentation, interviews, portfolio | S003, S012 | Portfolio review and role readiness checklist |

---

## Per-Language Draft Paths

| Language | Beginner Path | Intermediate Path | Advanced Path | First Project | Approx. Proficiency Band | Source |
|---|---|---|---|---|---|---|
| Python | Syntax, functions, lists/dicts, files, venv/pip | OOP, testing, APIs, Pandas or FastAPI | ML pipelines, async, packaging, performance | CLI expense tracker or CSV analyzer | 3-6 months for job-ready basics with projects | S037, S031-S033 |
| JavaScript | Browser basics, DOM, events, fetch | Node.js, React/Vue, testing, async | TypeScript, performance, accessibility, full-stack | Interactive web calculator + API call | 3-6 months frontend basics | S038, S031-S033 |
| TypeScript | JS refresh, types, interfaces, generics | React/Next or Node/Nest, API typing | monorepos, advanced types, design systems | Typed task app | 2-4 months after JS basics | S039 |
| Java | Syntax, classes, collections, exceptions | Spring Boot, SQL, testing, Maven/Gradle | concurrency, JVM tuning, microservices | REST API with PostgreSQL | 6-9 months for backend entry | S040 |
| C | Pointers, memory, arrays, structs, compile/link | POSIX, data structures, debugging with gdb | OS, embedded, security, performance | mini shell or file parser | 6-12 months; harder first language | S041 |
| C++ | C++ basics, RAII, STL | OOP/generic programming, CMake, tests | performance, concurrency, game/embedded patterns | 2D game or simulation | 9-15 months for serious proficiency | S042 |
| C# | Syntax, OOP, collections, LINQ | ASP.NET, EF Core, testing, APIs | architecture, cloud, Unity or enterprise patterns | ASP.NET CRUD app | 4-8 months | S043 |
| Go | Syntax, structs, interfaces, errors | HTTP services, goroutines, channels, testing | distributed systems, Kubernetes tools, observability | JSON REST service | 4-8 months after basics | S044 |
| Rust | Ownership, borrowing, enums, pattern matching | crates, error handling, async basics | systems, embedded, WASM, unsafe review | CLI grep clone | 9-15 months; advanced mental model | S045 |
| Kotlin | Kotlin syntax, null safety, collections | Android Compose or Ktor, coroutines | multiplatform, architecture, testing | Android notes app | 5-9 months | S046 |
| Swift | Swift syntax, optionals, structs/classes | SwiftUI/UIKit, networking, persistence | concurrency, architecture, App Store release | iOS habit tracker | 5-9 months plus Apple tooling | S047 |
| PHP | Syntax, arrays, forms, HTTP basics | Laravel, MVC, SQL, auth | queues, testing, deployment, security | Laravel CRUD app | 3-6 months for web basics | S048 |
| Ruby | Syntax, blocks, objects, gems | Rails, ActiveRecord, testing | metaprogramming, performance, scaling | Rails blog/app | 3-6 months web basics | S049 |
| Dart | Dart syntax, async, null safety | Flutter widgets, state, navigation | performance, platform channels, release | Flutter weather app | 4-8 months | S050 |
| R | Vectors, data frames, stats basics | tidyverse, visualization, modeling | reproducible reports, Shiny, statistical modeling | EDA notebook/report | 4-8 months with stats | S051 |
| MATLAB | Matrices, plotting, scripts/functions | toolboxes, Simulink basics, signal/control | optimization, code generation, research workflows | signal processing demo | 4-8 months with math | S052 |
| Scala | Syntax, collections, FP basics | Spark, Akka/Pekko, JVM tooling | type systems, distributed data, FP architecture | Spark ETL job | 9-15 months | S053 |
| Perl | Scalars/arrays/hashes, regex, files | CPAN, scripts, text pipelines | legacy maintenance, bioinformatics workflows | log analyzer | 3-6 months for scripting | S054 |
| Lua | Syntax, tables, functions | embedding, game scripting, metatables | performance, C API, plugin systems | game mod script | 2-5 months | S055 |
| Haskell | Pure functions, recursion, types | monads, IO, testing | type-level programming, compilers | parser combinator mini-project | 9-18 months | S056 |
| Elixir | Pattern matching, functions, processes | Phoenix, OTP basics, Ecto | distributed systems, observability | real-time chat app | 6-12 months | S057 |
| Erlang | Functional syntax, processes, message passing | OTP behaviours, supervision trees | distributed fault tolerance | resilient counter service | 6-12 months | S058 |
| Clojure | Lisp syntax, data structures, REPL | web/data libs, JVM interop | macros, immutable architecture | data transformation service | 6-12 months | S059 |
| F# | Functions, records, discriminated unions | .NET interop, async, data workflows | domain modeling, computation expressions | typed domain model API | 6-12 months | S060 |
| Julia | Syntax, arrays, multiple dispatch | packages, plotting, data frames | performance, scientific ML, optimization | numerical simulation | 4-9 months with math | S061 |
| Groovy | Syntax, closures, scripts | Gradle/Jenkins, JVM interop | build automation, DSLs | Jenkins pipeline or Gradle plugin | 2-5 months if JVM known | S062 |
| Visual Basic | Syntax, .NET basics, forms | database apps, .NET libraries | legacy modernization | inventory desktop app | 3-6 months for maintenance | S063 |
| Assembly x86/ARM | Registers, memory, instructions | calling conventions, debugging, ABI | reverse engineering, exploit/firmware analysis | simple boot/embedded routine | 12+ months with architecture | S064, S065 |
| SQL | SELECT/filter/sort/join/group | indexes, transactions, window functions | query tuning, modeling, warehousing | sales dashboard queries | 2-4 months core skill | S066 |
| Shell Bash/Zsh | commands, pipes, variables, scripts | cron, awk/sed, error handling | robust automation, CI/CD, ops scripts | backup automation script | 2-4 months useful skill | S067 |
| Solidity | JS/web3 basics, contract syntax | Hardhat/Foundry, testing, security | audits, gas optimization, DeFi patterns | escrow contract with tests | 6-12 months after JS/security | S068, S013 |
| Move | resource model, modules | Aptos/Sui toolchain, tests | asset safety, formal checks | token/resource module | 6-12 months niche | S069 |
| Cairo | syntax, felt/types, Starknet basics | contracts, tests, account abstraction | ZK/STARK app design | Starknet voting contract | 6-12 months niche | S070 |
| Zig | syntax, build system, memory | C interop, allocators, tests | systems, embedded, compiler/tooling | CLI utility | 6-12 months | S071 |
| Nim | syntax, types, modules | async, macros, C interop | systems/tooling, performance | static site or CLI tool | 4-8 months | S072 |

---

## Recommended Language Paths by Learner Goal

| Goal | Start | Second | Third | Reason | Source |
|---|---|---|---|---|---|
| Absolute beginner in Pakistan | Python or JavaScript | SQL | Git + Shell | Fast feedback plus broad employability. | S031-S036 |
| Freelancing web | HTML/CSS + JavaScript | PHP/Laravel or TypeScript | SQL | Web/CMS/full-stack remains accessible. | S034, S038, S048 |
| AI/data | Python | SQL | R or Julia | Python dominates AI/data signals; SQL needed for data access. | S032, S037, S066 |
| Enterprise backend | Java or C# | SQL | TypeScript | Enterprise stacks plus web/API needs. | S034, S040, S043 |
| Cloud/DevOps | Python or Go | Shell | YAML/Terraform syntax later | Automation and cloud tools. | S012, S044, S067 |
| Mobile Android | Kotlin | Java basics | SQL/Firebase concepts | Kotlin modern Android, Java legacy interop. | S046, S034 |
| Mobile iOS | Swift | SQL/API basics | TypeScript optional | Apple ecosystem path. | S047, S034 |
| Systems/embedded | C | C++ or Rust | Assembly basics | Hardware and performance path. | S041, S042, S045, S064-S065 |
| Game development | C# for Unity or C++ for Unreal | Lua optional | Python tools optional | Engine-driven path. | S022, S042, S043, S055 |
| Blockchain/Web3 | JavaScript/TypeScript | Solidity | Rust/Move/Cairo depending chain | Smart contract work needs web and security foundations. | S013, S068-S070 |

---

## Evidence Gaps

- “Time to proficiency” must be validated by learner interviews, course-completion data, or credible studies; current bands are planning estimates.
- Pakistan salaries need updated current data.
- Language-specific misconception lists need research from CS education and Stack Overflow-style error corpora.
- Resource recommendations need source-backed review of books/courses/videos.
