import requests
import json
from pathlib import Path

test_images = [
    Path("public/datasets/side-scan-sonar-object-detection-challenge/valid/images/000010_jpg.rf.efb6cf8c3257d078e4fffc1451283b5b.jpg"),
    list(Path("public/datasets/side-scan-sonar-object-detection-challenge/valid/images").glob("000225*"))[0]
]

for img_path in test_images:
    print("\n" + "=" * 60)
    print("Testing Image:", img_path.name)
    with open(img_path, "rb") as f:
        resp = requests.post(
            "http://127.0.0.1:8000/api/analyze",
            files={"image": (img_path.name, f, "image/jpeg")}
        )

    print("HTTP Status:", resp.status_code)
    data = resp.json()
    print("Analysis ID:", data.get("analysis_id"))
    print(f"Dimensions : {data.get('image_width')}x{data.get('image_height')}")
    print("Location   :", data.get("location"))
    for d in data.get("detections", []):
        print(f"  * Class: {d.get('class_name')} ({d.get('confidence')*100:.1f}%)")
        print(f"    BBox: {d.get('bbox')}")
        print(f"    Refined: {d.get('box_refined')} ({d.get('refinement_reason')})")
