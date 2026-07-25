from app.services.cv_engine import CVEngine
from app.services.scene_graph import SceneGraphEngine
from app.services.llm_engine import LLMEngine
from typing import Dict, Any

class AnalysisService:
    def __init__(self):
        self.cv_engine = CVEngine()
        self.scene_graph = SceneGraphEngine()
        self.llm_engine = LLMEngine()

    def process_image(self, image_bytes: bytes, quality_level: str = "Detailed") -> Dict[str, Any]:
        """
        Orchestrates the entire AI pipeline from image to prompt.
        """
        # 1. Preprocess
        clean_img = self.cv_engine.preprocess_sketch(image_bytes)
        
        # 2. Extract Depth & Spatial Info
        depth_info = self.cv_engine.extract_depth_map(clean_img)
        
        # 3. Detect Objects & Semantics
        objects = self.cv_engine.detect_objects_and_semantics(clean_img)
        
        # 4. Build Scene Graph
        graph = self.scene_graph.build_graph(objects, depth_info)
        
        # 5. Generate Structured JSON
        structured_json = self.llm_engine.generate_structured_json(graph, quality_level)
        
        # 6. Generate Master Prompt
        prompt = self.llm_engine.generate_prompt(structured_json)
        
        return {
            "scene_graph": graph,
            "structured_json": structured_json,
            "prompt": prompt
        }
