import os
from google import genai
from .exceptions import InvalidAPIKeyError

class GeminiClientFactory:
    """Factory to create and configure the Gemini Client."""
    
    @staticmethod
    def get_client() -> genai.Client:
        """
        Retrieves an initialized google-genai Client.
        Raises InvalidAPIKeyError if the API key is not found in the environment.
        """
        api_key = os.getenv("GEMINI_API_KEY", "").strip()
        
        if not api_key:
            raise InvalidAPIKeyError(
                "API Key is missing. Please set GEMINI_API_KEY in your .env file."
            )
            
        # The new SDK uses genai.Client()
        return genai.Client(api_key=api_key)
