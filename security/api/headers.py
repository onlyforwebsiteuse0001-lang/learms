def security_headers(nonce=None):
 csp="default-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'"
 if nonce:csp += f"; script-src 'nonce-{nonce}' 'strict-dynamic'"
 return {'Strict-Transport-Security':'max-age=31536000; includeSubDomains; preload','Content-Security-Policy':csp,'X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'strict-origin-when-cross-origin','Permissions-Policy':'camera=(), microphone=(), geolocation=()'}
