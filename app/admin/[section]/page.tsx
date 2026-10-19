import { notFound } from "next/navigation";
import AdminWorkspace from "@/components/admin/AdminWorkspace";
export default function Page({params}:{params:{section:string}}) {
 if (!["inventory","inbox","customers","discounts","returns","content","media","reports","settings"].includes(params.section)) notFound();
 return <AdminWorkspace section={params.section}/>;
}
