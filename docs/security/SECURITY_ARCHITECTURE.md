# Security architecture

Security is a risk-management system, not a promise of unbreakability. The service uses zero trust: every request is authenticated, authorized, validated, rate-limited, logged, and treated as hostile regardless of network location.

## Trust boundaries and DFD
```text
Student browser --TLS--> WAF/API edge --authz--> API services --parameterized SQL--> PostgreSQL
                                      |              |--TLS--> Redis (rate limits/jobs)
                                      |              |--allowlist--> external providers
                                      +--> append-only audit sink
Admin console --MFA + privileged role--> admin APIs
```
Boundaries: public client/edge, application runtime, data tier, third-party providers, and operations plane. Secrets never cross into client responses or logs.

## Defense in depth
TLS/HSTS and WAF; secure cookies and CSRF; Argon2id/MFA; default-deny RBAC+ABAC and database RLS; strict schemas and output encoding; encrypted fields/backups; least-privilege containers; immutable audit logs; dependency/SAST/DAST scanning; alerting and tested recovery.

## STRIDE summary
See `THREAT_MODEL.md`. Every asset has an owner, threat, preventive control, detective control, and recovery action. Fail closed on authorization, provider, key, parser, and upload errors.

## Principles
Least privilege, separation of duties (developer cannot approve production access), complete mediation on every object access, secure defaults, explicit consent, minimization, and reproducible change review. UUIDs are identifiers, never authorization.
