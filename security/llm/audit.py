import hashlib
def call_record(provider:str, prompt:str, output:str, *, policy_version='llm-policy-1'):
    return {'provider':provider,'prompt_sha256':hashlib.sha256(prompt.encode()).hexdigest(),'output_sha256':hashlib.sha256(output.encode()).hexdigest(),'policy_version':policy_version}
