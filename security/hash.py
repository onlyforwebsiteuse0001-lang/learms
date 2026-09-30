"""Argon2id password hashing; dependency is intentionally explicit."""
from argon2 import PasswordHasher
from argon2.exceptions import VerificationError, InvalidHash

_hasher = PasswordHasher(memory_cost=65536, time_cost=3, parallelism=4, hash_len=32, salt_len=16)
def hash_password(password: str) -> str:
    if len(password) < 12: raise ValueError("password must contain at least 12 characters")
    return _hasher.hash(password)
def verify_password(encoded: str, password: str) -> bool:
    try: return _hasher.verify(encoded, password)
    except (VerificationError, InvalidHash): return False
