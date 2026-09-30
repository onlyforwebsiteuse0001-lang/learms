# Authorization design

Roles: student, teacher, parent, counselor, admin, super-admin. Default deny. Permissions are verbs on resources; role grants are reviewed quarterly. ABAC additionally requires tenant, ownership/class relationship, consent, and purpose. Every endpoint performs authorization after authentication and before loading/returning an object. Use opaque UUIDs, but never treat them as authorization.

PostgreSQL RLS must enforce tenant/student ownership as a second barrier. Admin actions require step-up MFA, reason, and append-only audit logging. Support staff cannot approve their own access; super-admin is break-glass and monitored.
