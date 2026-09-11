"""
FastAPI Server for Ocean Sentinel AI - Side-Scan Sonar Analysis
Inference engine: Ultralytics YOLO (backend/models/best.pt)
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.analysis import router as analysis_router
from services.model_service import get_model_status

app = FastAPI(
    title="Ocean Sentinel AI - Sonar Detection Backend",
    description="FastAPI service for Side-Scan Sonar (SSS) YOLO object detection inference",
    version="2.0.0"
)

# Enable CORS for frontend Vite development server (localhost:5173) and production hosts
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(analysis_router)

@app.get("/")
def root():
    status = get_model_status()
    return {
        "status": "online",
        "service": "Ocean Sentinel Sonar AI Backend",
        "inference_engine": "Ultralytics YOLO (best.pt)",
        "model_loaded": status["model_loaded"],
        "endpoint": "/api/analyze"
    }

@app.get("/api/health")
def health():
    """
    Health check endpoint — reflects real YOLO model availability.
    """
    status = get_model_status()
    return {
        "status": "healthy" if status["model_loaded"] else "degraded",
        "model_loaded": status["model_loaded"],
        "inference_engine": "Ultralytics YOLO",
        "model_path": status["model_path"],
        "device": status["device"],
        "cuda_available": status["cuda_available"],
        "classes": status["classes"],
        "error": status["error"]
    }

@app.get("/api/model-status")
def model_status():
    """
    Detailed YOLO model status for diagnostics.
    """
    return get_model_status()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
