import json
from typing import Dict, Any
from .exceptions import JSONParsingError

class JSONBuilder:
    """Responsible for cleaning and parsing LLM text responses into valid JSON."""
    
    @staticmethod
    def parse(response_text: str) -> Dict[str, Any]:
        """
        Cleans markdown formatting and parses the string into a Python dictionary.
        Raises JSONParsingError if the result is invalid.
        """
        if not response_text:
            raise JSONParsingError("Received empty response from AI.")
            
        cleaned_text = response_text.strip()
        
        # Remove markdown code blocks if present
        if cleaned_text.startswith("```json"):
            cleaned_text = cleaned_text[7:]
        elif cleaned_text.startswith("```"):
            cleaned_text = cleaned_text[3:]
            
        if cleaned_text.endswith("```"):
            cleaned_text = cleaned_text[:-3]
            
        cleaned_text = cleaned_text.strip()
        
        try:
            return json.loads(cleaned_text)
        except json.JSONDecodeError as e:
            raise JSONParsingError(f"Failed to parse JSON from AI response: {str(e)}\nRaw Response: {cleaned_text}")
