"""
validate_model.py
=================
End-to-end validation of YOLO best.pt model accuracy.
Run from project root:
    python -m backend.scratch.validate_model
"""

import csv
import sys
from pathlib import Path
import numpy as np

BASE    = Path(__file__).resolve().parent.parent.parent
DATASET = BASE / "public" / "datasets" / "side-scan-sonar-object-detection-challenge"
TRAIN_IMG = DATASET / "train" / "images"
TRAIN_LBL = DATASET / "train" / "labels"
VALID_IMG = DATASET / "valid" / "images"
VALID_LBL = DATASET / "valid" / "labels"
CSV_PATH  = DATASET / "sss_dataset_with_location.csv"
MODEL_PATH = BASE / "backend" / "models" / "best.pt"

CLASS_NAMES = {0: "Shipwreck", 1: "Marine Debris", 2: "Ghost Net", 3: "Underwater Pipe"}


def iou(boxA, boxB):
    xA = max(boxA[0], boxB[0]); yA = max(boxA[1], boxB[1])
    xB = min(boxA[2], boxB[2]); yB = min(boxA[3], boxB[3])
    inter = max(0, xB - xA) * max(0, yB - yA)
    aA = (boxA[2]-boxA[0])*(boxA[3]-boxA[1])
    aB = (boxB[2]-boxB[0])*(boxB[3]-boxB[1])
    union = aA + aB - inter
    return inter / union if union > 0 else 0.0


def yolo_to_xyxy(cx, cy, w, h, img_w, img_h):
    return [(cx-w/2)*img_w, (cy-h/2)*img_h, (cx+w/2)*img_w, (cy+h/2)*img_h]


def load_gt(label_path, img_w, img_h):
    boxes = []
    if not label_path.exists():
        return boxes
    for line in label_path.read_text().splitlines():
        parts = line.strip().split()
        if len(parts) >= 5:
            cls = int(float(parts[0]))
            box = yolo_to_xyxy(*map(float, parts[1:5]), img_w, img_h)
            boxes.append({"class_id": cls, "box": box})
    return boxes


def predict(model, img_path):
    results = model.predict(str(img_path), conf=0.25, iou=0.45,
                            save=False, verbose=False, augment=False)
    preds = []
    if results and results[0].boxes is not None:
        orig_h, orig_w = results[0].orig_shape[:2]
        for box in results[0].boxes:
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            cls_id = int(box.cls[0].item())
            preds.append({
                "class_id":   cls_id,
                "class_name": model.names.get(cls_id, f"cls_{cls_id}"),
                "conf":       round(float(box.conf[0].item()), 4),
                "box":        [x1, y1, x2, y2],
                "img_w":      orig_w,
                "img_h":      orig_h,
            })
    return preds


def match(preds, gts, thresh=0.50):
    matched_gt = set(); matched_pred = set(); iou_vals = []
    for gi, gt in enumerate(gts):
        best_iou = 0.0; best_pi = -1
        for pi, pred in enumerate(preds):
            if pi in matched_pred:
                continue
            v = iou(pred["box"], gt["box"])
            if v > best_iou:
                best_iou = v; best_pi = pi
        if best_iou >= thresh and best_pi >= 0:
            matched_gt.add(gi); matched_pred.add(best_pi); iou_vals.append(best_iou)
    return len(matched_gt), len(preds)-len(matched_pred), len(gts)-len(matched_gt), iou_vals


def evaluate(model, img_dir, lbl_dir, split_name, max_images=100):
    print(f"\n{'='*60}")
    print(f"  Evaluating: {split_name}")
    print(f"{'='*60}")
    imgs = sorted(list(img_dir.glob("*.jpg")) + list(img_dir.glob("*.png")))[:max_images]
    print(f"  Images: {len(imgs)}")

    tot_TP = tot_FP = tot_FN = 0
    all_iou_vals = []
    samples = []
    ap_list = []

    for thresh in np.arange(0.50, 1.00, 0.05):
        t_TP = t_FP = t_FN = 0
        for img_path in imgs:
            lbl = lbl_dir / (img_path.stem + ".txt")
            preds = predict(model, img_path)
            img_w = preds[0]["img_w"] if preds else 640
            img_h = preds[0]["img_h"] if preds else 640
            gts = load_gt(lbl, img_w, img_h)
            tp, fp, fn, _ = match(preds, gts, float(thresh))
            t_TP += tp; t_FP += fp; t_FN += fn
        prec = t_TP/(t_TP+t_FP) if (t_TP+t_FP)>0 else 0
        rec  = t_TP/(t_TP+t_FN) if (t_TP+t_FN)>0 else 0
        ap_list.append(prec * rec)
        if abs(thresh - 0.50) < 0.001:
            tot_TP, tot_FP, tot_FN = t_TP, t_FP, t_FN

    # Collect per-image data for samples
    for img_path in imgs[:12]:
        lbl = lbl_dir / (img_path.stem + ".txt")
        preds = predict(model, img_path)
        img_w = preds[0]["img_w"] if preds else 640
        img_h = preds[0]["img_h"] if preds else 640
        gts = load_gt(lbl, img_w, img_h)
        _, _, _, iou_v = match(preds, gts, 0.50)
        all_iou_vals.extend(iou_v)
        samples.append({"img": img_path.stem, "gts": gts, "preds": preds, "iou_vals": iou_v})

    precision = tot_TP/(tot_TP+tot_FP) if (tot_TP+tot_FP)>0 else 0
    recall    = tot_TP/(tot_TP+tot_FN) if (tot_TP+tot_FN)>0 else 0
    map50     = ap_list[0] if ap_list else 0
    map50_95  = float(np.mean(ap_list)) if ap_list else 0
    mean_iou  = float(np.mean(all_iou_vals)) if all_iou_vals else 0

    print(f"\n  TP={tot_TP}  FP={tot_FP}  FN={tot_FN}")
    print(f"  Precision : {precision:.4f}  ({precision*100:.1f}%)")
    print(f"  Recall    : {recall:.4f}  ({recall*100:.1f}%)")
    print(f"  mAP@50    : {map50:.4f}  ({map50*100:.1f}%)")
    print(f"  mAP@50-95 : {map50_95:.4f}  ({map50_95*100:.1f}%)")
    print(f"  Mean IoU  : {mean_iou:.4f}  ({mean_iou*100:.1f}%)")

    print(f"\n  ── Sample detections ──")
    for s in samples[:9]:
        print(f"\n  ImageId: {s['img']}")
        if s["gts"]:
            g = s["gts"][0]
            b = [round(v,1) for v in g["box"]]
            print(f"    GT  : cls={g['class_id']} ({CLASS_NAMES.get(g['class_id'],'?')})  box={b}")
        else:
            print(f"    GT  : (background — no annotation)")
        if s["preds"]:
            p = s["preds"][0]
            b = [round(v,1) for v in p["box"]]
            print(f"    PRED: cls={p['class_id']} ({p['class_name']})  conf={p['conf']:.3f}  box={b}")
        else:
            print(f"    PRED: (no detection)")
        if s["iou_vals"]:
            print(f"    IoU : {s['iou_vals'][0]:.4f}")
        elif s["gts"] and not s["preds"]:
            print(f"    IoU : MISS (FN)")
        elif not s["gts"] and s["preds"]:
            print(f"    IoU : FALSE POSITIVE")

    return {"precision": precision, "recall": recall,
            "map50": map50, "map50_95": map50_95,
            "mean_iou": mean_iou}


def location_stats():
    stats = {"exif":0,"metadata":0,"csv_verified":0,"simulated":0,"unavailable":0,"total":0}
    if not CSV_PATH.exists():
        return stats
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            src = (row.get("location_source") or "").strip().lower()
            stats["total"] += 1
            if src == "exif":                          stats["exif"] += 1
            elif src in ("metadata","sonar_metadata"): stats["metadata"] += 1
            elif src == "simulated":                   stats["simulated"] += 1
            elif src in ("csv","dataset_match","navigation","interpolated_navigation","csv_verified"):
                stats["csv_verified"] += 1
            else:                                      stats["unavailable"] += 1
    return stats


def annotation_quality():
    sizes = []
    empty = 0
    checked = 0
    for lbl in list(VALID_LBL.glob("*.txt")) + list(TRAIN_LBL.glob("*.txt")):
        lines = [l.strip() for l in lbl.read_text().splitlines() if l.strip()]
        checked += 1
        if not lines:
            empty += 1
        for line in lines:
            parts = line.split()
            if len(parts) >= 5:
                w, h = float(parts[3]), float(parts[4])
                sizes.append(w * h)
    return {"checked": checked, "empty": empty,
            "sizes": sizes,
            "large_25pct": sum(1 for s in sizes if s > 0.25),
            "large_50pct": sum(1 for s in sizes if s > 0.50)}


if __name__ == "__main__":
    from ultralytics import YOLO
    print(f"Model: {MODEL_PATH}")
    if not MODEL_PATH.exists():
        print("❌  Model file not found"); sys.exit(1)
    model = YOLO(str(MODEL_PATH))

    # Validation set evaluation
    valid_res = evaluate(model, VALID_IMG, VALID_LBL, "VALIDATION SET", max_images=100)

    # Location stats
    loc = location_stats()
    print(f"\n{'='*60}")
    print("  Location Resolution Statistics")
    print(f"{'='*60}")
    for k, v in loc.items():
        print(f"  {k:20s}: {v}")

    # Annotation quality
    aq = annotation_quality()
    print(f"\n{'='*60}")
    print("  Annotation Quality Check")
    print(f"{'='*60}")
    print(f"  Label files checked : {aq['checked']}")
    print(f"  Empty (background)  : {aq['empty']}")
    if aq["sizes"]:
        print(f"  Bbox normalised area: min={min(aq['sizes']):.4f}  max={max(aq['sizes']):.4f}  mean={np.mean(aq['sizes']):.4f}")
        print(f"  Large boxes >25%    : {aq['large_25pct']} / {len(aq['sizes'])}")
        print(f"  Large boxes >50%    : {aq['large_50pct']} / {len(aq['sizes'])}")
        if aq["large_50pct"] > len(aq["sizes"]) * 0.3:
            print("  ⚠️  WARNING: Many annotations cover >50% of image.")
            print("  ⚠️  This suggests full-image / imprecise annotation boxes.")
            print("  ⚠️  Recommendation: RETRAINING with tighter annotations required for tight bounding boxes.")
    print("\n✅  Validation complete.")
