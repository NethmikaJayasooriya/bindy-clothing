"use client";

import { useEffect, useRef, useState } from "react";
import Image from "@/components/ResponsiveImage";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useStorefront } from "@/components/StorefrontProvider";
import { DEFAULT_HERO } from "@/lib/store-types";
import styles from "./EditorialHero.module.css";


export interface EditorialHeroProps { isSplashActive?: boolean; onExploreCollection: () => void; }

export default function EditorialHero({ isSplashActive = false, onExploreCollection }: EditorialHeroProps) {
  const { hero } = useStorefront();
  const chapters = hero.length ? hero : DEFAULT_HERO;
  const [active, setActive] = useState(0);
  const [photoReady, setPhotoReady] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const chapter = chapters[active % chapters.length];
  useEffect(() => { setActive(v => v % chapters.length); }, [chapters.length]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { setReducedMotion(media.matches); if (media.matches) setPlaying(false); };
    update(); media.addEventListener("change", update);
    let inView = true;
    const sync = () => setVisible(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); }, { threshold: .15 });
    if (heroRef.current) observer.observe(heroRef.current);
    document.addEventListener("visibilitychange", sync);
    return () => { observer.disconnect(); media.removeEventListener("change", update); document.removeEventListener("visibilitychange", sync); };
  }, []);

  useEffect(() => {
    if (!playing || !visible || reducedMotion || isSplashActive) return;
    const timer = window.setTimeout(() => setActive((value) => (value + 1) % chapters.length), active === 0 ? 6000 : 5000);
    return () => window.clearTimeout(timer);
  }, [active, playing, visible, reducedMotion, isSplashActive, chapters.length]);

  return (
    <section ref={heroRef} className={styles.hero} data-campaign-hero aria-roledescription="carousel" aria-label="The BINDY real life edit">
      <div className={styles.photographs}>
        {chapters.map((item, index) => (
          <div key={item.id} className={`${styles.scene} ${index === active ? styles.activeScene : ""}`} aria-hidden={index !== active}>
            {(index === active || (photoReady && index === (active + 1) % chapters.length)) && <Image src={item.image} alt={item.alt} loading={index === active ? "eager" : "lazy"} fetchPriority={index === active ? "high" : "low"} onLoad={() => { if(index === active) setPhotoReady(true); }} sizes="100vw" className={`absolute inset-0 h-full w-full ${styles.sceneImage}`} style={{ "--position": item.position, "--mobile-position": item.mobile } as React.CSSProperties} />}
          </div>
        ))}
        <span className={styles.photoNote}>A BINDY MOMENT. BEAUTIFULLY YOURS.</span>
        <Link className={styles.photoLink} href={chapter.link}><span>{chapter.product}</span><ArrowUpRight size={16} strokeWidth={1.4} /></Link>
      </div>
      <div className={`${styles.content} ${isSplashActive ? styles.primed : ""}`} key={chapter.id}>
        <p className={styles.eyebrow}><span />{chapter.label}</p>
        <h1 className={styles.title}><span className={styles.titleLead}>{chapter.title}</span><span className={styles.titleFinish}>{chapter.italic}</span></h1>
        <p className={styles.note}>{chapter.note}</p>
        <button className={styles.shop} onClick={onExploreCollection}><span>Explore the collection</span><ArrowUpRight size={17} strokeWidth={1.5} /></button>
      </div>
      <div className={styles.bottom}>
        <div className={styles.edition}><span>01 — THE REAL LIFE EDIT</span><small>SRI LANKA ↔ AUSTRALIA</small></div>
        <div className={styles.navigation}>
          <div className={styles.chapters} aria-label="Campaign chapters">
            {chapters.map((item, index) => (
              <button key={item.id} onClick={() => setActive(index)} aria-pressed={active === index} aria-label={`Show ${item.name.toLowerCase()}`} className={`${styles.chapter} ${active === index ? styles.selected : ""}`}>
                <span className={styles.track}><span key={`${active}-${playing}-${visible}-${isSplashActive}`} className={active === index && playing && visible && !reducedMotion && !isSplashActive ? styles.progress : ""} style={{ animationDuration: `${active === 0 ? 6 : 5}s` }} /></span>
                <span className={styles.chapterName}><small>0{index + 1}</small>{item.name}</span>
              </button>
            ))}
          </div>
          <div className={styles.controls}>
            <button aria-label="Previous chapter" onClick={() => setActive((active + chapters.length - 1) % chapters.length)}><ChevronLeft size={17} /></button>
            <button aria-label={playing ? "Pause chapters" : "Play chapters"} aria-pressed={playing} onClick={() => setPlaying(!playing)}>{playing ? <Pause size={12} /> : <Play size={12} />}</button>
            <button aria-label="Next chapter" onClick={() => setActive((active + 1) % chapters.length)}><ChevronRight size={17} /></button>
            <button aria-label="Scroll to collection" className={styles.scroll} onClick={onExploreCollection}><ArrowDown size={16} /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
