export interface AudShippingSettings {
  standardShipping: number;
  expressShipping: number;
  freeShippingThreshold: number;
  freeShippingEnabled?: boolean;
}

export function qualifiesForFreeShipping(settings: AudShippingSettings, subtotal: number) {
  return settings.freeShippingEnabled !== false && subtotal >= settings.freeShippingThreshold;
}

export function audShippingFee(settings: AudShippingSettings, subtotal: number, method: "standard" | "express" = "standard") {
  if (qualifiesForFreeShipping(settings, subtotal)) return 0;
  return method === "express" ? settings.expressShipping : settings.standardShipping;
}

export function audShippingDescription(settings: AudShippingSettings) {
  const rates = settings.standardShipping === settings.expressShipping
    ? `Shipping to Australia is AUD ${settings.standardShipping} per order.`
    : `Standard shipping to Australia is AUD ${settings.standardShipping}; express shipping is AUD ${settings.expressShipping}.`;
  return `${rates} ${settings.freeShippingEnabled === false
    ? "Shipping is charged on every Australian order."
    : `Free shipping applies to orders of AUD ${settings.freeShippingThreshold} or more.`}`;
}
