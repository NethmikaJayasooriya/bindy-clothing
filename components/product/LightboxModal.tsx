"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

export interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
  productName: string;
}

export default function LightboxModal({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  productName,
}: LightboxModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setIsZoomed(false);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, currentIndex, images.length]);

  const prev = () => {
    setIsZoomed(false);
    setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };

  const next = () => {
    setIsZoomed(false);
    setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 select-none"
        onClick={onClose}
      >
        {/* Top bar controls */}
        <div className="absolute top-4 inset-x-4 sm:inset-x-8 z-20 flex items-center justify-between text-white">
          <div className="space-y-0.5">
            <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-gold font-semibold">
              Editorial Lightbox • {currentIndex + 1} of {images.length}
            </span>
            <h4 className="font-serif text-sm sm:text-base text-white/90 font-light truncate max-w-[240px] sm:max-w-md">
              {productName}
            </h4>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(!isZoomed);
              }}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title={isZoomed ? "Zoom out" : "Zoom in"}
              aria-label="Toggle zoom"
            >
              {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Close (Esc)"
              aria-label="Close lightbox"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Previous Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Next Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Main Image Frame */}
        <div
          className="relative max-w-4xl max-h-[80vh] flex items-center justify-center overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`${productName} view ${currentIndex + 1}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{
              opacity: 1,
              scale: isZoomed ? 1.6 : 1,
            }}
            transition={{ duration: 0.3 }}
            className={`max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl transition-transform cursor-${
              isZoomed ? "zoom-out" : "zoom-in"
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
          />
        </div>

        {/* Bottom Thumbnails */}
        {images.length > 1 && (
          <div
            className="absolute bottom-6 inset-x-0 z-20 flex items-center justify-center gap-2 overflow-x-auto px-4 py-2"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((src, i) => (
              <button
                key={src + i}
                type="button"
                onClick={() => {
                  setIsZoomed(false);
                  setCurrentIndex(i);
                }}
                className={`relative w-12 h-16 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                  currentIndex === i
                    ? "border-gold ring-2 ring-gold scale-105"
                    : "border-white/30 opacity-60 hover:opacity-100"
                }`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
