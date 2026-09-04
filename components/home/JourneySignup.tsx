"use client";

import React, { useState } from "react";
import { Mail, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui";

export default function JourneySignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-paper-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-charcoal text-paper-light border border-sand/40 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
            {/* Left Column: Image Background with Scrim */}
            <div className="lg:col-span-6 relative min-h-[280px] lg:min-h-full">
              <img
                src="/images/destinations/garden.jpg"
                alt="Sri Lankan courtyard morning light"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-charcoal via-charcoal/40 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 lg:p-4 text-white">
                <blockquote className="font-editorial-italic text-lg sm:text-xl text-sand-light font-light">
                  &ldquo;A thread between two islands, woven at the pace of memory.&rdquo;
                </blockquote>
              </div>
            </div>

            {/* Right Column: Editorial Copy & Signup Form */}
            <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 text-[10px] font-sans uppercase tracking-[0.35em] text-gold font-semibold">
                  <Sparkles className="w-3 h-3 text-gold" />
                  <span>The BINDY Journal</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-wide text-white leading-tight">
                  Join the <span className="font-editorial-italic text-gold">Quiet Journey.</span>
                </h2>

                <p className="font-sans text-xs sm:text-sm text-sand/80 font-light leading-relaxed max-w-md">
                  Receive private preview access to our numbered edition drops, artisan field notes, and 10% off your first handcrafted piece.
                </p>
              </div>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-paper-light/10 border border-gold/40 text-paper-light space-y-2">
                  <div className="flex items-center gap-2 text-gold font-sans text-sm font-semibold">
                    <Check className="w-4 h-4" />
                    <span>Welcome to the BINDY family.</span>
                  </div>
                  <p className="text-xs text-sand/80 font-light">
                    Use code <strong className="text-gold font-mono tracking-wider">BINDYJOURNEY</strong> at checkout for 10% off your first order.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <div className="relative flex-1">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        required
                        className="w-full bg-paper-light text-charcoal pl-11 pr-4 py-3.5 rounded-full text-xs font-sans placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold border border-sand/40"
                      />
                    </div>
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      className="shrink-0"
                    >
                      Subscribe
                    </Button>
                  </div>
                  <p className="text-[10px] font-sans text-sand/60">
                    We send occasional thoughtful notes, never noise. Unsubscribe at any time.
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
