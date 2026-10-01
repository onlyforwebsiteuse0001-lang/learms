import hashlib,secrets
import pyotp

def new_totp():
 secret=pyotp.random_base32(); return secret,pyotp.TOTP(secret).provisioning_uri()
def verify_totp(secret,code):return pyotp.TOTP(secret).verify(code,valid_window=1)
def recovery_codes(count=10):
 raw=[secrets.token_urlsafe(12) for _ in range(count)]; return raw,[hashlib.sha256(x.encode()).hexdigest() for x in raw]
def consume_recovery(code,stored):
 digest=hashlib.sha256(code.encode()).hexdigest()
 for i,item in enumerate(stored):
  if secrets.compare_digest(digest,item): stored.pop(i); return True
 return False
