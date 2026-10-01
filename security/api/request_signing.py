import hashlib,hmac,time

def sign(body,secret,timestamp,nonce):return hmac.new(secret, f'{timestamp}.{nonce}.'.encode()+body,hashlib.sha256).hexdigest()
def verify(body,secret,timestamp,nonce,signature,now=None,window=300):
 if abs((now or time.time())-timestamp)>window:return False
 return hmac.compare_digest(sign(body,secret,timestamp,nonce),signature)
