"""
YOLO Model Training Script for Side-Scan Sonar (SSS) Object Detection
Dataset: Side-Scan Sonar Object Detection Challenge (AI4Shipwrecks / Marine Anomaly Detection)
Classes: 0: Shipwreck, 1: Marine Debris, 2: Ghost Net, 3: Underwater Pipe
"""

import os
import sys
import shutil
import argparse
from pathlib import Path


def validate_dataset(data_yaml_path: Path):
    """
    Validate existence of dataset images, labels, and class distribution
    before initiating YOLO neural training.
    """
    print("\n" + "=" * 60)
    print("🔍 VALIDATING DATASET STRUCTURE & LABELS")
    print("=" * 60)

    if not data_yaml_path.exists():
        print(f"❌ Error: data.yaml not found at: {data_yaml_path}")
        return False

    base_dir = data_yaml_path.parent
    dataset_dir = (base_dir / "../public/datasets/side-scan-sonar-object-detection-challenge").resolve()

    train_img_dir = dataset_dir / "train" / "images"
    train_lbl_dir = dataset_dir / "train" / "labels"
    valid_img_dir = dataset_dir / "valid" / "images"
    valid_lbl_dir = dataset_dir / "valid" / "labels"

    # Check directories
    checks = [
        ("Train Images", train_img_dir),
        ("Train Labels", train_lbl_dir),
        ("Valid Images", valid_img_dir),
        ("Valid Labels", valid_lbl_dir),
    ]

    for name, path in checks:
        if not path.exists():
            print(f"❌ Error: {name} directory missing at: {path}")
            return False

    train_imgs = list(train_img_dir.glob("*.jpg")) + list(train_img_dir.glob("*.png"))
    train_lbls = list(train_lbl_dir.glob("*.txt"))
    valid_imgs = list(valid_img_dir.glob("*.jpg")) + list(valid_img_dir.glob("*.png"))
    valid_lbls = list(valid_lbl_dir.glob("*.txt"))

    print(f"✅ Training Images found  : {len(train_imgs)}")
    print(f"✅ Training Labels found  : {len(train_lbls)}")
    print(f"✅ Validation Images found: {len(valid_imgs)}")
    print(f"✅ Validation Labels found: {len(valid_lbls)}")

    if len(train_imgs) == 0:
        print("❌ Error: No training images found.")
        return False
    if len(valid_imgs) == 0:
        print("❌ Error: No validation images found.")
        return False

    # Check classes in label files
    class_ids = set()
    for lbl in train_lbls + valid_lbls:
        try:
            with open(lbl, "r") as f:
                for line in f:
                    parts = line.strip().split()
                    if parts:
                        class_ids.add(int(float(parts[0])))
        except Exception as e:
            print(f"⚠️ Warning reading {lbl}: {e}")

    print(f"✅ Verified Class IDs in dataset: {sorted(list(class_ids))} (Total: {len(class_ids)} classes)")
    print("=" * 60 + "\n")
    return True


def run_training(args):
    """
    Execute Ultralytics YOLO training pipeline.
    """
    try:
        from ultralytics import YOLO
        import torch
    except ImportError:
        print("\n❌ Error: Missing required dependencies.")
        print("Please install requirements by running:")
        print("    pip install -r requirements.txt\n")
        sys.exit(1)

    backend_dir = Path(__file__).resolve().parent
    data_yaml_path = backend_dir / "data.yaml"

    # Step 1: Pre-validation
    if not validate_dataset(data_yaml_path):
        print("❌ Dataset validation failed. Aborting training.")
        sys.exit(1)

    # Step 2: Device Selection
    if args.device:
        device = args.device
    else:
        if torch.cuda.is_available():
            device = 0
            gpu_name = torch.cuda.get_device_name(0)
            print(f"🚀 CUDA GPU Detected: {gpu_name} (Using device: 0)")
        else:
            device = "cpu"
            print("ℹ️ CUDA not available. Running on CPU.")

    # Step 3: Load Model
    print(f"\n📦 Loading pretrained YOLO base model: {args.model}")
    model = YOLO(args.model)

    # Step 4: Run Training
    print(f"\n🎯 Starting YOLO training on Side-Scan Sonar Dataset...")
    print(f"   - Epochs    : {args.epochs}")
    print(f"   - Image Size: {args.imgsz}")
    print(f"   - Batch Size: {args.batch}")
    print(f"   - Workers   : {args.workers}")
    print(f"   - Device    : {device}\n")

    results = model.train(
        data=str(data_yaml_path),
        epochs=args.epochs,
        imgsz=args.imgsz,
        batch=args.batch,
        workers=args.workers,
        device=device,
        project="runs/detect",
        name="sonar_train",
        exist_ok=True,
        save=True,
        verbose=True
    )

    # Step 5: Save & Deploy Best Model
    models_dir = backend_dir / "models"
    models_dir.mkdir(exist_ok=True)
    destination_weights = models_dir / "best.pt"

    trained_best_weights = Path(results.save_dir) / "weights" / "best.pt"

    if trained_best_weights.exists():
        shutil.copy2(trained_best_weights, destination_weights)
        print("\n" + "=" * 60)
        print("🎉 TRAINING COMPLETE!")
        print(f"📁 Weights saved to   : {trained_best_weights}")
        print(f"🚀 Deployed model to : {destination_weights}")
        print("=" * 60 + "\n")
    else:
        print(f"\n⚠️ Training finished, but best.pt not found at expected path: {trained_best_weights}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train YOLO model on Side-Scan Sonar Dataset")
    parser.add_argument("--epochs", type=int, default=50, help="Number of training epochs (default: 50)")
    parser.add_argument("--imgsz", type=int, default=640, help="Image resolution size (default: 640)")
    parser.add_argument("--batch", type=int, default=16, help="Batch size (default: 16, use -1 for auto)")
    parser.add_argument("--workers", type=int, default=4, help="DataLoader worker threads (default: 4)")
    parser.add_argument("--device", type=str, default="", help="Device: '0', 'cpu', etc. (default: auto)")
    parser.add_argument("--model", type=str, default="yolov8n.pt", help="Base model weights (default: yolov8n.pt)")

    args = parser.parse_args()
    run_training(args)
