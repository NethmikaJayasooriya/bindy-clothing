export const TRYON_VERSION = "outfit-v3-bria-5555";
export const TRYON_MODEL = "bria/fibo-edit-1.5/virtual-try-on";
export const TRYON_SEED = 5555;
export const TRYON_BASE_MODEL = "/images/style-studio/bindy-fit-model.png";

export type TryOnReply = {
  state: "ready" | "processing" | "unavailable";
  topId: string;
  bottomId: string;
  pairKey: string;
  url?: string;
  error?: string;
  retryAfter?: number;
};

export function isCurrentLook(result: TryOnReply, topId: string, bottomId: string) {
  return result.topId === topId && result.bottomId === bottomId && /^[a-f0-9]{64}$/.test(result.pairKey);
}

export function safePreviewUrl(url: unknown): url is string {
  if (typeof url !== "string") return false;
  if (/^\/images\/tryon-v3\/[a-f0-9]{64}\.webp$/.test(url)) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && /^[a-z0-9]+\.supabase\.co$/.test(parsed.hostname) &&
      /^\/storage\/v1\/object\/public\/bindy-media\/tryon\/outfit-v3-bria-5555\/[a-f0-9]{64}\.webp$/.test(parsed.pathname) && !parsed.search && !parsed.hash;
  } catch { return false; }
}
