# Authentication hardening

Use 12+ character passwords (allow passphrases), breached-password screening via HIBP k-anonymity, Argon2id, no hints/questions, TOTP or WebAuthn, hashed single-use recovery codes. SMS is recovery-only and discouraged. Access tokens expire in 15 minutes; rotating refresh tokens expire in 7 days and are revoked on reuse. Cookies are HttpOnly, Secure, SameSite=Strict. Apply per-account and per-IP throttling with exponential delay; CAPTCHA after three failures. Bind sessions to a coarse risk signal, not a brittle IP lockout. OAuth uses authorization-code PKCE and exact redirect allowlists. Magic links are random, hashed, single-use, and expire in ten minutes.

Implementations in `security/` are reference utilities and require deployment review, key storage, and integration tests before production.
