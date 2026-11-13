import type { Product } from './products';

// Style 010 contains two different crochet designs; it must never be grouped by code.
const families: Record<string, {name: string; ids: string[]}> = {
 shirts: {name:'Relaxed Cotton Shirt',ids:['rose-stripe-shirt','white-striped-relaxed-shirt','black-relaxed-cotton-shirt']},
 corsets: {name:'Strapless Button-Front Top',ids:['lime-strapless-button-front-top','shore-traces-blouse']},
 skirts: {name:'Relaxed Flared Maxi Skirt',ids:['serendib-pearl-dress','black-relaxed-flared-maxi-skirt','brown-relaxed-flared-maxi-skirt','red-relaxed-flared-maxi-skirt']},
 shirtDresses: {name:'Tiered Cotton Shirt Dress',ids:['black-tiered-cotton-shirt-dress','soft-ivory-tiered-shirt-dress','sage-mist-tiered-cotton-shirt-dress','olive-grove-tiered-cotton-shirt-dress','earth-clay-tiered-cotton-shirt-dress','warm-sand-tiered-cotton-shirt-dress']},
 vests: {name:'Tailored Rayon Vest',ids:['chartreuse-tailored-rayon-vest','beige-tailored-rayon-vest']},
 peplums: {name:'Cotton Peplum Blouse',ids:['white-cotton-peplum-blouse','pink-cotton-peplum-blouse']},
};
function family(id: string) { return Object.entries(families).find(([,f])=>f.ids.includes(id)); }
export function productDisplayName(product: Pick<Product,'id'|'name'>) { return family(product.id)?.[1].name ?? product.name; }
export function colourVariants<T extends Pick<Product,'id'>>(product: T, products: T[]): T[] {
 const group=family(product.id)?.[1];return group ? products.filter(p=>group.ids.includes(p.id)) : [product];
}
export function groupCatalogueProducts<T extends Pick<Product,'id'>>(products: T[]): T[] {
 const seen=new Set<string>();return products.filter(p=>{const key=family(p.id)?.[0]??p.id;if(seen.has(key))return false;seen.add(key);return true;});
}
