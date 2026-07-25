from typing import List, Dict, Any

class SceneGraphEngine:
    def __init__(self):
        pass
        
    def build_graph(self, objects: List[Dict[str, Any]], depth_info: Dict[str, Any]) -> Dict[str, Any]:
        """
        Constructs a Scene Graph from detected objects and depth information.
        Calculates spatial relationships based on bounding boxes.
        """
        nodes = []
        edges = []
        
        # Create Nodes
        for obj in objects:
            nodes.append({
                "id": obj["id"],
                "label": obj["label"],
                "attributes": {
                    "description": obj["description"],
                    "confidence": obj["confidence"]
                },
                "position": {
                    "bbox": obj["bbox"]
                },
                "layer": self._determine_layer(obj["id"], depth_info["layers"])
            })
            
        # Create Edges (Spatial Relationships)
        # Simplified example: compare bounding boxes
        if len(objects) >= 2:
            obj1, obj2 = objects[0], objects[1]
            # If obj2 is completely to the left of obj1
            if obj2["bbox"][2] < obj1["bbox"][0]:
                edges.append({
                    "source": obj2["id"],
                    "target": obj1["id"],
                    "relation": "left_of"
                })
        
        return {
            "metadata": {
                "camera": depth_info["camera"]
            },
            "nodes": nodes,
            "edges": edges
        }
        
    def _determine_layer(self, obj_id: str, layers: Dict[str, List[str]]) -> str:
        for layer_name, obj_list in layers.items():
            if obj_id in obj_list:
                return layer_name
        return "middle_ground" # Default
