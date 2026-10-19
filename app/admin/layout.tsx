import type { Metadata } from "next";
import { AdminProvider } from "@/components/admin/AdminProvider";
import AdminShell from "@/components/admin/AdminShell";
import "@/components/admin/admin.css";
export const metadata: Metadata = { title: "Store admin · BINDY", robots: { index: false, follow: false } };
export default function AdminLayout({ children }: { children: React.ReactNode }) {
 return <div className="admin-root"><AdminProvider><AdminShell>{children}</AdminShell></AdminProvider></div>;
}
