"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useStorefront } from "@/components/StorefrontProvider";
import type { Category, Product } from "@/data/products";
import { DEFAULT_DISCOVERY } from "@/lib/home-discovery";
import DiscoveryImage from "./DiscoveryImage";
import styles from "./WardrobeDiscovery.module.css";

interface Props { activeCategory: Category | "All"; onSelectCategory: (category: Category | "All") => void; availableProducts?: Product[] }
export default function CategoryStoryBar({ activeCategory, onSelectCategory, availableProducts }: Props) {
  const store = useStorefront();
  const content = store.discovery ?? DEFAULT_DISCOVERY;
  const products = availableProducts ?? store.products;
  const rail = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const syncEdges = useCallback(() => {
    const el = rail.current; if (!el) return;
    const start = el.scrollLeft < 2, end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
    setEdges(current => current.start === start && current.end === end ? current : { start, end });
  }, []);
  useEffect(() => { const el = rail.current; if (!el) return; const observer = new ResizeObserver(syncEdges); observer.observe(el); syncEdges(); return () => observer.disconnect(); }, [syncEdges]);
  const move = (direction: number) => { const el = rail.current; if (el) el.scrollBy({ left: direction * (el.clientWidth * .8), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); };
  return <section className={styles.categorySection} aria-label="Shop by category">
    <div className={styles.categoryHeading}>
      <div><p className={styles.eyebrow}>FIND YOUR EVERYDAY</p><h2>{content.categoryHeading}</h2></div>
      <div className={styles.categoryActions}>
        <button type="button" className={styles.all} aria-pressed={activeCategory === "All"} onClick={() => onSelectCategory("All")}>View all {products.length} pieces</button>
        <div className={styles.railControls}>
          <button type="button" className={styles.railArrow} disabled={edges.start} aria-label="Previous categories" onClick={() => move(-1)}><ArrowLeft size={16}/></button>
          <button type="button" className={styles.railArrow} disabled={edges.end} aria-label="Next categories" onClick={() => move(1)}><ArrowRight size={16}/></button>
        </div>
      </div>
    </div>
    <div ref={rail} className={styles.rail} onScroll={syncEdges}>
      {content.categories.map(story => {
        const count = products.filter(p => p.category === story.category).length;
        const selected = activeCategory === story.category;
        return <button type="button" key={story.category} className={styles.category} disabled={!count} aria-label={`Shop ${story.category} (${count} pieces)`} aria-pressed={selected} onClick={() => onSelectCategory(story.category)}>
          <DiscoveryImage src={story.image} alt={story.alt} sizes="(max-width: 700px) 76vw, (max-width: 1000px) 32vw, (max-width: 1600px) 25vw, 390px" className={styles.categoryImage}/>
          <span className={styles.categoryShade}/>{selected && <span className={styles.categorySelected}><Check size={15}/></span>}
          <span className={styles.categoryCopy}><span className={styles.categoryName}>{story.category === "Two Piece Sets" ? "Matching sets" : story.category}</span><span className={styles.categoryShop}>Shop now · {count} pieces</span></span>
        </button>;
      })}
    </div>
  </section>;
}
