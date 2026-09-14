"use client";

import React, { useState, useEffect } from "react";
import {
  getAdminProducts,
  updateProductStock,
  toggleProductPublished,
  addAdminProduct,
  AdminProduct,
  AUSizeStock,
  ADMIN_EVENTS
} from "@/lib/adminData";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    category: "Dresses" as AdminProduct["category"],
    collectionName: "Serendipity" as AdminProduct["collectionName"],
    priceAud: 320,
    costAud: 140,
    fabric: "100% Organic Handloom Cotton",
    originWorkshop: "Kirindiwela Weaving Center",
    artisanMaster: "Dayawathi Gunasekara",
    image: "/images/products/dress-1.jpg",
    stock: {
      "AU 6": 4,
      "AU 8": 6,
      "AU 10": 6,
      "AU 12": 4,
      "AU 14": 2
    } as AUSizeStock
  });

  const loadProducts = () => {
    setProducts(getAdminProducts());
  };

  useEffect(() => {
    loadProducts();
    window.addEventListener(ADMIN_EVENTS.PRODUCTS_UPDATED, loadProducts);
    return () => {
      window.removeEventListener(ADMIN_EVENTS.PRODUCTS_UPDATED, loadProducts);
    };
  }, []);

  // Stock mutation handler
  const handleStockDelta = (productId: string, size: keyof AUSizeStock, delta: number) => {
    updateProductStock(productId, size, delta);
  };

  const handleTogglePublish = (productId: string) => {
    toggleProductPublished(productId);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.sku) return;

    addAdminProduct({
      ...newProduct,
      isPublished: true
    });

    setIsAddModalOpen(false);
    // Reset form
    setNewProduct({
      name: "",
      sku: `BIN-AU-${Math.floor(100 + Math.random() * 900)}`,
      category: "Dresses",
      collectionName: "Serendipity",
      priceAud: 320,
      costAud: 140,
      fabric: "100% Organic Handloom Cotton",
      originWorkshop: "Kirindiwela Weaving Center",
      artisanMaster: "Dayawathi Gunasekara",
      image: "/images/products/dress-1.jpg",
      stock: {
        "AU 6": 4,
        "AU 8": 6,
        "AU 10": 6,
        "AU 12": 4,
        "AU 14": 2
      }
    });
  };

  // Filtered list
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.fabric.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sizesList: (keyof AUSizeStock)[] = ["AU 6", "AU 8", "AU 10", "AU 12", "AU 14"];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#24221F]">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#FAF7F2] font-light tracking-wide">
            Silhouettes & AU Size Inventory
          </h1>
          <p className="text-xs font-mono text-[#8A857D] mt-1">
            Real-time handloom stock matrix across standard Australian sizes (AU 6 to AU 14).
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center space-x-2 bg-[#C5A059] hover:bg-[#b59048] text-[#0D0C0B] px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold transition-colors shadow-sm self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          <span>+ Add Silhouette</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#161513] border border-[#292724] flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by silhouette, SKU, or fabric..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#1C1B19] border border-[#2E2C28] rounded-lg text-xs text-[#FAF7F2] placeholder-[#6D685E] focus:outline-none focus:border-[#C5A059] transition-colors"
          />
          <svg className="w-4 h-4 text-[#6D685E] absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#1C1B19] border border-[#2E2C28] text-xs font-mono text-[#A8A39A] rounded-lg px-3 py-2 focus:outline-none focus:border-[#C5A059]"
          >
            <option value="all">All Categories</option>
            <option value="Dresses">Dresses</option>
            <option value="Tops & Blouses">Tops & Blouses</option>
            <option value="Skirts & Pants">Skirts & Pants</option>
            <option value="Two Piece Sets">Two Piece Sets</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#1C1B19] border border-[#2E2C28] text-xs font-mono text-[#A8A39A] rounded-lg px-3 py-2 focus:outline-none focus:border-[#C5A059]"
          >
            <option value="all">All Stock Statuses</option>
            <option value="in_stock">In Stock (&gt;5)</option>
            <option value="low_stock">Low Stock (1-5)</option>
            <option value="sold_out">Sold Out (0)</option>
          </select>

          <span className="text-xs font-mono text-[#787369] ml-2">
            Showing {filteredProducts.length} of {products.length}
          </span>
        </div>
      </div>

      {/* Products Table with AU Size Stock Matrix */}
      <div className="rounded-xl bg-[#161513] border border-[#292724] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#292724] bg-[#1A1918] text-[11px] font-mono text-[#8A857D] uppercase tracking-wider">
                <th className="py-3.5 px-4 min-w-[240px]">Silhouette & Artisan</th>
                <th className="py-3.5 px-3 min-w-[100px]">Price (AUD)</th>
                {sizesList.map((size) => (
                  <th key={size} className="py-3.5 px-2 text-center min-w-[80px]">
                    {size}
                  </th>
                ))}
                <th className="py-3.5 px-3 text-center min-w-[90px]">Total Stock</th>
                <th className="py-3.5 px-3 text-center min-w-[90px]">Status</th>
                <th className="py-3.5 px-4 text-right min-w-[100px]">Storefront</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#21201D] text-xs font-mono">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-[#1B1A18] transition-colors">
                  {/* Silhouette info */}
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-14 bg-[#23211E] rounded-md overflow-hidden flex-shrink-0 border border-[#33302B]">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-serif text-sm text-[#FAF7F2]">{p.name}</div>
                        <div className="text-[10px] text-[#8A857D] mt-0.5">
                          SKU: <span className="text-[#DFBF7A]">{p.sku}</span> · {p.category}
                        </div>
                        <div className="text-[10px] text-[#6D685E] mt-0.5">
                          {p.originWorkshop} ({p.artisanMaster})
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-4 px-3">
                    <div className="text-[#FAF7F2] font-semibold">${p.priceAud} AUD</div>
                    <div className="text-[10px] text-[#6D685E]">Cost: ${p.costAud}</div>
                  </td>

                  {/* Sizing Columns AU 6 - AU 14 */}
                  {sizesList.map((size) => {
                    const qty = p.stock[size] || 0;
                    return (
                      <td key={size} className="py-4 px-2 text-center">
                        <div className="inline-flex items-center space-x-1 bg-[#1F1E1B] border border-[#2E2C28] rounded-md p-0.5">
                          <button
                            onClick={() => handleStockDelta(p.id, size, -1)}
                            className="w-5 h-5 flex items-center justify-center text-[#8A857D] hover:text-[#FAF7F2] hover:bg-[#2A2825] rounded transition-colors text-xs"
                            title="Decrease stock"
                          >
                            -
                          </button>
                          <span className={`w-6 text-center text-xs font-mono ${qty === 0 ? "text-red-400 font-bold" : qty <= 2 ? "text-amber-400 font-semibold" : "text-[#FAF7F2]"}`}>
                            {qty}
                          </span>
                          <button
                            onClick={() => handleStockDelta(p.id, size, 1)}
                            className="w-5 h-5 flex items-center justify-center text-[#8A857D] hover:text-[#FAF7F2] hover:bg-[#2A2825] rounded transition-colors text-xs"
                            title="Increase stock"
                          >
                            +
                          </button>
                        </div>
                      </td>
                    );
                  })}

                  {/* Total Stock */}
                  <td className="py-4 px-3 text-center">
                    <span className="font-bold text-[#FAF7F2]">{p.totalStock}</span>
                    <span className="text-[10px] text-[#787369] block">units</span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-mono border ${
                      p.status === "in_stock"
                        ? "bg-emerald-950/60 text-emerald-300 border-emerald-800/40"
                        : p.status === "low_stock"
                        ? "bg-amber-950/60 text-amber-300 border-amber-800/40"
                        : "bg-red-950/60 text-red-300 border-red-800/40"
                    }`}>
                      {p.status.replace("_", " ")}
                    </span>
                  </td>

                  {/* Storefront visibility */}
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => handleTogglePublish(p.id)}
                      className={`px-2.5 py-1 rounded text-[10px] font-mono border transition-colors ${
                        p.isPublished
                          ? "bg-[#1E1D1B] text-emerald-400 border-emerald-800/40 hover:bg-[#24221F]"
                          : "bg-[#1E1D1B] text-[#787369] border-[#2E2C28] hover:bg-[#24221F]"
                      }`}
                    >
                      {p.isPublished ? "Published" : "Hidden"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Silhouette Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#161513] border border-[#33302B] rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl animate-fadeIn my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#282623]">
              <h2 className="font-serif text-lg text-[#FAF7F2] font-light">Add New Artisan Silhouette</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#8A857D] hover:text-[#FAF7F2]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8A857D] mb-1">GARMENT NAME</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ella Forest Silk Maxi"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1F1E1B] border border-[#2E2C28] rounded-lg text-[#FAF7F2] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-[#8A857D] mb-1">SKU NUMBER</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BIN-AU-908"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1F1E1B] border border-[#2E2C28] rounded-lg text-[#FAF7F2] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8A857D] mb-1">CATEGORY</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as AdminProduct["category"] })}
                    className="w-full px-3 py-2 bg-[#1F1E1B] border border-[#2E2C28] rounded-lg text-[#FAF7F2] focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="Dresses">Dresses</option>
                    <option value="Tops & Blouses">Tops & Blouses</option>
                    <option value="Skirts & Pants">Skirts & Pants</option>
                    <option value="Two Piece Sets">Two Piece Sets</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#8A857D] mb-1">COLLECTION</label>
                  <select
                    value={newProduct.collectionName}
                    onChange={(e) => setNewProduct({ ...newProduct, collectionName: e.target.value as AdminProduct["collectionName"] })}
                    className="w-full px-3 py-2 bg-[#1F1E1B] border border-[#2E2C28] rounded-lg text-[#FAF7F2] focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="Serendipity">Serendipity Collection</option>
                    <option value="Collection 02">Collection 02 Handloom</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8A857D] mb-1">RETAIL PRICE (AUD)</label>
                  <input
                    type="number"
                    min="1"
                    value={newProduct.priceAud}
                    onChange={(e) => setNewProduct({ ...newProduct, priceAud: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#1F1E1B] border border-[#2E2C28] rounded-lg text-[#FAF7F2] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-[#8A857D] mb-1">ATELIER COST (AUD)</label>
                  <input
                    type="number"
                    min="1"
                    value={newProduct.costAud}
                    onChange={(e) => setNewProduct({ ...newProduct, costAud: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#1F1E1B] border border-[#2E2C28] rounded-lg text-[#FAF7F2] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              {/* AU Sizes Matrix inputs */}
              <div className="p-3 bg-[#1C1B19] border border-[#2A2825] rounded-xl">
                <label className="block text-[#DFBF7A] mb-2 font-mono uppercase tracking-wider text-[11px]">
                  Initial AU Stock Matrix:
                </label>
                <div className="grid grid-cols-5 gap-2 text-center">
                  {sizesList.map((size) => (
                    <div key={size}>
                      <span className="block text-[10px] text-[#8A857D] mb-1">{size}</span>
                      <input
                        type="number"
                        min="0"
                        value={newProduct.stock[size]}
                        onChange={(e) => setNewProduct({
                          ...newProduct,
                          stock: {
                            ...newProduct.stock,
                            [size]: Math.max(0, parseInt(e.target.value) || 0)
                          }
                        })}
                        className="w-full text-center px-1 py-1.5 bg-[#252320] border border-[#38342E] rounded text-[#FAF7F2]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[#8A857D] mb-1">FABRIC & WEAVE</label>
                <input
                  type="text"
                  value={newProduct.fabric}
                  onChange={(e) => setNewProduct({ ...newProduct, fabric: e.target.value })}
                  className="w-full px-3 py-2 bg-[#1F1E1B] border border-[#2E2C28] rounded-lg text-[#FAF7F2] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8A857D] mb-1">SRI LANKAN WORKSHOP</label>
                  <input
                    type="text"
                    value={newProduct.originWorkshop}
                    onChange={(e) => setNewProduct({ ...newProduct, originWorkshop: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1F1E1B] border border-[#2E2C28] rounded-lg text-[#FAF7F2] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-[#8A857D] mb-1">MASTER WEAVER</label>
                  <input
                    type="text"
                    value={newProduct.artisanMaster}
                    onChange={(e) => setNewProduct({ ...newProduct, artisanMaster: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1F1E1B] border border-[#2E2C28] rounded-lg text-[#FAF7F2] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#262422]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#201E1C] text-[#8A857D] hover:text-[#FAF7F2] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#C5A059] text-[#0D0C0B] font-semibold hover:bg-[#b59048] transition-colors"
                >
                  Publish Silhouette
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
