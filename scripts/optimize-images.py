"""Generate content-addressed responsive WebP assets. Originals are never overwritten."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from PIL import Image, ImageOps
from urllib.parse import unquote
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
OUTPUT = PUBLIC / "images/optimized"
OUTPUT.mkdir(parents=True, exist_ok=True)
PATTERN = re.compile(r'''["'`](\/(?:images|uploads)\/[^"'`\r\n]+?\.(?:jpe?g|png|webp|avif|jfif))["'`]''', re.I)
retired = json.loads((ROOT / "data/retired-product-images.json").read_text(encoding="utf-8"))
urls = set()
for folder in ("app", "components", "data", "lib"):
    for file in (ROOT / folder).rglob("*"):
        if file.suffix not in (".tsx", ".ts", ".json", ".css") or file.name in ("image-manifest.json", "retired-product-images.json"):
            continue
        urls.update(PATTERN.findall(file.read_text(encoding="utf-8-sig")))
store = ROOT / ".store/store.json"
if store.exists():
    state = json.loads(store.read_text(encoding="utf-8-sig"))
    # Do not copy private order/customer data into the asset manifest or audit output.
    urls.update(PATTERN.findall(json.dumps({k: state.get(k) for k in ("products", "hero", "media")})))
urls = {retired.get(u, u) for u in urls if not u.startswith("/images/optimized/")}

def optimize(url):
    file = PUBLIC / unquote(url).lstrip("/")
    if not file.is_file():
        return url, None
    try:
        raw = file.read_bytes()
        digest = hashlib.sha256(raw + b"bindy-responsive-v1-q80").hexdigest()[:18]
        with Image.open(file) as source:
            if getattr(source, "is_animated", False):
                return url, None
            image = ImageOps.exif_transpose(source)
            image = image.convert("RGBA" if "A" in image.getbands() else "RGB")
            width, height = image.size
            maximum = 2400 if "-zoom" in file.stem else 1920
            widths = sorted(set(min(width, w) for w in (160, 320, 640, 960, 1600, maximum) if w <= maximum))
            variants = []
            for w in widths:
                target = OUTPUT / f"{digest}-{w}.webp"
                if not target.exists():
                    resized = image.resize((w, max(1, round(height * w / width))), Image.Resampling.LANCZOS)
                    resized.save(target, "WEBP", quality=80 if w >= 960 else 76, method=4)
                variants.append({"width": w, "src": "/images/optimized/" + target.name, "bytes": target.stat().st_size})
        default = min(variants, key=lambda v: abs(v["width"] - 960))
        return url, {"width": width, "height": height, "src": default["src"], "srcSet": ", ".join(f'{v["src"]} {v["width"]}w' for v in variants), "originalBytes": len(raw), "defaultBytes": default["bytes"]}
    except Exception as error:
        print(f"Skipped {url}: {error}", flush=True)
        return url, None

manifest = {}
with ThreadPoolExecutor(max_workers=3) as pool:
    for i, (url, record) in enumerate(pool.map(optimize, sorted(urls))):
        if record:
            manifest[url] = record
        if (i + 1) % 40 == 0:
            print(f"Optimized {i + 1}/{len(urls)} referenced images", flush=True)
(ROOT / "data/image-manifest.json").write_text(json.dumps(manifest, separators=(",", ":")) + "\n", encoding="utf-8")
before = sum(v["originalBytes"] for v in manifest.values())
after = sum(v["defaultBytes"] for v in manifest.values())
report = {"images": len(manifest), "originalBytes": before, "responsive960Bytes": after, "reductionPercent": round((1 - after / before) * 100, 1) if before else 0}
review = ROOT / "output/performance"
review.mkdir(parents=True, exist_ok=True)
(review / "image-optimization.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
print(json.dumps(report), flush=True)
