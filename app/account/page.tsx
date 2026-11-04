"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Heart, RefreshCw, HelpCircle, ArrowRight, Clock, MapPin, Sparkles, CheckCircle2 } from "lucide-react";
import { getAccount, subscribeAccount, getOrders, subscribeOrders, type UserAccount, type OrderRecord } from "@/lib/account";
import { getWishlistCount, subscribeWishlist } from "@/lib/wishlist";
import { useStorefront } from "@/components/StorefrontProvider";
import ResponsiveImage from "@/components/ResponsiveImage";
import Footer from "@/components/Footer";

export default function AccountPage() {
  const { settings } = useStorefront();
  const [account, setAccount] = useState<UserAccount | null>(null);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const sync = () => {
      setAccount(getAccount());
      setOrders(getOrders());
      setWishlistCount(getWishlistCount());
    };
    sync();
    const offAccount = subscribeAccount(sync);
    const offOrders = subscribeOrders(sync);
    const offWishlist = subscribeWishlist(sync);
    return () => {
      offAccount();
      offOrders();
      offWishlist();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1F1E1D] flex flex-col justify-between">
      {/* Luxury Minimal Header */}
      <header className="px-6 sm:px-10 py-6 border-b border-[#DCC7AF]/50 flex items-center justify-between bg-white/70 backdrop-blur-sm sticky top-0 z-30">
        <Link href="/" className="font-serif text-3xl font-bold tracking-tight">
          bindy<span className="text-[#C5A059]">.</span>
        </Link>
        <div className="flex items-center gap-6 text-xs uppercase tracking-widest text-[#78716A]">
          <Link href="/wishlist" className="hover:text-[#C5A059] transition-colors">
            Wishlist ({wishlistCount})
          </Link>
          <Link href="/collection" className="hover:text-[#C5A059] transition-colors font-medium">
            Explore Collection →
          </Link>
        </div>
      </header>

      {/* Main Account Portal */}
      <main className="max-w-5xl mx-auto px-6 py-12 sm:py-20 w-full flex-1">
        {/* Customer Welcome Greeting */}
        <div className="border-b border-[#DCC7AF]/50 pb-8 mb-10">
          <span className="uppercase text-[11px] font-mono tracking-[0.3em] text-[#C5A059] font-medium block mb-2">
            Always Welcome
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-[#1F1E1D]">
            {account?.name ? `Welcome back, ${account.name}.` : "Your BINDY Space."}
          </h1>
          <p className="mt-3 text-sm text-[#78716A] leading-relaxed max-w-2xl">
            Shop with convenient guest checkout. Your saved pieces and recent browser orders remain right here for easy access, tracking, and returns.
          </p>
        </div>

        {/* 3 Quick Action Cards */}
        <div className="grid sm:grid-cols-3 gap-5 mb-14">
          <Link
            href="/wishlist"
            className="border border-[#DCC7AF]/70 bg-white p-7 rounded-2xl hover:border-[#C5A059] hover:shadow-sm transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#DCC7AF]/50 flex items-center justify-center text-[#C5A059] mb-4 group-hover:scale-105 transition-transform">
                <Heart className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl font-medium">Your Wishlist</h2>
                {wishlistCount > 0 && (
                  <span className="text-[11px] font-mono bg-[#C5A059]/15 text-[#C5A059] font-bold px-2 py-0.5 rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <p className="text-xs leading-6 mt-2 text-[#78716A]">
                Come back to the garments and silken textures you love.
              </p>
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A059] flex items-center gap-1.5 mt-6">
              View Wishlist <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            href="/contact"
            className="border border-[#DCC7AF]/70 bg-white p-7 rounded-2xl hover:border-[#C5A059] hover:shadow-sm transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#DCC7AF]/50 flex items-center justify-center text-[#C5A059] mb-4 group-hover:scale-105 transition-transform">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h2 className="font-serif text-xl font-medium">Order Help</h2>
              <p className="text-xs leading-6 mt-2 text-[#78716A]">
                Have a question about sizing, payment, or parcel dispatch? Our concierge is here.
              </p>
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A059] flex items-center gap-1.5 mt-6">
              Contact Store <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            href="/returns/start"
            className="border border-[#DCC7AF]/70 bg-white p-7 rounded-2xl hover:border-[#C5A059] hover:shadow-sm transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#DCC7AF]/50 flex items-center justify-center text-[#C5A059] mb-4 group-hover:scale-105 transition-transform">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h2 className="font-serif text-xl font-medium">Track &amp; Returns</h2>
              <p className="text-xs leading-6 mt-2 text-[#78716A]">
                Check shipment progress or start an exchange within our 30-day policy.
              </p>
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C5A059] flex items-center gap-1.5 mt-6">
              Track Order <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>

        {/* Recent Orders Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#DCC7AF]/40 pb-4">
            <div className="flex items-center gap-2.5">
              <Package className="w-5 h-5 text-[#C5A059]" />
              <h2 className="font-serif text-2xl font-normal text-[#1F1E1D]">Recent Orders</h2>
            </div>
            <span className="text-xs font-mono text-[#78716A]">
              {orders.length} {orders.length === 1 ? "order" : "orders"} on this device
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="border border-[#DCC7AF]/60 rounded-2xl bg-white p-8 sm:p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#DCC7AF]/50 flex items-center justify-center mx-auto text-[#78716A]">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-normal">No recent orders in this browser</h3>
              <p className="text-xs text-[#78716A] max-w-md mx-auto leading-relaxed">
                When you place an order, its confirmation details will appear here automatically. If you already placed an order, you can track it anytime using your order reference.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/returns/start"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#DCC7AF] text-xs uppercase tracking-widest font-semibold hover:border-[#C5A059] transition-colors"
                >
                  Track guest order
                </Link>
                <Link
                  href="/collection"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#252822] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#3D3B36] transition-colors"
                >
                  Explore Collection
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const isLkr = order.currency === "LKR";
                const totalFormatted = isLkr
                  ? `Rs. ${order.total.toLocaleString("en-LK")} LKR`
                  : `$${order.total.toFixed(2)} AUD`;

                return (
                  <div
                    key={order.orderRef}
                    className="border border-[#DCC7AF]/60 rounded-2xl bg-white p-6 sm:p-8 shadow-sm space-y-6"
                  >
                    {/* Order Header Ribbon */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6DCD0] pb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-base font-bold text-[#1F1E1D]">
                            {order.orderRef}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-[#EAF0E6] text-[#4B6244] border border-[#4B6244]/20">
                            {order.status || "Confirmed"}
                          </span>
                        </div>
                        <p className="text-xs text-[#78716A] flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Placed on {order.date}</span>
                          {order.paymentMethod && <span>• {order.paymentMethod}</span>}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-[#78716A] block">Total</span>
                        <span className="font-serif text-lg font-bold text-[#1F1E1D]">
                          {totalFormatted}
                        </span>
                      </div>
                    </div>

                    {/* Order Line Items */}
                    <div className="divide-y divide-[#E6DCD0]">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="py-3 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3.5 min-w-0">
                            {item.image ? (
                              <ResponsiveImage
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-16 object-cover rounded-lg bg-[#FAF7F2] border border-[#DCC7AF]/40 flex-shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-16 rounded-lg bg-[#FAF7F2] border border-[#DCC7AF]/40 flex items-center justify-center flex-shrink-0 text-[#78716A]">
                                <Package className="w-5 h-5" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <h4 className="font-serif text-sm text-[#1F1E1D] truncate font-medium">
                                {item.name}
                              </h4>
                              <p className="text-xs text-[#78716A] mt-0.5">
                                Size: {item.size} • Qty: {item.quantity}
                              </p>
                            </div>
                          </div>

                          <span className="text-xs font-mono font-medium text-[#1F1E1D] flex-shrink-0">
                            {isLkr
                              ? `Rs. ${(item.priceAud * item.quantity).toLocaleString()}`
                              : `$${(item.priceAud * item.quantity).toFixed(2)}`}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Delivery Address & Action Bar */}
                    <div className="pt-4 border-t border-[#E6DCD0] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                      {order.shippingAddress && (
                        <div className="flex items-start gap-1.5 text-[#78716A]">
                          <MapPin className="w-3.5 h-3.5 mt-0.5 text-[#C5A059] flex-shrink-0" />
                          <span>
                            Delivering to: {order.shippingAddress.suburb || order.shippingAddress.address},{" "}
                            {order.shippingAddress.state || order.shippingAddress.country}
                          </span>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-4 sm:ml-auto">
                        <Link
                          href={`/returns/start?order=${order.orderRef}`}
                          className="font-semibold uppercase tracking-wider text-[#C5A059] hover:text-[#8E6E34] transition-colors inline-flex items-center gap-1"
                        >
                          <span>Track or Return Order</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/contact?subject=Order%20${order.orderRef}`}
                          className="text-[#78716A] hover:text-[#1F1E1D] underline transition-colors"
                        >
                          Need help?
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
