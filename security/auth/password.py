from argon2 import PasswordHasher
from argon2.exceptions import VerificationError, InvalidHash
import re
_hasher=PasswordHasher(time_cost=3,memory_cost=65536,parallelism=4)
def validate_password(password:str)->None:
    if len(password)<12 or len(password)>1024: raise ValueError('password length rejected')
def hash_password(password:str)->str:
    validate_password(password); return _hasher.hash(password)
def verify_password(encoded:str,password:str)->bool:
    try:return _hasher.verify(encoded,password)
    except (VerificationError,InvalidHash):return False
