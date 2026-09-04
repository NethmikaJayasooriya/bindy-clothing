"use client";

import React, { useState, useEffect } from "react";
import { Mail, MapPin, Phone, Send, Check, ChevronDown, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import { getCart } from "@/lib/cart";
import { ambientPlayer } from "@/lib/ambientSound";
import { FAQ_DATA } from "@/data/faq";
import { Button, SectionHeading } from "@/components/ui";

export default function ContactPage() {
  const [isMuted, setIsMuted] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<string | null>("0-0");
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Order Inquiry",
    message: "",
  });

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const toggleAudio = () => {
    if (!ambientPlayer) return;
    const muted = ambientPlayer.toggle();
    setIsMuted(muted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="min-h-screen bg-paper text-charcoal">
      {/* NAVBAR */}
      <Navbar
        isMuted={isMuted}
        toggleAudio={toggleAudio}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* HERO */}
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-24 px-4 sm:px-6 lg:px-8 bg-paper-dark border-b border-sand/40 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-[10px] font-sans uppercase tracking-[0.35em] text-gold font-semibold">
            <Mail className="w-3.5 h-3.5 text-gold" />
            <span>Client Care & Studios</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-wide text-charcoal-rich leading-tight">
            Contact & <span className="font-editorial-italic text-gold">Inquiries</span>
          </h1>

          <p className="font-serif italic text-base sm:text-lg text-muted font-light max-w-2xl mx-auto leading-relaxed">
            Whether you have questions about sizing, delivery, or custom bridal parties, our team in Brisbane and Colombo is here with calm assistance.
          </p>
        </div>
      </section>

      {/* 1. CONTACT FORM & STUDIO LOCATIONS */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-start">
          {/* Left: Studio Locations & Direct Info (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="text-[10px] font-sans uppercase tracking-widest text-gold font-semibold block">
                Two Studios
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-light">
                Where to Find Us
              </h2>
              <p className="text-xs font-sans text-muted leading-relaxed font-light">
                We operate across two coastal hubs, maintaining direct contact with both our weavers in Sri Lanka and our clients across Australia.
              </p>
            </div>

            {/* Brisbane Studio */}
            <div className="p-6 rounded-3xl bg-paper-light border border-sand/40 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-wider text-gold font-semibold">
                <MapPin className="w-4 h-4 text-gold" />
                <span>Brisbane Studio & Client Care</span>
              </div>
              <p className="text-xs font-sans text-charcoal/85 leading-relaxed font-light">
                New Farm, Brisbane QLD 4005, Australia<br />
                Fulfillment, sizing appointments & local returns
              </p>
              <div className="pt-2 text-[11px] font-sans text-muted space-y-1">
                <p>Hours: Monday – Friday, 9am – 5pm AEST</p>
                <p>care@bindyclothing.com</p>
              </div>
            </div>

            {/* Colombo Atelier */}
            <div className="p-6 rounded-3xl bg-paper-light border border-sand/40 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-wider text-gold font-semibold">
                <MapPin className="w-4 h-4 text-gold" />
                <span>Colombo Design Atelier</span>
              </div>
              <p className="text-xs font-sans text-charcoal/85 leading-relaxed font-light">
                Cinnamon Gardens, Colombo 07, Sri Lanka<br />
                Master pattern cutting, loom dispatch & sampling
              </p>
              <div className="pt-2 text-[11px] font-sans text-muted space-y-1">
                <p>Hours: Monday – Friday, 9am – 6pm IST</p>
                <p>atelier@bindyclothing.com</p>
              </div>
            </div>
          </div>

          {/* Right: Interactive Inquiries Form (7 cols) */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-paper-light border border-sand/40 shadow-paper-card">
            <h3 className="font-serif text-2xl text-charcoal font-medium mb-2">
              Send a Note
            </h3>
            <p className="text-xs font-sans text-muted mb-6 font-light">
              We respond to all notes within one business day.
            </p>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-gold/10 border border-gold/40 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-xl text-charcoal font-medium">Thank you for your note</h4>
                <p className="text-xs font-sans text-charcoal/80 max-w-sm mx-auto font-light">
                  We have received your message and will be in touch with thoughtful assistance shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-sans tracking-widest text-muted font-semibold mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      required
                      className="w-full bg-paper px-4 py-3 rounded-xl border border-sand/60 text-xs font-sans text-charcoal focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-sans tracking-widest text-muted font-semibold mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@example.com"
                      required
                      className="w-full bg-paper px-4 py-3 rounded-xl border border-sand/60 text-xs font-sans text-charcoal focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-sans tracking-widest text-muted font-semibold mb-1.5">
                    Subject / Nature of Inquiry
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-paper px-4 py-3 rounded-xl border border-sand/60 text-xs font-sans text-charcoal focus:outline-none focus:border-gold"
                  >
                    <option>Order & Tracking Inquiry</option>
                    <option>Sizing & Fit Advice</option>
                    <option>Returns & Exchanges</option>
                    <option>Press & Media Request</option>
                    <option>Wholesale & Collaborations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-sans tracking-widest text-muted font-semibold mb-1.5">
                    Your Message
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How may we assist your journey?"
                    required
                    className="w-full bg-paper p-4 rounded-xl border border-sand/60 text-xs font-sans text-charcoal focus:outline-none focus:border-gold"
                  />
                </div>

                <Button type="submit" variant="primary" size="md" rightIcon={<Send className="w-3.5 h-3.5" />}>
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 2. CATEGORIZED FAQ ACCORDION */}
      <section id="faq" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-paper-dark border-t border-sand/40">
        <div className="max-w-4xl mx-auto space-y-12">
          <SectionHeading
            eyebrow="Help & Certainty"
            title="Frequently Asked Questions"
            italicWord="Questions"
            description="Clear answers regarding shipping, sizing, returns, and organic fabric care."
            align="center"
          />

          <div className="space-y-8">
            {FAQ_DATA.map((cat, catIdx) => (
              <div key={cat.category} className="space-y-3">
                <h3 className="font-serif text-xl text-charcoal font-medium border-b border-sand/40 pb-2">
                  {cat.category}
                </h3>

                <div className="space-y-3">
                  {cat.items.map((item, itemIdx) => {
                    const id = `${catIdx}-${itemIdx}`;
                    const isOpen = activeFaq === id;
                    return (
                      <div
                        key={itemIdx}
                        className="rounded-2xl bg-paper-light border border-sand/40 overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => setActiveFaq(isOpen ? null : id)}
                          className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                        >
                          <span className="font-serif text-sm sm:text-base font-medium text-charcoal">
                            {item.q}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-gold shrink-0 transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {isOpen && (
                          <div className="px-5 pb-5 text-xs sm:text-sm font-sans text-charcoal/80 font-light leading-relaxed border-t border-sand/30 pt-3">
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />

      {/* CART DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={() => {}}
        onRemoveItem={() => {}}
      />
    </main>
  );
}
