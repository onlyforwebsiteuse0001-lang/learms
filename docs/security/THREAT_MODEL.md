# STRIDE threat model

| Area | S/T/R/I/D/E threats | Controls |
|---|---|---|
| Browser/API | spoofing, tampered requests, replay | MFA, short tokens, CSRF, origin checks, nonce/timestamp |
| Auth | credential stuffing, token theft, elevation | Argon2id, HIBP k-anonymity, throttling, rotation, deny-by-default |
| Student data | IDOR, disclosure, tampering | object ownership checks, RLS, encryption, audit trail |
| Uploads/providers | malware, SSRF, parser injection | magic bytes, size limits, isolated scanner, URL/IP allowlist |
| DB/cache | injection, poisoning, outage | bound parameters, TLS, ACLs, backups, resource limits |
| Admin/ops | insider abuse, repudiation | separate roles, phishing-resistant MFA, immutable audit, dual control |
| Runtime | container escape, DoS | non-root, read-only FS, seccomp, quotas, WAF/rate limits |

Risk acceptance requires security-owner signoff. Threats are reviewed on every architecture or dependency change.
