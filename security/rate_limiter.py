import time
class SlidingWindow:
    def __init__(self, limit=60, window=60): self.limit=limit; self.window=window; self.hits={}
    def allow(self, key):
        now=time.monotonic(); values=[t for t in self.hits.get(key,[]) if t>now-self.window]
        if len(values)>=self.limit: self.hits[key]=values; return False
        values.append(now); self.hits[key]=values; return True
