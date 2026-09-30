# API security

Use distributed sliding-window limits by IP, account, and endpoint. JWT validation pins algorithm, issuer, audience, expiry, and token type; reject `none` and asymmetric/symmetric confusion. CORS is an exact production allowlist with credentials only when required. API keys are scoped, displayed once, hashed at rest, and rotatable. Webhooks require HMAC over timestamp+nonce+body, replay windows, and constant-time comparison. Version APIs, publish deprecation dates, cap body/page sizes, and return generic errors with correlation IDs.
