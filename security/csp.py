def headers() -> dict[str,str]:
    return {'Content-Security-Policy': "default-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'", 'X-Content-Type-Options':'nosniff', 'Referrer-Policy':'no-referrer', 'Strict-Transport-Security':'max-age=63072000; includeSubDomains; preload'}
