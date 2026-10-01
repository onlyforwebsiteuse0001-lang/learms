import secrets, hmac, hashlib
def issue(session_secret: bytes) -> str: return secrets.token_urlsafe(32)
def valid(token: str, expected: str) -> bool: return bool(token) and hmac.compare_digest(token, expected)
