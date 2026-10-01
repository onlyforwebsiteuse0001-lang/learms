from dataclasses import dataclass,field
from datetime import datetime,timezone,timedelta
import secrets
@dataclass
class Session:
 user_id:str; created:datetime=field(default_factory=lambda:datetime.now(timezone.utc)); last_seen:datetime=field(default_factory=lambda:datetime.now(timezone.utc)); token:str=field(default_factory=lambda:secrets.token_urlsafe(32)); revoked:bool=False
def valid(s,now=None,idle=timedelta(minutes=30),absolute=timedelta(days=7)):
 now=now or datetime.now(timezone.utc); return not s.revoked and now-s.last_seen<=idle and now-s.created<=absolute
def revoke(s):s.revoked=True
class SessionStore:
 def __init__(self,max_sessions=5):self.max=max_sessions;self.data={}
 def create(self,user):
  sessions=self.data.setdefault(user,[]); s=Session(user); sessions.append(s)
  for old in sessions[:-self.max]:old.revoked=True
  return s
