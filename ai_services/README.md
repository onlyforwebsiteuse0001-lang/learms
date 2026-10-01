# AI services

Provider-specific clients and routing policy belong here as isolated adapters.
The ordered fallback chain will be Gemini → Groq → OpenRouter. A provider is
available only when its environment key exists and passes a health request.
No adapter may synthesize a successful response when all providers fail.

Implementation is part of Build Step 3 (concept extraction).
