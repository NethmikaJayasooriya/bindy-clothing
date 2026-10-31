const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),ts=require('typescript');
const data=require('../data/hero-images.json');
const m={exports:{}};new Function('exports',ts.transpileModule(fs.readFileSync('lib/hero-image-policy.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(m.exports);
let checks=0;function check(label,fn){fn();checks++;console.log('PASS '+label);}
for(const [url,image]of Object.entries(data)){
 check(url+': full client resolution available',()=>assert(image.width>=2500&&image.height>=1500));
 check(url+': mobile keeps original vertical detail',()=>assert.equal(image.mobile.height,image.height));
 check(url+': no upscaled or missing variants',()=>{for(const source of [image,image.mobile])for(const v of source.variants){assert(v.width<=source.width);assert(fs.existsSync(path.join('public',v.src)));}});
 check(url+': sharper phone asset stays bounded',()=>{const phone=image.mobile.variants.find(v=>v.width>=1080);assert(phone.bytes<450000);});
}
check('Hero sizes account for cover scaling on portrait phones',()=>{const sizes=m.exports.heroImageSizes(4000/2252);assert(sizes.includes('177.62dvh'));assert(sizes.includes('max(100vw'));});
check('Opening photo accounts for its 70% mobile height',()=>assert(m.exports.heroImageSizes(1,true).includes('70dvh')));
check('Each portrait crop has a bounded responsive media query',()=>assert(Object.values(data).every(v=>v.mobile.media.includes('max-aspect-ratio'))));
console.log(checks+' hero quality checks passed.');
