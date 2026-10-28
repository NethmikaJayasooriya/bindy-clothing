import { notFound } from "next/navigation";
import AdminWorkspace from "@/components/admin/AdminWorkspace";
export default async function Page({params}:{params:Promise<{section:string}>}) {
 if (!["promotions","inventory","inbox","customers","discounts","returns","content","media","reports","settings"].includes((await params).section)) notFound();
 return <AdminWorkspace section={(await params).section}/>;
}
