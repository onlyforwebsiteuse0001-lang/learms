# Security Policy

## Reporting a vulnerability

Email the maintainers via the contact in the repository profile, or open a GitHub
security advisory on this repo. **Do not** file public issues for vulnerabilities.
We aim to acknowledge within 72 hours.

## Supported versions

| Version | Supported |
|---|---|
| v1.5.x | ✅ current |

## Security architecture (v1.5.0)

- Auth: PBKDF2/argon2 password hashing, short-lived JWTs; MFA (TOTP + recovery codes),
  OAuth PKCE, and session-limit logic are provided by the integrated `security/` package.
- AuthZ: RBAC/ABAC building blocks and row-level-security guidance (`docs/security/`).
- Input validation: command-injection, path-traversal, SSRF validators; strict upload
  validation (type, size, container checks) before queueing.
- LLM guardrails: prompt-injection detector, input sanitizer, output validator, policy
  gate, audit hooks (`security/llm/`).
- API hardening: security headers middleware, CORS allowlist, rate limiting module,
  request signing module; honest capability reporting (no silent fallbacks).
- Supply chain: CI runs bandit, pip-audit, gitleaks, and Trivy on every push.

## Hardening status

- Backend hardening report: `docs/SECURITY.md`
- Design + compliance docs (threat model, OWASP coverage, cryptography, incident
  response, pentest template, privacy): `docs/security/`
- Secrets are never committed (`.env` gitignored; gitleaks in CI).

## Operational notes

- `SECRET_KEY`/`POSTGRES_PASSWORD` have no usable defaults in production — compose
  refuses to start without them; generate with `secrets.token_urlsafe(48)`.
- Set `FORCE_HTTPS=true` and `APP_ENV=production` behind a TLS terminator.
