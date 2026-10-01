from datetime import datetime,timezone,timedelta
import hashlib,secrets,jwt
class TokenError(ValueError):pass
def _binding(ip,ua):return hashlib.sha256((ip+'\0'+ua).encode()).hexdigest()
def issue(subject,key,issuer,audience,ip,ua,kind='access',days=0):
 if len(key)<32:raise ValueError('key must be 256 bits')
 now=datetime.now(timezone.utc); exp=now+ (timedelta(days=days) if kind=='refresh' else timedelta(minutes=15))
 return jwt.encode({'sub':subject,'iss':issuer,'aud':audience,'iat':now,'exp':exp,'jti':secrets.token_urlsafe(24),'typ':kind,'bnd':_binding(ip,ua)},key,algorithm='HS256')
def decode(token,key,issuer,audience,ip,ua,kind='access'):
 try:
  p=jwt.decode(token,key,algorithms=['HS256'],issuer=issuer,audience=audience,options={'require':['sub','iss','aud','iat','exp','jti']})
  if p.get('typ')!=kind or not secrets.compare_digest(p.get('bnd',''),_binding(ip,ua)):raise TokenError('invalid token')
  return p
 except jwt.PyJWTError as e:raise TokenError('invalid token') from e
