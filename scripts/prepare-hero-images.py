"""Export sharp campaign variants directly from client originals, without upscaling.

Portrait sources retain the same full-height crop/focal point as object-fit:cover,
so phones download visible detail instead of a tiny landscape image or a 4K scene.
"""
from pathlib import Path
from PIL import Image, ImageOps
import hashlib
import json

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public/images/optimized"
OUTPUT.mkdir(parents=True, exist_ok=True)
CAMPAIGNS = [
    ("/images/bindi-real/campaign-together.webp", "Bindi/20261001_155954.jpg", 1, "55% 90%", "7/10"),
    ("/images/bindi-real/campaign-city.webp", "Bindi/20261001_152722 (1).jpg", .75, "51% 85%", "3/4"),
    ("/images/campaign/blue.webp", "public/images/campaign/blue.webp", .75, "50% 50%", "3/4"),
    ("/images/campaign/coast.webp", "public/images/campaign/coast.webp", .75, "60% 50%", "3/4"),
    ("/images/campaign/highlands.webp", "public/images/campaign/highlands.webp", .75, "60% 50%", "3/4"),
]

def variants(image, tag):
    digest = hashlib.sha256(image.tobytes() + tag.encode() + b"hero-original-q90-v1").hexdigest()[:18]
    widths = sorted({min(image.width, w) for w in (480, 768, 1080, 1440, 1920, 2560, 3200, image.width)})
    exports = []
    for w in widths:
        target = OUTPUT / f"hero-{digest}-{w}.webp"
        if not target.exists():
            image.resize((w, round(image.height * w / image.width)), Image.Resampling.LANCZOS).save(target, "WEBP", quality=90, method=6)
        exports.append({"src": "/images/optimized/" + target.name, "width": w, "bytes": target.stat().st_size})
    return {"width": image.width, "height": image.height, "src": exports[-1]["src"], "srcSet": ", ".join(f'{v["src"]} {v["width"]}w' for v in exports), "variants": exports}

manifest = {}
for slug, name, ratio, focal, aspect_limit in CAMPAIGNS:
    with Image.open(ROOT / name) as original:
        image = ImageOps.exif_transpose(original).convert("RGB")
    full = variants(image, ("together" if "together" in slug else "city" if "city" in slug else slug) + "-desktop")
    x, y = [float(v.strip("%")) / 100 for v in focal.split()]
    crop_width = min(image.width, round(image.height * ratio))
    left = round((image.width - crop_width) * x)
    portrait = image.crop((left, 0, left + crop_width, image.height))
    mobile = variants(portrait, ("together" if "together" in slug else "city" if "city" in slug else slug) + "-mobile")
    mobile.update({"focalPoint": focal, "media": f"(max-width: 700px) and (max-aspect-ratio: {aspect_limit})"})
    full["mobile"] = mobile
    manifest[slug] = full
    print(f"{slug}: desktop {image.width}x{image.height}, mobile {portrait.width}x{portrait.height}", flush=True)
(ROOT / "data/hero-images.json").write_text(json.dumps(manifest, separators=(",", ":")) + "\n", encoding="utf-8")
