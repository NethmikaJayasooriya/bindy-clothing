"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function NavigationFeedback() {
  const pathname = usePathname(); const router = useRouter(); const [pending, setPending] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => { setPending(false); clearTimeout(timer.current); }, [pathname]);
  useEffect(() => {
    const warmed = new Set<string>();
    const linkFor = (target: EventTarget | null) => target instanceof Element ? target.closest<HTMLAnchorElement>("a[href]") : null;
    const warm = (event: Event) => {
      const a = linkFor(event.target);
      if (!a || a.target || !a.pathname.startsWith("/product/") || a.origin !== location.origin || warmed.has(a.pathname)) return;
      warmed.add(a.pathname); router.prefetch(a.pathname);
    };
    const click = (event: MouseEvent) => {
      const a = linkFor(event.target);
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !a || a.target || a.download || a.origin !== location.origin || a.pathname === location.pathname) return;
      setPending(true); clearTimeout(timer.current); timer.current = setTimeout(() => setPending(false), 8000);
    };
    const reset = () => { setPending(false); clearTimeout(timer.current); };
    document.addEventListener("pointerover", warm, { passive: true }); document.addEventListener("focusin", warm);
    document.addEventListener("click", click, true); window.addEventListener("popstate", reset); window.addEventListener("pageshow", reset);
    return () => { clearTimeout(timer.current); document.removeEventListener("pointerover", warm); document.removeEventListener("focusin", warm); document.removeEventListener("click", click, true); window.removeEventListener("popstate", reset); window.removeEventListener("pageshow", reset); };
  }, [router]);
  return pending ? <div className="navigation-feedback" role="status" aria-live="polite"><span/><span className="sr-only">Opening page…</span></div> : null;
}
