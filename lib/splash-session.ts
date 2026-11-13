const KEY = "bindy-splash-seen";
let sessionClaimed = false;

/**
 * Checks whether the splash animation should play:
 * - Always plays if URL has `?splash`
 * - In development, plays once per full page reload (and suppresses replay during in-app SPA navigation).
 * - In production, plays once per browser session via sessionStorage.
 */
export function claimSplash(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;

  const force = /[?&]splash(=|&|$)/.test(window.location.search);
  if (force) return true;

  // In-memory guard prevents replaying during client-side SPA navigation (e.g. Product -> Home)
  if (sessionClaimed) return false;
  sessionClaimed = true;

  // In production, also enforce single playback per browser session
  if (process.env.NODE_ENV === "production") {
    try {
      if (sessionStorage.getItem(KEY) === "1") return false;
    } catch {}
  }

  return true;
}

export function markSplashSeen(): void {
  sessionClaimed = true;
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {}
}

export function cleanupStaleStorage(): void {
  try {
    localStorage.removeItem(KEY);
    document.cookie = `${KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  } catch {}
}

export function resetSplashSeen(): void {
  sessionClaimed = false;
  try {
    sessionStorage.removeItem(KEY);
    localStorage.removeItem(KEY);
    document.cookie = `${KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  } catch {}
}

