from datetime import datetime, timedelta, timezone
import secrets
import jwt

class JWTError(ValueError): pass
def issue(subject: str, key: str, issuer: str, audience: str, minutes: int = 15) -> str:
    if len(key.encode()) < 32: raise ValueError("JWT key must be at least 256 bits")
    now = datetime.now(timezone.utc)
    return jwt.encode({'sub': subject, 'jti': secrets.token_urlsafe(24), 'iat': now, 'exp': now+timedelta(minutes=minutes), 'iss': issuer, 'aud': audience, 'typ':'access'}, key, algorithm='HS256')
def decode(token: str, key: str, issuer: str, audience: str) -> dict:
    try:
        return jwt.decode(token, key, algorithms=['HS256'], issuer=issuer, audience=audience, options={'require':['exp','iat','sub','iss','aud','jti']})
    except jwt.PyJWTError as exc: raise JWTError('invalid token') from exc
