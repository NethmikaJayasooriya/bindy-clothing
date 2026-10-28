import type { ComponentPropsWithoutRef } from "react";
import ResponsiveImage from "./ResponsiveImage";
import heroImages from "@/data/hero-images.json";
import imageManifest from "@/data/image-manifest.json";
import { heroImageSizes } from "@/lib/hero-image-policy";

type Source = {src:string;srcSet:string;width:number;height:number};
type HeroSource = Source & {mobile:Source & {focalPoint:string;media:string}};
type Props = ComponentPropsWithoutRef<"img"> & {src:string;opening:boolean;mobilePosition:string};
export default function HeroImage({src,opening,mobilePosition,...props}:Props){
  const image=(heroImages as Record<string,HeroSource>)[src];
  const dimensions=image??(imageManifest as Record<string,Source>)[src];
  const ratio=dimensions?dimensions.width/dimensions.height:16/9;
  // Respect newly edited CMS focal points by falling back to the full original.
  const focalPoint=opening?"55% 90%":mobilePosition;
  const mobile=image?.mobile.focalPoint===focalPoint?image.mobile:undefined;
  return <picture>
    {mobile&&<source media={mobile.media} srcSet={mobile.srcSet} sizes={heroImageSizes(mobile.width/mobile.height,opening)}/>}
    <ResponsiveImage {...props} src={image?.src??src} srcSet={image?.srcSet} width={dimensions?.width} height={dimensions?.height} sizes={heroImageSizes(ratio,opening)}/>
  </picture>;
}
