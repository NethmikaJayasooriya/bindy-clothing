// Withdrawn from sale at the owner's request. Historical order lines stay intact.
export const RETIRED_PRODUCT_IDS = ["moonflower-halter-top", "rose-dot-corset-top"] as const;
export function isRetiredProduct(id: string) {
  return (RETIRED_PRODUCT_IDS as readonly string[]).includes(id);
}
