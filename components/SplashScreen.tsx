"use client";

import React, { useEffect, useRef } from "react";
import { BUTTON_SOURCES } from "@/lib/splash-buttons";
import styles from "./SplashScreen.module.css";

interface SplashScreenProps {
  onComplete: () => void;
  onLift?: () => void;
}

const TIMING = {
  entranceDelay: 550, // after the logo fades in
  fall: 650,
  hop: 550,
  toPeriod: 550,
  sink: 400,
  stagger: 300,
  hold: 250, // pause on the finished logo before leaving
};

const FAILSAFE_MS = 8500;
const CONTACT = 100;
const HOP_H = 1.4;
const NEST = 0.2;
const SPRING_K = 170;
const SPRING_C = 9.1;
const IMPULSE = 7.8;
const REF_SPEED = 12.2;

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function wait(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export default function SplashScreen({ onComplete, onLift }: SplashScreenProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const buttonsLayerRef = useRef<HTMLDivElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const periodRef = useRef<HTMLSpanElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);

  const callbacks = useRef({ onComplete, onLift });
  callbacks.current = { onComplete, onLift };

  useEffect(() => {
    let active = true;
    let rafId: number | null = null;
    let failsafeTimer: ReturnType<typeof setTimeout> | null = null;
    let ended = false;
    let leaving = false;
    let periodFilled = false;

    const stage = stageRef.current;
    const buttonsLayer = buttonsLayerRef.current;
    const logoWrap = logoWrapRef.current;
    const periodEl = periodRef.current;
    const letters = lettersRef.current.filter((el): el is HTMLSpanElement => el !== null);
    const startWidth = window.innerWidth;

    if (!stage || !buttonsLayer || !logoWrap || !periodEl || letters.length === 0) {
      callbacks.current.onLift?.();
      callbacks.current.onComplete();
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function fillPeriod() {
      if (periodFilled) return;
      periodFilled = true;
      periodEl?.classList.add(styles.filled);
    }

    function leave(fast = false) {
      if (leaving || !active) return;
      leaving = true;
      callbacks.current.onLift?.();
      if (fast || reduced) {
        callbacks.current.onComplete();
        return;
      }
      stage?.classList.add(styles.leaving);
      setTimeout(() => {
        if (active) callbacks.current.onComplete();
      }, 350);
    }

    function finish(reason: string) {
      if (ended || !active) return;
      ended = true;
      if (failsafeTimer) clearTimeout(failsafeTimer);
      if (rafId) cancelAnimationFrame(rafId);
      logoWrap?.classList.add(styles.in);
      fillPeriod();
      if (buttonsLayer) buttonsLayer.textContent = "";
      if (reason === "done") {
        setTimeout(() => leave(false), reduced ? 1200 : TIMING.hold);
      } else if (reason === "skip") {
        leave(true);
      } else {
        setTimeout(() => leave(false), 250);
      }
    }

    function restart(el: HTMLElement, cls: string) {
      if (!cls) return;
      el.classList.remove(cls);
      void el.getBoundingClientRect();
      el.classList.add(cls);
    }

    function inkTops(size: number) {
      const cs = getComputedStyle(letters[0]);
      const fs = parseFloat(cs.fontSize) || 72;
      const wt = cs.fontWeight || "800";
      const fallback = fs * 0.25;
      try {
        const probe = document.createElement("div");
        probe.style.cssText = `position:absolute;left:0;top:0;visibility:hidden;white-space:nowrap;line-height:1;font-family:'League Spartan',sans-serif;font-weight:${wt};font-size:${fs}px`;
        probe.innerHTML = '<span style="display:inline-block;width:0;height:0"></span>b';
        stage?.appendChild(probe);
        const baseline = (probe.firstChild as HTMLElement).getBoundingClientRect().bottom - probe.getBoundingClientRect().top;
        stage?.removeChild(probe);

        const W = Math.ceil(fs * 1.3);
        const H = Math.ceil(fs * 1.6);
        const base = Math.round(fs * 1.2);
        const c = document.createElement("canvas");
        c.width = W;
        c.height = H;
        const g = c.getContext("2d", { willReadFrequently: true });
        if (!g) return letters.map(() => fallback);
        g.font = `${wt} ${fs}px "League Spartan", "Helvetica Neue", Arial, sans-serif`;
        g.textBaseline = "alphabetic";
        g.fillStyle = "#000";

        return letters.map((el) => {
          g.clearRect(0, 0, W, H);
          g.fillText(el.textContent || "", 0, base);
          const cx = el.getBoundingClientRect().width / 2;
          const half = Math.max(2, size * 0.3);
          const x0 = Math.max(0, Math.floor(cx - half));
          const w = Math.max(1, Math.min(W - x0, Math.ceil(half * 2)));
          const d = g.getImageData(x0, 0, w, H).data;
          for (let y = 0; y < H; y++) {
            for (let x = 0; x < w; x++) {
              if (d[(y * w + x) * 4 + 3] > 60) return baseline - (base - y);
            }
          }
          return fallback;
        });
      } catch {
        return letters.map(() => fallback);
      }
    }

    function measure() {
      if (!stage || !periodEl) return null;
      const s = stage.getBoundingClientRect();
      const size = Math.min(48, Math.max(20, window.innerWidth * 0.046));
      const tops = inkTops(size);
      function rel(el: HTMLElement) {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2 - s.left, top: r.top - s.top, h: r.height };
      }
      const ls = letters.map((el, i) => {
        const r = rel(el);
        return { ...r, gt: tops[i] };
      });
      return { size, letters: ls, period: rel(periodEl) };
    }

    function simulate(layout: NonNullable<ReturnType<typeof measure>>, sources: string[]) {
      return new Promise<void>((resolve) => {
        const size = layout.size;
        const H = size * HOP_H;
        const L = layout.letters;
        const P = layout.period;
        const n = L.length;
        const total = sources.length;
        const st = L.map(() => ({ q: 0, v: 0 }));
        const btns: any[] = [];
        let finished = 0;
        let resolved = false;
        const T0 = performance.now();
        let last = T0;

        function inkTop(i: number) {
          const sy = 1 - st[i].q;
          const p = 0.29 * st[i].q;
          return L[i].top + L[i].h + sy * (L[i].gt - L[i].h + p * L[i].h);
        }
        function restY(i: number) {
          return inkTop(i) - size * (1 - NEST);
        }
        const periodY = P.top + P.h / 2 - size / 2;

        function hit(i: number, speed: number) {
          const k = clamp(speed / (REF_SPEED * size), 0.4, 1.5);
          st[i].v += IMPULSE * k;
        }

        function place(b: any, cx: number, y: number) {
          b.pos.style.transform = `translate3d(${cx - size / 2}px,${y}px,0)`;
        }
        function pose(b: any, deg: number, sx: number, sy: number) {
          b.lift.style.transform = `rotate(${deg}deg) scale(${sx},${sy})`;
        }
        function shade(b: any, k: number) {
          b.shadow.style.opacity = (0.16 + 0.34 * k).toFixed(3);
          b.shadow.style.transform = `translateX(-50%) scale(${(0.48 + 0.52 * k).toFixed(3)})`;
        }

        function build(b: any, now: number) {
          const pos = document.createElement("div");
          pos.className = styles.btnPos;

          const shadow = document.createElement("div");
          shadow.className = styles.btnShadow;

          const lift = document.createElement("div");
          lift.className = styles.btnLift;

          const img = document.createElement("img");
          img.className = styles.btnImg;
          img.alt = "";
          img.src = sources[b.i];

          lift.appendChild(img);
          pos.appendChild(shadow);
          pos.appendChild(lift);
          buttonsLayer?.appendChild(pos);

          b.pos = pos;
          b.lift = lift;
          b.img = img;
          b.shadow = shadow;
          b.dir = 1;
          b.idx = 0;
          b.y0 = -(size + 60);
          place(b, L[0].x, b.y0);
          b.phase = "fall";
          b.t0 = now;
        }

        function land(b: any, i: number, speed: number, now: number) {
          b.idx = i;
          hit(i, speed);
          restart(b.img, styles.impact);
          b.phase = "contact";
          b.t0 = now;
        }

        function launch(b: any, now: number) {
          const isLast = b.idx === n - 1;
          b.fx = L[b.idx].x;
          b.fy = restY(b.idx);
          b.tx = isLast ? P.x : L[b.idx + 1].x;
          b.toPeriod = isLast;
          b.dur = (isLast ? TIMING.toPeriod : TIMING.hop) - CONTACT;
          b.phase = "air";
          b.t0 = now;
        }

        function step(b: any, now: number) {
          let t: number;
          if (b.phase === "idle") {
            if (now - T0 < b.i * TIMING.stagger) return;
            build(b, now);
          }
          if (b.phase === "fall") {
            t = (now - b.t0) / TIMING.fall;
            const y1 = restY(0);
            if (t >= 1) {
              land(b, 0, ((2 * (y1 - b.y0)) / TIMING.fall) * 1000, now);
              t = 1;
            }
            const y = lerp(b.y0, y1, t * t);
            place(b, L[0].x, y);
            const sy = t < 0.72 ? 1 + 0.2 * (t / 0.72) : 1 + 0.2 * (1 - (t - 0.72) / 0.28);
            pose(b, 0, Math.pow(sy, -0.76), sy);
            shade(b, t);
            b.shadow.style.opacity = (0.5 * t).toFixed(3);
          } else if (b.phase === "contact") {
            t = (now - b.t0) / CONTACT;
            place(b, L[b.idx].x, restY(b.idx));
            pose(b, 0, 1, 1);
            shade(b, 1);
            if (t >= 1) launch(b, now);
          } else if (b.phase === "air") {
            t = clamp((now - b.t0) / b.dur, 0, 1);
            const ty = b.toPeriod ? periodY : restY(b.idx + 1);
            const line = lerp(b.fy, ty, t);
            const yy = line - 4 * H * t * (1 - t);
            place(b, lerp(b.fx, b.tx, t), yy);
            pose(b, b.dir * 360 * t, 1, 1);
            shade(b, 1 - clamp((line - yy) / H, 0, 1));
            if (t >= 1) {
              if (b.toPeriod) {
                fillPeriod();
                b.img.style.transition = `transform ${TIMING.sink}ms cubic-bezier(.22,1,.36,1), opacity ${TIMING.sink}ms ease`;
                b.img.style.transform = "scale(.15)";
                b.img.style.opacity = "0";
                b.phase = "sink";
                b.t0 = now;
              } else {
                land(b, b.idx + 1, ((ty - b.fy + 4 * H) / b.dur) * 1000, now);
              }
            }
          } else if (b.phase === "sink") {
            if (now - b.t0 >= TIMING.sink) {
              b.pos.remove();
              b.phase = "done";
              finished++;
            }
          }
        }

        for (let i = 0; i < total; i++) btns.push({ i, phase: "idle" });

        function tick(now: number) {
          if (!active || ended) {
            letters.forEach((el) => {
              el.style.transform = "";
            });
            return;
          }
          const dt = Math.min(0.033, (now - last) / 1000);
          last = now;

          const h = dt / 2;
          for (let s2 = 0; s2 < 2; s2++) {
            for (let k = 0; k < n; k++) {
              const a = -SPRING_K * st[k].q - SPRING_C * st[k].v;
              st[k].v += a * h;
              st[k].q = clamp(st[k].q + st[k].v * h, -0.15, 0.6);
            }
          }
          for (let m = 0; m < n; m++) {
            letters[m].style.transform = `scale(${(1 + 0.37 * st[m].q).toFixed(4)},${(1 - st[m].q).toFixed(4)}) translateY(${(29 * st[m].q).toFixed(3)}%)`;
          }

          for (let j = 0; j < total; j++) {
            if (btns[j].phase !== "done") step(btns[j], now);
          }

          if (finished === total && !resolved) {
            resolved = true;
            resolve();
            return;
          }
          rafId = requestAnimationFrame(tick);
        }
        rafId = requestAnimationFrame(tick);
      });
    }

    async function play() {
      const decoded = BUTTON_SOURCES.map((src) => {
        const im = new Image();
        im.src = src;
        return im.decode ? im.decode().catch(() => {}) : Promise.resolve();
      });
      await Promise.race([
        Promise.all([document.fonts ? document.fonts.ready : Promise.resolve(), ...decoded]),
        wait(1500),
      ]);
      if (!active || ended) return;
      logoWrap?.classList.add(styles.in);
      await wait(TIMING.entranceDelay);
      if (!active || ended) return;

      const layout = measure();
      if (layout && active && !ended) {
        await simulate(layout, BUTTON_SOURCES);
      }
      finish("done");
    }

    failsafeTimer = setTimeout(() => {
      finish("failsafe");
    }, FAILSAFE_MS);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        finish("skip");
      }
    };
    document.addEventListener("keydown", onKeyDown);

    const onResize = () => {
      if (!ended && Math.abs(window.innerWidth - startWidth) > 40) {
        finish("resize");
      }
    };
    window.addEventListener("resize", onResize);

    if (reduced) {
      logoWrap?.classList.add(styles.in);
      fillPeriod();
      ended = true;
      setTimeout(() => leave(false), 1200);
    } else {
      play().catch(() => finish("failsafe"));
    }

    return () => {
      active = false;
      ended = true;
      if (failsafeTimer) clearTimeout(failsafeTimer);
      if (rafId) cancelAnimationFrame(rafId);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className={styles.splash}
      onClick={() => {
        callbacks.current.onLift?.();
        callbacks.current.onComplete();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="bindy clothing"
    >
      <div ref={buttonsLayerRef} className={styles.buttonsLayer} aria-hidden="true" />

      <div ref={logoWrapRef} className={styles.logoWrap}>
        <div className={styles.wordmark} role="img" aria-label="bindy clothing">
          {["b", "i", "n", "d", "y"].map((char, index) => (
            <span
              key={char + index}
              ref={(el) => {
                lettersRef.current[index] = el;
              }}
              className={styles.letter}
              aria-hidden="true"
            >
              {char}
            </span>
          ))}
          <span ref={periodRef} className={styles.period} aria-hidden="true" />
        </div>
        <div className={styles.subline} aria-hidden="true">
          clothing
        </div>
      </div>

      <button
        type="button"
        className={styles.skip}
        onClick={(e) => {
          e.stopPropagation();
          callbacks.current.onLift?.();
          callbacks.current.onComplete();
        }}
      >
        skip
      </button>
    </div>
  );
}
