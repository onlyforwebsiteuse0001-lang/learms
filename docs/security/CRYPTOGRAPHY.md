# Cryptography standard

TLS 1.3, HSTS, modern certificate management, AES-256-GCM envelope encryption through KMS/Vault, separate environment keys and rotation at least every 90 days. Argon2id for passwords; SHA-256 only for integrity; Ed25519 for signatures. Use OS CSPRNG (`secrets`), never predictable randomness. Keys are never committed, logged, or placed in client bundles. Backups are encrypted and restore-tested. Mobile certificate pinning requires an operational rotation plan.
