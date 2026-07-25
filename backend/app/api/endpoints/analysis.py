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
    instructions: str = Form("")
):
    """
    Endpoint to process an uploaded sketch along with configuration data.
    """
    contents = await file.read()
    
    context_data = {
        "title": title,
        "description": description,
        "theme": theme,
        "colors": colors,
        "instructions": instructions
    }
    
    # Process through Gemini
    result = analyzer_service.analyze(contents, context_data)
    
    return {
        "status": "success",
        "data": result
    }
