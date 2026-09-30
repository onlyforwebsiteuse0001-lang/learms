# Security release checklist

- [ ] Threat model reviewed and risks owned
- [ ] Authentication uses Argon2id, MFA, rotation, throttling
- [ ] Every route has authentication and object-level authorization
- [ ] Tenant/student RLS tested with cross-tenant cases
- [ ] UUIDs and generic errors used
- [ ] Schemas bound sizes and reject unknown fields
- [ ] SQL, shell, template, path, XML and outbound URL inputs reviewed
- [ ] Uploads type/size/magic-byte/scanner controls verified
- [ ] CSRF, CORS, CSP, HSTS and secure cookie tests pass
- [ ] Encryption keys come from KMS/Vault and rotation tested
- [ ] Logs contain no secrets or unnecessary PII
- [ ] Dependency/image/secret scans pass
- [ ] Backups encrypted and restore drill evidenced
- [ ] Incident contacts and notification plan current
- [ ] Privacy retention/deletion/consent tests pass
- [ ] Security owner approves production release
