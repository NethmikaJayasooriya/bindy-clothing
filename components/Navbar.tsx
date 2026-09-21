"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, Heart, Menu, Search, ShoppingBag, User, Volume2, VolumeX, X } from "lucide-react";
import SearchModal from "@/components/SearchModal";
import WishlistDrawer from "@/components/WishlistDrawer";
import { getAccount, subscribeAccount, type UserAccount } from "@/lib/account";
import { getWishlistCount, subscribeWishlist } from "@/lib/wishlist";
import styles from "./Navbar.module.css";

interface NavbarProps { immersive?: boolean; isMuted: boolean; toggleAudio: () => void; cartCount?: number; onOpenCart?: () => void; }
const categories = [
  ["All pieces", "/collection"], ["Dresses", "/collection?parent=Dresses"],
  ["Tops & blouses", "/collection?parent=Tops"], ["Skirts & pants", "/collection?parent=Bottoms"],
  ["Resort wear", "/collection?parent=Resort%20Wear"], ["New arrivals", "/collection?filter=new"],
];
const stories = [["Style Studio", "/build-your-set"], ["Our story", "/about"], ["The craft", "/craft"], ["Stories", "/stories"], ["Journal", "/journal"]];

export default function Navbar({ isMuted, toggleAudio, cartCount = 0, onOpenCart, immersive = false }: NavbarProps) {
  const [overHero, setOverHero] = useState(immersive);
  useEffect(() => {
    if (!immersive) return;
    const update = () => {
      const hero = document.querySelector("[data-campaign-hero]");
      setOverHero(Boolean(hero && hero.getBoundingClientRect().bottom > 120));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [immersive]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [account, setAccount] = useState<UserAccount | null>(null);
  const menuRef = useRef<HTMLDialogElement>(null);
  const shopRef = useRef<HTMLDetailsElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const sync = () => { setWishlistCount(getWishlistCount()); setAccount(getAccount()); };
    sync();
    const offAccount = subscribeAccount(sync), offWishlist = subscribeWishlist(sync);
    const dismiss = (event: MouseEvent) => { if (shopRef.current && !shopRef.current.contains(event.target as Node)) shopRef.current.open = false; };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape" && shopRef.current?.open) { shopRef.current.open = false; shopRef.current.querySelector("summary")?.focus(); } };
    document.addEventListener("click", dismiss);
    document.addEventListener("keydown", escape);
    return () => { offAccount(); offWishlist(); document.removeEventListener("click", dismiss); document.removeEventListener("keydown", escape); document.body.style.overflow = ""; };
  }, []);
  const closeMenu = () => { menuRef.current?.close(); document.body.style.overflow = ""; menuButton.current?.focus(); };
  const closeShop = () => { if (shopRef.current) shopRef.current.open = false; };
  return <>
    <header className={`${styles.header} ${immersive && overHero ? styles.immersive : ""}`}>
      <div className={styles.announcement}><span>Thoughtfully designed. Quietly special.</span><span>SRI LANKA <i>↔</i> AUSTRALIA</span><Link href="/about">Two islands. One thread. <ArrowUpRight size={11} /></Link></div>
      <nav className={styles.nav} aria-label="Main navigation">
        <div className={styles.navLeft}>
          <button className={`${styles.icon} ${styles.mobileMenu}`} ref={menuButton} aria-label="Open navigation menu" aria-haspopup="dialog" onClick={() => { menuRef.current?.showModal(); document.body.style.overflow = "hidden"; }}><Menu size={21} strokeWidth={1.4} /></button>
          <Link href="/" className={styles.wordmark} aria-label="bindy clothing home"><span>bindy<span className={styles.logoDot}>.</span></span><small>c l o t h i n g</small></Link>
        </div>
        <div className={styles.navCenter}>
          <div className={styles.desktopLinks}>
            <details ref={shopRef} className={styles.shopMenu}>
              <summary>Shop <ChevronDown size={12} className={styles.chevron} /></summary>
              <div className={styles.shopPanel}>
                <div><p>THE WARDROBE</p>{categories.map(([label, href]) => <Link key={href} href={href} onClick={closeShop}>{label}<ArrowUpRight size={13} /></Link>)}</div>
                <div className={styles.shopStory}><span>COLLECTION 01</span><h2>Serendipity.</h2><p>The beauty of<br />unexpected discovery.</p><Link href="/collection" onClick={closeShop}>Discover the collection <ArrowUpRight size={14} /></Link></div>
              </div>
            </details>
            <Link href="/collection?filter=new">New arrivals</Link>
            <Link href="/build-your-set">Style Studio</Link>
            <Link href="/about">Our story</Link>
            <Link href="/craft">The craft</Link>
          </div>
        </div>
        <div className={styles.navRight}>
          <button className={styles.icon} aria-label="Search garments" onClick={() => setSearchOpen(true)}><Search size={19} strokeWidth={1.35} /></button>
          <Link className={`${styles.icon} ${styles.account}`} href="/account" aria-label={account ? `Account for ${account.name}` : "Account sign in"}><User size={19} strokeWidth={1.35} /></Link>
          <button className={`${styles.icon} ${styles.saved}`} aria-label={`Saved pieces (${wishlistCount})`} onClick={() => setWishlistOpen(true)}><Heart size={18} strokeWidth={1.35} />{wishlistCount > 0 && <span className={styles.badge}>{wishlistCount}</span>}</button>
          {onOpenCart ? <button className={styles.bag} aria-label={`Shopping bag with ${cartCount} items`} onClick={onOpenCart}><ShoppingBag size={18} strokeWidth={1.35} /><span>Bag ({cartCount})</span></button> : <Link className={styles.bag} href="/checkout" aria-label="Shopping bag"><ShoppingBag size={18} strokeWidth={1.35} /><span>Bag ({cartCount})</span></Link>}
        </div>
      </nav>
    </header>
    <dialog className={styles.mobileDialog} ref={menuRef} aria-label="Navigation menu" onClose={() => { document.body.style.overflow = ""; }} onClick={e => { if (e.target === e.currentTarget) closeMenu(); }}>
      <div className={styles.menuTop}><span>bindy.</span><button className={styles.icon} aria-label="Close navigation menu" onClick={closeMenu}><X size={24} /></button></div>
      <p className={styles.menuLabel}>FIND YOUR EVERYDAY</p>
      <div className={styles.mobileCategories}>{categories.map(([label, href]) => <Link key={href} href={href} onClick={closeMenu}>{label}<ArrowUpRight size={18} /></Link>)}</div>
      <div className={styles.mobileStories}>{stories.map(([label, href]) => <Link key={href} href={href} onClick={closeMenu}>{label}</Link>)}</div>
      <div className={styles.menuUtilities}>
        <Link href="/account" onClick={closeMenu}>My account</Link>
        <button onClick={() => { closeMenu(); setWishlistOpen(true); }}>Saved pieces ({wishlistCount})</button>
        <Link href="/size-guide" onClick={closeMenu}>Size guide</Link><Link href="/returns/start" onClick={closeMenu}>Track order & returns</Link><Link href="/contact" onClick={closeMenu}>Contact us</Link>
        <button onClick={toggleAudio}>{isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />} Sound {isMuted ? "off" : "on"}</button>
      </div>
      <p className={styles.menuBottom}>SRI LANKA ↔ AUSTRALIA</p>
    </dialog>
    <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    <WishlistDrawer isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} onOpenCart={onOpenCart} />
  </>;
}
