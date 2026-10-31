"use client";
import { useEffect, useRef, useState } from "react";
import type { StudioPiece } from "@/lib/styleStudio";
import { isCurrentLook, safePreviewUrl, type TryOnReply } from "@/lib/tryon-policy";

type Preview = { selection: string; status: "loading" | "ready" | "unavailable"; url: string; message: string };
export function useTryOn(top?: StudioPiece, bottom?: StudioPiece) {
  const selection = JSON.stringify([top?.id, top?.image, bottom?.id, bottom?.image]);
  const [preview, setPreview] = useState<Preview>({ selection: "", status: "loading", url: "", message: "" });
  const [attempt, setAttempt] = useState(0);
  const serial = useRef(0);
  useEffect(() => {
    const request = ++serial.current, controller = new AbortController();
    if (!top || !bottom) return () => controller.abort();
    const current = () => !controller.signal.aborted && serial.current === request;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const wait = (ms: number) => new Promise<void>((resolve, reject) => {
      const abort = () => { clearTimeout(timer); timers.delete(timer); reject(new DOMException("Cancelled", "AbortError")); };
      const timer = setTimeout(() => { timers.delete(timer); controller.signal.removeEventListener("abort", abort); resolve(); }, ms); timers.add(timer);
      controller.signal.addEventListener("abort", abort, { once: true });
    });
    setPreview({ selection, status: "loading", url: "", message: "" });
    (async () => {
      try {
        await wait(300);
        const started = Date.now();
        let first = true;
        while (current() && Date.now() - started < 240000) {
          const response = await fetch("/api/tryon", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ topId: top.id, bottomId: bottom.id, retry: attempt > 0 && first }), signal: controller.signal });
          first = false;
          const result = await response.json() as TryOnReply;
          if (!current()) return;
          if (!isCurrentLook(result, top.id, bottom.id)) throw new Error(result.error || "This preview could not be confirmed. Please try again.");
          if (response.status === 202 && result.state === "processing") { await wait(3000); continue; }
          if (!response.ok || result.state !== "ready" || !safePreviewUrl(result.url)) throw new Error(result.error || "This outfit preview is unavailable. Your chosen pieces are shown separately.");
          const image = new Image(); image.src = result.url;
          await Promise.race([image.decode(), wait(20000).then(() => { throw new Error("The preview image could not load. Please try again."); })]);
          if (!current()) return;
          if (image.naturalWidth < 600 || image.naturalHeight < 800) throw new Error("This preview is not clear enough to display.");
          setPreview({ selection, status: "ready", url: result.url, message: "" }); return;
        }
        if (current()) throw new Error("This preview is taking longer than expected. Please try again shortly.");
      } catch (e) {
        if (current()) setPreview({ selection, status: "unavailable", url: "", message: (e as Error).message });
      }
    })();
    return () => { controller.abort(); for (const timer of timers) clearTimeout(timer); };
  }, [selection, attempt]);
  const active = !top || !bottom ? { selection, status: "unavailable" as const, url: "", message: "Choose an available top and bottom to start your preview." } : preview.selection === selection ? preview : { selection, status: "loading" as const, url: "", message: "" };
  return { ...active, retry: () => setAttempt(n => n + 1), imageFailed: () => setPreview({ selection, status: "unavailable", url: "", message: "The preview image could not load. Please try again." }) };
}
