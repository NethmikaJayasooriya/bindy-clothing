"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  getAdminProducts,
  getAdminOrders,
  getLoomWorkshops,
  getSalesTimeline,
  getAdminRole,
  updateOrderStatus,
  AdminProduct,
  AdminOrder,
  LoomWorkshop,
  SalesDataPoint,
  AdminRole,
  ADMIN_EVENTS
} from "@/lib/adminData";

export default function AdminDashboardPage() {
  const [role, setRole] = useState<AdminRole>("seller");
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [workshops, setWorkshops] = useState<LoomWorkshop[]>([]);
  const [salesData, setSalesData] = useState<SalesDataPoint[]>([]);
  const [timeRange, setTimeRange] = useState<"7d" | "30d">("7d");
  const [selectedPoint, setSelectedPoint] = useState<SalesDataPoint | null>(null);

  // Load data & subscribe to changes
  useEffect(() => {
    const loadAllData = () => {
      setRole(getAdminRole());
      setProducts(getAdminProducts());
      setOrders(getAdminOrders());
      setWorkshops(getLoomWorkshops());
      setSalesData(getSalesTimeline());
    };

    loadAllData();

    window.addEventListener(ADMIN_EVENTS.ROLE_CHANGED, loadAllData);
    window.addEventListener(ADMIN_EVENTS.PRODUCTS_UPDATED, loadAllData);
    window.addEventListener(ADMIN_EVENTS.ORDERS_UPDATED, loadAllData);

    return () => {
      window.removeEventListener(ADMIN_EVENTS.ROLE_CHANGED, loadAllData);
      window.removeEventListener(ADMIN_EVENTS.PRODUCTS_UPDATED, loadAllData);
      window.removeEventListener(ADMIN_EVENTS.ORDERS_UPDATED, loadAllData);
    };
  }, []);

  // Compute key KPIs
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === "Paid" ? o.totalAud : 0), 0);
  const totalOrdersCount = orders.length;
  const awaitingPackingCount = orders.filter(o => o.fulfillmentStatus === "Awaiting Packing" || o.fulfillmentStatus === "Preparing Handloom").length;
  const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  
  const lowStockProducts = products.filter(p => p.status === "low_stock" || p.status === "sold_out");
  const totalUnitsInStock = products.reduce((sum, p) => sum + p.totalStock, 0);

  // Quick dispatch action for an order directly from dashboard
  const handleQuickStatusChange = (orderId: string, currentStatus: AdminOrder["fulfillmentStatus"]) => {
    let nextStatus: AdminOrder["fulfillmentStatus"] = "Dispatched";
    if (currentStatus === "Awaiting Packing") nextStatus = "Preparing Handloom";
    else if (currentStatus === "Preparing Handloom") nextStatus = "Dispatched";
    else if (currentStatus === "Dispatched") nextStatus = "Delivered";
    else nextStatus = "Awaiting Packing";

    updateOrderStatus(orderId, nextStatus);
  };

  // SVG Chart Dimensions & Helpers
  const maxRevenue = salesData.length > 0 ? Math.max(...salesData.map(d => d.revenueAud)) * 1.15 : 5000;
  const chartHeight = 160;
  const chartWidth = 500;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#24221F]">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="font-serif text-2xl sm:text-3xl text-[#FAF7F2] font-light tracking-wide">
              Atelier Executive Dashboard
            </h1>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#C5A059]/20 text-[#DFBF7A] border border-[#C5A059]/40 tracking-wider">
              {role === "seller" ? "Seller Mode" : "Super Admin"}
            </span>
          </div>
          <p className="text-xs font-mono text-[#8A857D] mt-1.5">
            Real-time Australian sales, AusPost dispatches, and Sri Lankan pit-loom workshop status.
          </p>
        </div>

        {/* Quick controls */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-[#1A1918] border border-[#2B2925] rounded-lg p-1 text-xs font-mono">
            <button
              onClick={() => setTimeRange("7d")}
              className={`px-3 py-1 rounded transition-colors ${timeRange === "7d" ? "bg-[#C5A059] text-[#0D0C0B] font-semibold" : "text-[#8A857D] hover:text-[#FAF7F2]"}`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange("30d")}
              className={`px-3 py-1 rounded transition-colors ${timeRange === "30d" ? "bg-[#C5A059] text-[#0D0C0B] font-semibold" : "text-[#8A857D] hover:text-[#FAF7F2]"}`}
            >
              30 Days
            </button>
          </div>

          <Link
            href="/admin/orders"
            className="hidden sm:inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-lg bg-[#22201D] hover:bg-[#2A2825] border border-[#38342E] text-xs font-mono text-[#DFBF7A] transition-colors"
          >
            <span>AusPost Hub</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Gross Sales */}
        <div className="p-5 rounded-xl bg-[#161513] border border-[#292724] hover:border-[#C5A059]/40 transition-all duration-200">
          <div className="flex items-center justify-between text-xs font-mono text-[#8A857D]">
            <span>GROSS REVENUE (AUD)</span>
            <span className="text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40 text-[10px]">
              +18.4%
            </span>
          </div>
          <div className="mt-2.5 font-serif text-2xl sm:text-3xl text-[#FAF7F2] font-normal tracking-tight">
            ${totalRevenue.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-[11px] font-mono text-[#787369] flex items-center justify-between">
            <span>Direct Consumer & Wholesale</span>
            <span className="text-[#C5A059]">AUD</span>
          </div>
        </div>

        {/* Card 2: Orders & Pending */}
        <div className="p-5 rounded-xl bg-[#161513] border border-[#292724] hover:border-[#C5A059]/40 transition-all duration-200">
          <div className="flex items-center justify-between text-xs font-mono text-[#8A857D]">
            <span>ORDERS FULFILLED</span>
            {awaitingPackingCount > 0 ? (
              <span className="text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40 text-[10px]">
                {awaitingPackingCount} Awaiting Dispatch
              </span>
            ) : (
              <span className="text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40 text-[10px]">
                All Dispatched
              </span>
            )}
          </div>
          <div className="mt-2.5 font-serif text-2xl sm:text-3xl text-[#FAF7F2] font-normal tracking-tight">
            {totalOrdersCount} <span className="text-sm font-mono text-[#8A857D]">Orders</span>
          </div>
          <div className="mt-2 text-[11px] font-mono text-[#787369]">
            Sydney, Melbourne, Brisbane & Perth
          </div>
        </div>

        {/* Card 3: AOV & Inventory */}
        <div className="p-5 rounded-xl bg-[#161513] border border-[#292724] hover:border-[#C5A059]/40 transition-all duration-200">
          <div className="flex items-center justify-between text-xs font-mono text-[#8A857D]">
            <span>AVERAGE ORDER (AOV)</span>
            <span className="text-[#DFBF7A] text-[10px] font-mono">Premium Range</span>
          </div>
          <div className="mt-2.5 font-serif text-2xl sm:text-3xl text-[#FAF7F2] font-normal tracking-tight">
            ${averageOrderValue.toLocaleString("en-AU")}.00
          </div>
          <div className="mt-2 text-[11px] font-mono text-[#787369] flex items-center justify-between">
            <span>Units across sizes</span>
            <span className="text-[#FAF7F2] font-semibold">{totalUnitsInStock} in AU</span>
          </div>
        </div>

        {/* Card 4: Sri Lanka Looms Active */}
        <div className="p-5 rounded-xl bg-[#161513] border border-[#292724] hover:border-[#C5A059]/40 transition-all duration-200">
          <div className="flex items-center justify-between text-xs font-mono text-[#8A857D]">
            <span>PIT-LOOMS WEAVING (SL)</span>
            <span className="text-emerald-400 flex items-center space-x-1 text-[10px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              <span>Active</span>
            </span>
          </div>
          <div className="mt-2.5 font-serif text-2xl sm:text-3xl text-[#FAF7F2] font-normal tracking-tight">
            {workshops.reduce((sum, w) => sum + w.activeWeaversCount, 0)}{" "}
            <span className="text-sm font-mono text-[#8A857D]">Artisans</span>
          </div>
          <div className="mt-2 text-[11px] font-mono text-[#787369]">
            Kirindiwela, Dumbara & Kurunegala
          </div>
        </div>
      </div>

      {/* Main Charts & Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Performance Chart (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-[#161513] border border-[#292724] flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#262422]">
            <div>
              <h2 className="text-sm font-mono uppercase tracking-wider text-[#FAF7F2] flex items-center space-x-2">
                <span>Revenue Performance (AUD)</span>
                <span className="text-[10px] text-[#C5A059] font-mono">· Daily Velocity</span>
              </h2>
              <p className="text-xs text-[#8A857D] font-mono mt-0.5">
                Calculated from verified Australian customer checkout payments
              </p>
            </div>
            {selectedPoint && (
              <div className="text-right font-mono text-xs">
                <span className="text-[#8A857D]">{selectedPoint.dayLabel}: </span>
                <span className="text-[#C5A059] font-bold">${selectedPoint.revenueAud.toLocaleString()} AUD</span>
                <span className="text-[#787369] ml-1">({selectedPoint.ordersCount} orders)</span>
              </div>
            )}
          </div>

          {/* SVG Line / Area Graph */}
          <div className="mt-6 relative">
            <svg 
              className="w-full h-44 overflow-visible" 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C5A059" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#C5A059" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1={chartHeight * 0.25} x2={chartWidth} y2={chartHeight * 0.25} stroke="#292724" strokeDasharray="3 3" />
              <line x1="0" y1={chartHeight * 0.50} x2={chartWidth} y2={chartHeight * 0.50} stroke="#292724" strokeDasharray="3 3" />
              <line x1="0" y1={chartHeight * 0.75} x2={chartWidth} y2={chartHeight * 0.75} stroke="#292724" strokeDasharray="3 3" />
              <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#38342E" />

              {/* Area fill */}
              {salesData.length > 1 && (
                <polygon
                  fill="url(#goldGradient)"
                  points={`
                    0,${chartHeight} 
                    ${salesData.map((d, i) => {
                      const x = (i / (salesData.length - 1)) * chartWidth;
                      const y = chartHeight - (d.revenueAud / maxRevenue) * chartHeight;
                      return `${x},${y}`;
                    }).join(" ")} 
                    ${chartWidth},${chartHeight}
                  `}
                />
              )}

              {/* Line path */}
              {salesData.length > 1 && (
                <polyline
                  fill="none"
                  stroke="#C5A059"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={salesData.map((d, i) => {
                    const x = (i / (salesData.length - 1)) * chartWidth;
                    const y = chartHeight - (d.revenueAud / maxRevenue) * chartHeight;
                    return `${x},${y}`;
                  }).join(" ")}
                />
              )}

              {/* Interactive Points */}
              {salesData.map((d, i) => {
                const x = (i / (salesData.length - 1)) * chartWidth;
                const y = chartHeight - (d.revenueAud / maxRevenue) * chartHeight;
                const isSelected = selectedPoint?.date === d.date;
                return (
                  <g key={d.date} className="cursor-pointer" onMouseEnter={() => setSelectedPoint(d)}>
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? 6 : 4}
                      fill="#0D0C0B"
                      stroke="#C5A059"
                      strokeWidth={isSelected ? 3 : 2}
                      className="transition-all duration-150"
                    />
                  </g>
                );
              })}
            </svg>

            {/* X-Axis labels */}
            <div className="flex justify-between items-center mt-3 text-[11px] font-mono text-[#8A857D]">
              {salesData.map((d) => (
                <span key={d.date} className="text-center">{d.dayLabel}</span>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#262422] flex flex-wrap items-center justify-between text-xs font-mono text-[#8A857D] gap-2">
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#C5A059]" />
              <span>Daily AUD Volume</span>
            </span>
            <span>All sales in Australian Dollars (excl. GST)</span>
          </div>
        </div>

        {/* Low-Stock Inventory Radar (1 col) */}
        <div className="p-6 rounded-xl bg-[#161513] border border-[#292724] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#262422]">
              <h2 className="text-sm font-mono uppercase tracking-wider text-[#FAF7F2] flex items-center space-x-2">
                <span>Inventory Radar</span>
                <span className="text-[10px] text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40">
                  AU Sizes
                </span>
              </h2>
              <Link href="/admin/products" className="text-xs font-mono text-[#C5A059] hover:underline">
                Manage Stock &rarr;
              </Link>
            </div>

            <p className="text-xs text-[#8A857D] font-mono mt-3">
              Stock levels across Australian atelier sizing (AU 6 - AU 14).
            </p>

            {/* Low stock list */}
            <div className="mt-4 space-y-3">
              {lowStockProducts.slice(0, 4).map((item) => (
                <div key={item.id} className="p-3 rounded-lg bg-[#1B1A18] border border-[#2A2825] flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-11 bg-[#252320] rounded overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-xs font-serif text-[#FAF7F2] line-clamp-1">{item.name}</div>
                      <div className="text-[10px] font-mono text-[#8A857D]">
                        ${item.priceAud} AUD · {item.category}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      item.status === "sold_out" 
                        ? "bg-red-950/70 text-red-300 border-red-800/50" 
                        : "bg-amber-950/70 text-amber-300 border-amber-800/50"
                    }`}>
                      {item.totalStock} Left
                    </span>
                    <div className="text-[9px] font-mono text-[#787369] mt-1">
                      Low in AU 6, 8
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#262422]">
            <Link
              href="/admin/products"
              className="w-full block text-center py-2 rounded-lg bg-[#201F1C] hover:bg-[#282622] border border-[#33302A] text-xs font-mono text-[#DFBF7A] transition-colors"
            >
              Update AU Sizing Matrix
            </Link>
          </div>
        </div>
      </div>

      {/* Sri Lankan Loom Workshops Live Production Monitor */}
      <div className="p-6 rounded-xl bg-[#161513] border border-[#292724]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#262422]">
          <div>
            <h2 className="text-sm font-mono uppercase tracking-wider text-[#FAF7F2] flex items-center space-x-2">
              <span>Sri Lankan Handloom Workshops (Direct Loom Status)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h2>
            <p className="text-xs text-[#8A857D] font-mono mt-0.5">
              Live yardage tracking from ancestral pit-looms in Western and Central Provinces.
            </p>
          </div>
          <Link href="/admin/artisans" className="text-xs font-mono text-[#C5A059] hover:underline">
            View All Workshops & Fair Wage Ledger &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {workshops.map((shop) => (
            <div key={shop.id} className="p-4 rounded-xl bg-[#1A1918] border border-[#2C2A26] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-serif font-medium text-[#FAF7F2]">{shop.name}</h3>
                  <p className="text-[10px] font-mono text-[#8A857D]">{shop.district} · Master {shop.masterWeaver}</p>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#252320] text-[#DFBF7A] border border-[#3D3A35]">
                  {shop.status}
                </span>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-[#8A857D] mb-1">
                  <span>Batch: {shop.currentBatchName}</span>
                  <span className="text-[#FAF7F2] font-semibold">{shop.progressPercent}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#2B2925] overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#C5A059] to-[#DFBF7A] rounded-full transition-all duration-500" 
                    style={{ width: `${shop.progressPercent}%` }} 
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-[#787369] mt-1">
                  <span>{shop.completedYardageMeters}m woven</span>
                  <span>Target: {shop.targetYardageMeters}m</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#262422] flex items-center justify-between text-[10px] font-mono text-[#8A857D]">
                <span>Fair Trade Daily Wage:</span>
                <span className="text-emerald-400 font-semibold">${shop.fairTradeWageAudPerDay}.00 AUD/day</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders & AusPost Dispatch Pipeline */}
      <div className="p-6 rounded-xl bg-[#161513] border border-[#292724]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#262422]">
          <div>
            <h2 className="text-sm font-mono uppercase tracking-wider text-[#FAF7F2]">
              Recent Orders & AusPost Dispatch Pipeline
            </h2>
            <p className="text-xs text-[#8A857D] font-mono mt-0.5">
              Click status to advance dispatch stages or print customer packing slips.
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-mono text-[#C5A059] hover:underline"
          >
            Fulfillment Center &rarr;
          </Link>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#292724] text-[11px] font-mono text-[#8A857D] uppercase tracking-wider">
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Customer & Location</th>
                <th className="py-3 px-4">Items & AU Size</th>
                <th className="py-3 px-4">Total (AUD)</th>
                <th className="py-3 px-4">AusPost Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#21201D] text-xs font-mono">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-[#1B1A18] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#FAF7F2]">
                    {order.orderNumber}
                    <div className="text-[10px] text-[#787369] font-normal">{order.carrier}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-[#FAF7F2] font-medium">{order.customerName}</div>
                    <div className="text-[10px] text-[#8A857D]">{order.city}, {order.state} {order.postcode}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-[#A8A39A]">
                        {item.name} <span className="text-[#DFBF7A]">({item.size})</span> x{item.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#FAF7F2]">
                    ${order.totalAud.toFixed(2)}
                    <span className="text-[10px] text-emerald-400 block font-normal">{order.paymentStatus}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono border ${
                      order.fulfillmentStatus === "Dispatched" 
                        ? "bg-sky-950/60 text-sky-300 border-sky-800/40"
                        : order.fulfillmentStatus === "Delivered"
                        ? "bg-emerald-950/60 text-emerald-300 border-emerald-800/40"
                        : "bg-amber-950/60 text-amber-300 border-amber-800/40"
                    }`}>
                      {order.fulfillmentStatus}
                    </span>
                    {order.trackingNumber && (
                      <div className="text-[9px] text-[#787369] mt-0.5">{order.trackingNumber}</div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleQuickStatusChange(order.id, order.fulfillmentStatus)}
                      className="px-2.5 py-1 rounded bg-[#252320] hover:bg-[#302D28] text-[#DFBF7A] border border-[#3D3A35] text-[10px] font-mono transition-colors"
                    >
                      Advance Status &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
