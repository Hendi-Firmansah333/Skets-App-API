from typing import Dict, Any
from .config import SYSTEM_INSTRUCTION

class PromptBuilder:
    """Responsible for building the structured prompts for Gemini."""
    
    @staticmethod
    def build_analysis_prompt(context_data: Dict[str, Any]) -> str:
        """
        Combines the system instruction with the user's specific context.
        Ensures strict JSON output requirements.
        """
        output_type = context_data.get('output_type', 'image')
        
        if output_type == 'banner':
            banner_size = context_data.get('banner_size', 'Unknown')
            banner_title = context_data.get('banner_title', 'None')
            banner_elements = context_data.get('banner_elements', 'None')
            banner_content = context_data.get('banner_content', 'None')
            banner_colors = context_data.get('banner_colors', 'None')
            instructions = context_data.get('instructions', 'None')
            
            prompt = f"""
            {SYSTEM_INSTRUCTION}

            Context Requirements for Banner Generation:
            - Size/Orientation: {banner_size}
            - Banner Title: {banner_title}
            - Visual Elements Needed: {banner_elements}
            - Copywriting/Text Content: {banner_content}
            - Dominant Colors: {banner_colors}
            - Extra Instructions: {instructions}
            
            Analyze the provided sketch and return ONLY a valid JSON object matching exactly this structure:
            {{
                "detected_objects": [
                    {{
                        "id": "obj_1",
                        "label": "Name of object",
                        "bbox": [x1, y1, x2, y2], // Rough normalized bounding box [0-1000 scale]
                        "description": "Visual description"
                    }}
                ],
                "scene_graph": {{
                    "banner_specification": {{
                        "layout": {{
                            "orientation": "derived from {banner_size}",
                            "background_recommendation": "Detailed background style and elements"
                        }},
                        "typography": {{
                            "headline_font_style": "Font family/style for the main title",
                            "body_font_style": "Font family/style for content text"
                        }},
                        "elements": ["list of visual elements and their recommended placements"],
                        "color_palette": ["primary color", "secondary color", "accent color"],
                        "copywriting_suggestions": {{
                            "headline": "Punchy headline based on {banner_title}",
                            "subheadline": "Supporting text",
                            "call_to_action": "e.g. BUY NOW, READ MORE"
                        }}
                    }}
                }},
                "master_prompt": "A highly detailed, professional prompt combining the banner context, typography, color palette, and visual elements to generate the final banner design."
            }}
            
            Important Rules:
            1. Design the structure for a professional banner ad or web banner.
            2. Only return raw JSON, no markdown blocks (no ```json).
            """
            return prompt
        else:
            title = context_data.get('title', 'Unknown')
            description = context_data.get('description', 'None')
            theme = context_data.get('theme', 'Photorealistic')
            colors = context_data.get('colors', 'Natural')
            instructions = context_data.get('instructions', 'None')
            
            prompt = f"""
            {SYSTEM_INSTRUCTION}

            Context Requirements from User:
            - Title/Subject: {title}
            - Description: {description}
            - Style/Theme: {theme}
            - Dominant Colors: {colors}
            - Extra Instructions: {instructions}
            
            Analyze the provided image and return ONLY a valid JSON object matching exactly this structure:
            {{
                "detected_objects": [
                    {{
                        "id": "obj_1",
                        "label": "Name of object",
                        "bbox": [x1, y1, x2, y2], // Rough normalized bounding box coordinates [0-1000 scale, representing [x_min, y_min, x_max, y_max]]
                        "description": "Detailed visual description of this object in the context of the user's theme"
                    }}
                ],
                "scene_graph": {{
                    "meta": {{
                        "style": "derived from context theme",
                        "mood": "derived from image and context",
                        "lighting": "inferred lighting"
                    }},
                    "camera": {{
                        "angle": "e.g. eye level, high angle",
                        "shot_type": "e.g. wide shot, close up"
                    }},
                    "composition": {{
                        "foreground": ["list of elements"],
                        "middle_ground": ["list of elements"],
                        "background": ["list of elements"]
                    }}
                }},
                "master_prompt": "A highly detailed, professional prompt combining the user's context and the image contents, ensuring the composition of the original sketch is maintained but the visual quality is elevated to the requested theme/style."
            }}
            
            Important Rules:
            1. Maintain the original composition and spatial arrangement of the sketch.
            2. Elevate the visual quality based on the 'Style/Theme' context.
            3. Only return raw JSON, no markdown blocks (no ```json).
            """
            return prompt
