# Infrastructure security

Private subnets for DB/Redis; only edge is public. WAF and DDoS controls sit before the API. Images are minimal, signed, scanned with Trivy, non-root, no privilege, read-only where possible, and resource/seccomp/AppArmor constrained. No production SSH; use audited bastion/SSM. Vault or cloud secret manager supplies short-lived secrets. Central logs redact tokens/PII. Encrypted off-site backups define RPO/RTO and have scheduled restore drills.
