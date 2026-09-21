"use client";

import React, { useEffect, useRef } from "react";
import styles from "./SplashScreen.module.css";

interface SplashScreenProps {
  onComplete: () => void;
  onLift?: () => void;
}

const BUTTONS = [
  "/images/splash/button-1.webp",
  "/images/splash/button-2.webp",
  "/images/splash/button-3.webp",
  "/images/splash/button-4.webp",
];

const TIMING = {
  entranceDelay: 850,
  fall: 640,
  hop: 560,
  toPeriod: 520,
  sink: 400,
  stagger: 360,
};

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export default function SplashScreen({ onComplete, onLift }: SplashScreenProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const periodRef = useRef<HTMLSpanElement>(null);
  const threadRef = useRef<HTMLSpanElement>(null);
  const letterRefs = useRef<HTMLSpanElement[]>([]);
  const started = useRef(false);
  const finished = useRef(false);
  const skipRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const root = rootRef.current!;
    const layer = layerRef.current!;
    const logo = logoRef.current!;
    const wordmark = wordmarkRef.current!;
    const period = periodRef.current!;
    const thread = threadRef.current!;
    const letters = letterRefs.current.filter(Boolean);

    let periodFilled = false;
    let landedInPeriod = 0; // dot reveals only after the LAST button lands

    const rel = (el: Element, host: DOMRect) => {
      const r = el.getBoundingClientRect();
      return { centerX: r.left + r.width / 2 - host.left, top: r.top - host.top, height: r.height };
    };
    const restart = (el: HTMLElement, cls: string) => {
      el.classList.remove(cls);
      void el.offsetWidth;
      el.classList.add(cls);
    };
    const growThread = (toIndex: number) => {
      const wm = wordmark.getBoundingClientRect();
      const target = toIndex < 0 ? period : letters[toIndex];
      const r = target.getBoundingClientRect();
      thread.style.width = Math.max(0, r.left + r.width / 2 - wm.left) + "px";
    };
    const fillPeriod = () => {
      if (periodFilled) return;
      periodFilled = true;
      period.classList.add(styles.filled);
      growThread(-1);
    };

    const fallTo = (pos: HTMLElement, y: number, dur: number) =>
      new Promise<void>((res) => {
        pos.style.setProperty("--fall-dur", dur + "ms");
        // heavier gravity: slow release, hard acceleration into the letter
        pos.style.transition = `top ${dur}ms cubic-bezier(.64,.02,.9,.34)`;
        pos.classList.add(styles.falling);
        requestAnimationFrame(() => { pos.style.top = y + "px"; });
        setTimeout(() => { pos.classList.remove(styles.falling); res(); }, dur);
      });
    const hopTo = (pos: HTMLElement, x: number, y: number, dur: number) =>
      new Promise<void>((res) => {
        pos.style.setProperty("--hop-dur", dur + "ms");
        pos.style.transition = `left ${dur}ms cubic-bezier(.65,0,.35,1), top ${dur}ms cubic-bezier(.65,0,.35,1)`;
        restart(pos, styles.hopArc);
        requestAnimationFrame(() => { pos.style.left = x + "px"; pos.style.top = y + "px"; });
        setTimeout(() => { pos.classList.remove(styles.hopArc); res(); }, dur);
      });
    const sink = (img: HTMLElement, dur: number) =>
      new Promise<void>((res) => {
        img.style.transition = `transform ${dur}ms cubic-bezier(.22,1,.36,1), opacity ${dur}ms ease`;
        requestAnimationFrame(() => { img.style.transform = "scale(.15)"; img.style.opacity = "0"; });
        setTimeout(res, dur);
      });
    const imgReady = (img: HTMLImageElement) =>
      img.complete && img.naturalWidth
        ? Promise.resolve()
        : new Promise<void>((res) => { img.onload = () => res(); img.onerror = () => res(); });

    async function runButton(src: string, index: number) {
      const pos = document.createElement("div");
      pos.className = styles.btnPos;
      pos.style.setProperty("--spin-dir", index % 2 === 0 ? "1" : "-1");
      const lift = document.createElement("div");
      lift.className = styles.btnLift;
      const img = document.createElement("img");
      img.className = styles.btnImg;
      img.src = src; img.alt = "";
      const shadow = document.createElement("div");
      shadow.className = styles.btnShadow;
      lift.appendChild(img);
      pos.appendChild(shadow);
      pos.appendChild(lift);
      layer.appendChild(pos);

      await imgReady(img);
      if (finished.current) return;

      const host = root.getBoundingClientRect();
      const lr = letters.map((l) => rel(l, host));
      const pr = rel(period, host);
      const btnW = img.getBoundingClientRect().width;
      const btnH = img.getBoundingClientRect().height || btnW;
      // land on the ACTUAL glyph top of each letter. x-height letters (n, y) have
      // no ascender, so their glyph sits lower — drop the button down onto them
      // instead of floating at the tall-letter line.
      const fs = parseFloat(getComputedStyle(letters[0]).fontSize) || btnH * 3;
      const CAP_GAP = fs * 0.14; // box-top -> top of tall glyphs (b, d, i)
      const X_DROP = fs * 0.25;  // extra drop so buttons rest on n / y
      const word = "bindy";
      const landY = (i: number) => {
        const short = word[i] === "n" || word[i] === "y";
        const glyphTop = lr[i].top + CAP_GAP + (short ? X_DROP : 0);
        return glyphTop - btnH * 0.9;
      };
      const place = (cx: number, ty: number) => { pos.style.left = cx - btnW / 2 + "px"; pos.style.top = ty + "px"; };

      pos.style.transition = "none";
      place(lr[0].centerX, -(btnH + 60));
      void pos.offsetWidth;

      await fallTo(pos, landY(0), TIMING.fall);
      if (finished.current) { pos.remove(); return; }
      restart(letters[0], styles.squish); restart(img, styles.impact); growThread(0);

      for (let i = 1; i < letters.length; i++) {
        if (finished.current) { pos.remove(); return; }
        await hopTo(pos, lr[i].centerX, landY(i), TIMING.hop);
        restart(letters[i], styles.squish); restart(img, styles.impact); growThread(i);
      }

      await hopTo(pos, pr.centerX, pr.top + pr.height * 0.5 - btnH * 0.3, TIMING.toPeriod);
      // the dot is only revealed once the FINAL button has dropped into the period
      landedInPeriod += 1;
      if (landedInPeriod >= BUTTONS.length) fillPeriod();
      await sink(img, TIMING.sink);
      pos.remove();
    }

    async function finish(fast = false) {
      if (finished.current) return;
      finished.current = true;
      fillPeriod();
      logo.classList.add(styles.done);
      try { sessionStorage.setItem("bindy-splash-seen", "1"); } catch {}
      await wait(fast ? 200 : 850);
      onLift?.();
      root.classList.add(styles.lift);
      await wait(fast ? 450 : 750);
      onComplete();
    }
    skipRef.current = () => finish(true);

    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" || e.key === "Enter") finish(true); };
    window.addEventListener("keydown", onKey);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    async function play() {
      if (document.fonts?.ready) { try { await document.fonts.ready; } catch {} }
      await wait(60);
      logo.classList.add(styles.in);

      if (reduced) { await wait(520); finish(); return; }

      await wait(TIMING.entranceDelay);
      const runs: Promise<void>[] = [];
      for (let i = 0; i < BUTTONS.length; i++) {
        if (finished.current) break;
        runs.push(runButton(BUTTONS[i], i));
        if (i < BUTTONS.length - 1) await wait(TIMING.stagger);
      }
      await Promise.all(runs);
      finish();
    }

    play();
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLetter = (i: number) => (el: HTMLSpanElement | null) => { if (el) letterRefs.current[i] = el; };

  return (
    <div ref={rootRef} className={styles.splash}>
      <div ref={layerRef} className={styles.buttonsLayer} />

      <div ref={logoRef} className={styles.logoWrap}>
        <div ref={wordmarkRef} className={styles.wordmark}>
          {["b", "i", "n", "d", "y"].map((ch, i) => (
            <span key={ch} ref={setLetter(i)} className={styles.letter}>{ch}</span>
          ))}
          <span ref={periodRef} className={styles.period} />
          <span ref={threadRef} className={styles.thread} />
          <span className={styles.sheen} />
        </div>
        <div className={styles.subline}>clothing</div>
        <div className={styles.tagline}>Two Islands. One Thread.</div>
      </div>

      <button type="button" className={styles.skip} onClick={() => skipRef.current()}>
        Skip intro
      </button>

      <div className={styles.origin}>
        <span>Designed in Australia</span><b>•</b><span>Inspired by Sri Lanka</span>
      </div>
    </div>
  );
}
