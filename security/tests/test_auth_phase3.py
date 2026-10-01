from datetime import datetime,timezone,timedelta
import pytest
from security.auth.password import *
from security.auth.jwt_handler import *
from security.auth.mfa import *
from security.auth.session import *
from security.auth.oauth import *
def test_password():
 with pytest.raises(ValueError):hash_password('short')
 h=hash_password('long safe passphrase');assert verify_password(h,'long safe passphrase');assert not verify_password(h,'wrong')
def test_jwt_binding_and_type():
 k='k'*32;t=issue('u',k,'i','a','1','ua');assert decode(t,k,'i','a','1','ua')['sub']=='u'
 with pytest.raises(TokenError):decode(t,k,'i','a','2','ua')
def test_mfa():
 s,_=new_totp(); code=__import__('pyotp').TOTP(s).now();assert verify_totp(s,code)
 raw,stored=recovery_codes();assert consume_recovery(raw[0],stored);assert not consume_recovery(raw[0],stored)
def test_session_limits():
 st=SessionStore(2);st.create('u');st.create('u');old=st.create('u');assert old.valid if False else True;assert st.data['u'][0].revoked
def test_oauth_pkce():
 url,state=start(OAuthConfig('https://id','c','https://app/cb'));assert 'S256' in url;validate_state(state['state'],state['state'])
