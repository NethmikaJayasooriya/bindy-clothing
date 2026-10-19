"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { PRODUCTS } from "@/data/products";
import { DEFAULT_HERO, DEFAULT_SETTINGS, type PublicStore } from "@/lib/store-types";
const fallback: PublicStore = { products: PRODUCTS, hero: DEFAULT_HERO, settings: DEFAULT_SETTINGS, pages: [], revision: 0 };
const StorefrontContext = createContext(fallback);
export function StorefrontProvider({ children, initial }: { children: React.ReactNode; initial?: PublicStore }) {
  const [store, setStore] = useState(initial ?? fallback);
  const refresh = useCallback(() => { fetch("/api/storefront", { cache: "no-store" }).then(r => r.ok ? r.json() : null).then(data => { if (data) setStore(current=>current.revision===data.revision?current:data); }).catch(() => {}); }, []);
  useEffect(() => { refresh(); const timer = setInterval(refresh, 60000); window.addEventListener("focus", refresh); return () => { clearInterval(timer); window.removeEventListener("focus", refresh); }; }, [refresh]);
  return <StorefrontContext.Provider value={store}>{children}</StorefrontContext.Provider>;
}
export function useStorefront() { return useContext(StorefrontContext); }
