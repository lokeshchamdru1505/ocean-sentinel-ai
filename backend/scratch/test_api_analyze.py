import requests
import json
import glob
import os

import glob
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent.parent
images = list((BASE / "public" / "datasets" / "side-scan-sonar-object-detection-challenge" / "valid" / "images").glob("*.jpg"))
if not images:
    images = list((BASE / "public" / "datasets" / "side-scan-sonar-object-detection-challenge" / "test" / "images").glob("*.jpg"))

print(f"Total candidate images found: {len(images)}")
if images:
    for img_path in images[:5]:
        print(f"\n==========================================")
        print(f"Testing image: {img_path}")
        with open(img_path, 'rb') as f:
            r = requests.post(
                'http://127.0.0.1:8000/api/analyze',
                files={'image': (os.path.basename(img_path), f, 'image/jpeg')},
                data={'confidence_threshold': 0.25}
            )
        print(f"HTTP Status: {r.status_code}")
        if r.status_code == 200:
            res = r.json()
            print(f"Dimensions: {res.get('image_width')}x{res.get('image_height')}")
            print(f"Inference Engine: {res.get('inference_engine')}")
            print(f"Detections Count: {len(res.get('detections', []))}")
            loc = res.get('location', {})
            print(f"Location: available={loc.get('available')}, lat={loc.get('latitude')}, lon={loc.get('longitude')}, src={loc.get('source')}")
            for d in res.get('detections', []):
                print(f"  * {d.get('class_name')} ({d.get('confidence')*100:.1f}%) bbox={d.get('bbox')}")
        else:
            print(f"Error: {r.text}")
