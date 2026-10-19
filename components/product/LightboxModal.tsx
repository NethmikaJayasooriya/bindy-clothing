"use client";

import { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

export interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  thumbnails?: string[];
  imageLabels?: string[];
  initialIndex?: number;
  productName: string;
}

export default function LightboxModal({ isOpen, onClose, images, thumbnails, imageLabels, initialIndex = 0, productName }: LightboxModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => { if (isOpen) { setCurrentIndex(initialIndex); setIsZoomed(false); } }, [initialIndex, isOpen]);
  useEffect(() => {
    if (!isOpen) { dialog.current?.close(); return; }
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    dialog.current?.showModal();
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    return () => { dialog.current?.close(); document.body.style.overflow = previousOverflow; previousFocus?.focus(); };
  }, [isOpen]);

  useEffect(() => {
    if (!isZoomed || !frame.current) return;
    const element = frame.current;
    element.scrollTo((element.scrollWidth - element.clientWidth) / 2, (element.scrollHeight - element.clientHeight) / 2);
  }, [isZoomed]);

  const select = (index: number) => { setIsZoomed(false); setCurrentIndex((index + images.length) % images.length); };

  return (
    <dialog ref={dialog} onCancel={(event) => { event.preventDefault(); onClose(); }} aria-label={`${productName} photo gallery`} className="fixed inset-0 m-0 h-[100dvh] max-h-none w-screen max-w-none border-0 bg-[#141e1b] p-0 text-white backdrop:bg-black/70" onKeyDown={(event) => {
      if (event.key === "ArrowLeft") { event.preventDefault(); select(currentIndex - 1); }
      if (event.key === "ArrowRight") { event.preventDefault(); select(currentIndex + 1); }
    }}>
      {isOpen && <>
        <header className="absolute inset-x-0 top-0 z-20 flex h-24 items-center justify-between gap-4 border-b border-white/10 px-5 sm:px-10">
          <div className="min-w-0">
            <p className="text-[9px] uppercase tracking-[.24em] text-[#dec9a6]">A closer look · {currentIndex + 1} / {images.length}</p>
            <h2 className="mt-1 truncate font-serif text-lg sm:text-2xl">{productName}</h2>
          </div>
          <div className="flex shrink-0 gap-2">
            <button onClick={() => setIsZoomed(!isZoomed)} aria-label={isZoomed ? "Zoom out" : "Zoom in"} aria-pressed={isZoomed} className="grid h-11 w-11 place-items-center rounded-full border border-white/25 hover:bg-white/10">{isZoomed ? <ZoomOut size={18}/> : <ZoomIn size={18}/>}</button>
            <button ref={closeButton} onClick={onClose} aria-label="Close lightbox" className="grid h-11 w-11 place-items-center rounded-full border border-white/25 hover:bg-white/10"><X size={20}/></button>
          </div>
        </header>
        <div ref={frame} className={`absolute inset-x-4 bottom-36 top-28 sm:inset-x-24 ${isZoomed ? "overflow-auto overscroll-contain" : "overflow-hidden"}`}>
          <div style={{ width: isZoomed ? "220%" : "100%", height: isZoomed ? "220%" : "100%" }}>
            <img key={images[currentIndex]} src={images[currentIndex]} alt={`${productName} — ${imageLabels?.[currentIndex] || `view ${currentIndex + 1}`}`} className={`h-full w-full object-contain ${isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`} onClick={() => setIsZoomed(!isZoomed)} />
          </div>
        </div>
        {images.length > 1 && <>
          <button onClick={() => select(currentIndex - 1)} aria-label="Previous image" className="absolute left-2 top-1/2 z-20 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-black/30 sm:left-7"><ChevronLeft size={20}/></button>
          <button onClick={() => select(currentIndex + 1)} aria-label="Next image" className="absolute right-2 top-1/2 z-20 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-black/30 sm:right-7"><ChevronRight size={20}/></button>
        </>}
        <div className="absolute inset-x-0 bottom-0 flex h-32 flex-col items-center justify-center gap-3 border-t border-white/10 px-4">
          <p aria-live="polite" className="text-[10px] tracking-wider text-white/75">{imageLabels?.[currentIndex] || `View ${currentIndex + 1}`}{isZoomed && " · Scroll to explore the detail"}</p>
          <div className="flex max-w-full gap-2 overflow-x-auto px-1 py-1">
            {images.map((src, index) => <button key={src} onClick={() => select(index)} aria-label={`Show ${imageLabels?.[index] || `view ${index + 1}`}`} aria-pressed={index === currentIndex} className={`h-16 w-12 shrink-0 overflow-hidden rounded border ${index === currentIndex ? "border-[#e1c9a4] ring-1 ring-[#e1c9a4]" : "border-white/20 opacity-60 hover:opacity-100"}`}><img src={thumbnails?.[index] || src} alt="" className="h-full w-full object-cover" loading="lazy"/></button>)}
          </div>
        </div>
      </>}
    </dialog>
  );
}
