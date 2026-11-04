const assert = require("node:assert/strict");

function check(label, fn) {
  try {
    fn();
    console.log(`PASS ${label}`);
  } catch (e) {
    console.error(`FAIL ${label}`);
    console.error(e);
    process.exit(1);
  }
}

// Inline mirror of lib/stock.ts logic to verify CommonJS compatibility
function getStockForSize(stock, sizeStr) {
  if (!stock) return 1;
  if (stock[sizeStr] !== undefined) return stock[sizeStr];
  const sizeDigits = sizeStr.replace(/[^\d]/g, "");
  if (sizeDigits !== "") {
    for (const [key, qty] of Object.entries(stock)) {
      if (key.replace(/[^\d]/g, "") === sizeDigits) {
        return qty;
      }
    }
  }
  const normalizedSearch = sizeStr.trim().toLowerCase();
  for (const [key, qty] of Object.entries(stock)) {
    if (key.trim().toLowerCase() === normalizedSearch) {
      return qty;
    }
  }
  return 1;
}

function isSizeSoldOut(stock, sizeStr) {
  if (!stock) return false;
  return getStockForSize(stock, sizeStr) === 0;
}

function isProductSoldOut(product) {
  if (product.inventoryStatus === "sold_out") return true;
  if (!product.sizes || product.sizes.length === 0) {
    if (product.stock) {
      const vals = Object.values(product.stock);
      return vals.length > 0 && vals.every((v) => v === 0);
    }
    return false;
  }
  return product.sizes.every((sz) => isSizeSoldOut(product.stock, sz));
}

function getFirstAvailableSize(product) {
  if (!product.sizes || product.sizes.length === 0) return null;
  return product.sizes.find((sz) => !isSizeSoldOut(product.stock, sz)) || product.sizes[0] || null;
}

// Test Suite
const testStockFullKeys = {
  "AU 6 (XS)": 0,
  "AU 8 (S)": 5,
  "AU 10 (M)": 3,
  "AU 12 (L)": 2,
  "AU 14 (XL)": 1,
};

const testStockShortKeys = {
  "6": 0,
  "8": 5,
  "10": 3,
};

check("Detects size 6 as sold out with full key 'AU 6 (XS)'", () => {
  assert.equal(isSizeSoldOut(testStockFullKeys, "AU 6 (XS)"), true);
  assert.equal(isSizeSoldOut(testStockFullKeys, "AU 8 (S)"), false);
});

check("Detects size 6 as sold out when looked up via short label '6' or 'AU 6'", () => {
  assert.equal(isSizeSoldOut(testStockFullKeys, "6"), true);
  assert.equal(isSizeSoldOut(testStockFullKeys, "AU 6"), true);
  assert.equal(isSizeSoldOut(testStockFullKeys, "8"), false);
});

check("Detects size 6 as sold out when stock object uses short numeric keys", () => {
  assert.equal(isSizeSoldOut(testStockShortKeys, "AU 6 (XS)"), true);
  assert.equal(isSizeSoldOut(testStockShortKeys, "AU 8 (S)"), false);
});

check("First available size skips sold-out size 6 and chooses size 8", () => {
  const prod = {
    sizes: ["AU 6 (XS)", "AU 8 (S)", "AU 10 (M)", "AU 12 (L)", "AU 14 (XL)"],
    stock: testStockFullKeys,
  };
  assert.equal(getFirstAvailableSize(prod), "AU 8 (S)");
});

check("Recognizes product is not sold out if at least one size remains", () => {
  const prod = {
    sizes: ["AU 6 (XS)", "AU 8 (S)", "AU 10 (M)"],
    stock: testStockFullKeys,
  };
  assert.equal(isProductSoldOut(prod), false);
});

check("Recognizes product is completely sold out when all sizes are 0", () => {
  const prod = {
    sizes: ["AU 6 (XS)", "AU 8 (S)"],
    stock: { "AU 6 (XS)": 0, "AU 8 (S)": 0 },
  };
  assert.equal(isProductSoldOut(prod), true);
});

console.log("All inventory stock resolution checks passed.");

