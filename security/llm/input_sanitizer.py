import re, unicodedata

MAX_CHARS=12000
_CONTROL=re.compile(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]')
def sanitize(text: str, max_chars: int=MAX_CHARS) -> str:
    if not isinstance(text,str): raise TypeError('text must be a string')
    text=unicodedata.normalize('NFKC', text)
    text=_CONTROL.sub('', text).replace('\r\n','\n').replace('\r','\n')
    if len(text)>max_chars: raise ValueError('input exceeds limit')
    return text
