"use client";

import React, { useState } from "react";
import { Info, ArrowRight, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ReturnPortalCardProps {
  initialOrderNumber?: string;
  isStandalone?: boolean;
}

export default function ReturnPortalCard({ initialOrderNumber = "", isStandalone = false }: ReturnPortalCardProps) {
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [contactInfo, setContactInfo] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<"idle" | "found" | "not_found">("idle");
  const [selectedItem, setSelectedItem] = useState<string>("lotus-memory-dress");
  const [returnType, setReturnType] = useState<"exchange" | "refund" | "store_credit">("exchange");
  const [reason, setReason] = useState("Fit was slightly small");
  const [submitted, setSubmitted] = useState(false);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim() || !contactInfo.trim()) return;

    setIsSearching(true);
    setSearchResult("idle");

    setTimeout(() => {
      setIsSearching(false);
      // Simulate order lookup (demonstrates successful order matching)
      if (orderNumber.toUpperCase().includes("FAIL")) {
        setSearchResult("not_found");
      } else {
        setSearchResult("found");
      }
    }, 900);
  };

  const handleProcessReturn = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className={`w-full max-w-lg mx-auto ${isStandalone ? "p-4 sm:p-8" : ""}`}>
      <div className="bg-[#FAF7F2] border border-[#DCC7AF]/60 rounded-3xl p-8 sm:p-10 shadow-[0_10px_35px_rgba(0,0,0,0.04)] text-center transition-all duration-300">
        
        {/* HEADER MATCHING CLIENT SCREENSHOT */}
        <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#78716A] mb-2 font-medium">
          RETURN &amp; EXCHANGE PORTAL
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#1F1E1D] mb-6">
          Let&apos;s track your order first
        </h2>

        {/* LOOKUP FORM */}
        {searchResult === "idle" && (
          <form onSubmit={handleLookup} className="space-y-5 text-left">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-[#78716A] tracking-wider uppercase">
                  Order Number
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowTooltip(!showTooltip)}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="text-[#78716A] hover:text-[#C5A059] transition-colors p-1"
                    aria-label="Where to find order number"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                  {showTooltip && (
                    <div className="absolute right-0 bottom-full mb-2 w-56 p-2.5 bg-[#1F1E1D] text-white text-[11px] leading-relaxed rounded-xl shadow-lg z-20 pointer-events-none">
                      Found in your order confirmation email (e.g. #BIN-84291)
                    </div>
                  )}
                </div>
              </div>
              <input
                type="text"
                placeholder="e.g. #BIN-84291"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                required
                className="w-full px-4 py-3.5 bg-white border border-[#DCC7AF] rounded-xl text-sm text-[#1F1E1D] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#78716A] tracking-wider uppercase mb-1.5">
                Email or Phone
              </label>
              <input
                type="text"
                placeholder="name@example.com or +61..."
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                required
                className="w-full px-4 py-3.5 bg-white border border-[#DCC7AF] rounded-xl text-sm text-[#1F1E1D] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSearching}
                className="w-full py-4 bg-[#1F1E1D] text-white rounded-full text-xs font-medium tracking-[0.2em] uppercase hover:bg-[#C5A059] transition-all duration-300 shadow-md flex items-center justify-center space-x-2 disabled:opacity-60"
              >
                {isSearching ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#C5A059]" />
                    <span>Locating Order...</span>
                  </>
                ) : (
                  <span>FIND MY ORDER</span>
                )}
              </button>
            </div>

            <p className="text-center text-[11px] text-[#78716A] pt-2">
              Need assistance? Email our concierge at{" "}
              <a href="mailto:care@bindyclothing.com" className="underline text-[#1F1E1D] hover:text-[#C5A059]">
                care@bindyclothing.com
              </a>
            </p>
          </form>
        )}

        {/* NOT FOUND STATE */}
        {searchResult === "not_found" && (
          <div className="space-y-4 text-center py-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg text-[#1F1E1D]">We couldn&apos;t find that order</h3>
            <p className="text-xs text-[#78716A] max-w-sm mx-auto leading-relaxed">
              Please verify your order number and the email or phone number used during checkout.
            </p>
            <button
              type="button"
              onClick={() => setSearchResult("idle")}
              className="px-6 py-2.5 bg-[#FAF7F2] border border-[#DCC7AF] text-[#1F1E1D] rounded-full text-xs tracking-wider uppercase hover:border-[#C5A059] transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ORDER FOUND STATE & EXCHANGE FLOW */}
        {searchResult === "found" && !submitted && (
          <form onSubmit={handleProcessReturn} className="space-y-6 text-left pt-2">
            <div className="bg-white/80 p-4 rounded-2xl border border-[#DCC7AF]/50 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-mono uppercase text-[#78716A]">Order Verified</p>
                <p className="text-sm font-serif font-medium text-[#1F1E1D]">{orderNumber || "#BIN-84291"}</p>
              </div>
              <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#AFC8B1]/25 text-[#2E4A32] font-medium">
                Within Return Window
              </span>
            </div>

            {/* ITEM SELECTOR */}
            <div>
              <label className="block text-xs font-medium text-[#78716A] tracking-wider uppercase mb-2">
                Select Item to Return or Exchange
              </label>
              <div
                onClick={() => setSelectedItem("lotus-memory-dress")}
                className={`p-3 rounded-xl border flex items-center space-x-3 cursor-pointer transition-all ${
                  selectedItem === "lotus-memory-dress"
                    ? "border-[#C5A059] bg-[#C5A059]/5"
                    : "border-[#DCC7AF] bg-white"
                }`}
              >
                <div className="w-12 h-14 rounded-lg bg-[#EFE7DC] overflow-hidden flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/serendipity/lotus-memory-dress.jpg"
                    alt="Lotus Memory Strapless Dress"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-serif font-medium text-[#1F1E1D] truncate">
                    Lotus Memory Strapless Dress
                  </p>
                  <p className="text-[11px] text-[#78716A]">Lotus Pink • AU 8 (S) • $240 AUD</p>
                </div>
                <CheckCircle2
                  className={`w-4 h-4 ${
                    selectedItem === "lotus-memory-dress" ? "text-[#C5A059]" : "text-transparent"
                  }`}
                />
              </div>
            </div>

            {/* RETURN OPTION */}
            <div>
              <label className="block text-xs font-medium text-[#78716A] tracking-wider uppercase mb-2">
                Preferred Resolution
              </label>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {[
                  { id: "exchange", label: "Exchange Size" },
                  { id: "store_credit", label: "Store Credit" },
                  { id: "refund", label: "Original Refund" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setReturnType(opt.id as any)}
                    className={`p-3 rounded-xl border text-xs transition-all ${
                      returnType === opt.id
                        ? "border-[#1F1E1D] bg-[#1F1E1D] text-white"
                        : "border-[#DCC7AF] bg-white text-[#78716A] hover:border-[#C5A059]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* REASON */}
            <div>
              <label className="block text-xs font-medium text-[#78716A] tracking-wider uppercase mb-1.5">
                Reason for Return
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-[#DCC7AF] rounded-xl text-xs text-[#1F1E1D] focus:outline-none focus:border-[#C5A059]"
              >
                <option value="Fit was slightly small">Fit was slightly small</option>
                <option value="Fit was slightly large">Fit was slightly large</option>
                <option value="Preferred different silhouette">Preferred different silhouette</option>
                <option value="Color nuance different than expected">Color nuance different than expected</option>
                <option value="Other / Gift exchange">Other / Gift exchange</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#1F1E1D] text-white rounded-full text-xs font-medium tracking-[0.2em] uppercase hover:bg-[#C5A059] transition-all duration-300 shadow-md"
            >
              Generate Return Label &amp; Instructions
            </button>
          </form>
        )}

        {/* SUCCESS CONFIRMATION */}
        {submitted && (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#AFC8B1]/30 text-[#2E4A32] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl text-[#1F1E1D]">Return Request Initiated</h3>
            <p className="text-xs text-[#78716A] leading-relaxed max-w-sm mx-auto">
              Your return instructions and prepaid lodgment slip have been emailed to your account.
              Please allow 3 to 6 business days once received at our warehouse for processing.
            </p>
            <div className="pt-3">
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setSearchResult("idle");
                  setOrderNumber("");
                  setContactInfo("");
                }}
                className="px-6 py-3 bg-[#FAF7F2] border border-[#DCC7AF] text-[#1F1E1D] rounded-full text-xs tracking-wider uppercase hover:border-[#C5A059] transition-colors"
              >
                Start Another Return
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
