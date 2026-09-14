"use client";

import React, { useState, useEffect } from "react";
import {
  getAdminOrders,
  updateOrderStatus,
  AdminOrder,
  ADMIN_EVENTS
} from "@/lib/adminData";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [activeSlipOrder, setActiveSlipOrder] = useState<AdminOrder | null>(null);

  const loadOrders = () => {
    setOrders(getAdminOrders());
  };

  useEffect(() => {
    loadOrders();
    window.addEventListener(ADMIN_EVENTS.ORDERS_UPDATED, loadOrders);
    return () => {
      window.removeEventListener(ADMIN_EVENTS.ORDERS_UPDATED, loadOrders);
    };
  }, []);

  const handleStatusUpdate = (orderId: string, newStatus: AdminOrder["fulfillmentStatus"]) => {
    // If dispatching, generate realistic AusPost tracking number if not present
    let trackingNumber: string | undefined = undefined;
    const existing = orders.find(o => o.id === orderId);
    if (newStatus === "Dispatched" && !existing?.trackingNumber) {
      trackingNumber = `AP-EX-${Math.floor(10000000 + Math.random() * 90000000)}AU`;
    }
    updateOrderStatus(orderId, newStatus, trackingNumber);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = selectedStatus === "all" || order.fulfillmentStatus === selectedStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.city.toLowerCase().includes(q) ||
      order.postcode.includes(q) ||
      (order.trackingNumber && order.trackingNumber.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  const awaitingPackingCount = orders.filter(o => o.fulfillmentStatus === "Awaiting Packing").length;
  const preparingCount = orders.filter(o => o.fulfillmentStatus === "Preparing Handloom").length;
  const dispatchedCount = orders.filter(o => o.fulfillmentStatus === "Dispatched").length;
  const deliveredCount = orders.filter(o => o.fulfillmentStatus === "Delivered").length;
  const totalAudVolume = orders.reduce((sum, o) => sum + o.totalAud, 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#24221F]">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#FAF7F2] font-light tracking-wide">
            AusPost Fulfillment & Dispatches
          </h1>
          <p className="text-xs font-mono text-[#8A857D] mt-1">
            Australian orders pipeline, Australia Post Express dispatch tracking, and atelier packing slips.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-[#1F1E1B] border border-[#2E2C28] text-[#A8A39A]">
            Total Volume: <strong className="text-[#DFBF7A]">${totalAudVolume.toLocaleString("en-AU", { minimumFractionDigits: 2 })} AUD</strong>
          </span>
        </div>
      </div>

      {/* Status Filter Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#262422] pb-4">
        {[
          { label: "All Orders", key: "all", count: orders.length },
          { label: "Awaiting Packing", key: "Awaiting Packing", count: awaitingPackingCount, highlight: awaitingPackingCount > 0 },
          { label: "Preparing Handloom", key: "Preparing Handloom", count: preparingCount },
          { label: "In Transit / Dispatched", key: "Dispatched", count: dispatchedCount },
          { label: "Delivered", key: "Delivered", count: deliveredCount },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedStatus(tab.key)}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono transition-all flex items-center space-x-2 ${
              selectedStatus === tab.key
                ? "bg-[#C5A059] text-[#0D0C0B] font-semibold shadow-sm"
                : "bg-[#181715] text-[#A8A39A] hover:bg-[#201F1C] hover:text-[#FAF7F2] border border-[#292724]"
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              selectedStatus === tab.key
                ? "bg-[#0D0C0B]/20 text-[#0D0C0B]"
                : tab.highlight
                ? "bg-amber-950/80 text-amber-300 border border-amber-800/40"
                : "bg-[#272522] text-[#8A857D]"
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Filter by Order # (e.g. BIN-AU-8901), customer, or postcode..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-[#161513] border border-[#292724] rounded-lg text-xs text-[#FAF7F2] placeholder-[#6D685E] focus:outline-none focus:border-[#C5A059]"
        />
        <svg className="w-4 h-4 text-[#6D685E] absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Orders List Container */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-[#161513] border border-[#292724]">
            <p className="text-sm font-serif text-[#FAF7F2]">No Australian orders found.</p>
            <p className="text-xs font-mono text-[#8A857D] mt-1">Try switching status filters or search term.</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            return (
              <div
                key={order.id}
                className="rounded-xl bg-[#161513] border border-[#292724] overflow-hidden transition-colors"
              >
                {/* Order Summary Row */}
                <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Order Info & Customer */}
                  <div className="flex items-start sm:items-center space-x-4">
                    <button
                      onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                      className="p-1.5 rounded bg-[#1F1E1B] text-[#8A857D] hover:text-[#FAF7F2] border border-[#2E2C28] mt-1 sm:mt-0"
                      aria-label="Toggle details"
                    >
                      <svg
                        className={`w-4 h-4 transform transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm font-bold text-[#FAF7F2]">
                          {order.orderNumber}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#201F1C] text-[#A8A39A] border border-[#302D29]">
                          {order.createdAt}
                        </span>
                      </div>
                      <div className="text-xs text-[#FAF7F2] mt-1">
                        {order.customerName} · <span className="text-[#8A857D] font-mono">{order.city}, {order.state} {order.postcode}</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Items overview & Total */}
                  <div className="flex items-center space-x-6">
                    <div className="text-xs font-mono">
                      <div className="text-[#A8A39A]">
                        {order.items.length} {order.items.length === 1 ? "Silhouette" : "Silhouettes"}
                      </div>
                      <div className="text-[#DFBF7A] text-[11px] truncate max-w-[200px]">
                        {order.items[0]?.name} ({order.items[0]?.size})
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="text-sm font-bold text-[#FAF7F2]">${order.totalAud.toFixed(2)} AUD</div>
                      <div className="text-[10px] text-emerald-400 font-semibold">{order.paymentStatus}</div>
                    </div>
                  </div>

                  {/* Right: AusPost Status & Controls */}
                  <div className="flex flex-wrap items-center gap-2 justify-end">
                    <span className={`px-2.5 py-1 rounded text-xs font-mono border ${
                      order.fulfillmentStatus === "Dispatched"
                        ? "bg-sky-950/60 text-sky-300 border-sky-800/40"
                        : order.fulfillmentStatus === "Delivered"
                        ? "bg-emerald-950/60 text-emerald-300 border-emerald-800/40"
                        : order.fulfillmentStatus === "Preparing Handloom"
                        ? "bg-purple-950/60 text-purple-300 border-purple-800/40"
                        : "bg-amber-950/60 text-amber-300 border-amber-800/40"
                    }`}>
                      {order.fulfillmentStatus}
                    </span>

                    {/* Quick stage advancer */}
                    {order.fulfillmentStatus === "Awaiting Packing" && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, "Preparing Handloom")}
                        className="px-3 py-1 bg-[#201F1C] hover:bg-[#282622] text-[#DFBF7A] border border-[#3A362F] text-xs font-mono rounded transition-colors"
                      >
                        Prepare Handloom
                      </button>
                    )}

                    {order.fulfillmentStatus === "Preparing Handloom" && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, "Dispatched")}
                        className="px-3 py-1 bg-[#C5A059] hover:bg-[#b59048] text-[#0D0C0B] font-semibold text-xs font-mono rounded transition-colors"
                      >
                        Dispatch AusPost &rarr;
                      </button>
                    )}

                    {order.fulfillmentStatus === "Dispatched" && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, "Delivered")}
                        className="px-3 py-1 bg-[#1C281F] hover:bg-[#233527] text-emerald-300 border border-emerald-800/50 text-xs font-mono rounded transition-colors"
                      >
                        Confirm Delivery
                      </button>
                    )}

                    <button
                      onClick={() => setActiveSlipOrder(order)}
                      className="p-1.5 rounded bg-[#1C1B19] hover:bg-[#252320] text-[#8A857D] hover:text-[#FAF7F2] border border-[#2B2925] text-xs font-mono transition-colors"
                      title="View Packing Slip"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Expandable Order Details Panel */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-3 border-t border-[#24221F] bg-[#131211] text-xs font-mono space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Shipping details */}
                      <div className="p-3 bg-[#181715] rounded-lg border border-[#282623] space-y-1">
                        <div className="text-[10px] text-[#8A857D] uppercase tracking-wider">AUSTRALIAN RECIPIENT</div>
                        <div className="text-[#FAF7F2] font-semibold">{order.customerName}</div>
                        <div className="text-[#A8A39A]">{order.address}</div>
                        <div className="text-[#A8A39A]">{order.city}, {order.state} {order.postcode}</div>
                        <div className="text-[#787369] pt-1">
                          {order.customerEmail} · {order.phone}
                        </div>
                      </div>

                      {/* AusPost Dispatch Details */}
                      <div className="p-3 bg-[#181715] rounded-lg border border-[#282623] space-y-1">
                        <div className="text-[10px] text-[#8A857D] uppercase tracking-wider">CARRIER & TRACKING</div>
                        <div className="text-[#DFBF7A] font-semibold">{order.carrier}</div>
                        <div className="text-[#FAF7F2]">
                          Tracking: {order.trackingNumber || "Pending Dispatch Scan"}
                        </div>
                        {order.dispatchedAt && (
                          <div className="text-[11px] text-[#787369]">
                            Dispatched: {order.dispatchedAt}
                          </div>
                        )}
                        <div className="text-[10px] text-emerald-400 mt-1">
                          ✓ Carbon Neutral Parcel Post AU
                        </div>
                      </div>

                      {/* Summary Notes */}
                      <div className="p-3 bg-[#181715] rounded-lg border border-[#282623] space-y-1">
                        <div className="text-[10px] text-[#8A857D] uppercase tracking-wider">ATELIER NOTES</div>
                        <div className="text-[#A8A39A] italic">
                          {order.notes || "Standard Bindy raw silk ribbon packaging and hand-numbered authentication card included."}
                        </div>
                        <div className="pt-2 text-[10px] text-[#6D685E]">
                          Order ID: {order.id}
                        </div>
                      </div>
                    </div>

                    {/* Ordered Items List */}
                    <div className="pt-2">
                      <div className="text-[10px] text-[#8A857D] uppercase tracking-wider mb-2">
                        PACKING ITEMS MANIFEST
                      </div>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg bg-[#1B1A18] border border-[#2A2825] flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-12 bg-[#252320] rounded overflow-hidden flex-shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <div className="font-serif text-[#FAF7F2]">{item.name}</div>
                                <div className="text-[11px] text-[#8A857D]">
                                  Size: <span className="text-[#DFBF7A] font-bold">{item.size}</span> · Quantity: {item.quantity}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-[#FAF7F2] font-semibold">${item.unitPriceAud} AUD</div>
                              <div className="text-[10px] text-[#787369]">Subtotal: ${(item.unitPriceAud * item.quantity).toFixed(2)} AUD</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Packing Slip Modal */}
      {activeSlipOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FAF7F2] text-[#0D0C0B] rounded-xl max-w-2xl w-full p-8 space-y-6 shadow-2xl font-sans my-8 border border-[#DFBF7A]">
            <div className="flex items-center justify-between border-b border-[#E0DBD2] pb-4">
              <div>
                <span className="font-serif text-2xl tracking-[0.2em] font-light text-[#0D0C0B]">BINDY</span>
                <p className="text-[10px] font-mono tracking-widest text-[#787369] uppercase mt-0.5">
                  Australian Ethical Luxury Atelier · Melbourne & Colombo
                </p>
              </div>
              <div className="text-right font-mono text-xs">
                <div className="font-bold">PACKING SLIP</div>
                <div className="text-[#787369]">{activeSlipOrder.orderNumber}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 text-xs font-mono">
              <div>
                <span className="text-[10px] text-[#787369] uppercase block mb-1">SHIP TO:</span>
                <div className="font-bold text-sm">{activeSlipOrder.customerName}</div>
                <div>{activeSlipOrder.address}</div>
                <div>{activeSlipOrder.city}, {activeSlipOrder.state} {activeSlipOrder.postcode}</div>
                <div>Australia</div>
                <div className="text-[#787369] mt-1">{activeSlipOrder.customerEmail}</div>
              </div>

              <div>
                <span className="text-[10px] text-[#787369] uppercase block mb-1">FULFILLMENT DISPATCH:</span>
                <div>Carrier: <strong>{activeSlipOrder.carrier}</strong></div>
                <div>Tracking: <strong>{activeSlipOrder.trackingNumber || "Pending"}</strong></div>
                <div>Date: {activeSlipOrder.createdAt}</div>
                <div className="mt-2 p-2 bg-[#F0EBE1] rounded text-[11px]">
                  ✓ Inspected by Bindy Master Quality Atelier
                </div>
              </div>
            </div>

            <div className="border-t border-b border-[#E0DBD2] py-4">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-[#787369] uppercase tracking-wider text-[10px]">
                    <th className="pb-2">Garment Silhouette</th>
                    <th className="pb-2 text-center">AU Size</th>
                    <th className="pb-2 text-center">Qty</th>
                    <th className="pb-2 text-right">Price (AUD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0DBD2]">
                  {activeSlipOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 font-serif text-sm">{item.name}</td>
                      <td className="py-2.5 text-center font-bold">{item.size}</td>
                      <td className="py-2.5 text-center">{item.quantity}</td>
                      <td className="py-2.5 text-right font-bold">${(item.unitPriceAud * item.quantity).toFixed(2)} AUD</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center text-xs font-mono">
              <div className="text-[11px] text-[#787369] italic max-w-sm">
                Thank you for honoring ancestral Sri Lankan handloom craft. Each weave carries the legacy of generational weavers.
              </div>
              <div className="text-right">
                <div className="text-[10px] text-[#787369]">TOTAL AUD:</div>
                <div className="text-lg font-serif font-bold">${activeSlipOrder.totalAud.toFixed(2)} AUD</div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#E0DBD2]">
              <button
                onClick={() => setActiveSlipOrder(null)}
                className="px-4 py-2 bg-[#E0DBD2] hover:bg-[#D4CEB3] text-[#0D0C0B] rounded-lg text-xs font-mono"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-[#0D0C0B] text-[#FAF7F2] hover:bg-[#201F1C] rounded-lg text-xs font-mono font-semibold"
              >
                Print Slip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
