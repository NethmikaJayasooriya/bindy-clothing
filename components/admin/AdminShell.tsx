"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Shirt, Package, ShoppingBag, Users, TicketPercent, Image, PanelsTopLeft, RotateCcw, Inbox, ChartNoAxesCombined, Settings, ExternalLink, LogOut, Menu, X, Bell, RefreshCw, ArrowUpRight, Search } from "lucide-react";
import { useAdmin } from "./AdminProvider";
const links = [
  ["Overview", "/admin", LayoutDashboard], ["Orders", "/admin/orders", ShoppingBag], ["Products", "/admin/products", Shirt], ["Inventory", "/admin/inventory", Package], ["Customers", "/admin/customers", Users], ["Inbox", "/admin/inbox", Inbox], ["Discounts", "/admin/discounts", TicketPercent], ["Promotions", "/admin/promotions", TicketPercent], ["Returns", "/admin/returns", RotateCcw], ["Store content", "/admin/content", PanelsTopLeft], ["Media library", "/admin/media", Image], ["Reports", "/admin/reports", ChartNoAxesCombined], ["Settings", "/admin/settings", Settings],
] as const;
export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); const { store, owner, logout, refresh, notify, busy } = useAdmin(); const [open, setOpen] = useState(false); const [notifications, setNotifications] = useState(false);
  useEffect(() => { setOpen(false); setNotifications(false); refresh().catch(e=>notify(e.message,true)); }, [pathname, refresh, notify]);
  useEffect(() => {
    if (["/admin/content","/admin/settings","/admin/promotions"].includes(pathname)) return;
    const update=()=>{if(!busy && !document.hidden)refresh(true).catch(()=>{});};
    const timer=setInterval(update,30000);window.addEventListener("focus",update);
    return()=>{clearInterval(timer);window.removeEventListener("focus",update);};
  }, [pathname, refresh, busy]);
  const pending = store!.orders.filter(o => o.fulfillment === "unfulfilled" || o.fulfillment === "packed").length; const low = store!.products.filter(p => p.status === "active" && Object.values(p.stock).reduce((s,n)=>s+n,0) <= p.lowStockThreshold).length;
  const title = links.find(l => l[1] === pathname)?.[0] || "Store workspace";
  return <div className="admin-app">{open && <button className="admin-sidebar-overlay" aria-label="Close navigation" onClick={() => setOpen(false)} />}
    <aside className={`admin-sidebar ${open ? "open" : ""}`}><Link href="/admin" className="admin-wordmark">bindy<span>.</span><small>STORE ADMIN</small></Link><button className="admin-mobile-close" onClick={() => setOpen(false)} aria-label="Close navigation"><X size={20} /></button><div className="admin-store-chip"><span className="admin-store-avatar">B</span><div><strong>{store!.settings.storeName}</strong><small>Australian store · AUD</small></div><span className="admin-online-dot" /></div><p className="admin-nav-label">WORKSPACE</p><nav aria-label="Admin navigation">{links.map(([label, href, Icon], i) => <Link key={href} href={href} className={pathname === href ? "active" : ""} aria-current={pathname === href ? "page" : undefined}><Icon size={18} strokeWidth={1.65} /><span>{label}</span>{href === "/admin/orders" && pending > 0 && <b>{pending}</b>}{href === "/admin/inbox" && store!.messages.some(m=>m.status==="new") && <b>{store!.messages.filter(m=>m.status==="new").length}</b>}{href === "/admin/inventory" && low > 0 && <i>{low}</i>}{i === 6 && <span />}</Link>)}</nav><div className="admin-sidebar-bottom"><Link href="/" target="_blank">View storefront<ExternalLink size={15} /></Link><div className="admin-owner"><span>{owner!.name.slice(0, 1).toUpperCase()}</span><div><strong>{owner!.name}</strong><small>Store owner</small></div><button aria-label="Sign out" onClick={logout}><LogOut size={17} /></button></div></div></aside>
    <div className="admin-main"><header className="admin-topbar"><div><button className="admin-menu" aria-label="Open navigation" onClick={() => setOpen(true)}><Menu size={21} /></button><span className="admin-breadcrumb">Workspace <span>/</span> <strong>{title}</strong></span></div><div className="admin-top-actions"><button className="admin-bell" aria-label="Refresh store data" onClick={()=>refresh().then(()=>notify("Store data refreshed.")).catch(e=>notify(e.message,true))}><RefreshCw size={17}/></button><Link href="/admin/products" className="admin-top-search"><Search size={15} />Find a product</Link><Link href="/" target="_blank" className="admin-top-store">Your store<ArrowUpRight size={15} /></Link><button className={`admin-bell ${pending + low ? "has-alert" : ""}`} aria-label="Store notifications" onClick={() => setNotifications(!notifications)}><Bell size={19} /></button><span className="admin-top-avatar">{owner!.name.slice(0,1)}</span></div>
      {notifications && <div className="admin-notifications"><strong>Needs your attention</strong><Link href="/admin/orders">{pending} orders awaiting fulfilment <ArrowUpRight size={14} /></Link><Link href="/admin/inventory">{low} products running low <ArrowUpRight size={14} /></Link><p>Notifications are based on your saved store data.</p></div>}
    </header><main id="admin-main" className="admin-content">{children}</main><footer className="admin-workspace-footer"><span>BINDY · Thoughtfully managed.</span><span>Saved on your store server · AUD</span></footer></div>
  </div>;
}
