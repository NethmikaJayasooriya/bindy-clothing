// Withdrawn from sale at the owner's request. Historical order lines stay intact.
export const RETIRED_PRODUCT_IDS = ["moonflower-halter-top", "rose-dot-corset-top", "midnight-flow-maxi-skirt", "black-white-gingham-maxi-skirt"] as const;
export function isRetiredProduct(id: string) {
  return (RETIRED_PRODUCT_IDS as readonly string[]).includes(id);
}
