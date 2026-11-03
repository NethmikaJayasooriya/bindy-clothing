"use client";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { useStorefront } from "@/components/StorefrontProvider";
import { socialLinks } from "@/lib/social-links";
import SocialIcon from "./SocialIcon";
import styles from "./SocialRail.module.css";

export default function SocialRail() {
  const pathname = usePathname();
  const { settings } = useStorefront();
  if (/^\/(admin|checkout|payment)(\/|$)/.test(pathname ?? "")) return null;
  const links = socialLinks(settings);
  if (!links.length) return null;
  return <nav aria-label="BINDY social links" data-testid="social-rail" className={`${styles.rail} ${/^\/(shopping|faq|craft|about)(\/|$)/.test(pathname??"")?styles.reading:""}`}>
    <div className={styles.links}>{links.map(link => <a key={link.id} href={link.href} aria-label={link.aria} target={link.external ? "_blank" : undefined} rel={link.external ? "noopener noreferrer" : undefined} data-social-link={link.id} className={`${styles.link} ${styles[link.id]}`}>
      <SocialIcon kind={link.id} className={styles.icon}/>
      <span className={styles.tooltip} aria-hidden="true"><span><strong>{link.label}</strong><small>{link.detail}</small></span><ArrowUpRight size={15}/></span>
    </a>)}</div>
  </nav>;
}
