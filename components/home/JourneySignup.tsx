"use client";

import React, { useState } from "react";
import { Mail, Check, Sparkles, Copy, ArrowUp, Lock, Gift } from "lucide-react";

export default function JourneySignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const PROMO_CODE = "CALM10";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(PROMO_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleScrollToCollection = () => {
    const el = document.getElementById("browse-collection");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden bg-[#FAF7F2] border-t border-[#DCC7AF]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[32px] overflow-hidden bg-[#161513] text-white border border-[#C5A059]/40 shadow-2xl">
          
          {/* Subtle Ambient Gold Halo */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
            {/* Left Column: Image Background with Slow Fashion Quote */}
            <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/destinations/garden.jpg"
                alt="Sri Lankan courtyard morning light"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#161513] via-[#161513]/50 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 lg:p-4 text-white">
                <blockquote className="font-serif italic text-base sm:text-lg text-[#DCC7AF] font-light leading-relaxed">
                  &ldquo;A living thread between two islands, woven at the pace of calm.&rdquo;
                </blockquote>
                <span className="block text-sm font-mono uppercase font-semibold tracking-wider text-[#C5A059] mt-2 font-semibold">
                  Two Islands • One Thread
                </span>
              </div>
            </div>

            {/* Right Column: High-Converting VIP Privilege Box */}
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-center space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-[#C5A059]/40 text-[#C5A059] text-xs font-mono tracking-wider uppercase font-semibold">
                  <Gift className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>First-Order Invitation</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white leading-tight">
                  Unlock <span className="italic font-serif text-[#C5A059]">10% Off</span> Your First Silhouette
                </h2>

                <p className="font-serif italic text-sm sm:text-base text-[#DCC7AF]/85 font-light leading-relaxed max-w-lg">
                  Join our private client circle to receive immediate 10% savings on your first handloom purchase, private edition drop access, and artisan dispatches.
                </p>
              </div>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-white/[0.05] border border-[#C5A059]/60 text-white space-y-4 animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex items-center gap-2 text-[#AFC8B1] font-mono text-sm uppercase font-semibold tracking-wider font-semibold">
                    <Check className="w-4 h-4 text-[#AFC8B1]" />
                    <span>Welcome. Your 10% Privilege Is Active</span>
                  </div>

                  {/* Copyable Code Box */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0E0D0C] border border-[#C5A059]/50">
                    <div className="space-y-0.5">
                      <span className="text-xs font-mono uppercase tracking-widest text-[#DCC7AF]/60 block">
                        VIP Checkout Code
                      </span>
                      <span className="font-mono text-xl sm:text-2xl font-bold tracking-[0.15em] text-[#C5A059]">
                        {PROMO_CODE}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopy}
                      className="px-4 py-2 rounded-lg bg-[#C5A059] text-[#161513] font-mono text-sm uppercase font-semibold tracking-wider font-bold hover:bg-[#E2C78E] transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleScrollToCollection}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#161513] font-mono text-sm uppercase font-semibold tracking-wider font-bold hover:bg-[#C5A059] transition-colors cursor-pointer shadow-md"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                      <span>Shop Now with 10% Off</span>
                    </button>
                    <span className="text-sm font-mono text-[#DCC7AF]/70">
                      Applied automatically at checkout
                    </span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5 max-w-lg">
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <div className="relative flex-1">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#DCC7AF]/60" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email to reveal 10% code"
                        required
                        className="w-full bg-white/10 text-white pl-11 pr-4 py-3.5 rounded-full text-xs font-mono placeholder:text-[#DCC7AF]/50 focus:outline-none focus:ring-2 focus:ring-[#C5A059] border border-[#DCC7AF]/30"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-7 py-3.5 rounded-full bg-[#C5A059] text-[#161513] font-mono text-sm uppercase font-semibold tracking-[0.18em] font-bold hover:bg-[#E2C78E] transition-all shadow-md cursor-pointer shrink-0"
                    >
                      Claim 10% Code
                    </button>
                  </div>
                  <p className="text-xs font-mono text-[#DCC7AF]/60 tracking-wider">
                    Instant voucher code revealed upon submission • Valid across all pieces
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

