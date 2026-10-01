# Threat intelligence research (2026-10-01)

Use NVD/OSV/vendor advisories rather than hard-coded CVE lists; scan Python, FastAPI, PostgreSQL, Redis, Docker images on every build and daily. OWASP API risks emphasize BOLA, broken authentication, property/function authorization, unrestricted resource consumption, and unsafe API inventory. MITRE ATT&CK maps credential access, valid accounts, execution, persistence, collection, and exfiltration to detections. Treat prompt injection and indirect injection through documents as application threats, not model-only issues.

Sources: NIST ZTA [SP 800-207](https://www.nist.gov/publications/zero-trust-architecture); OWASP LLM 2025 summary [1](https://www.trydeepteam.com/docs/frameworks-owasp-top-10-for-llms); Pakistan legal status [2](https://www.dlapiperdataprotection.com/index.html?t=law&c=PK). Verify every advisory against official vendor/NVD sources before remediation.
