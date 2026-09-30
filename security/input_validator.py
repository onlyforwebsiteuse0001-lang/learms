from pydantic import BaseModel, Field, ConfigDict, AnyUrl
class SafeMessage(BaseModel):
    model_config=ConfigDict(extra='forbid', str_strip_whitespace=True)
    message: str = Field(min_length=1, max_length=10000)
class AllowedOutboundURL(BaseModel):
    model_config=ConfigDict(extra='forbid')
    url: AnyUrl
