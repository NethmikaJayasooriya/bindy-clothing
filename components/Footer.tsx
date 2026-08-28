"use client";

import React, { useState } from "react";
import { ArrowRight, Check, Heart } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <footer className="bg-ink-deep text-paper border-t border-gold/20 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand Column (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <h3 className="font-serif text-3xl sm:text-4xl tracking-[0.2em] uppercase font-light text-white">
              BINDY<span className="text-gold">.</span>
            </h3>
            <p className="text-xs uppercase font-sans tracking-[0.35em] text-gold">
              Two Islands • One Thread
            </p>
            <p className="font-serif italic text-sm text-[#A89F91] max-w-sm leading-relaxed">
              Thoughtfully designed pieces that blend comfort, creativity, and authentic Sri Lankan craftsmanship for the modern Australian woman.
            </p>
            <div className="pt-2 text-[11px] font-sans tracking-widest text-[#8C8477] uppercase space-y-1">
              <p>Brisbane, Australia & Colombo, Sri Lanka</p>
              <p>contact@bindyclothing.com</p>
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="md:col-span-3 space-y-3 text-xs font-sans uppercase tracking-[0.2em]">
            <h4 className="text-[10px] text-[#C5A059] tracking-[0.35em] font-semibold mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-zinc-400">
              <li>
                <a href="#collection" className="hover:text-white transition-colors">
                  Collection 01 — Origins
                </a>
              </li>
              <li>
                <a href="#stories" className="hover:text-white transition-colors">
                  Heritage Stories
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  Three Women Journey
                </a>
              </li>
              <li>
                <a href="#craft" className="hover:text-white transition-colors">
                  Artisan Handloom & Craft
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-[10px] text-[#C5A059] uppercase tracking-[0.35em] font-semibold">
              The Bindy Journal
            </h4>
            <p className="text-xs font-sans text-zinc-400">
              Receive limited edition release notices and private storytelling previews.
            </p>

            {subscribed ? (
              <div className="flex items-center space-x-2 text-xs text-[#C5A059] font-sans py-2">
                <Check className="w-4 h-4" />
                <span>Thank you for joining our journey.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center space-x-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="bg-white/5 border border-white/20 rounded-full px-4 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#C5A059] flex-1 font-sans"
                  required
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-[#C5A059] hover:bg-[#A46446] text-black hover:text-white text-xs font-sans uppercase tracking-widest transition-colors font-medium"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-sans text-zinc-500 tracking-wider">
          <p>© {new Date().getFullYear()} BINDY CLOTHING. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 flex items-center space-x-1">
            <span>Simple. Thoughtful. Special.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
