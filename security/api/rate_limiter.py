import time
class LocalLimiter:
 def __init__(self,limit=60,window=60):self.limit=limit;self.window=window;self._hits={}
 def allow(self,key,now=None):
  now=now or time.monotonic(); q=[x for x in self._hits.get(key,[]) if x>now-self.window]
  if len(q)>=self.limit:self._hits[key]=q;return False
  q.append(now);self._hits[key]=q;return True
class RedisLimiter:
 def __init__(self,redis):self.redis=redis
 async def allow(self,key,limit,window):
  # Redis implementation must provide atomic Lua in production; fail closed if unavailable.
  try:
   n=await self.redis.incr(key); 
   if n==1: await self.redis.expire(key,window)
   return n<=limit
  except Exception:return False
