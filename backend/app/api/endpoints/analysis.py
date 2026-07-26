from fastapi import APIRouter, File, UploadFile, Form
from app.services.gemini import GeminiAnalyzerService

router = APIRouter()
analyzer_service = GeminiAnalyzerService()

@router.post("/analyze")
async def analyze_image(
    file: UploadFile = File(...),
    title: str = Form(""),
    description: str = Form(""),
    theme: str = Form(""),
    colors: str = Form(""),
    instructions: str = Form(""),
    output_type: str = Form("image"),
    banner_size: str = Form(""),
    banner_title: str = Form(""),
    banner_elements: str = Form(""),
    banner_content: str = Form(""),
    banner_colors: str = Form("")
):
    """
    Endpoint to process an uploaded sketch along with configuration data.
    """
    contents = await file.read()
    
    context_data = {
        "output_type": output_type,
        "title": title,
        "description": description,
        "theme": theme,
        "colors": colors,
        "instructions": instructions,
        "banner_size": banner_size,
        "banner_title": banner_title,
        "banner_elements": banner_elements,
        "banner_content": banner_content,
        "banner_colors": banner_colors
    }
    
    # Process through Gemini
    result = analyzer_service.analyze(contents, context_data)
    
    return {
        "status": "success",
        "data": result
    }
