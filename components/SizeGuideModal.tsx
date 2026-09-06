"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Ruler, Sparkles, ExternalLink, HelpCircle } from "lucide-react";
import { BODY_MEASUREMENTS, SIZE_CONVERSIONS, MEASURING_GUIDE_TIPS } from "@/data/size-guide";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  const [unit, setUnit] = useState<"in" | "cm">("in");

  // Listen for Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative z-10 max-w-3xl w-full bg-[#FAF7F2] text-[#1F1E1D] rounded-3xl overflow-hidden border border-[#DCC7AF]/60 shadow-2xl max-h-[92vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-[#DCC7AF]/40 flex items-center justify-between bg-white/70">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
                  <Ruler className="w-5 h-5 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl text-[#1F1E1D] font-normal">
                    Size &amp; Fit Guide
                  </h3>
                  <p className="text-[11px] font-mono tracking-widest uppercase text-[#78716A]">
                    BODY MEASUREMENTS &amp; CONVERSIONS
                  </p>
                </div>
              </div>

              {/* UNIT TOGGLE (CM / IN) */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center bg-[#FAF7F2] p-1 rounded-full border border-[#DCC7AF]/80">
                  <button
                    type="button"
                    onClick={() => setUnit("cm")}
                    className={`px-3 py-1 text-xs font-mono rounded-full transition-all ${
                      unit === "cm"
                        ? "bg-[#1F1E1D] text-white shadow-sm"
                        : "text-[#78716A] hover:text-[#1F1E1D]"
                    }`}
                  >
                    CM
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnit("in")}
                    className={`px-3 py-1 text-xs font-mono rounded-full transition-all ${
                      unit === "in"
                        ? "bg-[#1F1E1D] text-white shadow-sm"
                        : "text-[#78716A] hover:text-[#1F1E1D]"
                    }`}
                  >
                    IN
                  </button>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-white border border-[#DCC7AF]/60 flex items-center justify-center text-[#78716A] hover:text-[#1F1E1D] hover:border-[#1F1E1D] transition-colors"
                  aria-label="Close size guide"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-5 sm:p-7 overflow-y-auto space-y-8 text-xs sm:text-sm custom-scrollbar">
              
              {/* BODY MEASUREMENTS TABLE (EXACT FROM CLIENT SPEC) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-mono text-[11px] uppercase tracking-widest text-[#78716A] font-semibold">
                    BODY MEASUREMENTS ({unit.toUpperCase()})
                  </h4>
                  <span className="text-[10px] text-[#78716A] italic">
                    All measurements in {unit === "in" ? "inches" : "centimetres"}
                  </span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-[#DCC7AF]/60 bg-white">
                  <table className="w-full text-center border-collapse">
                    <thead>
                      <tr className="bg-[#FAF7F2]/80 border-b border-[#DCC7AF]/40 text-[#78716A] font-mono text-[11px]">
                        <th className="py-3 px-3 sm:px-4 text-left font-medium uppercase tracking-wider sticky left-0 bg-[#FAF7F2]">
                          AUS / UK
                        </th>
                        {BODY_MEASUREMENTS.map((m) => (
                          <th key={m.size} className="py-3 px-3 sm:px-4 font-semibold text-[#1F1E1D]">
                            {m.size}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DCC7AF]/20 text-[#1F1E1D]">
                      <tr>
                        <td className="py-3 px-3 sm:px-4 text-left font-mono text-[11px] font-medium text-[#78716A] uppercase sticky left-0 bg-white">
                          Bust
                        </td>
                        {BODY_MEASUREMENTS.map((m) => (
                          <td key={m.size} className="py-3 px-3 sm:px-4 font-mono text-xs">
                            {m.bust[unit]}
                          </td>
                        ))}
                      </tr>
                      <tr className="bg-[#FAF7F2]/30">
                        <td className="py-3 px-3 sm:px-4 text-left font-mono text-[11px] font-medium text-[#78716A] uppercase sticky left-0 bg-[#FAF7F2]/30">
                          Waist
                        </td>
                        {BODY_MEASUREMENTS.map((m) => (
                          <td key={m.size} className="py-3 px-3 sm:px-4 font-mono text-xs">
                            {m.waist[unit]}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-3 px-3 sm:px-4 text-left font-mono text-[11px] font-medium text-[#78716A] uppercase sticky left-0 bg-white">
                          Hip
                        </td>
                        {BODY_MEASUREMENTS.map((m) => (
                          <td key={m.size} className="py-3 px-3 sm:px-4 font-mono text-xs">
                            {m.hip[unit]}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SIZE CONVERSION TABLE (EXACT FROM CLIENT SPEC) */}
              <div>
                <h4 className="font-mono text-[11px] uppercase tracking-widest text-[#78716A] font-semibold mb-3">
                  INTERNATIONAL SIZE CONVERSION
                </h4>
                <div className="overflow-x-auto rounded-2xl border border-[#DCC7AF]/60 bg-white">
                  <table className="w-full text-center border-collapse">
                    <thead>
                      <tr className="bg-[#FAF7F2]/80 border-b border-[#DCC7AF]/40 text-[#78716A] font-mono text-[11px]">
                        <th className="py-3 px-3 sm:px-4 text-left font-medium uppercase tracking-wider sticky left-0 bg-[#FAF7F2]">
                          AUS / UK
                        </th>
                        {SIZE_CONVERSIONS.map((c) => (
                          <th key={c.ausUk} className="py-3 px-3 sm:px-4 font-semibold text-[#1F1E1D]">
                            {c.ausUk}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DCC7AF]/20 text-[#1F1E1D]">
                      <tr>
                        <td className="py-3 px-3 sm:px-4 text-left font-mono text-[11px] font-medium text-[#78716A] uppercase sticky left-0 bg-white">
                          USA
                        </td>
                        {SIZE_CONVERSIONS.map((c) => (
                          <td key={c.ausUk} className="py-3 px-3 sm:px-4 font-mono text-xs">
                            {c.usa}
                          </td>
                        ))}
                      </tr>
                      <tr className="bg-[#FAF7F2]/30">
                        <td className="py-3 px-3 sm:px-4 text-left font-mono text-[11px] font-medium text-[#78716A] uppercase sticky left-0 bg-[#FAF7F2]/30">
                          EU
                        </td>
                        {SIZE_CONVERSIONS.map((c) => (
                          <td key={c.ausUk} className="py-3 px-3 sm:px-4 font-mono text-xs">
                            {c.eu}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* HOW TO MEASURE TIPS */}
              <div className="p-4 sm:p-5 bg-white rounded-2xl border border-[#DCC7AF]/50 space-y-3">
                <h5 className="font-serif text-sm text-[#1F1E1D] font-medium">
                  How to Measure Accurately
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#78716A]">
                  {MEASURING_GUIDE_TIPS.map((tip) => (
                    <div key={tip.title}>
                      <span className="font-medium text-[#1F1E1D] block mb-1">{tip.title}</span>
                      <p className="leading-relaxed text-[11px]">{tip.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-[#DCC7AF]/40 bg-white/70 flex items-center justify-between text-xs">
              <Link
                href="/size-guide"
                onClick={onClose}
                className="text-[#C5A059] hover:underline flex items-center space-x-1 font-medium"
              >
                <span>View Full Standalone Size Guide</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-[#1F1E1D] text-white rounded-full text-xs font-mono uppercase tracking-widest hover:bg-[#C5A059] transition-colors"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
