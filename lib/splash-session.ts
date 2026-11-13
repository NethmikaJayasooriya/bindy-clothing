const KEY = "bindy-splash-seen";

/**
 * Checks whether the splash animation should play.
 * In development, always returns true so the animation is easily testable on page reload.
 * In production, returns true only once per browser session unless forced via ?splash.
 */
export function claimSplash(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;

  // Tip: ?splash in the query string forces the animation to replay
  const force = /[?&]splash(=|&|$)/.test(window.location.search);
  if (force) return true;

  // In development, keep splash replayable on reload for rapid iteration & QA
  if (process.env.NODE_ENV !== "production") {
    return true;
  }

  try {
    if (sessionStorage.getItem(KEY) === "1") return false;
  } catch {
    // If storage is restricted, default to playing once per load
  }

  return true;
}

/**
 * Marks the splash screen as viewed so it will not replay during the same session in production.
 */
export function markSplashSeen(): void {
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {
    // Ignore storage errors
  }
}
