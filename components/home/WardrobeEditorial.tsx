"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/data/products";
import { useStorefront } from "@/components/StorefrontProvider";
import { DEFAULT_DISCOVERY } from "@/lib/home-discovery";
import DiscoveryImage from "./DiscoveryImage";
import styles from "./WardrobeDiscovery.module.css";

export function WardrobeEditorial({ onSelect }: { onSelect: (category: Category) => void }) {
  const content = useStorefront().discovery ?? DEFAULT_DISCOVERY;
  if (!content.featuresEnabled) return null;
  return <section className={styles.editorial} aria-label="The wardrobe edit">
    <header className={styles.editHeading}><p className={styles.eyebrow}>THE WARDROBE EDIT</p><h2>{content.heading}</h2><p>For the everyday. For a little occasion. For you.</p></header>
    <div className={styles.featureGrid}>
      {content.features.map((feature, index) => <button type="button" key={index} className={styles.feature} onClick={() => onSelect(feature.category)} aria-label={`${feature.action} — ${feature.title}`}>
        <DiscoveryImage src={feature.image} alt={feature.alt} sizes="(max-width: 700px) 100vw, (max-width: 1600px) 50vw, 780px" className={styles.featureImage}/>
        <span className={styles.featureShade}/><span className={styles.featureIndex}>0{index + 1} / THE BINDY WARDROBE</span>
        <span className={styles.featureCopy}><span className={styles.featureLabel}>{feature.label}</span><span className={styles.featureTitle}>{feature.title}</span><span className={styles.featureAction}>{feature.action}<ArrowUpRight size={19} strokeWidth={1.4}/></span></span>
      </button>)}
    </div>
  </section>;
}

export function WardrobeMission() {
  const content = (useStorefront().discovery ?? DEFAULT_DISCOVERY).mission;
  if (!content.enabled) return null;
  return <aside className={styles.mission} aria-label="Why we make BINDY">
    <div className={styles.missionOrigin}><span>AUSTRALIA</span><svg width="150" height="45" viewBox="0 0 150 45" fill="none" aria-hidden="true"><path d="M1 23C24 1 48 1 71 23C95 45 124 45 149 23M1 23C26 45 51 45 74 23C98 1 125 1 149 23" stroke="currentColor" strokeWidth=".8"/></svg><span>SRI LANKA</span></div>
    <div className={styles.missionCopy}><p className={styles.eyebrow}>{content.label}</p><h3>{content.title}</h3><p className={styles.missionBody}>{content.body}</p><Link href="/about" className={styles.missionLink}>A little more about BINDY<ArrowUpRight size={17} strokeWidth={1.4}/></Link></div>
    <span className={styles.missionSignature} aria-hidden="true">bindy.</span>
  </aside>;
}
