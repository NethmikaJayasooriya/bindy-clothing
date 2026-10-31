"""Prepare responsive full-figure editorial photography without changing the garments."""
from pathlib import Path
from PIL import Image, ImageOps
import hashlib,json,shutil
ROOT=Path(__file__).resolve().parents[1]
RECIPES={
 'dress-edit':('customer-capsule/editorial/rose-stripe-strapless-dress.webp',None),
 'separates-edit':('customer-capsule/editorial/botanic-rose-cami.webp',None),
 'tops':('customer-capsule/editorial/pearl-lace-blouse.webp',None),
 'dresses':('customer-capsule/editorial/sage-shirt-maxi-dress.webp',None),
 'sets':('campaign/highlands.webp',.6),
 'bottoms':('customer-capsule/editorial/ivory-tiered-maxi-skirt.webp',None),
}
manifest={}
output=ROOT/'public/images/optimized';output.mkdir(exist_ok=True)
for name,(source,focal) in RECIPES.items():
 with Image.open(ROOT/'public/images'/source) as original:image=ImageOps.exif_transpose(original).convert('RGB')
 if focal is not None:
  width=round(image.height*.8);left=round((image.width-width)*focal);image=image.crop((left,0,left+width,image.height))
 digest=hashlib.sha256(image.tobytes()+b'full-figure-discovery-q88-v1').hexdigest()[:18]
 variants=[]
 for width in sorted({min(image.width,w) for w in (320,480,768,1080,1440,image.width)}):
  target=output/f'discovery-{digest}-{width}.webp'
  if not target.exists():image.resize((width,round(width*image.height/image.width)),Image.Resampling.LANCZOS).save(target,'WEBP',quality=88,method=6)
  variants.append({'src':'/images/optimized/'+target.name,'width':width,'bytes':target.stat().st_size})
 logical=ROOT/'public/images/discovery'/f'{name}.webp';logical.parent.mkdir(exist_ok=True);shutil.copyfile(ROOT/'public'/variants[-1]['src'].lstrip('/'),logical)
 manifest['/images/discovery/'+name+'.webp']={'src':variants[-1]['src'],'srcSet':', '.join(f'{v["src"]} {v["width"]}w' for v in variants),'width':image.width,'height':image.height,'variants':variants}
 print(name,image.size,flush=True)
(ROOT/'data/discovery-images.json').write_text(json.dumps(manifest,separators=(',',':'))+'\n')
