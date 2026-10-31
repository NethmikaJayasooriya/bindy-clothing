// Private input references, never product gallery images. Re-run only after reviewing crops.
const fs = require('node:fs/promises'), path = require('node:path'), sharp = require('sharp');
const load = require('./lib/load-project.cjs')();
const { STUDIO_TOPS, STUDIO_BOTTOMS } = load('@/lib/styleStudio');
const original = name => `assets/retired-reference-photos/${name}.jpg`;
const overrides = {
  'cacao-satin-cami': [original('cacao-satin-cami-styled'), [0, 0, 1, .74]],
  'ivory-tiered-maxi-skirt': [original('ivory-tiered-maxi-skirt-detail')],
  'ivory-eyelet-mini-skirt': [original('ivory-eyelet-mini-skirt-detail')],
  'botanic-rose-cami': [original('botanic-rose-cami-styled'), [0, 0, 1, .40]],
  'botanic-rose-trousers': [original('botanic-rose-trousers-detail')],
  'midnight-flow-maxi-skirt': [original('midnight-maxi-skirt-detail')],
  'pearl-lace-blouse': [original('pearl-lace-blouse-styled'), [0, 0, 1, .78]],
  'rose-stripe-shirt': [original('rose-stripe-shirt-detail')],
  'ivory-crochet-bralette': [original('ivory-crochet-bralette-detail')],
  'sunlit-paisley-shirt': [original('sunlit-paisley-coord-detail'), [0, 0, 1, .76]],
  'gingham-wander-maxi-skirt': [original('crochet-bralette-gingham-skirt-styled'), [0, .31, 1, .67]],
};
// Each rectangle includes the complete selected garment, excluding most of its partner.
const crops = {
 'shore-traces-blouse': [0, .15, 1, .46],
 'tea-leaf-two-piece--top': [0, .15, 1, .35], 'tea-leaf-two-piece--bottom': [0, .39, 1, .59],
 'beyond-garden-wall-peplum': [0, .11, 1, .5],
 'desert-rose-set--top': [0, .08, 1, .4], 'desert-rose-set--bottom': [0, .34, 1, .36],
 'sunset-stroll-set--top': [0, .13, 1, .4], 'sunset-stroll-set--bottom': [0, .37, 1, .6],
 'terra-essence-set--top': [0, .12, 1, .35], 'terra-essence-set--bottom': [0, .37, 1, .6],
 'midnight-bloom-set--top': [0, .13, 1, .37], 'midnight-bloom-set--bottom': [0, .38, 1, .6],
 'cinnamon-flow-skirt': [0, .39, 1, .59], 'celestial-terracotta-skirt': [0, .4, 1, .58],
 'sunlit-paisley-shorts': [0, .35, 1, .25], 'gingham-wander-maxi-skirt': [0, .36, 1, .62],
};
(async () => {
 await fs.mkdir('data/tryon-references', { recursive: true }); const manifest = {};
 for (const p of [...STUDIO_TOPS, ...STUDIO_BOTTOMS]) {
  const [source, crop] = overrides[p.id] || [path.join('public', p.image), crops[p.id]];
  let image = sharp(source).rotate(), { width, height } = await image.metadata();
  if (crop) image = image.extract({ left: Math.round(width*crop[0]), top: Math.round(height*crop[1]), width: Math.round(width*crop[2]), height: Math.round(height*crop[3]) });
  const file = `${p.id}.webp`;
  await image.resize({ width: 1400, height: 1800, fit: 'inside', withoutEnlargement: true }).webp({ quality: 96 }).toFile(path.join('data/tryon-references', file));
  manifest[p.id] = { catalogImage: p.image, file, ...(['cacao-satin-cami','botanic-rose-cami'].includes(p.id) ? { instruction: 'The camisole must hang OUTSIDE and OVER the waistband, not tucked or bloused into it. Show its complete original straight lower hem loose over the skirt, just as in reference 1. Keep BOTH original bare feet unchanged; add no shoes, straps, sandals or accessories.' } : {}) };
 }
 await fs.writeFile('data/tryon-sources.json', JSON.stringify(manifest, null, 2)+'\n');
 console.log(`${Object.keys(manifest).length} private garment references prepared.`);
})();
