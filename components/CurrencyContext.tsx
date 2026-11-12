"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";

export type Market = "Australia" | "Sri Lanka";
export type Currency = "AUD" | "LKR";

export interface FormattedPrice {
  amount: number;
  formatted: string;
  currency: Currency;
  symbol: string;
}

export interface ProductPriceInput {
  priceAud: number;
  priceLkr?: number;
  compareAtAud?: number;
}

export function getProductPrice(
  product: ProductPriceInput,
  market: Market
): FormattedPrice {
  if (market === "Sri Lanka") {
    const amount =
      typeof product.priceLkr === "number" && product.priceLkr > 0
        ? product.priceLkr
        : Math.ceil(product.priceAud * 200);
    return {
      amount,
      formatted: `Rs. ${amount.toLocaleString()}`,
      currency: "LKR",
      symbol: "Rs. ",
    };
  }

  const amount = product.priceAud;
  return {
    amount,
    formatted: `$${amount} AUD`,
    currency: "AUD",
    symbol: "$",
  };
}

interface CurrencyContextValue {
  market: Market;
  country: "AU" | "LK";
  currency: Currency;
  isLkr: boolean;
  isAud: boolean;
  setMarket: (market: Market) => void;
  toggleMarket: () => void;
  formatPrice: (product: ProductPriceInput, options?: { showCurrency?: boolean }) => string;
  getPrice: (product: ProductPriceInput) => FormattedPrice;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  market: "Australia",
  country: "AU",
  currency: "AUD",
  isLkr: false,
  isAud: true,
  setMarket: () => {},
  toggleMarket: () => {},
  formatPrice: (product) => `$${product.priceAud} AUD`,
  getPrice: (product) => ({
    amount: product.priceAud,
    formatted: `$${product.priceAud} AUD`,
    currency: "AUD",
    symbol: "$",
  }),
});

const STORAGE_KEY = "bindy_market";
const EVENT_NAME = "bindy-market-change";

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [market, setMarketState] = useState<Market>("Australia");

  const setMarket = useCallback((next: Market) => {
    setMarketState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
      sessionStorage.setItem(STORAGE_KEY, next);
      // Set cookie for server components / middleware
      document.cookie = `bindy_market=${encodeURIComponent(next)}; path=/; max-age=31536000; SameSite=Lax`;
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: next }));
    } catch {}
  }, []);

  const toggleMarket = useCallback(() => {
    setMarket(market === "Sri Lanka" ? "Australia" : "Sri Lanka");
  }, [market, setMarket]);

  useEffect(() => {
    try {
      // 1. URL search params override (?market=Sri+Lanka or ?country=LK or ?currency=LKR)
      const params = new URLSearchParams(window.location.search);
      const paramMarket = params.get("market") || params.get("country") || params.get("currency");
      if (paramMarket) {
        const lower = paramMarket.toLowerCase();
        if (lower.includes("sri") || lower === "lk" || lower === "lkr") {
          setMarket("Sri Lanka");
          return;
        }
        if (lower.includes("aus") || lower === "au" || lower === "aud") {
          setMarket("Australia");
          return;
        }
      }

      // 2. Saved preference in storage
      const saved = (localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY)) as Market | null;
      if (saved === "Australia" || saved === "Sri Lanka") {
        setMarketState(saved);
        return;
      }

      // 3. Client timezone detection (Sri Lanka vs Australia / rest of world)
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      if (tz.includes("Colombo") || tz.includes("Sri_Lanka")) {
        setMarket("Sri Lanka");
        return;
      }

      // 4. Try server geo detection if available
      fetch("/api/geo")
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data?.market === "Sri Lanka" || data?.market === "Australia") {
            setMarket(data.market);
          }
        })
        .catch(() => {});
    } catch {
      /* default remains Australia */
    }
  }, [setMarket]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && (e.newValue === "Australia" || e.newValue === "Sri Lanka")) {
        setMarketState(e.newValue as Market);
      }
    };
    const handleCustom = (e: Event) => {
      const customEvent = e as CustomEvent<Market>;
      if (customEvent.detail === "Australia" || customEvent.detail === "Sri Lanka") {
        setMarketState(customEvent.detail);
      }
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener(EVENT_NAME, handleCustom);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(EVENT_NAME, handleCustom);
    };
  }, []);

  const country: "LK" | "AU" = market === "Sri Lanka" ? "LK" : "AU";
  const currency: Currency = market === "Sri Lanka" ? "LKR" : "AUD";
  const isLkr = market === "Sri Lanka";
  const isAud = market === "Australia";

  const getPrice = useCallback(
    (product: ProductPriceInput) => getProductPrice(product, market),
    [market]
  );

  const formatPrice = useCallback(
    (product: ProductPriceInput, options?: { showCurrency?: boolean }) => {
      const info = getProductPrice(product, market);
      if (options?.showCurrency === false) {
        return market === "Sri Lanka" ? `Rs. ${info.amount.toLocaleString()}` : `$${info.amount}`;
      }
      return info.formatted;
    },
    [market]
  );

  const value = useMemo(
    () => ({
      market,
      country,
      currency,
      isLkr,
      isAud,
      setMarket,
      toggleMarket,
      formatPrice,
      getPrice,
    }),
    [market, country, currency, isLkr, isAud, setMarket, toggleMarket, formatPrice, getPrice]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
