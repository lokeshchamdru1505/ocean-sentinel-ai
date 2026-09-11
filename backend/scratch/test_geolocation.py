import sys
import io
from pathlib import Path
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from backend.services.geolocation_service import resolve_scan_location, extract_exif_gps, match_dataset_location
from backend.services.model_service import analyze_sonar_image

def run_tests():
    print("--- RUNNING GEOLOCATION TESTS ---")

    # TEST 1: Dataset Match (sss_dataset_with_location.csv match)
    filename_dataset = "000012_jpg.rf.b76b3c145d081a2a8ae2601c202bdc84.jpg"
    img = Image.new("RGB", (100, 100), color="blue")
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    bytes_data = buf.getvalue()

    res1 = resolve_scan_location(bytes_data, filename_dataset)
    print("\nTEST 1 (Dataset CSV Match):", res1)
    assert res1["available"] == True
    assert res1["latitude"] == 13.02
    assert res1["longitude"] == 80.24
    assert res1["source"] == "dataset_match"
    print("✅ TEST 1 PASSED!")

    # TEST 2: Dataset Match (geo_data.json match)
    filename_json = "DS-IND-001.png"
    res2 = resolve_scan_location(bytes_data, filename_json)
    print("\nTEST 2 (geo_data.json Match):", res2)
    assert res2["available"] == True
    assert res2["latitude"] == 13.0827
    assert res2["longitude"] == 80.2707
    assert res2["source"] == "dataset_match"
    print("✅ TEST 2 PASSED!")

    # TEST 3: No Metadata / No Match -> Unavailable
    filename_unknown = "unknown_sonar_scan_999.png"
    res3 = resolve_scan_location(bytes_data, filename_unknown)
    print("\nTEST 3 (No GPS / No Match):", res3)
    assert res3["available"] == False
    assert res3["latitude"] is None
    assert res3["longitude"] is None
    assert res3["source"] is None
    print("✅ TEST 3 PASSED!")

    # TEST 4: Full model inference response format check
    full_res = analyze_sonar_image(bytes_data, filename_dataset)
    print("\nTEST 4 (API Response Location Field):")
    print("Location field in response:", full_res.get("location"))
    assert "location" in full_res
    assert full_res["location"]["available"] == True
    print("✅ TEST 4 PASSED!")

    print("\n🎉 ALL GEOLOCATION TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()
