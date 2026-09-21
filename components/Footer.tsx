"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

export default function Footer() {
  return (
    <footer className="bg-paper-dark text-charcoal border-t border-sand/40 pt-16 sm:pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-16 border-b border-sand/40">
          {/* Brand Column (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block">
              <BrandLogo size="lg" />
            </Link>

            <p className="text-[11px] font-sans font-medium uppercase tracking-[0.26em] text-[#8E6E34]">
              Two Islands • One Thread
            </p>

            <p className="font-cormorant text-[16.5px] italic text-charcoal/75 leading-[1.65] max-w-sm">
              Thoughtfully designed pieces that blend comfort, poetic storytelling, and authentic Sri Lankan handloom craftsmanship for the modern Australian wardrobe.
            </p>

            <div className="pt-2 space-y-2 text-[13px] font-sans text-charcoal-subtle">
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold/60 shrink-0" />
                <span>Studios in Brisbane, Australia &amp; Colombo, Sri Lanka</span>
              </p>
              <p>
                <a
                  href="mailto:contact@bindyclothing.com"
                  className="inline-flex items-center gap-2 text-charcoal/80 hover:text-[#8E6E34] transition-colors duration-200 group"
                >
                  <Mail className="w-3.5 h-3.5 text-[#8E6E34]/80 group-hover:text-[#8E6E34] transition-colors" />
                  <span className="underline decoration-sand/60 underline-offset-4 group-hover:decoration-[#8E6E34]">
                    contact@bindyclothing.com
                  </span>
                </a>
              </p>
            </div>
          </div>

          {/* Shop Column (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-[11px] font-sans font-semibold uppercase tracking-[0.22em] text-[#8E6E34] mb-4">
              Collection
            </h4>
            <ul className="space-y-2.5 text-[13.5px] font-sans text-charcoal/75">
              <li>
                <Link href="/collection" className="hover:text-charcoal-rich hover:translate-x-0.5 transition-all duration-200 inline-block">
                  All Pieces
                </Link>
              </li>
              <li>
                <Link href="/collection/dresses" className="hover:text-charcoal-rich hover:translate-x-0.5 transition-all duration-200 inline-block">
                  Dresses
                </Link>
              </li>
              <li>
                <Link href="/collection/tops-and-blouses" className="hover:text-charcoal-rich hover:translate-x-0.5 transition-all duration-200 inline-block">
                  Tops &amp; Blouses
                </Link>
              </li>
              <li>
                <Link href="/collection/skirts-and-pants" className="hover:text-charcoal-rich hover:translate-x-0.5 transition-all duration-200 inline-block">
                  Skirts &amp; Pants
                </Link>
              </li>
              <li>
                <Link href="/collection/two-piece-sets" className="hover:text-charcoal-rich hover:translate-x-0.5 transition-all duration-200 inline-block">
                  Two Piece Sets
                </Link>
              </li>
            </ul>
          </div>

          {/* Story & Craft Column (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-[11px] font-sans font-semibold uppercase tracking-[0.22em] text-[#8E6E34] mb-4">
              Our World
            </h4>
            <ul className="space-y-2.5 text-[13.5px] font-sans text-charcoal/75">
              <li>
                <Link href="/about" className="hover:text-charcoal-rich hover:translate-x-0.5 transition-all duration-200 inline-block">
                  Our Story &amp; Founders
                </Link>
              </li>
              <li>
                <Link href="/stories" className="hover:text-charcoal-rich hover:translate-x-0.5 transition-all duration-200 inline-block">
                  Heritage Stories
                </Link>
              </li>
              <li>
                <Link href="/craft" className="hover:text-charcoal-rich hover:translate-x-0.5 transition-all duration-200 inline-block">
                  Artisan Handloom &amp; Craft
                </Link>
              </li>
              <li>
                <Link href="/journal" className="hover:text-charcoal-rich hover:translate-x-0.5 transition-all duration-200 inline-block">
                  Field Notes &amp; Journal
                </Link>
              </li>
              <li>
                <Link href="/craft#sustainability" className="hover:text-charcoal-rich hover:translate-x-0.5 transition-all duration-200 inline-block">
                  Sustainability Standards
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Care Column (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-[11px] font-sans font-semibold uppercase tracking-[0.22em] text-[#8E6E34] mb-4">
              Client Care
            </h4>
            <ul className="space-y-2.5 text-[13.5px] font-sans text-charcoal/75">
              <li>
                <Link href="/size-guide" className="hover:text-charcoal-rich hover:translate-x-0.5 transition-all duration-200 inline-block">
                  Size Guide &amp; Fit
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-charcoal-rich hover:translate-x-0.5 transition-all duration-200 inline-block">
                  Returns &amp; Exchanges Policy
                </Link>
              </li>
              <li>
                <Link href="/returns/start" className="hover:text-charcoal-rich hover:translate-x-0.5 transition-all duration-200 inline-block">
                  Return &amp; Exchange Portal
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-charcoal-rich hover:translate-x-0.5 transition-all duration-200 inline-block">
                  Contact &amp; Inquiries
                </Link>
              </li>
              <li>
                <Link href="/contact#faq" className="hover:text-charcoal-rich hover:translate-x-0.5 transition-all duration-200 inline-block">
                  Frequently Asked Questions
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-[13px] font-sans font-medium text-[#8E6E34] hover:text-charcoal-rich transition-colors duration-200 group"
                >
                  <span className="text-[10px] text-gold">✦</span>
                  <span className="underline decoration-gold/40 underline-offset-4 group-hover:decoration-charcoal-rich">
                    Atelier Seller Portal
                  </span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-sans text-charcoal/60 tracking-wider gap-4">
          <p>© {new Date().getFullYear()} BINDY CLOTHING. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-sans text-charcoal/60">
            <Link
              href="/admin"
              className="text-[#8E6E34] hover:text-charcoal-rich font-medium transition-colors"
            >
              Seller Hub
            </Link>
            <span className="text-sand/60 hidden sm:inline">•</span>
            <Link href="/contact#privacy" className="hover:text-charcoal-rich transition-colors">
              Privacy Policy
            </Link>
            <span className="text-sand/60 hidden sm:inline">•</span>
            <Link href="/contact#terms" className="hover:text-charcoal-rich transition-colors">
              Terms of Service
            </Link>
            <span className="text-sand/60 hidden sm:inline">•</span>
            <span className="font-serif italic text-[#8E6E34] tracking-normal">
              Two Islands, One Thread
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
