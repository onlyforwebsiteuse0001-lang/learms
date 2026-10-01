from dataclasses import dataclass
from .injection_detector import inspect
@dataclass(frozen=True)
class Decision: allow: bool; reason: str
def evaluate(user_text:str, *, tool_requested:bool=False, human_approval:bool=False)->Decision:
    finding=inspect(user_text)
    if finding.matched: return Decision(False,'prompt injection indicators require review')
    if tool_requested and not human_approval: return Decision(False,'side effects require explicit approval')
    return Decision(True,'allowed by input policy')
