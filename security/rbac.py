from enum import StrEnum
from dataclasses import dataclass
class Role(StrEnum): STUDENT='student'; TEACHER='teacher'; PARENT='parent'; COUNSELOR='counselor'; ADMIN='admin'; SUPER_ADMIN='super-admin'
PERMISSIONS={'student': {'read:self','write:self'}, 'teacher': {'read:class'}, 'parent': {'read:child'}, 'counselor': {'read:wellness'}, 'admin': {'read:all','manage:users'}, 'super-admin': {'*'}}
@dataclass(frozen=True)
class Principal: subject: str; role: Role; tenant: str
def allows(principal: Principal, permission: str) -> bool: return permission in PERMISSIONS[principal.role.value] or '*' in PERMISSIONS[principal.role.value]
def owns(principal: Principal, owner_id: str) -> bool: return principal.subject == owner_id
