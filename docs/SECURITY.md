# Backend Security Hardening Report

Date: 2026-10-01

## Implemented and tested

- PBKDF2-SHA256 salted password hashing and constant-time verification.
- JWT signature, algorithm, expiry, malformed subject, and default-role tests.
- Production/staging startup fails closed for default/short secrets, disabled HTTPS, or localhost CORS.
- HSTS on HTTPS, CSP, frame denial, MIME sniffing denial, permissions policy, referrer policy, no-store API caching, and request correlation IDs.
- Uploaded names are path-component stripped and bounded.
- Uploads are streamed with hard byte limits and exclusive file creation.
- PDF/OpenXML magic bytes and parsability are checked.
- OpenXML member count, expanded size, and compression ratio mitigate ZIP bombs.
- Cross-tenant learning and document lookups are ownership scoped.
- AI output must match strict schemas and exact source evidence.
- `pip-audit` initially found vulnerable pypdf/Pillow constraints. They were raised to pypdf 6.16.1+ and Pillow 12.3.0+; the production requirements audit then reported **No known vulnerabilities found**.

## OWASP mapping

- Broken access control: ownership-scoped queries and contract tests; broader RBAC is not implemented.
- Cryptographic failures: environment secrets and signed expiring JWTs; no refresh/revocation flow yet.
- Injection: SQLAlchemy expressions avoid raw input SQL; strict Pydantic request validation.
- Insecure design: no fabricated learning outputs, prerequisite gating, evidence validation.
- Security misconfiguration: deployment validators and headers.
- Vulnerable components: audited and constraints updated.
- Identification/auth failures: password/JWT edge cases tested; brute-force controls remain open.
- Integrity failures: strict archive/container validation; antivirus hook remains open.
- Logging/monitoring failures: JSON logging exists and request IDs/metrics were added; durable audit trail remains open.
- SSRF: provider URLs are constants, not caller supplied.

## Open high-priority findings

1. Refresh-token rotation and revocation are not implemented.
2. Login rate limiting/brute-force protection needs Redis-backed shared state.
3. Teacher/admin RBAC and class membership are not modeled.
4. Malware scanning needs a deployment hook (for example ClamAV); parsing checks are not antivirus.
5. Metrics endpoint should be network-restricted by ingress in production.
6. Tamper-evident durable audit storage is not implemented.
7. CSRF is not applicable to bearer-token APIs today; reassess if browser cookies are introduced.
