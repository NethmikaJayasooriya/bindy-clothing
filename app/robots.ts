import type { MetadataRoute } from "next";
export default function robots():MetadataRoute.Robots {const site=process.env.SITE_URL||"https://bindyclothing.com.au";return {rules:{userAgent:"*",allow:"/",disallow:["/admin","/api/","/checkout","/account","/payment/","/test"]},sitemap:`${site}/sitemap.xml`};}
