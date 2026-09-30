import re, unicodedata
from dataclasses import dataclass
@dataclass(frozen=True)
class Finding: matched: bool; reasons: tuple[str,...]; risk: str
_PATTERNS=((r'ignore\s+(all\s+)?previous\s+instructions','instruction_override'),(r'(system|developer)\s*:\s*','role_spoofing'),(r'you\s+are\s+now\s+','role_hijack'),(r'reveal|print|show\s+(the\s+)?system\s+prompt','prompt_extraction'),(r'disregard\s+your\s+rules','instruction_override'))
def inspect(text:str)->Finding:
    normalized=unicodedata.normalize('NFKC',text).casefold()
    reasons=tuple(name for pattern,name in _PATTERNS if re.search(pattern,normalized))
    # zero-width/control characters are useful obfuscation indicators, not proof alone
    if any(c in text for c in '\u200b\u200c\u200d\ufeff'): reasons += ('unicode_obfuscation',)
    return Finding(bool(reasons),reasons,'high' if reasons else 'none')
