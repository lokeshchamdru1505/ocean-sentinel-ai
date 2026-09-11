import os
from pathlib import Path
from PIL import Image
from backend.services.model_service import analyze_sonar_image

BASE = Path(__file__).resolve().parent.parent.parent
VAL_DIR = BASE / "public" / "datasets" / "side-scan-sonar-object-detection-challenge" / "valid" / "images"

test_files = list(VAL_DIR.glob("*.jpg"))[:10]
print(f"Testing {len(test_files)} validation dataset images...\n")

for i, fpath in enumerate(test_files, 1):
    with open(fpath, "rb") as f:
        img_bytes = f.read()
    res = analyze_sonar_image(img_bytes, filename=fpath.name)
    dets = res.get("detections", [])
    print(f"[{i}] File: {fpath.name}")
    print(f"    Dimensions: {res.get('image_width')}x{res.get('image_height')}")
    print(f"    Detections Count: {len(dets)}")
    for d in dets:
        print(f"      * {d['class']} (conf={d['confidence']*100:.1f}%) | bbox={d['bbox']} | refined={d.get('box_refined')}")
    print("-" * 60)
