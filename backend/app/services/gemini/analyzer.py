import io
import logging
from typing import Dict, Any
from PIL import Image

from .config import RECOMMENDED_MODEL
from .client import GeminiClientFactory
from .prompt_builder import PromptBuilder
from .json_builder import JSONBuilder
from .exceptions import GeminiAPIError

logger = logging.getLogger(__name__)

class GeminiAnalyzerService:
    """Orchestrates the AI Vision analysis using the Google GenAI SDK."""
    
    def __init__(self):
        try:
            self.client = GeminiClientFactory.get_client()
            logger.info("GeminiClient initialized successfully.")
        except Exception as e:
            logger.error(f"Failed to initialize GeminiClient: {str(e)}")
            self.client = None

    def analyze(self, image_bytes: bytes, context_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes the vision analysis pipeline.
        Catches errors and returns a structured error JSON if the API fails,
        ensuring the frontend doesn't crash.
        """
        if not self.client:
            return self._build_error_response("Gemini Client not initialized. Check API Key.")
            
        try:
            # Prepare image
            image = Image.open(io.BytesIO(image_bytes))
            
            # Prepare prompt
            prompt = PromptBuilder.build_analysis_prompt(context_data)
            
            # Call API using the new google-genai SDK
            logger.info(f"Calling Google GenAI using model: {RECOMMENDED_MODEL}")
            response = self.client.models.generate_content(
                model=RECOMMENDED_MODEL,
                contents=[prompt, image]
            )
            
            # Parse response
            logger.info("Successfully received response from Gemini.")
            result_json = JSONBuilder.parse(response.text)
            
            return result_json
            
        except GeminiAPIError as e:
            logger.error(f"Gemini API or Parsing error: {str(e)}")
            return self._build_error_response(str(e))
        except Exception as e:
            logger.error(f"Unexpected error during analysis: {str(e)}", exc_info=True)
            return self._build_error_response(f"Unexpected Error: {str(e)}")

    def _build_error_response(self, error_message: str) -> Dict[str, Any]:
        """Fallback JSON response to maintain API contract with the frontend."""
        return {
            "detected_objects": [
                {
                    "id": "error",
                    "label": "API Error",
                    "bbox": [0, 0, 100, 100],
                    "description": error_message
                }
            ],
            "scene_graph": {
                "meta": {"style": "Error", "mood": "Error", "lighting": "Error"},
                "camera": {"angle": "Error", "shot_type": "Error"},
                "composition": {"foreground": [], "middle_ground": [f"API Error: {error_message}"], "background": []}
            },
            "master_prompt": f"Failed to perform analysis. Details: {error_message}"
        }
