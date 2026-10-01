# Security testing plan

Pre-commit: gitleaks, Bandit, Semgrep. CI: pip-audit, dependency review, Trivy, unit/property tests, and authenticated OWASP ZAP baseline against an isolated environment. Schemathesis fuzzes OpenAPI boundaries. Quarterly manual OWASP Top 10 review and annual independent penetration test. Critical findings block deploy; critical patch SLA 24h, high 7d. Evidence includes tool version, scope, artifact, owner, and remediation proof.
