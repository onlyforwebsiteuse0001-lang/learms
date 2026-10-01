"""Critical configuration behavior for Build Step 1."""
from backend.app.core.config import Settings


def test_ai_providers_disabled_without_keys() -> None:
    """Missing keys must disable providers rather than imply fake availability."""
    settings = Settings(
        _env_file=None,
        gemini_api_key=None,
        groq_api_key=None,
        openrouter_api_key=None,
    )
    assert settings.enabled_ai_providers == []


def test_only_configured_provider_is_enabled() -> None:
    """Provider availability must follow explicit environment configuration."""
    settings = Settings(
        _env_file=None,
        gemini_api_key="test-key",
        groq_api_key=None,
        openrouter_api_key=None,
    )
    assert settings.enabled_ai_providers == ["gemini"]


def test_cors_origins_are_normalized() -> None:
    """Comma-separated origins should become a clean middleware list."""
    settings = Settings(_env_file=None, cors_origins="http://a.test, http://b.test ")
    assert settings.cors_origin_list == ["http://a.test", "http://b.test"]
