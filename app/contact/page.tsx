"use client";
import { useStorefront } from "@/components/StorefrontProvider";
import { phoneLink } from "@/lib/contact-details";

import Link from "next/link";
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
  const { settings } = useStorefront();
  const [isMuted, setIsMuted] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<string | null>("0-0");
  const [sending,setSending]=useState(false);
  const [sendError,setSendError]=useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSending(true);setSendError("");
    try{const response=await fetch("/api/storefront/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(formData)});const data=await response.json();if(!response.ok)throw new Error(data.error);setSubmitted(true);}catch(error){setSendError((error as Error).message);}finally{setSending(false);}
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
            <span>Client care</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-wide text-charcoal-rich leading-tight">
            Contact & <span className="font-editorial-italic text-gold">Inquiries</span>
          </h1>

          <p className="font-serif italic text-base sm:text-lg text-muted font-light max-w-2xl mx-auto leading-relaxed">
            For questions about garments, sizing, delivery or an existing order, send our team a note.
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
                Australia & Sri Lanka
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-light">
                Here to help.
              </h2>
              <p className="text-xs font-sans text-muted leading-relaxed font-light">
                Use the contact details below for shopping and order support. Please contact us before sending a return.
              </p>
            </div>

            {/* Brisbane Studio */}
            <div className="p-6 rounded-3xl bg-paper-light border border-sand/40 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-wider text-gold font-semibold">
                <MapPin className="w-4 h-4 text-gold" />
                <span>BINDY customer care</span>
              </div>
              <p className="text-xs font-sans text-charcoal/85 leading-relaxed font-light">
                <span className="whitespace-pre-line">{settings.address}</span><br />
                Product, sizing and order enquiries
              </p>
              <div className="pt-2 text-[11px] font-sans text-muted space-y-1">
                <p>Please include your order number for order enquiries.</p>
                <p><a href={`mailto:${settings.email}`}>{settings.email}</a></p>{settings.phone&&<p><a href={phoneLink(settings.phone)}>{settings.phone}</a></p>}
              </div>
            </div>


          </div>

          {/* Right: Interactive Inquiries Form (7 cols) */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-paper-light border border-sand/40 shadow-paper-card">
            <h3 className="font-serif text-2xl text-charcoal font-medium mb-2">
              Send a Note
            </h3>
            <p className="text-xs font-sans text-muted mb-6 font-light">
              Send your question and our team will get back to you. Please do not include card details, passwords or OTPs.
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
              <form onSubmit={handleSubmit} className="space-y-4">{sendError&&<p role="alert" className="text-red-700">{sendError}</p>}
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

                <Button disabled={sending} type="submit" variant="primary" size="md" rightIcon={<Send className="w-3.5 h-3.5" />}>
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 2. CATEGORIZED FAQ ACCORDION */}
      <section id="faq" className="py-16 px-5 text-center border-t border-sand"><h2 className="font-serif text-3xl">A little clarity before you choose.</h2><p className="text-sm mt-4">Answers about sizing, included garments, currency, delivery and checkout.</p><Link href="/faq" className="inline-block mt-6 underline underline-offset-4">Read our shopping questions ↗</Link></section>

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
