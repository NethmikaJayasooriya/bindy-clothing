import type { CSSProperties } from "react";
import frames from "@/data/product-photo-framing.json";
import { currentImageSource } from "@/lib/product-media";

type PhotoFrame = { src: string; scale: number; origin: string; fit?: "cover"; position?: string };
function photoFrame(product: { id: string }, src: string): PhotoFrame | undefined {
  const frame = (frames as Record<string, PhotoFrame>)[product.id];
  return frame && currentImageSource(src) === currentImageSource(frame.src) ? frame : undefined;
}

// Frame only the reviewed photo. A replacement uploaded in admin stays uncropped.
// CSS magnifies the original photograph without changing garment construction.
export function productPhotoFraming(product: { id: string }, src: string): CSSProperties | undefined {
  const frame = photoFrame(product,src);
  if (!frame) return undefined;
  return { transform: `scale(${frame.scale})`, transformOrigin: frame.origin, ...(frame.fit ? {objectFit: frame.fit, objectPosition: frame.position} : {}) };
}

// Load enough source pixels for the enlarged garment, including high-DPI screens.
export function productPhotoSizes(product: { id: string }, src: string, sizes: string) {
  const scale = photoFrame(product,src)?.scale ?? 1;
  return sizes.replace(/([\d.]+)vw/g,(_, value)=>`${Number(value)*scale}vw`);
}
