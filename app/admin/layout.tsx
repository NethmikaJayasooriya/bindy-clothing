"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  getAdminProducts, 
  getAdminOrders, 
  getAdminRole, 
  setAdminRole, 
  AdminRole,
  ADMIN_EVENTS
} from "@/lib/adminData";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [role, setRole] = useState<AdminRole>("seller");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Sync role and badge counts on mount & listen to changes
  useEffect(() => {
    const updateStats = () => {
      setRole(getAdminRole());
      const products = getAdminProducts();
      const orders = getAdminOrders();
      
      const lowStock = products.filter(p => p.status === "low_stock" || p.status === "sold_out").length;
      setLowStockCount(lowStock);

      const pending = orders.filter(o => o.fulfillmentStatus === "Awaiting Packing" || o.fulfillmentStatus === "Preparing Handloom").length;
      setPendingOrdersCount(pending);
    };

    updateStats();

    window.addEventListener(ADMIN_EVENTS.ROLE_CHANGED, updateStats);
    window.addEventListener(ADMIN_EVENTS.PRODUCTS_UPDATED, updateStats);
    window.addEventListener(ADMIN_EVENTS.ORDERS_UPDATED, updateStats);

    return () => {
      window.removeEventListener(ADMIN_EVENTS.ROLE_CHANGED, updateStats);
      window.removeEventListener(ADMIN_EVENTS.PRODUCTS_UPDATED, updateStats);
      window.removeEventListener(ADMIN_EVENTS.ORDERS_UPDATED, updateStats);
    };
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleToggleRole = () => {
    const newRole: AdminRole = role === "seller" ? "super_admin" : "seller";
    setRole(newRole);
    setAdminRole(newRole);
  };

  const navLinks = [
    {
      label: "Dashboard",
      href: "/admin",
      badge: null,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      label: "Silhouettes & Stock",
      href: "/admin/products",
      badge: lowStockCount > 0 ? `${lowStockCount} Low` : null,
      badgeColor: "bg-amber-900/60 text-amber-300 border-amber-700/40",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      label: "Orders & AusPost",
      href: "/admin/orders",
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} Due` : null,
      badgeColor: "bg-[#C5A059]/20 text-[#DFBF7A] border-[#C5A059]/30",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    {
      label: "Loom Workshops",
      href: "/admin/artisans",
      badge: "SL Live",
      badgeColor: "bg-emerald-950/80 text-emerald-300 border-emerald-700/50",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      label: "Payouts & Finance",
      href: "/admin/payouts",
      badge: null,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  ];

  return (
    <div className="min-h-screen bg-[#0D0C0B] text-[#FAF7F2] flex font-sans antialiased selection:bg-[#C5A059]/30 selection:text-[#FAF7F2]">
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed lg:sticky top-0 h-screen w-72 bg-[#141312] border-r border-[#262422] flex flex-col justify-between z-50 transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-[#262422]">
            <div className="flex items-center justify-between">
              <Link href="/admin" className="block group">
                <div className="flex items-center space-x-2">
                  <span className="font-serif text-2xl tracking-[0.25em] font-light text-[#FAF7F2] group-hover:text-[#C5A059] transition-colors">
                    BINDY
                  </span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#C5A059]/20 text-[#DFBF7A] border border-[#C5A059]/30 tracking-widest">
                    ATELIER
                  </span>
                </div>
                <div className="text-[10px] tracking-widest text-[#8A857D] uppercase mt-1 font-mono">
                  {role === "seller" ? "Merchant Seller Portal" : "Executive Super Admin"}
                </div>
              </Link>
              
              <button 
                onClick={() => setMobileMenuOpen(false)} 
                className="lg:hidden text-[#8A857D] hover:text-[#FAF7F2] p-1"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Role Switcher Pill */}
            <div className="mt-5 p-1 bg-[#1E1D1B] rounded-lg border border-[#2E2C28] flex items-center">
              <button
                onClick={() => {
                  setRole("seller");
                  setAdminRole("seller");
                }}
                className={`flex-1 text-xs py-1.5 px-2 rounded-md font-mono tracking-wider transition-all duration-200 ${
                  role === "seller" 
                    ? "bg-[#C5A059] text-[#0D0C0B] font-semibold shadow-sm" 
                    : "text-[#8A857D] hover:text-[#FAF7F2]"
                }`}
              >
                Seller View
              </button>
              <button
                onClick={() => {
                  setRole("super_admin");
                  setAdminRole("super_admin");
                }}
                className={`flex-1 text-xs py-1.5 px-2 rounded-md font-mono tracking-wider transition-all duration-200 ${
                  role === "super_admin" 
                    ? "bg-[#C5A059] text-[#0D0C0B] font-semibold shadow-sm" 
                    : "text-[#8A857D] hover:text-[#FAF7F2]"
                }`}
              >
                Super Admin
              </button>
            </div>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 pb-2 text-[10px] font-mono tracking-widest uppercase text-[#6D685E]">
              Core Operations
            </div>
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                    isActive
                      ? "bg-[#24221F] text-[#FAF7F2] font-medium border border-[#3D3A35] shadow-inner"
                      : "text-[#A8A39A] hover:bg-[#1C1B19] hover:text-[#FAF7F2]"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={isActive ? "text-[#C5A059]" : "text-[#736E64]"}>
                      {item.icon}
                    </span>
                    <span className="tracking-wide text-xs uppercase font-mono">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${item.badgeColor || "bg-[#282624] text-[#A8A39A] border-[#3D3A35]"}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#262422] bg-[#11100F] space-y-3">
          {/* Storefront Link */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs font-mono text-[#8A857D] hover:text-[#C5A059] hover:bg-[#1A1918] rounded-md transition-colors"
          >
            <span className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-[#8A857D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span>Live Storefront (AU)</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              <span>Online</span>
            </span>
          </Link>

          {/* Seller / Admin Profile Card */}
          <div className="flex items-center space-x-3 px-3 py-2.5 rounded-lg bg-[#181715] border border-[#2B2925]">
            <div className="w-8 h-8 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#DFBF7A] text-xs font-serif font-bold">
              BC
            </div>
            <div className="overflow-hidden flex-1">
              <div className="text-xs font-medium text-[#FAF7F2] truncate">Bindy Atelier Melbourne</div>
              <div className="text-[10px] text-[#787369] font-mono truncate">
                {role === "seller" ? "Verified Artisan Seller" : "Master Overseer"}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-[#141312]/90 backdrop-blur-md border-b border-[#262422] sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden text-[#8A857D] hover:text-[#FAF7F2] p-1.5 rounded-md hover:bg-[#201E1C]"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Breadcrumb / Title Context */}
            <div className="hidden sm:flex items-center space-x-2 text-xs font-mono text-[#8A857D]">
              <span className="hover:text-[#FAF7F2] cursor-pointer">Bindy Platform</span>
              <span>/</span>
              <span className="text-[#FAF7F2] uppercase tracking-wider">
                {pathname === "/admin" && "Executive Dashboard"}
                {pathname === "/admin/products" && "Inventory & Silhouettes"}
                {pathname === "/admin/orders" && "Fulfillment & AusPost"}
                {pathname === "/admin/artisans" && "Sri Lankan Handloom Looms"}
                {pathname === "/admin/payouts" && "Payout Settlements"}
              </span>
            </div>
          </div>

          {/* Right actions: Notifications & Quick Link */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Currency Pill */}
            <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#1C1B19] border border-[#2B2925] text-[11px] font-mono text-[#A8A39A]">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>AUD Currency (A$)</span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-[#8A857D] hover:text-[#FAF7F2] hover:bg-[#1E1D1B] rounded-lg transition-colors"
                aria-label="Notifications"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {pendingOrdersCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C5A059]" />
                )}
              </button>

              {/* Notification dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#161513] border border-[#302D28] rounded-xl shadow-2xl p-4 z-50 animate-fadeIn">
                  <div className="flex items-center justify-between pb-3 border-b border-[#292723]">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#FAF7F2]">Atelier Alerts</span>
                    <span className="text-[10px] font-mono text-[#C5A059]">Active</span>
                  </div>
                  <div className="py-2 space-y-2.5">
                    <div className="p-2.5 rounded-lg bg-[#1F1E1B] border border-[#2E2C28] text-xs">
                      <div className="font-medium text-[#FAF7F2]">New AU Order #BIN-AU-8902</div>
                      <div className="text-[11px] text-[#A8A39A] mt-0.5">South Yarra, VIC — $385.00 AUD (Lotus Memory Dress)</div>
                      <div className="text-[9px] font-mono text-[#6B665E] mt-1">12 mins ago · Express AusPost</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#1F1E1B] border border-[#2E2C28] text-xs">
                      <div className="font-medium text-[#DFBF7A]">Loom Batch Complete</div>
                      <div className="text-[11px] text-[#A8A39A] mt-0.5">Kirindiwela Workshop passed 320m Organic Cotton quality check.</div>
                      <div className="text-[9px] font-mono text-[#6B665E] mt-1">2 hours ago</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setNotificationsOpen(false)}
                    className="w-full mt-2 py-1.5 text-center text-xs font-mono text-[#8A857D] hover:text-[#FAF7F2] bg-[#1B1A18] rounded-md transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>

            {/* Quick Action: New Product */}
            <Link
              href="/admin/products"
              className="inline-flex items-center space-x-1.5 bg-[#C5A059] hover:bg-[#b59048] text-[#0D0C0B] px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold transition-colors shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Silhouette</span>
            </Link>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
