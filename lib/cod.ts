import type { Product } from "./products";
import type { StoreSettings } from "./store-types";
export const DEFAULT_COD = {enabled:false,testMode:true,demoMultiplier:200,shippingLkr:400};
export const SL_DISTRICTS = ["Ampara","Anuradhapura","Badulla","Batticaloa","Colombo","Galle","Gampaha","Hambantota","Jaffna","Kalutara","Kandy","Kegalle","Kilinochchi","Kurunegala","Mannar","Matale","Matara","Monaragala","Mullaitivu","Nuwara Eliya","Polonnaruwa","Puttalam","Ratnapura","Trincomalee","Vavuniya"];
export function codSettings(settings:Pick<StoreSettings,"cod">) { return {...DEFAULT_COD,...settings.cod}; }
export function codUnitPrice(product:Pick<Product,"priceAud"|"priceLkr">,settings:ReturnType<typeof codSettings>) {
  // Illustrative test prices only. Live orders always need an explicit LKR price.
  if(settings.testMode) return Math.round(product.priceAud*settings.demoMultiplier);
  return typeof product.priceLkr==="number" && Number.isFinite(product.priceLkr) && product.priceLkr>0 ? product.priceLkr : null;
}
export const lkr = (amount:number) => new Intl.NumberFormat("en-LK",{style:"currency",currency:"LKR",maximumFractionDigits:2}).format(amount);
export type CodQuote = {items:{productId:string;name:string;image:string;size:string;quantity:number;unitPrice:number}[];subtotal:number;shipping:number;total:number;currency:"LKR";testMode:boolean;token:string};
