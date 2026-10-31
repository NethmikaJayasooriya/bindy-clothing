export const DEFAULT_SOCIALS = {
  instagram: "https://www.instagram.com/bindy_clothing?stkn=MW4wY3pkbGUzYWE5cA==",
  facebook: "https://www.facebook.com/share/1HWTugZEtN/?mibextid=wwXIfr",
  tiktok: "https://www.tiktok.com/@bindy_clothing?_r=1&_t=ZS-99hKGfLbSy1",
};
export const DEFAULT_CONTACT_EMAIL = "bindyclothingteam@gmail.com";
export type SocialKind = keyof typeof DEFAULT_SOCIALS | "email";
type SocialSettings = Partial<typeof DEFAULT_SOCIALS> & { email?: string };
export function validSocialUrl(value: string, kind: keyof typeof DEFAULT_SOCIALS) {
  try {
    const url = new URL(value);
    const hosts = kind === "facebook" ? ["facebook.com", "www.facebook.com", "m.facebook.com"] : [`${kind}.com`, `www.${kind}.com`];
    return url.protocol === "https:" && hosts.includes(url.hostname) && !url.username && !url.password && !url.port && url.pathname.split("/").some(Boolean);
  } catch { return false; }
}
export function socialLinks(settings: SocialSettings) {
  const links: { id: SocialKind; label: string; detail: string; href: string; external: boolean; aria: string }[] = [];
  for (const id of ["instagram", "facebook", "tiktok"] as const) {
    const href = settings[id] ?? DEFAULT_SOCIALS[id];
    if (!validSocialUrl(href, id)) continue;
    const label = id === "tiktok" ? "TikTok" : id[0].toUpperCase() + id.slice(1);
    const handle = new URL(href).pathname.split("/").filter(Boolean)[0].replace(/^@/, "");
    links.push({ id, label, detail: id === "facebook" ? "BINDY Clothing" : `@${handle}`, href, external: true, aria: `Visit BINDY on ${label} (opens in a new tab)` });
  }
  const email = settings.email ?? DEFAULT_CONTACT_EMAIL;
  if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) links.push({ id: "email", label: "Gmail", detail: email, href: `mailto:${email}`, external: false, aria: `Email BINDY at ${email}` });
  return links;
}
