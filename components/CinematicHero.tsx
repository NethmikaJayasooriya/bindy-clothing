"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from "framer-motion";
import { Play, Pause, Volume2, VolumeX, ArrowRight, Sparkles } from "lucide-react";

interface HeroProps {
  onExploreCollection?: () => void;
}

export default function CinematicHero({ onExploreCollection }: HeroProps) {
  const [activeVideo, setActiveVideo] = useState<0 | 1>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTimeFormatted, setCurrentTimeFormatted] = useState("00:00");
  const [totalProgress, setTotalProgress] = useState(0);

  const video0Ref = useRef<HTMLVideoElement>(null);
  const video1Ref = useRef<HTMLVideoElement>(null);

  const videoClips = [
    { id: 0, src: "/media/scene-scenery.mp4" },
    { id: 1, src: "/media/scene-walking.mp4" },
  ];

  // 1. Cursor-Aware Subtle Background Parallax (Max ±10px, Fine Pointers Only)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 45, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 45, damping: 25 });
  const bgX = useTransform(smoothX, [-1, 1], [-10, 10]);
  const bgY = useTransform(smoothY, [-1, 1], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches) {
      const rect = e.currentTarget.getBoundingClientRect();
      const xPct = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const yPct = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      mouseX.set(xPct);
      mouseY.set(yPct);
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // 2. Scroll-Linked Hero Content Pacing (0.8x Parallax Lag on Scroll)
  const { scrollY } = useScroll();
  const heroContentY = useTransform(scrollY, [0, 900], [0, 140]);
  const heroOpacity = useTransform(scrollY, [0, 700], [1, 0.25]);

  // Seamless continuous video loop
  useEffect(() => {
    const v0 = video0Ref.current;
    const v1 = video1Ref.current;
    if (!v0 || !v1) return;

    const handleTimeUpdate0 = () => {
      if (activeVideo === 0 && v0.duration) {
        const progress = (v0.currentTime / v0.duration) * 50;
        setTotalProgress(progress);
        const secs = Math.floor(v0.currentTime % 60);
        setCurrentTimeFormatted(`00:${secs < 10 ? "0" + secs : secs}`);

        if (v0.currentTime >= v0.duration - 0.6) {
          v1.currentTime = 0;
          v1.play().catch(() => {});
          setActiveVideo(1);
        }
      }
    };

    const handleTimeUpdate1 = () => {
      if (activeVideo === 1 && v1.duration) {
        const progress = 50 + (v1.currentTime / v1.duration) * 50;
        setTotalProgress(progress);
        const secs = Math.floor(v1.currentTime % 60) + 8;
        setCurrentTimeFormatted(`00:${secs < 10 ? "0" + secs : secs}`);

        if (v1.currentTime >= v1.duration - 0.6) {
          v0.currentTime = 0;
          v0.play().catch(() => {});
          setActiveVideo(0);
        }
      }
    };

    v0.addEventListener("timeupdate", handleTimeUpdate0);
    v1.addEventListener("timeupdate", handleTimeUpdate1);

    return () => {
      v0.removeEventListener("timeupdate", handleTimeUpdate0);
      v1.removeEventListener("timeupdate", handleTimeUpdate1);
    };
  }, [activeVideo]);

  // Click-to-unmute with sound pattern
  const togglePlayOrSound = () => {
    const v0 = video0Ref.current;
    const v1 = video1Ref.current;
    const activeEl = activeVideo === 0 ? v0 : v1;
    if (!activeEl) return;

    if (isPlaying) {
      if (isMuted) {
        // Unmute on visitor engagement
        setIsMuted(false);
        if (v0) v0.muted = false;
        if (v1) v1.muted = false;
      } else {
        v0?.pause();
        v1?.pause();
        setIsPlaying(false);
      }
    } else {
      activeEl.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMuteOnly = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (video0Ref.current) video0Ref.current.muted = newMuted;
    if (video1Ref.current) video1Ref.current.muted = newMuted;
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-screen min-h-[720px] overflow-hidden bg-black flex items-center justify-center select-none"
    >
      {/* 1. SEAMLESS DUAL-VIDEO BACKGROUND LAYERS WITH CURSOR-AWARE PARALLAX */}
      <motion.div
        style={{ x: bgX, y: bgY }}
        className="absolute inset-0 w-full h-full scale-[1.04]"
      >
        <video
          ref={video0Ref}
          src={videoClips[0].src}
          autoPlay
          muted={isMuted}
          playsInline
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover object-[center_8%] sm:object-[center_6%] transition-opacity duration-1200 ease-in-out ${
            activeVideo === 0 ? "opacity-100 scale-100 z-0" : "opacity-0 scale-105 pointer-events-none"
          }`}
        />

        <video
          ref={video1Ref}
          src={videoClips[1].src}
          muted={isMuted}
          playsInline
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover object-[center_8%] sm:object-[center_6%] transition-opacity duration-1200 ease-in-out ${
            activeVideo === 1 ? "opacity-100 scale-100 z-0" : "opacity-0 scale-105 pointer-events-none"
          }`}
        />
      </motion.div>

      {/* 2. HIGH-CONTRAST EDITORIAL GRADIENT SCRIMS */}
      <div className="absolute inset-y-0 left-0 w-full md:w-[65%] lg:w-[55%] bg-gradient-to-r from-black/90 via-black/60 to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 inset-x-0 h-44 bg-gradient-to-b from-black/70 via-black/30 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none z-10" />

      {/* Subtle warm golden ambient glow */}
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-[radial-gradient(circle,rgba(197,160,89,0.06)_0%,transparent_70%)] blur-3xl pointer-events-none z-10 opacity-30" />

      {/* 3. MAIN CINEMATIC EDITORIAL CONTENT WITH SCROLL PARALLAX */}
      <motion.div
        style={{ y: heroContentY, opacity: heroOpacity }}
        className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-between pt-24 sm:pt-28 pb-10 sm:pb-12"
      >
        {/* Top Header: Quiet small-caps collection label */}
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <span className="text-[10px] font-sans tracking-[0.35em] uppercase text-sand/60 font-light drop-shadow-sm">
              Collection 01 • Origins
            </span>
          </motion.div>
        </div>

        {/* Center Editorial Content: Confident, Oversized Typography Anchoring the Screen */}
        <div className="my-auto max-w-2xl lg:max-w-4xl py-4 sm:py-6">
          <div className="space-y-6 text-left">
            {/* 1. Single Luxury Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#C5A059]/50 shadow-md"
            >
              <Sparkles className="w-3 h-3 text-[#C5A059]" />
              <span className="text-[10px] uppercase font-sans tracking-[0.3em] text-[#FAF7F2] font-medium">
                Woven for the Australian Wardrobe
              </span>
            </motion.div>

            {/* 2. Kinetic Oversized Headline Reveal (Bottega / Prada / YSL Editorial Scale) */}
            <div className="overflow-hidden space-y-1 sm:space-y-2">
              <motion.h1
                initial={{ opacity: 0, y: 25, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] xl:text-[7.25rem] text-[#FFFFFF] font-normal tracking-tight leading-[0.94] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]"
              >
                Wear Your Calm,
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 25, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="italic font-light text-[#E5D7C5] font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] xl:text-[7.25rem] leading-[0.94] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] block">
                  Feel Your Story.
                </span>
              </motion.div>
            </div>

            {/* 3. Editorial Philosophy Description */}
            <motion.p
              initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif italic text-base sm:text-xl md:text-2xl text-[#F2ECE1] max-w-xl font-light tracking-wide leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]"
            >
              Thoughtfully designed silhouettes blending everyday ease, artistic spirit, and authentic Sri Lankan craftsmanship.
            </motion.p>

            {/* 4. Single Confident Primary CTA (No competing secondary links in hero) */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="pt-2 sm:pt-4"
            >
              <a
                href="#collection"
                onClick={onExploreCollection}
                className="group inline-flex items-center space-x-3 px-9 py-4 sm:py-4.5 rounded-full bg-[#C5A059] hover:bg-[#FAF7F2] text-black font-sans text-xs uppercase tracking-[0.25em] font-semibold transition-all duration-300 shadow-[0_6px_30px_rgba(197,160,89,0.35)] hover:shadow-[0_8px_35px_rgba(255,255,255,0.4)] cursor-pointer hover:scale-[1.02]"
              >
                <span>Discover Collection</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
              </a>
            </motion.div>
          </div>
        </div>

        {/* 5. BOTTOM BAR: Fashion Film Player with Click-to-Unmute Pattern */}
        <div className="flex items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex items-center space-x-3.5 bg-black/70 backdrop-blur-2xl px-4 py-2.5 rounded-full border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] w-full sm:w-auto"
          >
            {/* Play / Pause Toggle Button */}
            <button
              onClick={togglePlayOrSound}
              className="w-8 h-8 rounded-full bg-[#C5A059] text-black flex items-center justify-center hover:bg-white transition-all shadow-md cursor-pointer flex-shrink-0"
              title={isPlaying ? (isMuted ? "Click to Unmute with Sound" : "Pause Video") : "Play Video"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
            </button>

            {/* Time & Progress Info */}
            <div className="flex flex-col flex-1 sm:w-44">
              <div className="flex justify-between text-[9px] font-sans tracking-[0.2em] text-white/90 uppercase mb-1">
                <span>Fashion Film</span>
                <span className="font-mono text-[#C5A059] font-medium">{currentTimeFormatted}</span>
              </div>
              <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-[#C5A059] h-full transition-all duration-200 ease-linear rounded-full"
                  style={{ width: `${totalProgress}%` }}
                />
              </div>
            </div>

            {/* Audio Mute/Unmute Indicator */}
            <button
              onClick={toggleMuteOnly}
              className="p-1.5 text-white/70 hover:text-[#C5A059] transition-colors"
              title={isMuted ? "Unmute Video Sound" : "Mute Video Sound"}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#C5A059]" />}
            </button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
