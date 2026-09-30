import base64,hashlib,secrets
from urllib.parse import urlencode
class OAuthConfig:
 def __init__(self,authorize,client_id,redirect):self.authorize=authorize;self.client_id=client_id;self.redirect=redirect
def start(c):
 verifier=base64.urlsafe_b64encode(secrets.token_bytes(32)).rstrip(b'=').decode(); challenge=base64.urlsafe_b64encode(hashlib.sha256(verifier.encode()).digest()).rstrip(b'=').decode(); state=secrets.token_urlsafe(32); nonce=secrets.token_urlsafe(24)
 return c.authorize+'?'+urlencode({'client_id':c.client_id,'redirect_uri':c.redirect,'response_type':'code','code_challenge':challenge,'code_challenge_method':'S256','state':state,'nonce':nonce}),{'verifier':verifier,'state':state,'nonce':nonce}
def validate_state(expected,actual):
 if not expected or not actual or not secrets.compare_digest(expected,actual):raise ValueError('invalid oauth state')
