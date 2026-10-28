"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import imageManifest from "@/data/image-manifest.json";
import { currentImageSource } from "@/lib/product-media";

type ImageRecord = { src: string; srcSet: string; width: number; height: number };
const images = imageManifest as Record<string, ImageRecord>;

// Static, pre-sized assets avoid a slow first image-transcoding request on the server.
// New uploads / external images keep their original URL until the next asset build.
const ResponsiveImage = forwardRef<HTMLImageElement, ComponentPropsWithoutRef<"img">>(function ResponsiveImage({
  src, srcSet, sizes = "(max-width: 768px) 100vw, 50vw", loading = "lazy", decoding = "async", width, height, alt = "", ...props
}, ref) {
  const original = src ? currentImageSource(src) : undefined;
  const image = original ? images[original] : undefined;
  return <img {...props} ref={ref} src={image?.src ?? original} srcSet={srcSet ?? image?.srcSet} sizes={srcSet || image ? sizes : undefined}
    width={width ?? image?.width} height={height ?? image?.height} alt={alt} loading={loading} decoding={decoding}/>;
});

export default ResponsiveImage;
