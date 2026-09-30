import pytest
from security.validators.path_traversal import safe_path
from security.validators.command_injection import safe_args
from security.validators.ssrf import validate_url
from security.api.request_signing import *
def test_path(tmp_path):
 assert safe_path(tmp_path,'a.txt').parent==tmp_path
 with pytest.raises(ValueError):safe_path(tmp_path,'../x')
def test_command():
 assert safe_args(['echo','ok'],{'echo'})
 with pytest.raises(ValueError):safe_args(['echo',';rm'],{'echo'})
def test_ssrf():
 with pytest.raises(ValueError):validate_url('http://127.0.0.1')
def test_signature():
 s=b'x'*32;ts=1000;sig=sign(b'body',s,ts,'n');assert verify(b'body',s,ts,'n',sig,now=1001);assert not verify(b'body',s,ts,'n',sig,now=2000)
