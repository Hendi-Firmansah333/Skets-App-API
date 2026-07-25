import os
from dotenv import load_dotenv
from google import genai

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("No API Key found")
    exit(1)

client = genai.Client(api_key=api_key)
print("Available Models supporting generateContent:")
for model in client.models.list():
    if "generateContent" in model.supported_actions:
        print(f"- {model.name}")
