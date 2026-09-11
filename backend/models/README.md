# Trained YOLO Model — Ocean Sentinel AI

## Model File

`best.pt` — Trained Ultralytics YOLOv8 Object Detection model (6.25 MB)

## Detected Classes

| Class ID | Class Name      |
|----------|-----------------|
| 0        | Shipwreck       |
| 1        | Marine Debris   |
| 2        | Ghost Net       |
| 3        | Underwater Pipe |

## Usage

The FastAPI backend (`backend/main.py`) automatically loads `best.pt` at startup
via `backend/services/model_service.py`.

Do NOT retrain or replace this file unless using a newly validated model.

## Inference Settings

- Confidence threshold: 0.25 (configurable)
- Device: Auto (CUDA GPU preferred, CPU fallback)
- Framework: Ultralytics >= 8.0.0
