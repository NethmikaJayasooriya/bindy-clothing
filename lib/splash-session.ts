const KEY = "bindy-splash-seen";
let claimed = false;

/** Claim before playing, so interrupted intros and back navigation cannot replay it. */
export function claimSplash(): boolean {
  if (claimed) return false;
  claimed = true;
  try {
    if (sessionStorage.getItem(KEY)) return false;
    sessionStorage.setItem(KEY, "1");
  } catch { /* The in-memory guard still covers SPA navigation when storage is blocked. */ }
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
