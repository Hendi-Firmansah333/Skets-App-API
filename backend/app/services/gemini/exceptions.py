class GeminiAPIError(Exception):
    """Exception raised when the Gemini API returns an error."""
    pass

class InvalidAPIKeyError(GeminiAPIError):
    """Exception raised when the API key is missing or invalid."""
    pass

class JSONParsingError(GeminiAPIError):
    """Exception raised when the AI response cannot be parsed into the expected JSON structure."""
    pass
