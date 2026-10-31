import type { SocialKind } from "@/lib/social-links";
export default function SocialIcon({ kind, className }: { kind: SocialKind; className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} width="20" height="20" fill="none" aria-hidden="true" focusable="false">
    {kind === "instagram" && <><rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.7"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7"/><circle cx="17.4" cy="6.8" r="1.1" fill="currentColor"/></>}
    {kind === "facebook" && <path fill="currentColor" d="M14.2 22v-8.5H17l.4-3.3h-3.2V8.1c0-1 .3-1.6 1.6-1.6h1.7v-3c-.3 0-1.3-.2-2.5-.2-2.5 0-4.2 1.5-4.2 4.3v2.6H8v3.3h2.8V22h3.4Z"/>}
    {kind === "tiktok" && <path fill="currentColor" d="M16.7 2h-3.5v13.4a2.9 2.9 0 1 1-2.5-2.9V8.9a6.4 6.4 0 1 0 6 6.4V8.6c1.3.9 2.9 1.4 4.5 1.4V6.5a4.6 4.6 0 0 1-4.5-4.5Z"/>}
    {kind === "email" && <><rect x="3" y="5.5" width="18" height="13" rx="2.4" stroke="currentColor" strokeWidth="1.6"/><path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></>}
  </svg>;
}
