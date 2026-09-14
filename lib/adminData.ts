/**
 * BINDY Clothing — Super Admin & Seller Data Layer
 * Provides executive analytics, real-time inventory management across AU sizes,
 * AusPost order fulfillment status, and Sri Lankan artisan loom tracking.
 */

export interface AUSizeStock {
  "AU 6": number;
  "AU 8": number;
  "AU 10": number;
  "AU 12": number;
  "AU 14": number;
}

export interface AdminProduct {
  id: string;
  sku: string;
  name: string;
  category: "Dresses" | "Tops & Blouses" | "Skirts & Pants" | "Two Piece Sets";
  collectionName: "Serendipity" | "Collection 02";
  priceAud: number;
  costAud: number;
  stock: AUSizeStock;
  totalStock: number;
  status: "in_stock" | "low_stock" | "sold_out";
  image: string;
  fabric: string;
  originWorkshop: string;
  artisanMaster: string;
  isPublished: boolean;
  salesCount: number;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  size: string;
  quantity: number;
  unitPriceAud: number;
  image: string;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  city: string;
  state: string;
  postcode: string;
  address: string;
  items: OrderItem[];
  subtotalAud: number;
  shippingAud: number;
  totalAud: number;
  paymentStatus: "Paid" | "Refunded";
  fulfillmentStatus: "Awaiting Packing" | "Preparing Handloom" | "Dispatched" | "Delivered";
  trackingNumber?: string;
  carrier: "Australia Post Express" | "DHL Express";
  notes?: string;
  createdAt: string;
  dispatchedAt?: string;
}

export interface LoomWorkshop {
  id: string;
  name: string;
  district: string;
  masterWeaver: string;
  activeWeaversCount: number;
  specialty: string;
  currentBatchName: string;
  fabricType: string;
  targetYardageMeters: number;
  completedYardageMeters: number;
  progressPercent: number;
  estimatedCompletion: string;
  fairTradeWageAudPerDay: number;
  certifications: string[];
  status: "Weaving" | "Natural Dyeing" | "Finishing & Inspection" | "Ready for Sea/Air Freight";
  image: string;
}

export interface SalesDataPoint {
  date: string;
  dayLabel: string;
  revenueAud: number;
  ordersCount: number;
  aovAud: number;
}

export interface SellerPayout {
  id: string;
  reference: string;
  period: string;
  grossSalesAud: number;
  artisanFairWageDeductionAud: number;
  platformFeeAud: number;
  netPayoutAud: number;
  status: "Settled" | "Processing" | "Upcoming";
  settledDate?: string;
  bankAccount: string;
}

// -----------------------------------------------------------------------------
// Initial Mock Seed Data
// -----------------------------------------------------------------------------

const INITIAL_PRODUCTS: AdminProduct[] = [
  {
    id: "lotus-memory-dress",
    sku: "BND-LMD-01",
    name: "Lotus Memory Dress",
    category: "Dresses",
    collectionName: "Serendipity",
    priceAud: 240,
    costAud: 82,
    stock: { "AU 6": 4, "AU 8": 2, "AU 10": 5, "AU 12": 1, "AU 14": 0 },
    totalStock: 12,
    status: "low_stock",
    image: "/images/hero images only/collection 1/section 1/lotus-memory-dress.jpg",
    fabric: "Pit-Loom Cotton Voile with Scalloped Cutwork",
    originWorkshop: "Gampaha Looms Atelier",
    artisanMaster: "Kalyani Jayawardena",
    isPublished: true,
    salesCount: 84,
    createdAt: "2026-06-10",
  },
  {
    id: "cinnamon-flow-skirt",
    sku: "BND-CFS-02",
    name: "Cinnamon Flow Skirt",
    category: "Skirts & Pants",
    collectionName: "Serendipity",
    priceAud: 195,
    costAud: 65,
    stock: { "AU 6": 8, "AU 8": 6, "AU 10": 9, "AU 12": 4, "AU 14": 3 },
    totalStock: 30,
    status: "in_stock",
    image: "/images/hero images only/collection 1/section 1/cinnamon-flow-skirt.jpg",
    fabric: "True Bias Silk Crepe dyed with Ceylon Cinnamon",
    originWorkshop: "Ella Mountain Guild",
    artisanMaster: "Sunil Bandara",
    isPublished: true,
    salesCount: 112,
    createdAt: "2026-05-18",
  },
  {
    id: "serendib-pearl-dress",
    sku: "BND-SPD-03",
    name: "Serendib Pearl Dress",
    category: "Dresses",
    collectionName: "Serendipity",
    priceAud: 310,
    costAud: 110,
    stock: { "AU 6": 2, "AU 8": 3, "AU 10": 1, "AU 12": 0, "AU 14": 0 },
    totalStock: 6,
    status: "low_stock",
    image: "/images/hero images only/collection 1/section 2/serendib-pearl-dress.jpg",
    fabric: "Single-Ply Unbleached Raw Cotton with Pearl Fasteners",
    originWorkshop: "Mannar Coastal Guild",
    artisanMaster: "Anula Wickramasinghe",
    isPublished: true,
    salesCount: 65,
    createdAt: "2026-06-01",
  },
  {
    id: "shore-traces-blouse",
    sku: "BND-STB-04",
    name: "Shore Traces Blouse",
    category: "Tops & Blouses",
    collectionName: "Serendipity",
    priceAud: 175,
    costAud: 54,
    stock: { "AU 6": 12, "AU 8": 14, "AU 10": 10, "AU 12": 8, "AU 14": 6 },
    totalStock: 50,
    status: "in_stock",
    image: "/images/hero images only/collection 1/section 2/shore-traces-blouse.jpg",
    fabric: "Airy Voile Peplum with Hand-Chiseled Hem",
    originWorkshop: "Galle Heritage Looms",
    artisanMaster: "Rohini De Silva",
    isPublished: true,
    salesCount: 94,
    createdAt: "2026-06-15",
  },
  {
    id: "golden-cascade-dress",
    sku: "BND-GCD-05",
    name: "Golden Cascade Tiered Dress",
    category: "Dresses",
    collectionName: "Collection 02",
    priceAud: 285,
    costAud: 95,
    stock: { "AU 6": 6, "AU 8": 8, "AU 10": 7, "AU 12": 5, "AU 14": 2 },
    totalStock: 28,
    status: "in_stock",
    image: "/images/new info/collection 2/A_GOLDEN_CASCADE_Inspired_by_Sri_Lankas_Ehela_blossom/A_GOLDEN_CASCADE_Inspired_by_Sri_Lankas_Ehela_blossom.jpeg",
    fabric: "Ehela Blossom Botanical Weave with Turned Teak Buttons",
    originWorkshop: "Matale Workshop",
    artisanMaster: "Gamini Ratnayake",
    isPublished: true,
    salesCount: 78,
    createdAt: "2026-08-01",
  },
  {
    id: "the-crimson-lotus",
    sku: "BND-TCL-06",
    name: "The Crimson Lotus Gown",
    category: "Dresses",
    collectionName: "Collection 02",
    priceAud: 320,
    costAud: 115,
    stock: { "AU 6": 3, "AU 8": 4, "AU 10": 2, "AU 12": 1, "AU 14": 1 },
    totalStock: 11,
    status: "in_stock",
    image: "/images/new info/collection 2/The Crimson Lotus/The Crimson Lotus 1.jpeg",
    fabric: "Madder Root Hand-Drape Crepe",
    originWorkshop: "Dambulla Atelier",
    artisanMaster: "Priyanthi Senanayake",
    isPublished: true,
    salesCount: 52,
    createdAt: "2026-08-12",
  },
  {
    id: "tea-leaf-two-piece",
    sku: "BND-TLT-07",
    name: "Tea Leaf Ensemble",
    category: "Two Piece Sets",
    collectionName: "Serendipity",
    priceAud: 290,
    costAud: 98,
    stock: { "AU 6": 1, "AU 8": 2, "AU 10": 1, "AU 12": 0, "AU 14": 0 },
    totalStock: 4,
    status: "low_stock",
    image: "/images/hero images only/collection 1/section 1/cinnamon-flow-skirt.jpg",
    fabric: "Hand-spun Organic Cotton Top & Trouser",
    originWorkshop: "Kandy Mountain Guild",
    artisanMaster: "Upul Weerakkody",
    isPublished: true,
    salesCount: 41,
    createdAt: "2026-07-04",
  },
  {
    id: "desert-rose-set",
    sku: "BND-DRS-08",
    name: "Desert Rose Linen Coordinate",
    category: "Two Piece Sets",
    collectionName: "Collection 02",
    priceAud: 280,
    costAud: 92,
    stock: { "AU 6": 0, "AU 8": 0, "AU 10": 0, "AU 12": 0, "AU 14": 0 },
    totalStock: 0,
    status: "sold_out",
    image: "/images/new info/collection 2/Desert Rose/491359925_1218755440258894_9128689862156059991_n.jpg",
    fabric: "Sun-Bleached Linen & Hand-Carved Coconut Buttons",
    originWorkshop: "Jaffna Looms",
    artisanMaster: "Sivapalan Ramanathan",
    isPublished: true,
    salesCount: 68,
    createdAt: "2026-08-20",
  },
];

const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: "ord-901",
    orderNumber: "BND-9841",
    customerName: "Camilla Hemsworth",
    customerEmail: "camilla.h@sydney.com.au",
    phone: "+61 412 890 234",
    city: "Paddington",
    state: "NSW",
    postcode: "2021",
    address: "142 Glenmore Road",
    items: [
      {
        productId: "lotus-memory-dress",
        name: "Lotus Memory Dress",
        size: "AU 8 (S)",
        quantity: 1,
        unitPriceAud: 240,
        image: "/images/hero images only/collection 1/section 1/lotus-memory-dress.jpg",
      },
      {
        productId: "cinnamon-flow-skirt",
        name: "Cinnamon Flow Skirt",
        size: "AU 8 (S)",
        quantity: 1,
        unitPriceAud: 195,
        image: "/images/hero images only/collection 1/section 1/cinnamon-flow-skirt.jpg",
      },
    ],
    subtotalAud: 435,
    shippingAud: 0,
    totalAud: 435,
    paymentStatus: "Paid",
    fulfillmentStatus: "Awaiting Packing",
    carrier: "Australia Post Express",
    notes: "Leave package at side porch if unattended.",
    createdAt: "2026-09-14T08:14:00Z",
  },
  {
    id: "ord-902",
    orderNumber: "BND-9840",
    customerName: "Gemma Fitzpatrick",
    customerEmail: "gemma.fitz@melbourne.vic.gov.au",
    phone: "+61 405 771 902",
    city: "South Yarra",
    state: "VIC",
    postcode: "3141",
    address: "28/42 Domain Road",
    items: [
      {
        productId: "golden-cascade-dress",
        name: "Golden Cascade Tiered Dress",
        size: "AU 10 (M)",
        quantity: 1,
        unitPriceAud: 285,
        image: "/images/new info/collection 2/A_GOLDEN_CASCADE_Inspired_by_Sri_Lankas_Ehela_blossom/A_GOLDEN_CASCADE_Inspired_by_Sri_Lankas_Ehela_blossom.jpeg",
      },
    ],
    subtotalAud: 285,
    shippingAud: 0,
    totalAud: 285,
    paymentStatus: "Paid",
    fulfillmentStatus: "Awaiting Packing",
    carrier: "Australia Post Express",
    createdAt: "2026-09-14T06:30:00Z",
  },
  {
    id: "ord-903",
    orderNumber: "BND-9839",
    customerName: "Saskia Sterling",
    customerEmail: "saskia@byronbaystudio.com",
    phone: "+61 433 112 567",
    city: "Byron Bay",
    state: "NSW",
    postcode: "2481",
    address: "7 Lighthouse Road",
    items: [
      {
        productId: "serendib-pearl-dress",
        name: "Serendib Pearl Dress",
        size: "AU 6 (XS)",
        quantity: 1,
        unitPriceAud: 310,
        image: "/images/hero images only/collection 1/section 2/serendib-pearl-dress.jpg",
      },
    ],
    subtotalAud: 310,
    shippingAud: 0,
    totalAud: 310,
    paymentStatus: "Paid",
    fulfillmentStatus: "Preparing Handloom",
    trackingNumber: "AP-9928172AU",
    carrier: "Australia Post Express",
    createdAt: "2026-09-13T22:15:00Z",
  },
  {
    id: "ord-904",
    orderNumber: "BND-9838",
    customerName: "Elena Vance",
    customerEmail: "elena.vance@pertharts.org",
    phone: "+61 418 344 891",
    city: "Cottesloe",
    state: "WA",
    postcode: "6011",
    address: "18 Marine Parade",
    items: [
      {
        productId: "the-crimson-lotus",
        name: "The Crimson Lotus Gown",
        size: "AU 10 (M)",
        quantity: 1,
        unitPriceAud: 320,
        image: "/images/new info/collection 2/The Crimson Lotus/The Crimson Lotus 1.jpeg",
      },
    ],
    subtotalAud: 320,
    shippingAud: 0,
    totalAud: 320,
    paymentStatus: "Paid",
    fulfillmentStatus: "Dispatched",
    trackingNumber: "AP-9812401AU",
    carrier: "Australia Post Express",
    createdAt: "2026-09-13T14:20:00Z",
    dispatchedAt: "2026-09-14T02:00:00Z",
  },
  {
    id: "ord-905",
    orderNumber: "BND-9837",
    customerName: "Miriam Al-Hassan",
    customerEmail: "miriam@brisbanedesign.com.au",
    phone: "+61 409 663 118",
    city: "New Farm",
    state: "QLD",
    postcode: "4005",
    address: "55 Merthyr Road",
    items: [
      {
        productId: "shore-traces-blouse",
        name: "Shore Traces Blouse",
        size: "AU 8 (S)",
        quantity: 1,
        unitPriceAud: 175,
        image: "/images/hero images only/collection 1/section 2/shore-traces-blouse.jpg",
      },
    ],
    subtotalAud: 175,
    shippingAud: 0,
    totalAud: 175,
    paymentStatus: "Paid",
    fulfillmentStatus: "Delivered",
    trackingNumber: "AP-9710398AU",
    carrier: "Australia Post Express",
    createdAt: "2026-09-11T10:05:00Z",
    dispatchedAt: "2026-09-11T16:00:00Z",
  },
];

const INITIAL_LOOMS: LoomWorkshop[] = [
  {
    id: "loom-gampaha",
    name: "Gampaha Looms Atelier",
    district: "Western Province",
    masterWeaver: "Kalyani Jayawardena",
    activeWeaversCount: 16,
    specialty: "60s Count Featherlight Voile & Scalloped Cutwork",
    currentBatchName: "Batch Voile-904 (Lotus Reserve)",
    fabricType: "Pure Botanical Cotton Voile",
    targetYardageMeters: 450,
    completedYardageMeters: 380,
    progressPercent: 84,
    estimatedCompletion: "2026-09-22",
    fairTradeWageAudPerDay: 48.5,
    certifications: ["Ancestral Handloom Certified", "Fair Wage Verified", "Zero Chemical Bleach"],
    status: "Weaving",
    image: "/images/destinations/gampaha.jpg",
  },
  {
    id: "loom-ella",
    name: "Ella Mountain Guild",
    district: "Uva Highlands",
    masterWeaver: "Sunil Bandara",
    activeWeaversCount: 12,
    specialty: "45° True Bias Fluid Twill with Cinnamon Bark Steep",
    currentBatchName: "Batch Cinnamon-722",
    fabricType: "Heavy Bias Mulberry Twill",
    targetYardageMeters: 300,
    completedYardageMeters: 290,
    progressPercent: 96,
    estimatedCompletion: "2026-09-16",
    fairTradeWageAudPerDay: 52.0,
    certifications: ["Ancestral Handloom Certified", "Natural Dye Lot A1", "Carbon Neutral Guild"],
    status: "Finishing & Inspection",
    image: "/images/destinations/ella.jpg",
  },
  {
    id: "loom-matale",
    name: "Matale Spice & Timber Workshop",
    district: "Central Province",
    masterWeaver: "Gamini Ratnayake",
    activeWeaversCount: 18,
    specialty: "Hand-Carved Timber Fasteners & Ehela Blossom Drapes",
    currentBatchName: "Batch Golden-Cascade-18",
    fabricType: "Textured Ochre Handloom Cotton",
    targetYardageMeters: 500,
    completedYardageMeters: 310,
    progressPercent: 62,
    estimatedCompletion: "2026-09-28",
    fairTradeWageAudPerDay: 49.0,
    certifications: ["Sustainably Sourced Teak", "Fair Trade Certified"],
    status: "Natural Dyeing",
    image: "/images/destinations/matale.jpg",
  },
  {
    id: "loom-mannar",
    name: "Mannar Coastal Shell Guild",
    district: "Northern Coast",
    masterWeaver: "Anula Wickramasinghe",
    activeWeaversCount: 14,
    specialty: "River Shell Fasteners & Unbleached Raw Voile",
    currentBatchName: "Batch Pearl-Maxi-09",
    fabricType: "Open-Cell Raw Ecru Cotton",
    targetYardageMeters: 350,
    completedYardageMeters: 350,
    progressPercent: 100,
    estimatedCompletion: "Ready Now",
    fairTradeWageAudPerDay: 51.5,
    certifications: ["Natural Fastener Guild Certified", "Fair Wage Living Verified"],
    status: "Ready for Sea/Air Freight",
    image: "/images/destinations/mannar.jpg",
  },
];

const INITIAL_SALES_TIMELINE: SalesDataPoint[] = [
  { date: "2026-09-08", dayLabel: "Mon", revenueAud: 4890, ordersCount: 18, aovAud: 271 },
  { date: "2026-09-09", dayLabel: "Tue", revenueAud: 5620, ordersCount: 21, aovAud: 267 },
  { date: "2026-09-10", dayLabel: "Wed", revenueAud: 6940, ordersCount: 24, aovAud: 289 },
  { date: "2026-09-11", dayLabel: "Thu", revenueAud: 7850, ordersCount: 28, aovAud: 280 },
  { date: "2026-09-12", dayLabel: "Fri", revenueAud: 9240, ordersCount: 31, aovAud: 298 },
  { date: "2026-09-13", dayLabel: "Sat", revenueAud: 11480, ordersCount: 39, aovAud: 294 },
  { date: "2026-09-14", dayLabel: "Sun (Today)", revenueAud: 8960, ordersCount: 23, aovAud: 389 },
];

const INITIAL_PAYOUTS: SellerPayout[] = [
  {
    id: "pay-101",
    reference: "PAY-AU-9821",
    period: "1 Sep 2026 – 14 Sep 2026",
    grossSalesAud: 54980,
    artisanFairWageDeductionAud: 12450,
    platformFeeAud: 2749,
    netPayoutAud: 39781,
    status: "Upcoming",
    bankAccount: "Commonwealth Bank of Australia (•••• 8921)",
  },
  {
    id: "pay-100",
    reference: "PAY-AU-9740",
    period: "15 Aug 2026 – 31 Aug 2026",
    grossSalesAud: 48210,
    artisanFairWageDeductionAud: 10920,
    platformFeeAud: 2410,
    netPayoutAud: 34880,
    status: "Settled",
    settledDate: "2026-09-02",
    bankAccount: "Commonwealth Bank of Australia (•••• 8921)",
  },
  {
    id: "pay-099",
    reference: "PAY-AU-9620",
    period: "1 Aug 2026 – 14 Aug 2026",
    grossSalesAud: 42190,
    artisanFairWageDeductionAud: 9680,
    platformFeeAud: 2109,
    netPayoutAud: 30401,
    status: "Settled",
    settledDate: "2026-08-16",
    bankAccount: "Commonwealth Bank of Australia (•••• 8921)",
  },
];

export type AdminRole = "seller" | "super_admin";

export const ADMIN_EVENTS = {
  PRODUCTS_UPDATED: "bindy_admin_products_updated",
  ORDERS_UPDATED: "bindy_admin_orders_updated",
  ROLE_CHANGED: "bindy_admin_role_updated",
  WORKSHOPS_UPDATED: "bindy_admin_workshops_updated",
} as const;

// -----------------------------------------------------------------------------
// Reactive Storage Handlers
// -----------------------------------------------------------------------------

const STORAGE_KEYS = {
  PRODUCTS: "bindy_admin_products",
  ORDERS: "bindy_admin_orders",
  LOOMS: "bindy_admin_looms",
  VIEW_ROLE: "bindy_admin_view_role",
};

export function getAdminProducts(): AdminProduct[] {
  if (typeof window === "undefined") return INITIAL_PRODUCTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PRODUCTS;
  }
}

export function saveAdminProducts(products: AdminProduct[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  window.dispatchEvent(new Event("bindy_admin_products_updated"));
}

export function getAdminOrders(): AdminOrder[] {
  if (typeof window === "undefined") return INITIAL_ORDERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ORDERS;
  }
}

export function saveAdminOrders(orders: AdminOrder[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  window.dispatchEvent(new Event("bindy_admin_orders_updated"));
}

export function getAdminLooms(): LoomWorkshop[] {
  if (typeof window === "undefined") return INITIAL_LOOMS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOOMS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.LOOMS, JSON.stringify(INITIAL_LOOMS));
      return INITIAL_LOOMS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_LOOMS;
  }
}

export function getAdminSalesTimeline(): SalesDataPoint[] {
  return INITIAL_SALES_TIMELINE;
}

export function getAdminPayouts(): SellerPayout[] {
  return INITIAL_PAYOUTS;
}

// Aliases for intuitive imports
export const getLoomWorkshops = getAdminLooms;
export const getSalesTimeline = getAdminSalesTimeline;
export const getSellerPayouts = getAdminPayouts;

export function getAdminRole(): "seller" | "super_admin" {
  if (typeof window === "undefined") return "seller";
  const saved = localStorage.getItem(STORAGE_KEYS.VIEW_ROLE);
  return saved === "super_admin" ? "super_admin" : "seller";
}

export function setAdminRole(role: "seller" | "super_admin") {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.VIEW_ROLE, role);
  window.dispatchEvent(new Event("bindy_admin_role_updated"));
}

// -----------------------------------------------------------------------------
// Mutation Helpers
// -----------------------------------------------------------------------------

export function updateProductStock(
  productId: string,
  sizeKey: keyof AUSizeStock,
  delta: number
) {
  const products = getAdminProducts();
  const updated = products.map((prod) => {
    if (prod.id === productId) {
      const current = prod.stock[sizeKey] || 0;
      const nextSizeCount = Math.max(0, current + delta);
      const nextStock = { ...prod.stock, [sizeKey]: nextSizeCount };
      const nextTotal = Object.values(nextStock).reduce((a, b) => a + b, 0);
      const nextStatus =
        nextTotal === 0 ? "sold_out" : nextTotal <= 8 ? "low_stock" : "in_stock";

      return {
        ...prod,
        stock: nextStock,
        totalStock: nextTotal,
        status: nextStatus as "in_stock" | "low_stock" | "sold_out",
      };
    }
    return prod;
  });
  saveAdminProducts(updated);
}

export function toggleProductPublished(productId: string) {
  const products = getAdminProducts();
  const updated = products.map((p) =>
    p.id === productId ? { ...p, isPublished: !p.isPublished } : p
  );
  saveAdminProducts(updated);
}

export function addAdminProduct(
  newProd: Omit<AdminProduct, "id" | "sku" | "totalStock" | "salesCount" | "createdAt" | "status"> & {
    status?: AdminProduct["status"];
  }
) {
  const products = getAdminProducts();
  const totalStock = Object.values(newProd.stock).reduce((a, b) => a + b, 0);
  const id = newProd.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const sku = `BND-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${products.length + 1}`;
  const status = newProd.status || (totalStock === 0 ? "sold_out" : totalStock <= 8 ? "low_stock" : "in_stock");

  const created: AdminProduct = {
    ...newProd,
    id,
    sku,
    totalStock,
    status,
    salesCount: 0,
    createdAt: new Date().toISOString().split("T")[0],
  };

  saveAdminProducts([created, ...products]);
  return created;
}

export function updateOrderStatus(
  orderId: string,
  status: AdminOrder["fulfillmentStatus"],
  trackingNumber?: string
) {
  const orders = getAdminOrders();
  const updated = orders.map((o) => {
    if (o.id === orderId) {
      return {
        ...o,
        fulfillmentStatus: status,
        trackingNumber: trackingNumber || o.trackingNumber || `AP-${Math.floor(1000000 + Math.random() * 9000000)}AU`,
        dispatchedAt: status === "Dispatched" ? new Date().toISOString() : o.dispatchedAt,
      };
    }
    return o;
  });
  saveAdminOrders(updated);
}
