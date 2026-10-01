from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import base64, secrets

def encrypt(plaintext: bytes, key: bytes, aad: bytes=b'') -> str:
    if len(key) not in (16,24,32): raise ValueError('AES key must be 128/192/256 bits')
    nonce=secrets.token_bytes(12)
    return base64.urlsafe_b64encode(nonce+AESGCM(key).encrypt(nonce, plaintext, aad)).decode()
def decrypt(token: str, key: bytes, aad: bytes=b'') -> bytes:
    raw=base64.urlsafe_b64decode(token.encode()); return AESGCM(key).decrypt(raw[:12], raw[12:], aad)
