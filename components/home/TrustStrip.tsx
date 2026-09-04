import React from "react";
import { Truck, RefreshCw, Sparkles, ShieldCheck } from "lucide-react";

export default function TrustStrip() {
  const items = [
    {
      icon: Truck,
      title: "Free AU Shipping $150+",
      sub: "Express carbon-neutral delivery",
    },
    {
      icon: RefreshCw,
      title: "30-Day Thoughtful Returns",
      sub: "Hassle-free exchanges",
    },
    {
      icon: Sparkles,
      title: "Handloom Certified",
      sub: "100% ancestral pit-loom woven",
    },
    {
      icon: ShieldCheck,
      title: "Small-Batch Ethical Craft",
      sub: "Fair living wages for artisans",
    },
  ];

  return (
    <section className="relative z-10 bg-paper-light border-y border-sand/40 py-5 sm:py-6 px-4 sm:px-6 lg:px-8 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 lg:divide-x divide-sand/30">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`flex items-center gap-3.5 ${
                  idx > 0 ? "pt-3 sm:pt-0 lg:pl-6" : ""
                } ${idx === 1 ? "sm:pl-4" : ""}`}
              >
                <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/25 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-gold" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-[11px] sm:text-xs font-sans uppercase tracking-wider text-charcoal font-semibold">
                    {item.title}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] font-sans text-muted font-light">
                    {item.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
