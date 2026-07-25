from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Skets App API",
    description="AI Visual Understanding Platform API",
    version="1.0.0",
)

from app.api.endpoints import analysis

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analysis.router, prefix="/api/v1/analysis", tags=["analysis"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Skets App API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
