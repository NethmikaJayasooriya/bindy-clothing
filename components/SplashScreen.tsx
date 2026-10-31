"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { SPLASH_ASSET_WAIT_MS, SPLASH_FADE_MS, SPLASH_HOLD_MS } from "@/lib/splash-timing";
import styles from "./SplashScreen.module.css";
interface SplashScreenProps { onComplete: () => void; onLift?: () => void }
export default function SplashScreen({ onComplete, onLift }: SplashScreenProps) {
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const skip = useRef<HTMLButtonElement>(null);
  const callbacks = useRef({ onComplete, onLift });
  callbacks.current = { onComplete, onLift };
  const done = useRef(false), lifted = useRef(false);
  function lift() { if (!lifted.current) { lifted.current = true; callbacks.current.onLift?.(); } }
  function complete() { if (done.current) return; done.current = true; lift(); callbacks.current.onComplete(); }

  useEffect(() => {
    let cancelled = false;
    root.current?.focus({ preventScroll: true });
    // Start the visual timeline after its actual artwork and fonts are ready.
    // Bound the wait so an unavailable asset cannot trap visitors in the intro.
    let timeout: ReturnType<typeof setTimeout>;
    const assets = [...(root.current?.querySelectorAll("img") ?? [])].map(image => image.decode().catch(() => {}));
    const bounded = new Promise<void>(resolve => { timeout = setTimeout(resolve, SPLASH_ASSET_WAIT_MS); });
    Promise.race([Promise.all([document.fonts.ready, ...assets]), bounded]).then(() => {
      clearTimeout(timeout);
      if (!cancelled) setReady(true);
    });
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter") { event.preventDefault(); complete(); }
      if (event.key === "Tab") { event.preventDefault(); skip.current?.focus({ preventScroll: true }); }
    };
    window.addEventListener("keydown", key);
    return () => { cancelled = true; clearTimeout(timeout); window.removeEventListener("keydown", key); };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const hold = setTimeout(() => { setLeaving(true); lift(); }, SPLASH_HOLD_MS);
    const finish = setTimeout(complete, SPLASH_HOLD_MS + SPLASH_FADE_MS);
    return () => { clearTimeout(hold); clearTimeout(finish); };
  }, [ready]);

  return <div ref={root} tabIndex={-1} role="dialog" aria-modal="true" data-splash-screen data-ready={ready} className={`${styles.splash} ${leaving ? styles.lift : ""}`} aria-label="BINDY introduction" style={{ "--fade-duration": `${SPLASH_FADE_MS}ms` } as CSSProperties}>
    <div className={styles.logoWrap} aria-hidden="true">
      <div className={styles.wordmark}>
        <span className={styles.brand}>bindy<span className={styles.period}>.</span></span>
        {[1, 2, 3, 4].map((n) => <span key={n} className={styles.button} style={{ "--button-index": n - 1 } as CSSProperties}><img src={`/images/splash/button-${n}.webp`} width="58" height="58" alt="" decoding="async" loading="eager"/></span>)}
      </div>
      <div className={styles.subline}>clothing</div>
      <p className={styles.tagline}>Two Islands. One Thread.</p>
    </div>
    <button ref={skip} type="button" className={styles.skip} onClick={complete}>Skip intro</button>
    <div className={styles.origin}>Designed in Australia <span>·</span> Inspired by Sri Lanka</div>
  </div>;
}
