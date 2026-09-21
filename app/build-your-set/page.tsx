"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Sparkles, Shuffle, Check, ShoppingBag, ArrowRight, Info, Loader2, Shirt, RefreshCw } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import { getCart, saveCart, addToCart } from "@/lib/cart";
import { ambientPlayer } from "@/lib/ambientSound";
import {
  STUDIO_TOPS,
  STUDIO_BOTTOMS,
  compatibleBottoms,
  matchScore,
  outfitPricing,
  type StudioPiece,
} from "@/lib/styleStudio";

const SIZES = ["AU 6", "AU 8", "AU 10", "AU 12", "AU 14"];

function scoreLabel(s: number) {
  if (s >= 85) return "Perfect match";
  if (s >= 70) return "Great together";
  if (s >= 55) return "Nice pairing";
  return "Bold mix";
}

export default function BuildYourSetPage() {
  const [isMuted, setIsMuted] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [topId, setTopId] = useState<string>(STUDIO_TOPS[0]?.id ?? "");
  const [bottomId, setBottomId] = useState<string>("");
  const [size, setSize] = useState("AU 8");
  const [added, setAdded] = useState(false);

  useEffect(() => { setCartItems(getCart()); }, []);
  const toggleAudio = () => { if (ambientPlayer) setIsMuted(ambientPlayer.toggle()); };

  const top = useMemo<StudioPiece | undefined>(() => STUDIO_TOPS.find((t) => t.id === topId), [topId]);
  const matches = useMemo(() => (topId ? compatibleBottoms(topId, 12) : []), [topId]);

  // keep a sensible bottom selected whenever the top changes
  useEffect(() => {
    if (!matches.length) return;
    if (!matches.some((m) => m.piece.id === bottomId)) setBottomId(matches[0].piece.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topId]);

  const bottom = useMemo<StudioPiece | undefined>(
    () => STUDIO_BOTTOMS.find((b) => b.id === bottomId),
    [bottomId]
  );

  const score = top && bottom ? matchScore(top, bottom) : 0;
  const pricing = top && bottom ? outfitPricing(top, bottom) : null;

  // ── Virtual try-on (FASHN via /api/tryon) — the only preview ──
  const [tryUrl, setTryUrl] = useState<string | null>(null);
  const [trying, setTrying] = useState(false);
  const [tryErr, setTryErr] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0); // bump to force a re-render

  useEffect(() => {
    if (!topId || !bottomId) return;
    let cancelled = false;
    setTrying(true); setTryErr(null); setTryUrl(null);
    fetch("/api/tryon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topId, bottomId }),
    })
      .then(async (r) => await r.json().catch(() => ({ error: `HTTP ${r.status}` })))
      .then((d) => {
        if (cancelled) return;
        if (d.url) setTryUrl(d.url);
        else {
          const detail = typeof d.detail === "string" ? d.detail : d.detail ? JSON.stringify(d.detail) : "";
          setTryErr(`${d.error || "Render failed"}${detail ? " — " + detail.slice(0, 180) : ""}`);
        }
      })
      .catch((e) => { if (!cancelled) setTryErr(String(e)); })
      .finally(() => { if (!cancelled) setTrying(false); });
    return () => { cancelled = true; };
  }, [topId, bottomId, nonce]);

  const surprise = () => {
    const t = STUDIO_TOPS[Math.floor(Math.random() * STUDIO_TOPS.length)];
    setTopId(t.id);
    const best = compatibleBottoms(t.id, 3);
    if (best.length) setBottomId(best[Math.floor(Math.random() * best.length)].piece.id);
  };

  const addSet = () => {
    if (!top || !bottom) return;
    addToCart(top, size, 1);
    setCartItems(addToCart(bottom, size, 1));
    setAdded(true);
    setIsCartOpen(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const updateQty = (id: string, sz: string, delta: number) =>
    setCartItems((prev) => {
      const next = prev
        .map((it) => (it.product.id === id && it.size === sz ? { ...it, quantity: it.quantity + delta } : it))
        .filter((it) => it.quantity > 0);
      saveCart(next);
      return next;
    });
  const removeItem = (id: string, sz: string) =>
    setCartItems((prev) => {
      const next = prev.filter((it) => !(it.product.id === id && it.size === sz));
      saveCart(next);
      return next;
    });

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <main className="min-h-screen bg-paper text-charcoal">
      <Navbar isMuted={isMuted} toggleAudio={toggleAudio} cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

      {/* Intro band */}
      <section className="pt-32 pb-10 px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-flex items-center gap-2 text-[11px] font-sans uppercase tracking-[0.32em] text-gold font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Style Studio
        </span>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl md:text-6xl font-light">
          Build your <span className="italic">own set.</span>
        </h1>
        <p className="mt-4 font-serif italic text-base sm:text-lg text-charcoal/70 max-w-xl mx-auto">
          Mix a top with a skirt, see them together, and make the pairing yours — styled sets come with 10% off.
        </p>
        <button
          onClick={surprise}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-charcoal/15 bg-white/60 hover:border-gold hover:text-gold text-xs font-sans uppercase tracking-[0.2em] transition-colors"
        >
          <Shuffle className="w-3.5 h-3.5" /> Surprise me
        </button>
      </section>

      {/* Studio */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* TOP PICKER */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <h2 className="text-[11px] font-sans uppercase tracking-[0.28em] text-charcoal/50 mb-3">1 · Choose a top</h2>
            <div className="grid grid-cols-3 lg:grid-cols-2 gap-2.5 lg:max-h-[560px] lg:overflow-y-auto lg:pr-1">
              {STUDIO_TOPS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTopId(t.id)}
                  className={`group relative aspect-[3/4] rounded-xl overflow-hidden border transition-all ${
                    topId === t.id ? "border-gold ring-2 ring-gold/40" : "border-sand/40 hover:border-gold/60"
                  }`}
                >
                  <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                  {topId === t.id && (
                    <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-gold text-black grid place-items-center shadow">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* LIVE OUTFIT PREVIEW */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="rounded-3xl border border-sand/50 bg-white/50 overflow-hidden shadow-[0_14px_50px_rgba(31,30,29,0.08)]">
              {/* on-the-model try-on preview */}
              <div className="relative aspect-[3/4] bg-paper-dark grid place-items-center overflow-hidden">
                <span className="absolute top-3 right-3 z-20 inline-flex items-center gap-1 bg-black/55 backdrop-blur-md text-white/90 text-[10px] font-sans uppercase tracking-[0.14em] px-3 py-1.5 rounded-full"><Shirt className="w-3 h-3" /> On the model</span>

                {trying && (
                  <div className="flex flex-col items-center gap-3 text-charcoal/60 px-6 text-center">
                    <Loader2 className="w-7 h-7 animate-spin text-gold" />
                    <span className="font-serif italic text-sm">Styling the look on the model…</span>
                    <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-charcoal/40">first render takes a few seconds</span>
                  </div>
                )}

                {!trying && tryUrl && <img src={tryUrl} alt={`${top?.name} with ${bottom?.name}`} className="w-full h-full object-cover" />}

                {!trying && tryErr && (
                  <div className="flex flex-col items-center gap-3 text-charcoal/60 px-6 text-center max-w-sm">
                    <span className="font-serif italic text-sm">Couldn&apos;t render this pairing.</span>
                    <span className="text-[11px] font-mono text-charcoal/45 break-words">{tryErr}</span>
                    <button onClick={() => setNonce((n) => n + 1)} className="inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-wide text-gold"><RefreshCw className="w-3.5 h-3.5" /> Try again</button>
                  </div>
                )}

                {top && bottom && !trying && tryUrl && (
                  <span className="absolute top-3 left-3 bg-gold text-black text-[11px] font-sans font-bold uppercase tracking-[0.14em] px-3 py-1.5 rounded-full shadow-lg">{score}% · {scoreLabel(score)}</span>
                )}
              </div>

              {/* buy bar */}
              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-serif text-lg leading-tight truncate">{top?.name ?? "—"}</p>
                    <p className="font-serif text-lg leading-tight truncate text-charcoal/70">{bottom?.name ?? "Choose a skirt"}</p>
                  </div>
                  {pricing && (
                    <div className="text-right shrink-0">
                      <div className="text-xs text-charcoal/45 line-through">${pricing.subtotal} AUD</div>
                      <div className="font-serif text-2xl font-semibold text-charcoal">${pricing.total} AUD</div>
                      <div className="text-[11px] font-sans uppercase tracking-wide text-gold font-semibold">Save ${pricing.savings}</div>
                    </div>
                  )}
                </div>

                {/* size */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-charcoal/50 mr-1">Size</span>
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-sans border transition-colors ${
                        size === s ? "bg-charcoal text-white border-charcoal" : "border-sand/60 hover:border-gold"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <button
                  onClick={addSet}
                  disabled={!top || !bottom}
                  className="w-full h-14 rounded-full bg-gold hover:bg-charcoal text-black hover:text-white font-sans text-xs uppercase tracking-[0.24em] font-semibold flex items-center justify-center gap-3 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {added ? <><Check className="w-4 h-4" /> Added to bag</> : <><ShoppingBag className="w-4 h-4" /> Add set to bag</>}
                </button>
                <p className="flex items-center gap-1.5 text-[11px] text-charcoal/50 font-sans">
                  <Info className="w-3 h-3" /> Two pieces, worn your way. Each is added to your bag individually.
                </p>
              </div>
            </div>
          </div>

          {/* BOTTOM MATCHES */}
          <div className="lg:col-span-4 order-3">
            <h2 className="text-[11px] font-sans uppercase tracking-[0.28em] text-charcoal/50 mb-3">
              2 · Skirts that pair with <span className="text-gold">{top?.name?.replace(" — Top", "") ?? "your top"}</span>
            </h2>
            <div className="grid grid-cols-2 gap-3 lg:max-h-[560px] lg:overflow-y-auto lg:pr-1">
              {matches.map(({ piece, score: s }) => (
                <button
                  key={piece.id}
                  onClick={() => setBottomId(piece.id)}
                  className={`group text-left rounded-xl overflow-hidden border transition-all ${
                    bottomId === piece.id ? "border-gold ring-2 ring-gold/40" : "border-sand/40 hover:border-gold/60"
                  }`}
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img src={piece.image} alt={piece.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-md text-gold text-[10px] font-sans font-bold px-2 py-0.5 rounded-full">{s}%</span>
                    {bottomId === piece.id && (
                      <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-gold text-black grid place-items-center shadow"><Check className="w-3 h-3" /></span>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-serif truncate">{piece.name.replace(" — Skirt", "")}</p>
                    <p className="text-[11px] text-charcoal/55 font-sans">${piece.priceAud} AUD</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/collection" className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.2em] text-charcoal/60 hover:text-gold transition-colors">
            Browse the full collection <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQty}
        onRemoveItem={removeItem}
      />
    </main>
  );
}
