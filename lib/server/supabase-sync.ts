import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { StoreState, StoreProduct, StoreOrder } from "@/lib/store-types";

export async function syncProductToSupabase(p: StoreProduct) {
  try {
    const sb = getSupabaseAdmin() as any;
    if (!sb) return;

    const images = [p.image, p.imageHover, ...(p.gallery || [])].filter(Boolean);
    const details = {
      story: p.story,
      storyPlace: p.storyPlace,
      destinations: p.destinations,
      colorName: p.colorName,
      colorHex: p.colorHex,
      palette: p.palette,
      fabric: p.fabric,
      badge: p.badge,
      weightGsm: p.weightGsm,
      originDistrict: p.originDistrict,
      occasions: p.occasions,
      featured: p.featured,
    };

    const { data: prodData } = await sb.from("products").upsert({
      slug: p.id,
      name: p.name,
      description: p.description,
      category_slug: p.category,
      price_aud: p.priceAud,
      compare_at_aud: p.compareAtAud > 0 ? p.compareAtAud : null,
      images,
      details,
      status: p.status || "active",
      updated_at: new Date().toISOString(),
    }, { onConflict: "slug" }).select("id").single();

    if (prodData) {
      await sb.from("product_costs").upsert({
        product_id: prodData.id,
        cost_aud: p.costAud || 0,
        supplier_sku: p.sku || `BIN-${p.id}`,
      }, { onConflict: "product_id" });

      if (p.sizes && Array.isArray(p.sizes)) {
        for (const size of p.sizes) {
          const stock = p.stock && p.stock[size] !== undefined ? p.stock[size] : 0;
          const sku = `${p.sku || "BIN"}-${size.replace(/[^a-zA-Z0-9]/g, "")}`;
          await sb.from("product_variants").upsert({
            product_id: prodData.id,
            size,
            stock,
            sku,
            updated_at: new Date().toISOString(),
          }, { onConflict: "product_id, size" });
        }
      }
    }
  } catch (err) {
    console.warn("[supabase-sync] Error syncing product:", err);
  }
}

export async function syncProductStatusToSupabase(ids: string[], status: "active" | "draft" | "archived") {
  try {
    const sb = getSupabaseAdmin() as any;
    if (!sb) return;
    await sb.from("products").update({ status, updated_at: new Date().toISOString() }).in("slug", ids);
  } catch (err) {
    console.warn("[supabase-sync] Error updating product status:", err);
  }
}

export async function deleteProductFromSupabase(slugOrSlugs: string | string[]) {
  try {
    const sb = getSupabaseAdmin() as any;
    if (!sb) return;
    if (Array.isArray(slugOrSlugs)) {
      if (slugOrSlugs.length > 0) {
        await sb.from("products").delete().in("slug", slugOrSlugs);
      }
    } else if (slugOrSlugs) {
      await sb.from("products").delete().eq("slug", slugOrSlugs);
    }
  } catch (err) {
    console.warn("[supabase-sync] Error deleting product:", err);
  }
}

export async function syncOrderToSupabase(order: StoreOrder) {
  try {
    const sb = getSupabaseAdmin() as any;
    if (!sb) return;

    const { data: orderData } = await sb.from("orders").upsert({
      order_number: order.number,
      idempotency_key: order.requestId || order.id,
      customer_email: order.email,
      customer_name: order.customerName,
      customer_phone: order.phone || "",
      shipping_address: { address: order.address },
      shipping_method: order.shipping >= 18 ? "express" : "standard",
      subtotal_aud: order.subtotal,
      discount_aud: order.discount,
      shipping_aud: order.shipping,
      tax_aud: Math.round((order.total / 11) * 100) / 100,
      total_aud: order.total,
      coupon_code: order.discountCode || null,
      payment_status: order.payment === "paid" ? "paid" : order.payment === "refunded" ? "refunded" : "pending",
      fulfillment_status: order.fulfillment === "delivered" ? "fulfilled" : order.fulfillment === "cancelled" ? "cancelled" : "unfulfilled",
      updated_at: new Date().toISOString(),
    }, { onConflict: "order_number" }).select("id").single();

    if (orderData && order.items && Array.isArray(order.items)) {
      for (const item of order.items) {
        const { data: prod } = await sb.from("products").select("id").eq("slug", item.productId).single();
        if (prod) {
          await sb.from("order_items").upsert({
            order_id: orderData.id,
            product_id: prod.id,
            product_name: item.name,
            size: item.size,
            unit_price_aud: item.priceAud,
            quantity: item.quantity,
            total_price_aud: item.priceAud * item.quantity,
            product_image: item.image || "",
          });
        }
      }
    }
  } catch (err) {
    console.warn("[supabase-sync] Error syncing order:", err);
  }
}

export async function syncStoreStateToSupabase(state: StoreState) {
  try {
    const sb = getSupabaseAdmin() as any;
    if (!sb) return;

    // Sync settings
    if (state.settings) {
      await sb.from("store_settings").upsert({
        id: 1,
        store_name: state.settings.storeName || "BINDY Clothing",
        order_prefix: state.settings.orderPrefix || "BIN",
        standard_shipping_aud: state.settings.standardShipping || 12.00,
        express_shipping_aud: state.settings.expressShipping || 18.00,
        free_shipping_threshold_aud: state.settings.freeShippingThreshold || 150.00,
        tax_rate_percent: 10.00,
        reservation_minutes: 30,
        returns_window_days: state.settings.returnsDays || 30,
        is_maintenance_mode: !state.settings.acceptingOrders,
        announcement_banner: state.settings.announcement || "Complimentary Express Shipping on Australian Orders Over $150",
      }, { onConflict: "id" });
    }

    // Sync discounts
    if (state.discounts && Array.isArray(state.discounts)) {
      for (const d of state.discounts) {
        const type = d.type === "shipping" ? "free_shipping" : d.type === "fixed" ? "fixed_amount" : "percentage";
        await sb.from("discounts").upsert({
          code: d.code.toUpperCase(),
          type,
          value: d.value,
          minimum_spend_aud: d.minimum || 0,
          usage_limit: d.usageLimit > 0 ? d.usageLimit : null,
          used_count: d.used || 0,
          is_active: d.active !== false,
        }, { onConflict: "code" });
      }
    }
  } catch (err) {
    console.warn("[supabase-sync] Error syncing store state:", err);
  }
}
