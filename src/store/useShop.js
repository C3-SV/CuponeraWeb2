import { create } from "zustand";
import { MOCK_PRODUCTS } from "../data/mockData";
import { supabase } from "../lib/supabaseClient";

const toISO = (d) => new Date(d).toISOString();

const codePrefix3 = (name = "LCP") => {
    const letters = (name.toUpperCase().match(/[A-Z]/g) || []).join("");
    return (letters + "XXX").slice(0, 3);
};

const toDateYYYYMMDD = (d) => {
    const dt = new Date(d);
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

const generateCode = (businessName) => {
    const prefix = codePrefix3(businessName);
    const random7Digits = () => String(Math.floor(Math.random() * 1e10)).padStart(10, "0");
    return `${prefix}${random7Digits()}`;
}

const computeStatus = ({ validUntil, redeemedAt }) => {
    if (redeemedAt) return "redeemed";
    if (validUntil && new Date(validUntil) < new Date()) return "expired";
    return "available";
};

const PRODUCT_IMAGES_BUCKET = "product-images";
const CATEGORY_IMAGES_BUCKET = "categories-icons";
const COMPANY_LOGOS_BUCKET = "companies-logos";

const toStorageUrl = (url, bucket) => {
    if (!url) return null;
    if (/^https?:\/\//i.test(url)) return url;

    const { data } = supabase.storage.from(bucket).getPublicUrl(url);
    return data?.publicUrl ?? null;
};


export const useShopStore = create((set, get) => ({
    // Estado inicial
    products: [],
    categories: [],
    cart: [],
    coupons: [],
    selectedCategory: null,
    productsLoading: false,
    productsError: null,
    // Cargando informacion de la base de datos para ofertas
    loadOffers: async () => {
        set({ productsLoading: true, productsError: null });

        const { data, error } = await supabase
            .from("offers")
            .select(`
      offer_id,
      offer_title,
      offer_description,
      offer_regular_price,
      offer_price,
      offer_start_date,
      offer_end_date,
      coupon_usage_deadline,
      coupon_quantity_limit,
      offer_status,
      company_id,
      deleted_at,

      company:companies (
        company_id,
        company_name,
        company_code,
        company_photo,
        company_commission_rate,
        deleted_at,
        category_id:categories (
            category_id,
            category_name,
            category_img
        )
      ),

      offer_carousel_images (
        offer_carousel_image_id,
        image_url,
        image_alt_text,
        image_sort_order,
        main_image,
        deleted_at
      ),

      offer_list_details (
        offer_list_detail_id,
        item_title,
        item_description,
        item_sort_order,
        deleted_at
      )
    `)
            .is("deleted_at", null)
            .order("created_at", { ascending: false });

        //.order("image_sort_order", { foreignTable: "offer_carousel_images", ascending: true })
        //.order("item_sort_order", { foreignTable: "offer_list_details", ascending: true });

        if (error) {
            console.error("loadOffers:", error);
            set({ productsLoading: false, productsError: error.message });
            return;
        }

        // mapeo al componente 
        const mapped = (data ?? []).map((row) => {
            const images = (row.offer_carousel_images ?? []).map((img) => ({
                id: img.offer_carousel_image_id,
                url: toStorageUrl(img.image_url, PRODUCT_IMAGES_BUCKET),
                alt: img.image_alt_text,
                isMain: img.main_image,
                sortOrder: img.image_sort_order,
            }));

            const mainImage =
                images.find((img) => img.isMain)?.url
                ?? images[0]?.url
                ?? null;

            const rowDetails = (row.offer_list_details ?? [])
                .filter((d) => !d.deleted_at)
                .sort((a, b) => (a.item_sort_order ?? 1) - (b.item_sort_order ?? 1))
                .map((d) => ({
                    id: d.offer_list_detail_id,
                    title: d.item_title,
                    description: d.item_description,
                    order: d.item_sort_order ?? 1,
                }));

            const categoryData = row.company?.category_id
                ? {
                    name: row.company.category_id.category_name,
                }
                : null;

            const details = [...rowDetails, ...(categoryData ? [{ categoryName: categoryData.name }] : [])];


            const businessName =
                row.company?.deleted_at ? "—" : (row.company?.company_name ?? "—");

            const companyPhoto = toStorageUrl(
                row.company?.company_photo ?? null,
                COMPANY_LOGOS_BUCKET
            );

            const categoryName = row.company?.category_id?.category_name ?? null;

            const validUntil = row.coupon_usage_deadline ?? row.offer_end_date ?? null;

            return {
                // campos compatibles con el componente
                id: row.offer_id,
                name: row.offer_title,
                description: row.offer_description,

                price: Number(row.offer_price ?? 0),
                regularPrice: Number(row.offer_regular_price ?? 0),

                startDate: row.offer_start_date,
                endDate: row.offer_end_date,
                validUntil,
                expiresAt: validUntil,

                stock: Number(row.coupon_quantity_limit ?? 0),
                status: row.offer_status,

                companyId: row.company_id,
                businessName,
                companyPhoto,
                categoryName,

                images,
                mainImage: mainImage,
                details,
            };
        });

        set({ products: mapped, productsLoading: false });
    },

    loadCategories: async () => {
        const { data, error } = await supabase
            .from("categories")
            .select(`category_id, category_name, category_img, category_img_hover, alt_text`)
            .is("deleted_at", null)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("loadCategories:", error);
            return [];
        }

        data.map((cat) => {
            cat.category_img = toStorageUrl(cat.category_img, CATEGORY_IMAGES_BUCKET);
            cat.category_img_hover = toStorageUrl(cat.category_img_hover, CATEGORY_IMAGES_BUCKET);
        });

        set({ categories: data ?? [] });
    },

    setCategory: (category) =>
        set({ selectedCategory: category }),

    getProductsByCategory: () => {
        const { products, selectedCategory } = get();
        if (!selectedCategory) return products;

        return products.filter(
            (product) => product.category === selectedCategory
        );
    },

    // Acciones del carrito 
    addToCart: (product, quantity = 1) =>
        set((state) => {
            const qty = Math.max(1, Number(quantity) || 1);
            const existingItem = state.cart.find((item) => item.id === product.id);

            if (existingItem) {
                const current = Number(existingItem.quantity || 0);
                return {
                    cart: state.cart.map((item) =>
                        item.id === product.id
                            ? { ...item, quantity: current + qty }
                            : item
                    ),
                };
            }
            return { cart: [...state.cart, { ...product, quantity: qty }] };
        }),

    removeFromCart: (productId) =>
        set((state) => ({
            cart: state.cart.filter((item) => item.id !== productId),
        })),

    updateQuantity: (productId, quantity) =>
        set((state) => {
            const qty = Math.max(1, Number(quantity) || 1);
            return {
                cart: state.cart.map((item) =>
                    item.id === productId ? { ...item, quantity: qty } : item
                ),
            };
        }),

    clearCart: () => set({ cart: [] }),

    // Acciones de cupones
    finalizePurchase: (meta = {}) =>
        set((state) => {
            const purchaseDate = meta.purchaseDate ?? toISO(new Date());

            // validFrom = fecha de compra
            const validFrom = meta.validFrom ?? purchaseDate;

            // validUntil:
            // 2) si no, lo ponemos a +30 días (placeholder)
            const buildValidUntil = (item) => {
                const fromItem =
                    item.validUntil || item.expiresAt || item.expirationDate || null;
                if (fromItem) return toISO(fromItem);

                // placeholder: +30 días
                const d = new Date(validFrom);
                d.setDate(d.getDate() + 30);
                return d.toISOString();
            };

            const newCoupons = [];
            for (const item of state.cart) {
                const qty = Number(item.quantity || 1);

                for (let i = 0; i < qty; i++) {
                    const coupon = {
                        id: `cp_${Date.now()}_${item.id}_${i}`,
                        code: generateCode(item.businessName || item.merchant || item.store || "X"),

                        offerId: item.id,
                        offerName: item.name ?? item.title ?? "Cupón",
                        businessName: item.businessName ?? item.merchant ?? item.store ?? "—",

                        purchaseDate,
                        validFrom,
                        validUntil: buildValidUntil(item),

                        redeemedAt: null,

                        unitPrice: Number(item.price ?? 0),
                        quantity: 1,

                        status: "available",
                    };
                    coupon.status = computeStatus(coupon);
                    newCoupons.push(coupon);
                }
            }
            return {
                coupons: [...newCoupons, ...(state.coupons ?? [])],
                cart: [], // limpiar el carrito
            };
        }),

    // guardar compra en la base de datos 

    savePurchaseToSupabase: async ({ paymentRef }) => {
        const cart = get().cart;

        if (!cart || cart.length === 0) throw new Error("Carrito vacío");

        const { data: authData, error: authErr } = await supabase.auth.getUser();
        const user = authData?.user;
        if (authErr || !user) throw new Error("No autenticado");

        // 1) Insert order
        const now = new Date();
        const { data: orderRows, error: orderErr } = await supabase
            .from("orders")
            .insert([
                {
                    customer_id: user.id,
                    order_payment_ref: paymentRef ?? null,
                    order_paid_at: now.toISOString(),
                    order_status: "COMPLETED",
                },
            ])
            .select("order_id")
            .single();

        if (orderErr) throw orderErr;

        const orderId = orderRows.order_id;

        try {
            // 2) Insert order_items (return ids)
            const itemsPayload = cart.map((it) => ({
                order_id: orderId,
                offer_id: it.id,
                quantity: Math.max(1, Number(it.quantity) || 1),
                unit_price: Number(it.price ?? 0),
            }));

            const { data: itemRows, error: itemsErr } = await supabase
                .from("order_items")
                .insert(itemsPayload)
                .select("order_item_id, offer_id, quantity");

            if (itemsErr) throw itemsErr;

            // 3) Insert coupons (1 fila por unidad)
            const couponsPayload = [];
            for (const row of itemRows) {
                const original = cart.find((x) => x.id === row.offer_id);
                const businessName = original?.businessName ?? "LCP";

                // expiración: si el offer trae validUntil/expiresAt, úsalo, si no +30 días
                const expires =
                    original?.validUntil || original?.expiresAt
                        ? toDateYYYYMMDD(original.validUntil || original.expiresAt)
                        : (() => {
                            const d = new Date(now);
                            d.setDate(d.getDate() + 30);
                            return toDateYYYYMMDD(d);
                        })();

                const qty = Math.max(1, Number(row.quantity) || 1);

                for (let i = 0; i < qty; i++) {
                    couponsPayload.push({
                        order_item_id: row.order_item_id,
                        coupon_code: generateCode(businessName),
                        coupon_expires_at: expires, // date YYYY-MM-DD
                        coupon_status: "AVAILABLE",
                    });
                }
            }

            // Inserción en lote (si choca UNIQUE por casualidad, lo verás en el error)
            const { error: couponsErr } = await supabase.from("coupons").insert(couponsPayload);
            if (couponsErr) throw couponsErr;

            // 4) limpiar carrito local
            set({ cart: [] });

            return orderId;
        } catch (e) {
            // Rollback: si falla items o coupons, borramos la orden (FK cascade limpia todo)
            await supabase.from("orders").delete().eq("order_id", orderId);
            throw e;
        }
    },

    // cargar cupones desde la base 

    loadMyCouponsFromSupabase: async () => {
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;
        if (!user) {
            set({ coupons: [] });
            return;
        }

        const { data, error } = await supabase
            .from("orders")
            .select(`
      order_id, order_paid_at, order_status,
      order_items (
        order_item_id, offer_id, quantity, unit_price,
        offers (
          offer_title,
          companies ( company_name )
        ),
        coupons (
          coupon_id, coupon_code, coupon_expires_at, coupon_redeemed_at, coupon_status
        )
      )
    `)
            .eq("customer_id", user.id)
            .eq("order_status", "COMPLETED")
            .is("deleted_at", null)
            .order("order_paid_at", { ascending: false });

        if (error) {
            console.error("loadMyCouponsFromSupabase:", error);
            return;
        }

        // Flatten a tu UI
        const out = [];
        for (const o of data ?? []) {
            for (const oi of o.order_items ?? []) {
                const offerName = oi.offers?.offer_title ?? "Cupón";
                const businessName = oi.offers?.companies?.company_name ?? "—";

                for (const c of oi.coupons ?? []) {
                    const status =
                        c.coupon_status === "REDEEMED"
                            ? "redeemed"
                            : new Date(c.coupon_expires_at) < new Date()
                                ? "expired"
                                : "available";

                    out.push({
                        id: c.coupon_id,
                        code: c.coupon_code,
                        offerId: oi.offer_id,
                        offerName,
                        businessName,
                        purchaseDate: o.order_paid_at ? o.order_paid_at.slice(0, 10) : null,
                        validFrom: o.order_paid_at ? o.order_paid_at.slice(0, 10) : null,
                        validUntil: c.coupon_expires_at,
                        redeemedAt: c.coupon_redeemed_at,
                        status,
                    });
                }
            }
        }

        set({ coupons: out });
    },

    // marcar cupon como canjeado 
    redeemCoupon: (couponId) =>
        set((state) => ({
            coupons: state.coupons.map((c) => {
                if (c.id !== couponId) return c;
                const redeemedAt = new Date().toISOString();
                const updated = { ...c, redeemedAt };
                return { ...updated, status: computeStatus(updated) };
            }),
        })),

    // refrescar estados de cupones  
    refreshCouponStatuses: () =>
        set((state) => ({
            coupons: state.coupons.map((c) => {
                const updated = { ...c };
                updated.status = computeStatus(updated);
                return updated;
            }),
        })),

    // limpiar cupones  
    clearCoupons: () => set({ coupons: [] }),
}));