"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResponsiveImage from "@/components/ResponsiveImage";
import CartDrawer from "@/components/CartDrawer";
import { getCart, saveCart, subscribe, type CartItem } from "@/lib/cart";
import { ambientPlayer } from "@/lib/ambientSound";
import styles from "./about.module.css";

const productionStages = ["Pattern making", "Sampling", "Production", "Finishing", "Packing"];
const familyValues = ["Craftsmanship", "Attention to detail", "Authenticity"];

export default function AboutPage() {
  const [isMuted, setIsMuted] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    setCartItems(getCart());
    return subscribe(() => setCartItems(getCart()));
  }, []);

  function toggleAudio() {
    if (ambientPlayer) setIsMuted(ambientPlayer.toggle());
  }

  function updateQuantity(id: string, size: string, delta: number) {
    saveCart(getCart().map(item => item.product.id === id && item.size === size
      ? { ...item, quantity: Math.max(0, Math.min(99, item.quantity + delta)) }
      : item).filter(item => item.quantity > 0));
  }

  return <div className={styles.page}>
    <Navbar isMuted={isMuted} toggleAudio={toggleAudio}
      cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
      onOpenCart={() => setIsCartOpen(true)} />

    <main>
      <section className={styles.hero} aria-labelledby="about-title">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><span aria-hidden="true" />About BINDY</p>
          <h1 id="about-title" className={styles.headline}>Family at heart.<br /><em>Care in every thread.</em></h1>
          <p className={styles.heroIntro}>Our brand is built on a family passion for textiles, craftsmanship, and quality garment making.</p>
          <a href="#our-story" className={styles.storyLink}>A little about us <ArrowDown size={16} strokeWidth={1.3} /></a>
          <div className={styles.heroSignature} aria-label="Creative direction in Australia, production in Sri Lanka">
            <span>Australia</span><span className={styles.signatureThread} aria-hidden="true" /><span>Sri Lanka</span>
          </div>
        </div>
        <figure className={styles.heroFigure}>
          <div className={styles.heroImageFrame}>
            <ResponsiveImage src="/images/bindi-real/campaign-together.webp"
              alt="Two friends wearing BINDY floral and sage garments outdoors"
              loading="eager" fetchPriority="high"
              sizes="(max-width: 800px) 100vw, 54vw" className={styles.heroImage} />
          </div>
          <figcaption><span>The BINDY wardrobe</span><span>Made to be part of your everyday.</span></figcaption>
        </figure>
      </section>

      <section id="our-story" className={styles.story} aria-labelledby="story-title">
        <div>
          <p className={styles.eyebrow}>Our story</p>
          <h2 id="story-title" className={styles.sectionTitle}>A shared love.<br /><em>A considered way of creating.</em></h2>
        </div>
        <div className={styles.storyBody}>
          <p>With creative direction led from Australia and production based in Sri Lanka, we bring together generations of industry knowledge and a shared love for fashion.</p>
          <div className={styles.origins}>
            <div><span>Creative direction</span><strong>Australia</strong></div>
            <div><span>Family-owned production</span><strong>Sri Lanka</strong></div>
            <div><span>Factory established</span><strong>2012</strong></div>
          </div>
        </div>
      </section>

      <section className={styles.factory} aria-labelledby="factory-title">
        <div className={styles.factoryTop}>
          <div><p className={styles.eyebrow}>Our family-owned garment factory</p><h2 id="factory-title" className={styles.factoryTitle}>One roof.<br /><em>Every detail.</em></h2></div>
          <p className={styles.factoryIntro}>Every garment is designed with care and produced in our family-owned garment factory, established in 2012, where the entire process takes place under one roof, from pattern making and sampling to production, finishing, and packing.</p>
        </div>
        <ol className={styles.stages} aria-label="Garment production under one roof">
          {productionStages.map((stage, index) => <li key={stage}><span className={styles.stageNumber}>0{index + 1}</span><span>{stage}</span><ArrowUpRight size={18} strokeWidth={1} aria-hidden="true" /></li>)}
        </ol>
        <p className={styles.factoryNote}>Connected to every stage, from the first pattern to the final package.</p>
      </section>

      <section className={styles.values} aria-labelledby="values-title">
        <div className={styles.valuesIntro}>
          <p className={styles.eyebrow}>The values we carry</p>
          <h2 id="values-title" className={styles.sectionTitle}>Rooted in family.<br /><em>Reflected in every piece.</em></h2>
          <p>Being directly connected to every stage of creation allows us to maintain the highest standards of quality while ensuring that each piece reflects the values our family has built over the years: craftsmanship, attention to detail, and authenticity.</p>
        </div>
        <div className={styles.valueWords}>{familyValues.map((value, index) => <div key={value}><span>0{index + 1}</span><h3>{value}</h3></div>)}</div>
      </section>

      <section className={styles.purpose} aria-labelledby="purpose-title">
        <p className={styles.eyebrow}>Our purpose</p>
        <h2 id="purpose-title">Made to be worn.<br /><em>Loved. Cherished.</em></h2>
        <p className={styles.purposeText}>Our goal is to create timeless, thoughtfully made clothing that connects contemporary design with the expertise of Sri Lankan manufacturing, delivering pieces that are made to be worn, loved, and cherished for years to come.</p>
        <Link href="/collection" className={styles.collectionLink}>Explore the collection <ArrowUpRight size={18} strokeWidth={1.3} /></Link>
        <span className={styles.wordmark} aria-hidden="true">bindy.</span>
      </section>
    </main>

    <Footer />
    <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cartItems}
      onUpdateQuantity={updateQuantity}
      onRemoveItem={(id, size) => saveCart(getCart().filter(item => !(item.product.id === id && item.size === size)))} />
  </div>;
}
