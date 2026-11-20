import { notFound } from "next/navigation";
import EditorialPage from "@/components/EditorialPage";
import { readPublicStore } from "@/lib/server/store-repository";
import { pageMetadata } from "@/lib/seo";
export const dynamic="force-dynamic";
export async function generateMetadata(){const page=(await readPublicStore()).editorial?.about;return page?pageMetadata(page.seoTitle||page.title,page.seoDescription||page.intro,"/about",page.image):{robots:{index:false,follow:false}};}
export default async function Page(){const page=(await readPublicStore()).editorial?.about;if(!page)notFound();return <EditorialPage kind="about" page={page}/>;}
