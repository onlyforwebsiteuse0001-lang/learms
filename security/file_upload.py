from pathlib import Path
import secrets
ALLOWED={b'\x89PNG\r\n\x1a\n':'image/png', b'\xff\xd8\xff':'image/jpeg', b'%PDF-':'application/pdf'}
def store(data: bytes, root: Path, max_bytes=10*1024*1024) -> tuple[Path,str]:
    if len(data)>max_bytes: raise ValueError('file too large')
    mime=next((v for k,v in ALLOWED.items() if data.startswith(k)),None)
    if not mime: raise ValueError('unsupported file type')
    root.mkdir(mode=0o700,parents=True,exist_ok=True); path=root/secrets.token_hex(16); path.write_bytes(data); path.chmod(0o600); return path,mime
