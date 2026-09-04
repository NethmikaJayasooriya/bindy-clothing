"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui";

export interface NotifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  size: string;
}

export default function NotifyModal({
  isOpen,
  onClose,
  productName,
  size,
}: NotifyModalProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 select-none"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-md bg-paper-light rounded-3xl border border-sand/50 shadow-2xl p-6 sm:p-8 space-y-5"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-muted hover:text-charcoal transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-[10px] font-sans uppercase tracking-[0.3em] text-gold font-semibold">
              <Bell className="w-3.5 h-3.5 text-gold" />
              <span>Back in Stock Alert</span>
            </div>
            <h3 className="font-serif text-2xl text-charcoal font-light leading-snug">
              Notify Me When Available
            </h3>
            <p className="text-xs font-sans text-muted">
              You will receive an email as soon as <strong className="text-charcoal font-medium">{productName}</strong> in size <strong className="text-gold font-medium">{size}</strong> is restocked by our weavers.
            </p>
          </div>

          {submitted ? (
            <div className="p-5 rounded-2xl bg-gold/10 border border-gold/30 text-charcoal space-y-1.5 text-center">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold/20 text-gold mb-1">
                <Check className="w-4 h-4" />
              </div>
              <h4 className="font-serif text-base font-medium">You&apos;re on the priority list</h4>
              <p className="text-xs font-sans text-muted">
                We will email {email} the moment a new loom batch arrives.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-sans tracking-widest text-muted font-semibold mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="w-full bg-paper px-4 py-3 rounded-xl border border-sand/60 text-xs font-sans text-charcoal focus:outline-none focus:border-gold"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
              >
                Send Me Restock Notification
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
