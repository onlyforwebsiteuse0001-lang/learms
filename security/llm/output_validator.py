from typing import TypeVar, Type
from pydantic import BaseModel, ValidationError
import re
T=TypeVar('T',bound=BaseModel)
_SECRET=re.compile(r'(sk-[A-Za-z0-9]{20,}|bearer\s+[A-Za-z0-9._-]+)',re.I)
def validate_output(raw: object, schema: Type[T]) -> T:
    return schema.model_validate(raw)
def redact_secrets(text:str)->str: return _SECRET.sub('[REDACTED_SECRET]',text)
def reject_markup(text:str)->str:
    if re.search(r'<\s*(script|iframe|object)\b',text,re.I): raise ValueError('unsafe markup')
    return text
