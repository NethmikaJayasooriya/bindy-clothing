"""Prepare campaign photographs and the client's requested button retouch.

Run with: python scripts/prepare_bindi_photos.py
Original files are read-only. Approved retouches live separately in assets/retouched.
Crops use EXIF-corrected pixels; gallery exports are not upscaled.
"""
from pathlib import Path
from PIL import Image, ImageOps
import json
import sys

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "Bindi"
OUTPUT = ROOT / "public/images/bindi-real"
OUTPUT.mkdir(parents=True, exist_ok=True)

def photo(file, label, box=None):
    return {"file": file + ".jpg", "label": label, "box": box}

def retouched(file, label, box=None):
    return {"file": f"assets/retouched/{file}.png", "label": label, "box": box}

RECIPES = {
    "cacao-satin-cami": [
        photo("20261001_145459(0)", "On the model", [0, .15, 1, .90]),
        photo("20261001_145457", "Styled with ivory", [0, .15, 1, .90]),
        photo("20261001_145848", "Satin & neckline", [.12, .12, .91, .87]),
        photo("20261001_145633", "The complete look"),
    ],
    "ivory-tiered-maxi-skirt": [
        photo("20261001_145633", "On the model", [0, .23, 1, .98]),
        photo("20261001_145459(0)", "Movement & drape", [0, .22, 1, .97]),
        photo("20261001_145743", "Waist & tier detail"),
        photo("20261001_145743", "Ruffles & texture", [.15, .30, .87, .84]),
    ],
    "monochrome-breeze-maxi-dress": [
        photo("20261001_150822", "On the model", [0, .20, 1, .95]),
        photo("20261001_151107", "The full silhouette", [0, .22, 1, .97]),
        photo("20261001_150923", "Bodice & lace seam", [.12, .10, .91, .85]),
        photo("20261001_151419(0)", "Walking view", [0, .12, 1, .97]),
    ],
    "pearl-lace-blouse": [
        photo("20261001_152238", "On the model", [0, .12, 1, .87]),
        photo("20261001_152142", "Front view", [0, .12, 1, .87]),
        photo("20261001_152338", "Side & fit", [0, .14, 1, .89]),
        photo("20261001_152142", "Buttons & lace finish", [.17, .45, .82, .88]),
    ],
    "sage-shirt-maxi-dress": [
        photo("20261001_154737(0)", "On the model", [0, .12, 1, .97]),
        photo("20261001_154540(0)", "Side & movement", [0, .12, 1, .97]),
        photo("20261001_154548(0)", "Gathering & buttons", [.12, .36, .87, .92]),
        photo("20261001_160419", "Back view", [.23, .17, .51, .99]),
    ],
    "botanic-rose-cami": [
        photo("20261001_155528", "On the model", [.08, .15, .94, .80]),
        photo("20261001_155528", "Print & neckline", [.19, .29, .80, .61]),
        photo("20261001_160436", "Back & straps", [.42, .20, .68, .77]),
        photo("20261001_155902 (1)", "Styled in the city", [.40, .33, .61, .99]),
    ],
    "botanic-rose-trousers": [
        photo("20261001_155528", "On the model", [0, .20, 1, .98]),
        photo("20261001_155528", "Waist & floral print", [.20, .49, .78, .95]),
        photo("20261001_155902 (1)", "Another angle", [.40, .33, .61, .99]),
        photo("20261001_160419", "Back & drape", [.41, .34, .67, .99]),
    ],
    "ivory-eyelet-mini-skirt": [
        photo("20261005_141019", "On the model", [0, .19, 1, .94]),
        photo("20261005_141041(0)", "Side & silhouette", [0, .19, 1, .94]),
        photo("20261005_141128", "Eyelet & waistband"),
        photo("20261005_141128", "Floral cutwork detail", [.13, .43, .90, .82]),
    ],
    "moonflower-halter-top": [
        photo("20261005_142323 (1)", "On the model", [0, .14, 1, .89]),
        photo("20261005_142358", "Back & halter tie", [0, .14, 1, .89]),
        photo("20261005_142323 (1)", "Embroidery & tie", [.17, .29, .85, .69]),
        photo("20261005_142358", "Eyelet back detail", [.20, .34, .87, .70]),
    ],
    "midnight-flow-maxi-skirt": [
        photo("20261005_142323 (1)", "On the model", [0, .22, 1, .97]),
        photo("20261005_142358", "Back view", [0, .22, 1, .97]),
        photo("20261005_142323 (1)", "Gathering & drape", [.18, .50, .87, .93]),
        photo("20261005_142358", "Hem & movement", [.22, .55, .87, .97]),
    ],
    "rose-dot-corset-top": [
        retouched("rose-dot-button-waterfront", "On the model", [.28, .32, .66, .99]),
        photo("20261005_150600", "Back view", [.32, .34, .59, .99]),
        retouched("rose-dot-button-closeup", "Dots & button detail"),
        retouched("rose-dot-button-closeup", "Bodice finish", [.10, .25, .89, .89]),
    ],
    "rose-stripe-strapless-dress": [
        photo("20261005_172136", "On the model", [0, .18, 1, .98]),
        photo("20261005_171437", "Garden silhouette", [.49, .17, .78, .99]),
        photo("20261005_165721", "Stripes & bodice"),
        photo("20261005_172125", "A little movement", [.39, .40, .61, .99]),
    ],
}

# Listing photographs focus on the item being sold. A coordinated outfit is
# still available in the gallery, without making the two separates look alike.
CARD_RECIPES = {
    "cacao-satin-cami": [
        photo("20261001_145848", "Camisole", [0, .07, 1, .82]),
        photo("20261001_145459(0)", "Camisole alternate", [.15, .24, .88, .63]),
    ],
    "ivory-tiered-maxi-skirt": [
        photo("20261001_145633", "Skirt", [.16, .51, .90, .99]),
        photo("20261001_145743", "Skirt detail", [0, .08, 1, .98]),
    ],
    "botanic-rose-cami": [
        photo("20261001_155902 (1)", "Camisole", [.415, .38, .575, .73]),
        photo("20261001_155528", "Camisole alternate", [.32, .35, .72, .58]),
    ],
    "botanic-rose-trousers": [
        photo("20261001_155528", "Trousers", [.34, .52, .72, .84]),
        photo("20261001_160419", "Trousers back", [.43, .59, .66, .99]),
    ],
    "ivory-eyelet-mini-skirt": [
        photo("20261005_141128", "Mini skirt", [.05, .25, .95, .91]),
        photo("20261005_141041(0)", "Mini skirt alternate", [.26, .51, .75, .80]),
    ],
    "moonflower-halter-top": [
        photo("20261005_142323 (1)", "Halter top", [.24, .25, .77, .65]),
        photo("20261005_142358", "Halter back", [.22, .32, .84, .69]),
    ],
    "midnight-flow-maxi-skirt": [
        photo("20261005_142323 (1)", "Black skirt", [.23, .49, .77, .94]),
        photo("20261005_142358", "Black skirt alternate", [.23, .50, .80, .95]),
    ],
    "rose-dot-corset-top": [
        retouched("rose-dot-button-closeup", "Button-front top", [0, .25, 1, .87]),
        retouched("rose-dot-button-waterfront", "Waterfront view", [.33, .39, .61, .99]),
    ],
}
CARDS_ONLY = "--cards-only" in sys.argv

def load(file, box=None):
    source_path = ROOT / file if file.startswith("assets/") else SOURCE / file
    with Image.open(source_path) as source:
        im = ImageOps.exif_transpose(source).convert("RGB")
    if box:
        im = im.crop(tuple(round(v * (im.width if i % 2 == 0 else im.height)) for i, v in enumerate(box)))
    return im

def save(im, path, edge, quality):
    im = im.copy()
    im.thumbnail((edge, edge), Image.Resampling.LANCZOS)
    im.save(path, "WEBP", quality=quality, method=6)

manifest = {}
audit = {}
for slug, views in RECIPES.items():
    gallery, zoom = [], []
    revision = "v3" if slug == "rose-dot-corset-top" else "v2"
    for i, view in enumerate(views):
        name = f"{slug}-retouched-{i + 1:02}" if slug == "rose-dot-corset-top" else f"{slug}-{i + 1:02}"
        im = load(view["file"], view["box"])
        if not CARDS_ONLY:
            save(im, OUTPUT / f"{name}.webp", 2200, 86)
            save(im, OUTPUT / f"{name}-zoom.webp", 3600, 92)
        gallery.append(f"/images/bindi-real/{name}.webp")
        zoom.append(f"/images/bindi-real/{name}-zoom.webp")
    # Small listing images avoid downloading a full gallery photo for every card.
    listing_views = CARD_RECIPES.get(slug, views[:2])
    for suffix, view in [(f"card-{revision}", listing_views[0]), (f"hover-{revision}", listing_views[1])]:
        im = load(view["file"], view["box"])
        im = ImageOps.fit(im, (780, 1040), method=Image.Resampling.LANCZOS, centering=(.5, .38))
        save(im, OUTPUT / f"{slug}-{suffix}.webp", 1040, 84)
    manifest[slug] = {
        "image": f"/images/bindi-real/{slug}-card-{revision}.webp",
        "imageHover": f"/images/bindi-real/{slug}-hover-{revision}.webp",
        "gallery": gallery,
        "galleryZoom": zoom,
        "galleryLabels": [v["label"] for v in views],
        "imageSource": "photography",
    }
    audit[slug] = views

campaigns = [
    ("together", "20261001_155954.jpg", None),
    ("waterfront", "20261005_150612.jpg", None),
    ("city", "20261001_152722 (1).jpg", None),
    ("slow-days", "20261005_141339.jpg", None),
    ("garden", "20261005_171104.jpg", None),
]
if not CARDS_ONLY:
    for slug, file, box in campaigns:
        im = load(file, box)
        save(im, OUTPUT / f"campaign-{slug}.webp", 2560, 87)

(ROOT / "data/real-product-photos.json").write_text(json.dumps(manifest, indent=2) + "\n")
(OUTPUT / "sources.json").write_text(json.dumps({"products": audit, "listingCrops": CARD_RECIPES, "campaigns": campaigns}, indent=2) + "\n")
print(f"Prepared {len(manifest)} real product galleries and {len(campaigns)} campaign images.")
