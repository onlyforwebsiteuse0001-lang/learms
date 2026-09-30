import hashlib, json, time
class AuditChain:
    def __init__(self): self.previous='0'*64
    def record(self, event: dict) -> dict:
        safe={k:v for k,v in event.items() if k not in {'password','token','secret','authorization'}}; safe['ts']=time.time(); safe['prev']=self.previous
        digest=hashlib.sha256(json.dumps(safe,sort_keys=True,separators=(',',':')).encode()).hexdigest(); safe['hash']=digest; self.previous=digest; return safe
