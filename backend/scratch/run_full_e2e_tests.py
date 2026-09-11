import requests
import json
import io
from pathlib import Path
from PIL import Image

API_URL = "http://127.0.0.1:8000/api/analyze"
HEALTH_URL = "http://127.0.0.1:8000/api/health"
images_dir = Path("public/datasets/side-scan-sonar-object-detection-challenge/valid/images")

test_samples = [
    ("Shipwreck", images_dir / "000010_jpg.rf.efb6cf8c3257d078e4fffc1451283b5b.jpg"),
    ("Underwater Pipe", images_dir / "000225_jpg.rf.3b0e73d0e39a3b3db62b7abac27aa14f.jpg"),
    ("Marine Debris", images_dir / "000123_jpg.rf.2ed0ee5490c8a919344ab2ab0ce3e21f.jpg"),
    ("Ghost Net", images_dir / "000016_jpg.rf.059f50f2c5b3f0a73a433734847c1c30.jpg"),
]

def analyze_file(file_bytes, filename):
    files = {"image": (filename, file_bytes, "image/jpeg")}
    resp = requests.post(API_URL, files=files)
    return resp.status_code, resp.json()

print("============================================================")
print("1. CHECKING BACKEND HEALTH")
print("============================================================")
resp = requests.get(HEALTH_URL)
print(f"Health Status: {resp.status_code}")
print(json.dumps(resp.json(), indent=2))

print("\n============================================================")
print("2. END-TO-END IMAGE DETECTION & GEOLOCATION TESTS")
print("============================================================")

results = []

for category, path in test_samples:
    if not path.exists():
        print(f"File not found: {path}")
        continue
    status, data = analyze_file(path.read_bytes(), path.name)
    results.append({
        "category": category,
        "filename": path.name,
        "http_status": status,
        "data": data
    })

# Blank image test
blank_img = Image.new("RGB", (640, 640), color=(20, 20, 20))
buf = io.BytesIO()
blank_img.save(buf, format="JPEG")
blank_bytes = buf.getvalue()
status, blank_res = analyze_file(blank_bytes, "blank_sonar_scan.jpg")
results.append({
    "category": "Blank / No Object",
    "filename": "blank_sonar_scan.jpg",
    "http_status": status,
    "data": blank_res
})

for r in results:
    print(f"\n------------------------------------------------------------")
    print(f"Target Category : {r['category']}")
    print(f"Filename        : {r['filename']}")
    print(f"HTTP Status     : {r['http_status']}")
    
    d = r['data']
    print(f"Analysis ID     : {d.get('analysis_id')}")
    print(f"Dimensions      : {d.get('dimensions')}")
    print(f"Location        : {d.get('location')}")
    
    dets = d.get('detections', [])
    print(f"Detections Count: {len(dets)}")
    for i, det in enumerate(dets):
        print(f"  [{i+1}] Class: {det.get('class')} ({det.get('confidence') * 100:.1f}%)")
        print(f"      BBox : {det.get('bbox')}")
        print(f"      Refinement: {det.get('refinement', {}).get('applied')}")

