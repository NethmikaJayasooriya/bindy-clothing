"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play, X } from "lucide-react";
import styles from "./EditorialHero.module.css";

const chapters = [
  { id: "together", name: "Together, always", label: "DIFFERENT STORIES. ONE BEAUTIFUL THREAD.", title: "Made for you.", italic: "All of you.", note: "Individual by nature. Connected by feeling.", image: "/images/campaign/together.webp", alt: "Four women wearing the collection beneath bougainvillea", position: "center 15%", mobile: "69% center", link: "/collection", film: "/videos/campaign/together.mp4" },
  { id: "coast", name: "The coast", label: "SALT IN THE AIR. SOFTNESS IN THE DETAILS.", title: "An island", italic: "state of mind.", note: "For sunlit days & unhurried moments.", image: "/images/campaign/coast.webp", alt: "Ivory lace separates on a sunlit tropical shoreline", position: "center 15%", mobile: "63% center", link: "/collection?parent=Resort%20Wear", film: "/videos/campaign/coast.mp4" },
  { id: "heritage", name: "The old streets", label: "OLD WORLD CHARM. YOUR OWN WAY.", title: "A little past.", italic: "A new story.", note: "Familiar places. A different point of view.", image: "/images/campaign/heritage.webp", alt: "Red gingham dress along terracotta archways and cobbled streets", position: "center 15%", mobile: "54% center", link: "/collection?parent=Dresses", film: "/videos/campaign/heritage.mp4" },
  { id: "highlands", name: "The highlands", label: "ROOTED IN NATURE. FREE IN SPIRIT.", title: "Find your", italic: "softer side.", note: "Earthy tones. Room to simply be.", image: "/images/campaign/highlands.webp", alt: "Olive green separates amid misty Sri Lankan tea hills", position: "center 15%", mobile: "64% center", link: "/product/tea-leaf-two-piece", film: "/videos/campaign/highlands.mp4" },
  { id: "blue", name: "The blue hour", label: "FOLLOW THE LIGHT. FEEL THE BREEZE.", title: "Lost in blue.", italic: "Found in you.", note: "Easy silhouettes, with an ocean of possibility.", image: "/images/campaign/blue.webp", alt: "Blue tiered dress beside white coastal walls and the ocean", position: "center 10%", mobile: "53% center", link: "/product/ocean-embraced-tiered-dress", film: "/videos/campaign/blue.mp4" },
];

export interface EditorialHeroProps {
  isSplashActive?: boolean;
  onExploreCollection: () => void;
}

export default function EditorialHero({
  isSplashActive = false,
  onExploreCollection,
}: EditorialHeroProps) {
  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(!isSplashActive);
  const [playing, setPlaying] = useState(true);
  const [readyScene, setReadyScene] = useState(chapters[0].id);
  const [visible, setVisible] = useState(true);
  const [filmOpen, setFilmOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const filmButtonRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const chapter = chapters[active];

  // Sync grand reveal with splash screen lift
  useEffect(() => {
    if (!isSplashActive) {
      setRevealed(true);
    } else {
      setRevealed(false);
    }
  }, [isSplashActive]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReducedMotion(media.matches);
      if (media.matches) setPlaying(false);
    };
    update();
    media.addEventListener("change", update);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.1 });
    if (heroRef.current) observer.observe(heroRef.current);
    const onVisibility = () =>
      setVisible(!document.hidden && Boolean(heroRef.current && heroRef.current.getBoundingClientRect().bottom > 0));
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      media.removeEventListener("change", update);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => {
    if (!playing || !visible || filmOpen || reducedMotion || !revealed) return;
    const timer = window.setTimeout(
      () => {
        setPrevious(active);
        setActive((active + 1) % chapters.length);
      },
      active === 0 ? 6500 : 5000
    );
    return () => window.clearTimeout(timer);
  }, [active, playing, visible, filmOpen, reducedMotion, revealed]);

  useEffect(() => {
    if (previous === null || readyScene !== chapters[active].id) return;
    const timer = window.setTimeout(() => setPrevious(null), 1200);
    return () => window.clearTimeout(timer);
  }, [previous, active, readyScene]);

  useEffect(() => {
    if (filmOpen) {
      dialogRef.current?.showModal();
      const overflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      videoRef.current?.play().catch(() => {});
      return () => {
        document.body.style.overflow = overflow;
      };
    }
  }, [filmOpen]);

  const select = (index: number) => {
    if (index !== active) {
      setPrevious(active);
      setActive(index);
    }
  };
  const closeFilm = () => {
    videoRef.current?.pause();
    dialogRef.current?.close();
    setFilmOpen(false);
    filmButtonRef.current?.focus();
  };

  return (
    <section
      ref={heroRef}
      className={`${styles.hero} ${revealed ? styles.grandReveal : styles.primed}`}
      data-chapter={chapter.id}
      aria-label="Serendipity campaign"
      data-campaign-hero
    >
      <div className={styles.background} aria-hidden="true">
        {previous !== null && (
          <Image
            data-group={chapters[previous].id === "together"}
            src={chapters[previous].image}
            alt=""
            fill
            sizes="(max-width: 700px) 180vh, 125vw"
            quality={95}
            className={styles.sceneImage}
            style={
              {
                "--scene-position": chapters[previous].position,
                "--mobile-position": chapters[previous].mobile,
              } as React.CSSProperties
            }
          />
        )}
        <div
          key={chapter.id}
          className={`${styles.scene} ${
            previous !== null
              ? readyScene === chapter.id
                ? styles.entering
                : styles.pending
              : ""
          }`}
        >
          <Image
            data-group={chapter.id === "together"}
            data-first={chapter.id === "together"}
            src={chapter.image}
            alt=""
            onLoad={() => setReadyScene(chapter.id)}
            fill
            priority={active === 0}
            sizes="(max-width: 700px) 180vh, 125vw"
            quality={95}
            className={styles.sceneImage}
            style={
              {
                "--scene-position": chapter.position,
                "--mobile-position": chapter.mobile,
              } as React.CSSProperties
            }
          />
        </div>
      </div>
      <div className={styles.shade} />
      {revealed && <div className={styles.introSheen} aria-hidden="true" />}
      <span className={styles.sideNote}>SRI LANKAN SOUL. A WORLD OF POSSIBILITY.</span>
      <div className={styles.content} key={`copy-${active}-${revealed}`}>
        <h1 className={styles.title}>
          <span className={styles.titleLead}>{chapter.title}</span>
          <em className={styles.titleItalic}>{chapter.italic}</em>
        </h1>
        <p className={styles.note}>{chapter.note}</p>
        <div className={styles.actions}>
          <button className={styles.shop} onClick={onExploreCollection}>
            <span>Explore the collection</span>
            <ArrowUpRight size={16} strokeWidth={1.8} className={styles.btnArrow} />
          </button>
          <Link href={chapter.link} className={styles.look}>
            <span>Discover this chapter</span>
            <ArrowUpRight size={14} strokeWidth={1.6} className={styles.btnArrow} />
          </Link>
        </div>
      </div>
    <button ref={filmButtonRef} className={styles.film} onClick={() => setFilmOpen(true)} aria-label={`Watch ${chapter.name.toLowerCase()} film`}>
      <span className={styles.filmImage}>
        <Image src={chapter.image} alt="" fill sizes="140px" quality={85} />
        <span className={styles.playCircle}>
          <Play size={13} fill="currentColor" strokeWidth={0} />
        </span>
      </span>
      <span className={styles.filmCopy}>
        <small className={styles.filmTag}>THE COLLECTION, IN MOTION</small>
        <span className={styles.filmTitle}>A moment with Bindy <ArrowUpRight size={13} /></span>
      </span>
    </button>
    <div className={styles.bottom}>
      <div className={styles.chapterHeading}>
        <span className={styles.chapterSubhead}>FIVE CHAPTERS. ONE FEELING.</span>
        <div className={styles.chapterCounter}>
          <span className={styles.counterCurrent}>0{active + 1}</span>
          <span className={styles.counterDivider}>/</span>
          <span className={styles.counterTotal}>05</span>
        </div>
      </div>
      <div className={styles.chapterRow}>
        <div className={styles.chapters} aria-label="Campaign chapters">
          {chapters.map((item, index) => (
            <button
              key={item.id}
              onClick={() => select(index)}
              aria-pressed={active === index}
              aria-label={`Show ${item.name.toLowerCase()}`}
              className={`${styles.chapterTab} ${active === index ? styles.selected : ""}`}
            >
              <span className={styles.chapterTrack}>
                <span
                  key={`${active}-${playing}`}
                  className={playing && visible && !filmOpen && !reducedMotion && active === index ? styles.progress : ""}
                />
              </span>
              <span className={styles.chapterName}>
                <small className={styles.chapterNum}>0{index + 1}</small>
                <span className={styles.chapterText}>{item.name}</span>
              </span>
            </button>
          ))}
        </div>
        <div className={styles.controls}>
          <button aria-label="Previous chapter" onClick={() => select((active + 4) % 5)} className={styles.ctrlBtn}>
            <ChevronLeft size={18} />
          </button>
          {!reducedMotion && (
            <button
              aria-label={playing ? "Pause chapters" : "Play chapters"}
              aria-pressed={playing}
              onClick={() => setPlaying(!playing)}
              className={styles.ctrlBtn}
            >
              {playing ? <Pause size={13} /> : <Play size={13} />}
            </button>
          )}
          <button aria-label="Next chapter" onClick={() => select((active + 1) % 5)} className={styles.ctrlBtn}>
            <ChevronRight size={18} />
          </button>
          <button className={styles.scroll} aria-label="Scroll to collection" onClick={onExploreCollection}>
            <ArrowDown size={17} />
          </button>
        </div>
      </div>
    </div>
    <span className={styles.srOnly} aria-live="polite">{chapter.name}. {chapter.alt}</span>
    <dialog ref={dialogRef} className={styles.filmDialog} aria-label={`${chapter.name} campaign film`} onCancel={closeFilm} onClose={() => setFilmOpen(false)} onClick={event => { if (event.target === event.currentTarget) closeFilm(); }}>
      <div className={styles.filmHeader}><span>bindy. <small>{chapter.name} / In motion</small></span><button aria-label="Close campaign film" onClick={closeFilm}><X size={24}/></button></div>
      {filmOpen && <video ref={videoRef} src={chapter.film} controls playsInline autoPlay preload="metadata" className={styles.player} />}
    </dialog>
  </section>
);
}
