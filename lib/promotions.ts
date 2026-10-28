import type { StoreState, Promotion } from "@/lib/store-types";
export function publishedPromotions(state: Pick<StoreState,"promotions"|"discounts">, now = new Date()): Promotion[] {
  const today=now.toISOString().slice(0,10);
  return (state.promotions??[]).filter(p=>p.published&&(!p.startsAt||today>=p.startsAt)&&(!p.endsAt||today<=p.endsAt)&&(!p.code||state.discounts.some(d=>d.code===p.code&&d.active&&(!d.startsAt||today>=d.startsAt)&&(!d.endsAt||today<=d.endsAt)&&(!d.usageLimit||d.used<d.usageLimit))));
}
