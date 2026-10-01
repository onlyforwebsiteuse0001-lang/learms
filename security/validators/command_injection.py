import shlex
_META=set(';|&$`><\n')
def safe_args(args,allowed):
 if not isinstance(args,list) or not args or args[0] not in allowed:raise ValueError('command rejected')
 if any(any(c in _META for c in str(a)) for a in args):raise ValueError('metacharacter rejected')
 return args
