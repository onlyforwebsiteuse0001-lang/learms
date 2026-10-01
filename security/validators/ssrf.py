import ipaddress,socket
from urllib.parse import urlparse

def validate_url(value,allowed_hosts=()):
 p=urlparse(value)
 if p.scheme!='https' or not p.hostname or p.username or p.password:raise ValueError('URL rejected')
 if allowed_hosts and p.hostname not in set(allowed_hosts):raise ValueError('host not allowed')
 try:
  addrs={ipaddress.ip_address(x[4][0]) for x in socket.getaddrinfo(p.hostname,p.port or 443,type=socket.SOCK_STREAM)}
 except OSError as e:raise ValueError('DNS failure') from e
 if any(a.is_private or a.is_loopback or a.is_link_local or a.is_reserved for a in addrs):raise ValueError('internal address rejected')
 return p
