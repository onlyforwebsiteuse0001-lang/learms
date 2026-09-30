from dataclasses import dataclass
from datetime import datetime
@dataclass(frozen=True)
class Context: subject:str; tenant:str; owner:str|None=None; device_trusted:bool=False; now:datetime|None=None
def allow_own(ctx,resource_tenant):return ctx.tenant==resource_tenant and ctx.owner==ctx.subject
def allow_sensitive(ctx,resource_tenant):return allow_own(ctx,resource_tenant) and ctx.device_trusted
