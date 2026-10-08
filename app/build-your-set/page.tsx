"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Sparkles, Shuffle, Check, ShoppingBag, ArrowRight, Info, Shirt, Layers3, Loader2 } from "lucide-react";
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

  const [topId, setTopId] = useState<string>(STUDIO_TOPS.find((piece) => piece.id === "cacao-satin-cami")?.id ?? STUDIO_TOPS[0]?.id ?? "");
  const [bottomId, setBottomId] = useState<string>(STUDIO_BOTTOMS.find((piece) => piece.id === "ivory-tiered-maxi-skirt")?.id ?? "");
  const [size, setSize] = useState("AU 8");
  const [added, setAdded] = useState(false);
  const [tryUrl, setTryUrl] = useState("");
  const [trying, setTrying] = useState(false);
  const [tryErr, setTryErr] = useState("");

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

  useEffect(() => {
    if (!top || !bottom) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setTrying(true);
      setTryErr("");
      try {
        const response = await fetch("/api/tryon", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topId: top.id, bottomId: bottom.id }),
          signal: controller.signal,
        });
        const result = await response.json();
        if (!response.ok || !result.url) throw new Error(result.error || "Could not create this look");
        setTryUrl(result.url);
      } catch (error) {
        if ((error as Error).name !== "AbortError") setTryErr("Preview unavailable — your selected pieces are shown below.");
      } finally {
        if (!controller.signal.aborted) setTrying(false);
      }
    }, 350);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [top, bottom]);

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
      <section className="pt-36 pb-12 px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-flex items-center gap-2 text-[11px] font-sans uppercase tracking-[0.32em] text-gold font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Style Studio
        </span>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl md:text-6xl font-light">
          Build your <span className="italic">own set.</span>
        </h1>
        <p className="mt-4 font-serif italic text-base sm:text-lg text-charcoal/70 max-w-xl mx-auto">
          Choose a top and bottom, then see both pieces fitted automatically on one BINDY model — styled sets come with 10% off.
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
          <div className="lg:col-span-3 order-2 lg:order-1 rounded-3xl border border-sand/45 bg-white/45 p-3 sm:p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[11px] font-sans uppercase tracking-[0.28em] text-charcoal/60">1 · Choose a top</h2>
              <Shirt className="h-4 w-4 text-gold" />
            </div>
            <div className="grid grid-cols-3 lg:grid-cols-2 gap-2.5 lg:max-h-[620px] lg:overflow-y-auto lg:pr-1">
              {STUDIO_TOPS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTopId(t.id)}
                  title={t.name}
                  className={`group relative aspect-[3/4] rounded-2xl overflow-hidden border transition-all ${
                    topId === t.id ? "border-gold ring-2 ring-gold/40" : "border-sand/40 hover:border-gold/60"
                  }`}
                >
                  <img src={t.image} alt={t.name} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 pb-2 pt-8 text-left text-[9px] font-sans font-medium leading-tight text-white sm:text-[10px]">
                    {t.name.replace(" — Top", "")}
                  </span>
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
          <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-24 self-start">
            <div className="rounded-3xl border border-sand/50 bg-white/50 overflow-hidden shadow-[0_14px_50px_rgba(31,30,29,0.08)]">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#EAE2D6]">
                {tryUrl && !tryErr ? (
                  <img src={tryUrl} alt={`${top?.name} styled with ${bottom?.name}`} className="h-full w-full object-cover object-top" />
                ) : (
                  <div className="relative h-full bg-[#eee8df]">
                    <img
                      src={tryErr && bottom ? bottom.image : "/images/style-studio/bindy-fit-model.png"}
                      alt={tryErr && bottom ? bottom.name : "BINDY virtual fitting model"}
                      className="h-full w-full object-cover object-top"
                    />
                    <div className="absolute inset-x-3 bottom-3 grid grid-cols-2 gap-2">
                      {top && <div className="flex items-center gap-2 rounded-xl border border-white/70 bg-paper/90 p-2 shadow-lg backdrop-blur-md"><img src={top.image} alt="" className="h-11 w-9 rounded-lg object-cover object-top"/><span className="line-clamp-2 text-[9px] font-sans font-bold uppercase tracking-[0.08em]">{top.name}</span></div>}
                      {bottom && <div className="flex items-center gap-2 rounded-xl border border-white/70 bg-paper/90 p-2 shadow-lg backdrop-blur-md"><img src={bottom.image} alt="" className="h-11 w-9 rounded-lg object-cover object-top"/><span className="line-clamp-2 text-[9px] font-sans font-bold uppercase tracking-[0.08em]">{bottom.name}</span></div>}
                    </div>
                  </div>
                )}

                <span className="absolute left-3 top-3 z-20 inline-flex items-center gap-2 rounded-full bg-black/65 px-3 py-1.5 text-[9px] font-sans font-bold uppercase tracking-[0.16em] text-white shadow-lg backdrop-blur-md">
                  <Sparkles className="h-3 w-3 text-gold" /> Virtual fitting room
                </span>

                {trying && (
                  <div className="absolute inset-0 z-20 grid place-items-center bg-charcoal/35 backdrop-blur-[2px]">
                    <div className="rounded-2xl border border-white/40 bg-paper/95 px-6 py-5 text-center shadow-2xl">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-gold" />
                      <p className="mt-3 text-[10px] font-sans font-bold uppercase tracking-[0.2em]">Styling your look</p>
                      <p className="mt-1 font-serif text-sm italic text-charcoal/60">Combining both pieces…</p>
                    </div>
                  </div>
                )}

                {tryErr && !trying && <span className="sr-only">{tryErr}</span>}

                {top && bottom && (
                  <span className="absolute right-3 top-3 z-20 rounded-full bg-gold px-3 py-1.5 text-[10px] font-sans font-bold uppercase tracking-[0.14em] text-black shadow-lg">{score}% · {scoreLabel(score)}</span>
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
          <div className="lg:col-span-4 order-3 rounded-3xl border border-sand/45 bg-white/45 p-3 sm:p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <h2 className="text-[11px] font-sans uppercase tracking-[0.22em] leading-relaxed text-charcoal/60">
                2 · Choose a bottom<br/><span className="text-gold normal-case tracking-normal">for {top?.name?.replace(" — Top", "") ?? "your top"}</span>
              </h2>
              <Layers3 className="h-4 w-4 shrink-0 text-gold" />
            </div>
            <div className="grid grid-cols-2 gap-3 lg:max-h-[620px] lg:overflow-y-auto lg:pr-1">
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
