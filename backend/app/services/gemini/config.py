import os
from dotenv import load_dotenv

# Load environment variables when this module is imported
load_dotenv()

# Model Settings
# We use gemini-flash-latest as the recommended stable vision/multimodal model.
# Flash is fast and widely available, suitable for this use case.
RECOMMENDED_MODEL = "gemini-flash-latest"

# Fallback Settings
FALLBACK_MODEL = "gemini-1.5-flash"

# System Instructions / Persona
SYSTEM_INSTRUCTION = """
You are an expert Computer Vision system and AI Prompt Engineer.
Your task is to analyze the image thoroughly and generate a highly structured JSON response that describes the scene so it can be used to generate a highly detailed prompt for Midjourney/Stable Diffusion.
"""
