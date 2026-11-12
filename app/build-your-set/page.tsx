"use client";
import ResponsiveImage from "@/components/ResponsiveImage";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Sparkles, Shuffle, Check, ShoppingBag, ArrowRight, Info, Shirt, Layers3, Loader2, Ruler } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import { getCart, saveCart, addToCart, subscribe } from "@/lib/cart";
import { ambientPlayer } from "@/lib/ambientSound";
import { useStorefront } from "@/components/StorefrontProvider";
import { useCurrency } from "@/components/CurrencyContext";
import { useTryOn } from "@/components/style-studio/useTryOn";
import {
  studioPieces,
  matchScore,
} from "@/lib/styleStudio";
import { isSizeSoldOut, getFirstAvailableSize } from "@/lib/stock";
import SizeGuideModal from "@/components/SizeGuideModal";

function scoreLabel(s: number) {
  if (s >= 85) return "Perfect match";
  if (s >= 70) return "Great together";
  if (s >= 55) return "Nice pairing";
  return "Bold mix";
}

export default function BuildYourSetPage() {
  const { products } = useStorefront();
  const { getPrice, isLkr } = useCurrency();
  const { tops: STUDIO_TOPS, bottoms: STUDIO_BOTTOMS } = useMemo(() => studioPieces(products), [products]);
  const [isMuted, setIsMuted] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [topId, setTopId] = useState<string>(STUDIO_TOPS.find((piece) => piece.id === "cacao-satin-cami")?.id ?? STUDIO_TOPS[0]?.id ?? "");
  const [bottomId, setBottomId] = useState<string>(STUDIO_BOTTOMS.find((piece) => piece.id === "ivory-tiered-maxi-skirt")?.id ?? "");
  const [topSize, setTopSize] = useState("");
  const [bottomSize, setBottomSize] = useState("");
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setCartItems(getCart());
    const unsub = subscribe(() => setCartItems(getCart()));
    return () => unsub();
  }, []);

  const toggleAudio = () => { if (ambientPlayer) setIsMuted(ambientPlayer.toggle()); };

  const top = STUDIO_TOPS.find(t => t.id === topId) ?? STUDIO_TOPS[0];
  const bottom = STUDIO_BOTTOMS.find(b => b.id === bottomId) ?? STUDIO_BOTTOMS[0];
  const matches = useMemo(() => top ? STUDIO_BOTTOMS.map(piece => ({ piece, score: matchScore(top, piece) })).sort((a,b) => b.score-a.score) : [], [top, STUDIO_BOTTOMS]);
  const preview = useTryOn(top, bottom);
  const trying = preview.status === "loading", tryUrl = preview.url, tryErr = preview.message;
  const score = top && bottom ? matchScore(top, bottom) : 0;

  const topProduct = useMemo(() => products.find(p => p.id === top?.sourceId), [products, top?.sourceId]);
  const bottomProduct = useMemo(() => products.find(p => p.id === bottom?.sourceId), [products, bottom?.sourceId]);
  const isSameSet = Boolean(top?.sourceId && top.sourceId === bottom?.sourceId);

  const purchasable = useMemo(() => products.filter(p => p.id === top?.sourceId || p.id === bottom?.sourceId), [products, top?.sourceId, bottom?.sourceId]);
  const pricing = top && bottom ? { total: purchasable.reduce((s,p) => s + getPrice(p).amount, 0), savings: 0, subtotal: 0 } : null;

  const topSizes = useMemo(() => topProduct?.sizes ?? [], [topProduct]);
  const bottomSizes = useMemo(() => bottomProduct?.sizes ?? [], [bottomProduct]);

  // Ensure selected topSize is valid and in stock
  const selectedTopSize = useMemo(() => {
    if (topSize && topSizes.includes(topSize) && !isSizeSoldOut(topProduct?.stock, topSize)) {
      return topSize;
    }
    return topProduct ? getFirstAvailableSize(topProduct) ?? "" : "";
  }, [topSize, topSizes, topProduct]);

  // Ensure selected bottomSize is valid and in stock
  const selectedBottomSize = useMemo(() => {
    if (isSameSet) return selectedTopSize;
    if (bottomSize && bottomSizes.includes(bottomSize) && !isSizeSoldOut(bottomProduct?.stock, bottomSize)) {
      return bottomSize;
    }
    return bottomProduct ? getFirstAvailableSize(bottomProduct) ?? "" : "";
  }, [bottomSize, bottomSizes, bottomProduct, isSameSet, selectedTopSize]);

  const canAddSet = Boolean(
    top && bottom && topProduct && bottomProduct &&
    selectedTopSize && !isSizeSoldOut(topProduct.stock, selectedTopSize) &&
    (isSameSet || (selectedBottomSize && !isSizeSoldOut(bottomProduct.stock, selectedBottomSize)))
  );

  const surprise = () => {
    const t = STUDIO_TOPS[Math.floor(Math.random() * STUDIO_TOPS.length)];
    if (!t) return;
    setTopId(t.id);
    const best = STUDIO_BOTTOMS.map(piece => ({ piece, score: matchScore(t,piece) })).sort((a,b)=>b.score-a.score).slice(0,3);
    if (best.length) setBottomId(best[Math.floor(Math.random() * best.length)].piece.id);
  };

  const addSet = () => {
    if (!canAddSet || !topProduct || !bottomProduct) return;
    if (isSameSet) {
      addToCart(topProduct, selectedTopSize, 1);
    } else {
      addToCart(topProduct, selectedTopSize, 1);
      addToCart(bottomProduct, selectedBottomSize, 1);
    }
    setCartItems(getCart());
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
          Choose your top. Find your bottom. See the complete look on our studio model.
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
                  aria-label={`Choose top: ${t.name}`}
                  aria-pressed={top?.id === t.id}
                  className={`group relative aspect-[3/4] rounded-2xl overflow-hidden border transition-all ${
                    top?.id === t.id ? "border-gold ring-2 ring-gold/40" : "border-sand/40 hover:border-gold/60"
                  }`}
                >
                  <ResponsiveImage src={t.image} alt={t.name} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 pb-2 pt-8 text-left text-[9px] font-sans font-medium leading-tight text-white sm:text-[10px]">
                    {t.name.replace(" — Top", "")}
                  </span>
                  {top?.id === t.id && (
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
                  <img key={tryUrl} src={tryUrl} alt={`${top?.name} styled with ${bottom?.name}`} data-testid="outfit-preview" data-top-id={top?.id} data-bottom-id={bottom?.id} loading="eager" onError={preview.imageFailed} className="h-full w-full object-contain" />
                ) : (
                  <div className="relative h-full bg-[#eee8df] pt-16 pb-32 px-3">
                    <div className="grid h-full grid-cols-2 gap-2">
                      {top && <ResponsiveImage src={top.image} alt={`Selected top: ${top.name}`} className="h-full w-full min-w-0 object-contain" />}
                      {bottom && <ResponsiveImage src={bottom.image} alt={`Selected bottom: ${bottom.name}`} className="h-full w-full min-w-0 object-contain" />}
                    </div>
                    <div className="absolute inset-x-3 bottom-3 grid grid-cols-2 gap-2">
                      {top && <div className="flex items-center gap-2 rounded-xl border border-white/70 bg-paper/90 p-2 shadow-lg backdrop-blur-md"><ResponsiveImage src={top.image} alt="" className="h-11 w-9 rounded-lg object-cover object-top"/><span className="line-clamp-2 text-[9px] font-sans font-bold uppercase tracking-[0.08em]">{top.name}</span></div>}
                      {bottom && <div className="flex items-center gap-2 rounded-xl border border-white/70 bg-paper/90 p-2 shadow-lg backdrop-blur-md"><ResponsiveImage src={bottom.image} alt="" className="h-11 w-9 rounded-lg object-cover object-top"/><span className="line-clamp-2 text-[9px] font-sans font-bold uppercase tracking-[0.08em]">{bottom.name}</span></div>}
                    </div>
                  </div>
                )}

                <span className="absolute left-3 top-3 z-20 inline-flex items-center gap-2 rounded-full bg-black/65 px-3 py-1.5 text-[9px] font-sans font-bold uppercase tracking-[0.16em] text-white shadow-lg backdrop-blur-md">
                  <Sparkles className="h-3 w-3 text-gold" /> {tryUrl ? "Your outfit preview" : "Your selected pieces"}
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

                {tryErr && !trying && <div role="status" className="absolute bottom-3 inset-x-3 z-30 rounded-xl bg-paper/95 text-charcoal p-3 text-xs leading-5">{tryErr}<button onClick={preview.retry} className="ml-2 underline font-semibold">Try again</button></div>}

                {top && bottom && (
                  <span className="absolute right-3 top-3 z-20 rounded-full bg-gold px-3 py-1.5 text-[10px] font-sans font-bold uppercase tracking-[0.14em] text-black shadow-lg">{scoreLabel(score)}</span>
                )}
              </div>

              {/* buy bar */}
              <div className="p-5 sm:p-6 space-y-4">
                <p className="text-[11px] text-charcoal/60">AI styling preview. See the product photos for exact garment details and the size guide for fit.</p>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-serif text-lg leading-tight truncate">{top?.name ?? "—"}</p>
                    <p className="font-serif text-lg leading-tight truncate text-charcoal/70">{bottom?.name ?? "Choose a skirt"}</p>
                  </div>
                  {pricing && (
                    <div className="text-right shrink-0">
                      {pricing.savings>0&&<div className="text-xs text-charcoal/45 line-through">${pricing.subtotal} AUD</div>}
                      <div className="font-serif text-2xl font-semibold text-charcoal">{isLkr ? `Rs. ${pricing.total.toLocaleString()}` : `$${pricing.total} AUD`}</div>
                      {pricing.savings>0&&<div className="text-[11px] font-sans uppercase tracking-wide text-gold font-semibold">Save ${pricing.savings}</div>}
                    </div>
                  )}
                </div>

                {/* Independent Garment Sizing */}
                <div className="space-y-4 pt-3 border-t border-sand/40">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-sans uppercase tracking-[0.22em] text-charcoal/70 font-semibold">
                      {isSameSet ? "Set Sizing" : "Garment Sizing"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowSizeGuide(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-sans uppercase font-bold tracking-wider text-gold hover:text-cinnamon transition-colors cursor-pointer"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>Size Guide</span>
                    </button>
                  </div>

                  {/* Top Size Selector */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-sans text-charcoal flex items-center gap-1.5 font-medium">
                        <Shirt className="w-3.5 h-3.5 text-gold" />
                        <span>Top Size:</span>
                        <strong className="text-charcoal font-semibold">
                          {selectedTopSize ? selectedTopSize.split(" ")[0] : "—"}
                        </strong>
                      </span>
                      {selectedTopSize && isSizeSoldOut(topProduct?.stock, selectedTopSize) && (
                        <span className="text-[10px] text-[#A46446] font-semibold uppercase tracking-wider">
                          Sold Out
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-5 gap-1.5">
                      {topSizes.map((s) => {
                        const isSoldOut = isSizeSoldOut(topProduct?.stock, s);
                        const isSelected = selectedTopSize === s;
                        const short = s.replace("AU ", "").split(" ")[0];
                        return (
                          <button
                            key={s}
                            type="button"
                            disabled={isSoldOut}
                            onClick={() => setTopSize(s)}
                            className={`py-2 rounded-xl text-xs font-sans transition-all border text-center ${
                              isSoldOut
                                ? "border-sand/40 bg-[#F2ECE1]/60 text-charcoal/30 line-through cursor-not-allowed select-none"
                                : isSelected
                                ? "bg-charcoal text-paper-light border-charcoal font-bold shadow-sm cursor-pointer"
                                : "bg-white/70 border-sand/60 text-charcoal hover:border-gold hover:bg-white font-medium cursor-pointer"
                            }`}
                            title={isSoldOut ? `Size ${short} is sold out in ${top?.name}` : `Select size ${s} for top`}
                          >
                            {short}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bottom Size Selector (only shown if separate pieces) */}
                  {!isSameSet && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-sans text-charcoal flex items-center gap-1.5 font-medium">
                          <Layers3 className="w-3.5 h-3.5 text-gold" />
                          <span>Bottom Size:</span>
                          <strong className="text-charcoal font-semibold">
                            {selectedBottomSize ? selectedBottomSize.split(" ")[0] : "—"}
                          </strong>
                        </span>
                        {selectedBottomSize && isSizeSoldOut(bottomProduct?.stock, selectedBottomSize) && (
                          <span className="text-[10px] text-[#A46446] font-semibold uppercase tracking-wider">
                            Sold Out
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-5 gap-1.5">
                        {bottomSizes.map((s) => {
                          const isSoldOut = isSizeSoldOut(bottomProduct?.stock, s);
                          const isSelected = selectedBottomSize === s;
                          const short = s.replace("AU ", "").split(" ")[0];
                          return (
                            <button
                              key={s}
                              type="button"
                              disabled={isSoldOut}
                              onClick={() => setBottomSize(s)}
                              className={`py-2 rounded-xl text-xs font-sans transition-all border text-center ${
                                isSoldOut
                                  ? "border-sand/40 bg-[#F2ECE1]/60 text-charcoal/30 line-through cursor-not-allowed select-none"
                                  : isSelected
                                  ? "bg-charcoal text-paper-light border-charcoal font-bold shadow-sm cursor-pointer"
                                  : "bg-white/70 border-sand/60 text-charcoal hover:border-gold hover:bg-white font-medium cursor-pointer"
                              }`}
                              title={isSoldOut ? `Size ${short} is sold out in ${bottom?.name}` : `Select size ${s} for bottom`}
                            >
                              {short}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={addSet}
                  disabled={!canAddSet}
                  className="w-full h-14 rounded-full bg-gold hover:bg-charcoal text-black hover:text-white font-sans text-xs uppercase tracking-[0.24em] font-semibold flex items-center justify-center gap-3 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-luxury cursor-pointer"
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-800" />
                      <span>Added to bag</span>
                    </>
                  ) : !canAddSet ? (
                    <span>
                      {!selectedTopSize || !selectedBottomSize
                        ? "Select your sizes"
                        : "Selected size unavailable"}
                    </span>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add selected items • ${pricing?.total ?? 0} AUD</span>
                    </>
                  )}
                </button>
                {canAddSet && !isSameSet && selectedTopSize && selectedBottomSize && (
                  <p className="text-center text-[11px] font-sans text-charcoal-subtle -mt-2">
                    Top: {selectedTopSize.split(" ")[0]} · Bottom: {selectedBottomSize.split(" ")[0]}
                  </p>
                )}
                <p className="flex items-center gap-1.5 text-[11px] text-charcoal/50 font-sans">
                  <Info className="w-3 h-3" />{" "}
                  {top?.isSplit || bottom?.isSplit
                    ? "A piece from a two-piece set is purchased with its original full set."
                    : "Both garments are added to your bag individually with their chosen sizes."}
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
                  aria-label={`Choose bottom: ${piece.name}`}
                  aria-pressed={bottom?.id === piece.id}
                  className={`group text-left rounded-xl overflow-hidden border transition-all ${
                    bottom?.id === piece.id ? "border-gold ring-2 ring-gold/40" : "border-sand/40 hover:border-gold/60"
                  }`}
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <ResponsiveImage src={piece.image} alt={piece.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-md text-gold text-[10px] font-sans font-bold px-2 py-0.5 rounded-full">Style pick</span>
                    {bottom?.id === piece.id && (
                      <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-gold text-black grid place-items-center shadow"><Check className="w-3 h-3" /></span>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-serif truncate">{piece.name.replace(" — Bottom", "")}</p>
                    <p className="text-[11px] text-charcoal/55 font-sans">{(() => {
                      const sp = products.find(p => p.id === piece.sourceId);
                      const amt = sp ? getPrice(sp).amount : (isLkr ? Math.ceil(piece.priceAud * 200) : piece.priceAud);
                      return isLkr ? `Rs. ${amt.toLocaleString()}` : `$${amt} AUD`;
                    })()}</p>
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

      <SizeGuideModal isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
    </main>
  );
}
