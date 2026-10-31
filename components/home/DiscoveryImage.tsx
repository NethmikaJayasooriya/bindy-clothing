import type { ComponentPropsWithoutRef } from "react";
import ResponsiveImage from "@/components/ResponsiveImage";
import images from "@/data/discovery-images.json";
type Source = { src: string; srcSet: string; width: number; height: number };
export default function DiscoveryImage({ src, ...props }: ComponentPropsWithoutRef<"img"> & { src: string }) {
  const image = (images as Record<string, Source>)[src];
  return <ResponsiveImage {...props} src={image?.src ?? src} srcSet={image?.srcSet} width={image?.width} height={image?.height}/>;
}
