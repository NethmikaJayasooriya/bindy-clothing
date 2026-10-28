"use client";
import AdminPromotions from "./AdminPromotions";
import AdminInbox from "./AdminInbox";
import AdminOverview from "./AdminOverview";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import { AdminCustomers, AdminDiscounts, AdminReturns } from "./AdminDirectories";
import { AdminContent, AdminMedia, AdminSettings } from "./AdminContent";
export default function AdminWorkspace({ section = "overview" }: { section?: string }) {
  switch (section) {
    case "promotions": return <AdminPromotions/>;
    case "products": return <AdminProducts/>;
    case "inventory": return <AdminProducts inventory/>;
    case "orders": return <AdminOrders/>;
    case "inbox": return <AdminInbox/>;
    case "customers": return <AdminCustomers/>;
    case "discounts": return <AdminDiscounts/>;
    case "returns": return <AdminReturns/>;
    case "content": return <AdminContent/>;
    case "media": return <AdminMedia/>;
    case "reports": return <AdminOverview reports/>;
    case "settings": return <AdminSettings/>;
    default: return <AdminOverview/>;
  }
}
