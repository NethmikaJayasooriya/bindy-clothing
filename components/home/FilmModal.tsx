"use client";

import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, VolumeX, Sparkles, MapPin } from "lucide-react";

export interface FilmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FilmModal({ isOpen, onClose }: FilmModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = React.useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    } else {
      document.body.style.overflow = "";
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-5xl rounded-3xl overflow-hidden bg-charcoal border border-sand/30 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/80 to-transparent">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-[10px] font-sans uppercase tracking-[0.3em] text-gold font-medium">
                  <Sparkles className="w-3 h-3 text-gold" />
                  <span>Cinematic Short Film</span>
                </div>
                <h3 className="font-serif text-lg sm:text-xl text-white font-light">
                  Two Islands, One Thread • The BINDY Journey
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2.5 rounded-full bg-black/60 hover:bg-black text-white hover:text-gold border border-white/20 transition-colors cursor-pointer"
                  title={isMuted ? "Unmute film" : "Mute film"}
                  aria-label="Toggle sound"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-gold" />}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-2.5 rounded-full bg-black/60 hover:bg-black text-white hover:text-gold border border-white/20 transition-colors cursor-pointer"
                  title="Close film"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video w-full bg-black">
              <video
                ref={videoRef}
                src="/media/hero-joined.mp4"
                controls
                autoPlay
                playsInline
                muted={isMuted}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Bottom Caption */}
            <div className="p-4 sm:p-5 bg-charcoal-rich border-t border-sand/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-sand/80 font-sans">
              <div className="flex items-center gap-2 text-[11px] tracking-wide">
                <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>Filmed on 35mm in Anuradhapura, Galle Fort & Brisbane</span>
              </div>
              <p className="text-[11px] font-serif italic text-sand/60">
                Direction by Vinudhi Ranasinghe · Soundscape by Sri Lankan Artisan Looms
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
