"use client";
import { useStorefront } from "@/components/StorefrontProvider";
import { useCurrency } from "@/components/CurrencyContext";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, Heart, Menu, Search, ShoppingBag, User, Volume2, VolumeX, X } from "lucide-react";
import SearchModal from "@/components/SearchModal";
import WishlistDrawer from "@/components/WishlistDrawer";
import { getAccount, subscribeAccount, type UserAccount } from "@/lib/account";
import { getWishlistCount, subscribeWishlist } from "@/lib/wishlist";
import { getCart, subscribe as subscribeCart, cartCount as calculateCartCount } from "@/lib/cart";
import styles from "./Navbar.module.css";

interface NavbarProps { immersive?: boolean; isMuted: boolean; toggleAudio: () => void; cartCount?: number; onOpenCart?: () => void; }
const AU_FLAG_SRC = "/images/country%20flags/Austraila%20flag.jpg";
const LK_FLAG_SRC = "/images/country%20flags/Sri%20lanka%20flag.webp";

const categories = [
  ["All pieces", "/collection"], ["Dresses", "/collection?parent=Dresses"],
  ["Tops & blouses", "/collection?parent=Tops"], ["Skirts & pants", "/collection?parent=Bottoms"],
  ["Resort wear", "/collection?parent=Resort%20Wear"], ["New arrivals", "/collection?filter=new"],
];
const stories = [["Style Studio", "/build-your-set"], ["Our story", "/about"], ["The craft", "/craft"], ["Stories", "/stories"], ["Journal", "/journal"]];

export default function Navbar({ isMuted, toggleAudio, cartCount = 0, onOpenCart, immersive = false }: NavbarProps) {
  const { settings } = useStorefront();
  const { market, toggleMarket, isLkr } = useCurrency();
  const [overHero, setOverHero] = useState(immersive);
  useEffect(() => {
    if (!immersive) return;
    const hero = document.querySelector("[data-campaign-hero]");
    if (!hero) return;
    const observer = new IntersectionObserver(([entry])=>setOverHero(entry.isIntersecting),{rootMargin:"-120px 0px 0px",threshold:0});
    observer.observe(hero);
    return () => observer.disconnect();
  }, [immersive]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [liveCartCount, setLiveCartCount] = useState(cartCount);
  const [account, setAccount] = useState<UserAccount | null>(null);
  const menuRef = useRef<HTMLDialogElement>(null);
  const shopRef = useRef<HTMLDetailsElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const sync = () => {
      setWishlistCount(getWishlistCount());
      setAccount(getAccount());
      setLiveCartCount(calculateCartCount(getCart()));
    };
    sync();
    const offAccount = subscribeAccount(sync), offWishlist = subscribeWishlist(sync), offCart = subscribeCart(sync);
    const dismiss = (event: MouseEvent) => { if (shopRef.current && !shopRef.current.contains(event.target as Node)) shopRef.current.open = false; };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape" && shopRef.current?.open) { shopRef.current.open = false; shopRef.current.querySelector("summary")?.focus(); } };
    document.addEventListener("click", dismiss);
    document.addEventListener("keydown", escape);
    return () => { offAccount(); offWishlist(); offCart(); document.removeEventListener("click", dismiss); document.removeEventListener("keydown", escape); document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    if (cartCount !== undefined) {
      setLiveCartCount(cartCount);
    }
  }, [cartCount]);

  const closeMenu = () => { menuRef.current?.close(); document.body.style.overflow = ""; menuButton.current?.focus(); };
  const closeShop = () => { if (shopRef.current) shopRef.current.open = false; };
  return <>
    <header className={`${styles.header} ${immersive && overHero ? styles.immersive : ""}`}>
      <div className={styles.announcement}>
        <span>{settings.announcement}</span>
        <button
          type="button"
          onClick={toggleMarket}
          style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", font: "inherit", display: "inline-flex", alignItems: "center", gap: "7px" }}
          title="Click to switch delivery destination & currency"
        >
          <span className={styles.flagWrapper} style={{ width: "22px", height: "11px" }}>
            <img
              src={isLkr ? LK_FLAG_SRC : AU_FLAG_SRC}
              alt={isLkr ? "Sri Lanka flag" : "Australia flag"}
              className={styles.flagImg}
            />
          </span>
          <span>{isLkr ? "SRI LANKA" : "AUSTRALIA"}</span>
        </button>
        <Link href="/about">Two islands. One thread. <ArrowUpRight size={11} /></Link>
      </div>
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
          <button
            type="button"
            onClick={toggleMarket}
            className={styles.flagButton}
            title={isLkr ? "Delivering to Sri Lanka · Click to switch" : "Delivering to Australia · Click to switch"}
            aria-label={isLkr ? "Current destination: Sri Lanka. Click to switch to Australia." : "Current destination: Australia. Click to switch to Sri Lanka."}
          >
            <span className={styles.flagWrapper}>
              <img
                src={isLkr ? LK_FLAG_SRC : AU_FLAG_SRC}
                alt={isLkr ? "Sri Lanka flag" : "Australia flag"}
                className={styles.flagImg}
              />
            </span>
          </button>
          <button className={styles.icon} aria-label="Search garments" onClick={() => setSearchOpen(true)}><Search size={19} strokeWidth={1.35} /></button>
          <Link className={`${styles.icon} ${styles.account}`} href="/account" aria-label={account ? `Account for ${account.name}` : "Account sign in"}><User size={19} strokeWidth={1.35} /></Link>
          <button className={`${styles.icon} ${styles.saved}`} aria-label={`Saved pieces (${wishlistCount})`} onClick={() => setWishlistOpen(true)}><Heart size={18} strokeWidth={1.35} />{wishlistCount > 0 && <span className={styles.badge}>{wishlistCount}</span>}</button>
          {onOpenCart ? <button className={styles.bag} aria-label={`Shopping bag with ${liveCartCount} items`} onClick={onOpenCart}><ShoppingBag size={18} strokeWidth={1.35} /><span>Bag ({liveCartCount})</span></button> : <Link className={styles.bag} href="/checkout" aria-label="Shopping bag"><ShoppingBag size={18} strokeWidth={1.35} /><span>Bag ({liveCartCount})</span></Link>}
        </div>
      </nav>
    </header>
    <dialog className={styles.mobileDialog} ref={menuRef} aria-label="Navigation menu" onClose={() => { document.body.style.overflow = ""; }} onClick={e => { if (e.target === e.currentTarget) closeMenu(); }}>
      <div className={styles.menuTop}><span>bindy.</span><button className={styles.icon} aria-label="Close navigation menu" onClick={closeMenu}><X size={24} /></button></div>
      <p className={styles.menuLabel}>FIND YOUR EVERYDAY</p>
      <div className={styles.mobileCategories}>{categories.map(([label, href]) => <Link key={href} href={href} onClick={closeMenu}>{label}<ArrowUpRight size={18} /></Link>)}</div>
      <div className={styles.mobileStories}>{stories.map(([label, href]) => <Link key={href} href={href} onClick={closeMenu}>{label}</Link>)}</div>
      <div className={styles.menuUtilities}>
        <button
          onClick={() => { toggleMarket(); closeMenu(); }}
          style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
        >
          <span className={styles.flagWrapper} style={{ width: "26px", height: "13px" }}>
            <img
              src={isLkr ? LK_FLAG_SRC : AU_FLAG_SRC}
              alt=""
              className={styles.flagImg}
            />
          </span>
          <span>{isLkr ? "Delivery: Sri Lanka · Switch" : "Delivery: Australia · Switch"}</span>
        </button>
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
