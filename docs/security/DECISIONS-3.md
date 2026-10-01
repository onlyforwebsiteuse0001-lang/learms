# Security implementation decisions

1. **Policy outside the LLM:** model output cannot authorize actions; tools require typed schemas and independent authorization.
2. **Fail closed on uncertainty:** detectors return a review/deny signal, never silently allow high-risk content.
3. **Safe pentesting only:** scanners require an explicit target allowlist and never exploit production or perform destructive actions.
4. **No legal claims:** compliance documents identify controls and gaps; counsel/auditor determines applicability.
