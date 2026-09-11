"""
FastAPI Analysis Route for Side-Scan Sonar (SSS) Image Processing
Inference engine: Ultralytics YOLO (backend/models/best.pt)
"""

from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from typing import Optional
from services.model_service import analyze_sonar_image

router = APIRouter(prefix="/api", tags=["Analysis"])

@router.post("/analyze")
async def analyze_endpoint(
    image: UploadFile = File(...),
    metadata: Optional[str] = Form(None)
):
    """
    Accepts an uploaded Side-Scan Sonar (SSS) raster file (PNG, JPG, TIFF),
    runs YOLO object detection inference using the trained best.pt model,
    and returns real bounding boxes with class names and confidence scores
    for detected objects: Shipwreck, Marine Debris, Ghost Net, Underwater Pipe.
    """
    if not image.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    # Read binary bytes
    contents = await image.read()
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    result = analyze_sonar_image(contents, filename=image.filename)
    return result
