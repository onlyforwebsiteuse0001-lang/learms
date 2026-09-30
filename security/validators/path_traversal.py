from pathlib import Path
def safe_path(root,user):
 base=Path(root).resolve(); candidate=(base/user).resolve()
 if candidate!=base and base not in candidate.parents:raise ValueError('path traversal')
 return candidate
