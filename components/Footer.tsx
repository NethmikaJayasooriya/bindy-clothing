"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Heart, Mail } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <footer className="bg-paper-dark text-charcoal border-t border-sand/40 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-16 border-b border-sand/40">
          {/* Brand Column (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block">
              <h3 className="font-display text-3xl sm:text-4xl tracking-[0.2em] font-normal text-charcoal">
                BINDY<span className="text-gold">.</span>
              </h3>
              <span className="text-[8px] uppercase font-sans tracking-[0.45em] text-gold font-semibold block -mt-1">
                Clothing
              </span>
            </Link>

            <p className="text-xs uppercase font-sans tracking-[0.35em] text-gold font-semibold">
              Two Islands • One Thread
            </p>

            <p className="font-serif italic text-sm text-muted max-w-sm leading-relaxed">
              Thoughtfully designed pieces that blend comfort, poetic storytelling, and authentic Sri Lankan handloom craftsmanship for the modern Australian wardrobe.
            </p>

            <div className="pt-2 text-[11px] font-sans tracking-wider text-muted space-y-1">
              <p>Studios in Brisbane, Australia & Colombo, Sri Lanka</p>
              <p>contact@bindyclothing.com</p>
            </div>
          </div>

          {/* Shop Column (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-[10px] text-gold uppercase tracking-[0.35em] font-semibold mb-4">
              Collection
            </h4>
            <ul className="space-y-2.5 text-xs font-sans uppercase tracking-[0.18em] text-charcoal/80">
              <li>
                <Link href="/collection" className="hover:text-gold transition-colors">
                  All Pieces
                </Link>
              </li>
              <li>
                <Link href="/collection/dresses" className="hover:text-gold transition-colors">
                  Dresses
                </Link>
              </li>
              <li>
                <Link href="/collection/tops-and-blouses" className="hover:text-gold transition-colors">
                  Tops & Blouses
                </Link>
              </li>
              <li>
                <Link href="/collection/skirts-and-pants" className="hover:text-gold transition-colors">
                  Skirts & Pants
                </Link>
              </li>
              <li>
                <Link href="/collection/two-piece-sets" className="hover:text-gold transition-colors">
                  Two Piece Sets
                </Link>
              </li>
            </ul>
          </div>

          {/* Story & Craft Column (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-[10px] text-gold uppercase tracking-[0.35em] font-semibold mb-4">
              Our World
            </h4>
            <ul className="space-y-2.5 text-xs font-sans uppercase tracking-[0.18em] text-charcoal/80">
              <li>
                <Link href="/about" className="hover:text-gold transition-colors">
                  Our Story & Founders
                </Link>
              </li>
              <li>
                <Link href="/stories" className="hover:text-gold transition-colors">
                  Heritage Stories
                </Link>
              </li>
              <li>
                <Link href="/craft" className="hover:text-gold transition-colors">
                  Artisan Handloom & Craft
                </Link>
              </li>
              <li>
                <Link href="/journal" className="hover:text-gold transition-colors">
                  Field Notes & Journal
                </Link>
              </li>
              <li>
                <Link href="/craft#sustainability" className="hover:text-gold transition-colors">
                  Sustainability Standards
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Care Column (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-[10px] text-gold uppercase tracking-[0.35em] font-semibold mb-4">
              Client Care
            </h4>
            <ul className="space-y-2.5 text-xs font-sans uppercase tracking-[0.18em] text-charcoal/80">
              <li>
                <Link href="/size-guide" className="hover:text-gold transition-colors">
                  Size Guide & Measuring
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold transition-colors">
                  Contact & Inquiries
                </Link>
              </li>
              <li>
                <Link href="/contact#faq" className="hover:text-gold transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact#returns" className="hover:text-gold transition-colors">
                  30-Day Returns Policy
                </Link>
              </li>
              <li>
                <Link href="/contact#shipping" className="hover:text-gold transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-sans text-muted tracking-wider gap-4">
          <p>© {new Date().getFullYear()} BINDY CLOTHING. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/contact#privacy" className="hover:text-gold transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact#terms" className="hover:text-gold transition-colors">
              Terms of Service
            </Link>
            <span className="flex items-center gap-1 text-gold">
              <span>Two Islands, One Thread</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
