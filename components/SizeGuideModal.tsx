"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Ruler, Sparkles, HelpCircle, ShieldCheck } from "lucide-react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SIZE_CHART = [
  { size: "AU 6 (XS)", bust: "78–82", waist: "60–64", hip: "86–90" },
  { size: "AU 8 (S)", bust: "83–87", waist: "65–69", hip: "91–95" },
  { size: "AU 10 (M)", bust: "88–93", waist: "70–75", hip: "96–101" },
  { size: "AU 12 (L)", bust: "94–99", waist: "76–81", hip: "102–107" },
  { size: "AU 14 (XL)", bust: "100–106", waist: "82–88", hip: "108–114" },
];

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
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
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative z-10 max-w-2xl w-full bg-paper-light text-charcoal rounded-3xl overflow-hidden border border-sand/40 shadow-2xl max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-sand/30 flex items-center justify-between bg-paper">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                  <Ruler className="w-5 h-5 stroke-[1.5]" />
                </div>
                <div>
                  <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-gold font-semibold block">
                    Tailoring & Dimensions
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-normal text-charcoal">
                    Size & Fit Guide
                  </h3>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full bg-sand/15 border border-sand/40 text-charcoal hover:bg-sand/30 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                aria-label="Close Size Guide"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-5 sm:p-7 overflow-y-auto custom-scrollbar space-y-6 sm:space-y-8">
              {/* AU Sizing Chart */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-lg text-charcoal font-medium">
                    Australian Standard Sizing Chart
                  </h4>
                  <span className="text-[11px] font-sans text-muted">Measurements in cm</span>
                </div>

                <div className="overflow-x-auto custom-scrollbar rounded-2xl border border-sand/30 bg-paper">
                  <table className="w-full text-left text-xs font-sans border-collapse">
                    <thead>
                      <tr className="border-b border-sand/30 bg-sand/15 text-charcoal text-[10px] uppercase tracking-wider">
                        <th className="py-3 px-4 font-semibold">AU Size</th>
                        <th className="py-3 px-4 font-semibold">Bust (cm)</th>
                        <th className="py-3 px-4 font-semibold">Waist (cm)</th>
                        <th className="py-3 px-4 font-semibold">Hip (cm)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sand/20">
                      {SIZE_CHART.map((row, idx) => (
                        <tr key={idx} className="hover:bg-sand/10 transition-colors">
                          <td className="py-3 px-4 font-medium text-charcoal">{row.size}</td>
                          <td className="py-3 px-4 text-charcoal/80">{row.bust}</td>
                          <td className="py-3 px-4 text-charcoal/80">{row.waist}</td>
                          <td className="py-3 px-4 text-charcoal/80">{row.hip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* How to Measure */}
              <section className="space-y-3">
                <h4 className="font-serif text-lg text-charcoal font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold" />
                  How to Measure
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans">
                  <div className="p-3.5 rounded-2xl bg-paper border border-sand/30 space-y-1">
                    <span className="text-gold font-semibold uppercase tracking-wider text-[10px] block">1. Bust</span>
                    <p className="text-charcoal/80 leading-relaxed font-light">
                      Measure around the fullest part of your bust, keeping the tape level.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-paper border border-sand/30 space-y-1">
                    <span className="text-gold font-semibold uppercase tracking-wider text-[10px] block">2. Waist</span>
                    <p className="text-charcoal/80 leading-relaxed font-light">
                      Measure around the narrowest part of your natural waistline.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-paper border border-sand/30 space-y-1">
                    <span className="text-gold font-semibold uppercase tracking-wider text-[10px] block">3. Hip</span>
                    <p className="text-charcoal/80 leading-relaxed font-light">
                      Measure around the fullest part of your hips, about 20cm below your waist.
                    </p>
                  </div>
                </div>
                <p className="text-[11px] font-sans text-muted italic">
                  * For the most accurate fit, measure over light clothing or undergarments, keeping the tape snug but not tight.
                </p>
              </section>

              {/* Fit Notes */}
              <section className="space-y-3 bg-paper border border-sand/30 p-4 sm:p-5 rounded-2xl">
                <h4 className="font-serif text-base text-charcoal font-medium text-gold">
                  Artisan Fabric & Silhouette Notes
                </h4>
                <ul className="space-y-2.5 text-xs font-sans text-charcoal/85 font-light leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 flex-shrink-0" />
                    <span>
                      Our handloom cotton and linen pieces are woven with natural give — if you&apos;re between sizes, we recommend sizing down for a fitted silhouette or sizing up for a relaxed drape.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 flex-shrink-0" />
                    <span>
                      Bias-cut and gathered-waist styles (like the Cinnamon Flow Skirt) are more forgiving through the waist and hip.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 flex-shrink-0" />
                    <span>
                      Structured bodices (like the Lotus Memory Dress) fit closer to your true measurements — check individual product reviews under &ldquo;Fit Feedback&rdquo; for real customer experiences with this piece specifically.
                    </span>
                  </li>
                </ul>
              </section>

              {/* Still Unsure? */}
              <section className="flex items-center gap-3 p-4 rounded-2xl bg-gold/10 border border-gold/30 text-xs font-sans text-charcoal">
                <HelpCircle className="w-5 h-5 text-gold flex-shrink-0" />
                <div className="space-y-0.5">
                  <span className="font-medium text-gold">Still Unsure About Sizing?</span>
                  <p className="font-light">
                    Reach out to our team for personalized fit advice before you order, or use our 30-day effortless Australian exchange guarantee if it&apos;s not quite right.
                  </p>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-5 border-t border-sand/30 bg-paper flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] font-sans text-muted">
                <ShieldCheck className="w-4 h-4 text-gold" />
                <span>30-Day Effortless Australian Exchanges</span>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-gold text-charcoal font-sans text-xs uppercase tracking-widest font-semibold hover:bg-cinnamon hover:text-white transition-colors cursor-pointer min-h-[40px]"
              >
                Close Guide
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
