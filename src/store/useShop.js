import { create } from "zustand";
import { supabase } from "../lib/supabaseClient";
import Swal from "sweetalert2";

const toISO = (d) => new Date(d).toISOString();

const todayDateSupabaseFormat = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

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
    bestSellers: [],
    endingSoonOffers: [],

    // Cargando informacion de la base de datos 

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
            .eq("offer_status", "APPROVED")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("loadOffers:", error);
            set({ productsLoading: false, productsError: error.message });

            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "error",
                title: "No se pudieron cargar las ofertas",
                showConfirmButton: false,
                timer: 1600,
                timerProgressBar: true,
            });

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

    loadBestSellers: async () => {
        set({ productsLoading: true, productsError: null });

        const { data, error } = await supabase
            .from("top_vendidos_mes")
            .select(`
                offer_id, offer_title, offer_description, offer_regular_price, offer_price,
                offer_start_date, offer_end_date, coupon_usage_deadline, coupon_quantity_limit,
                offer_status, company_id, deleted_at, total_vendido,
                company:companies ( company_id, company_name, company_photo, deleted_at, category_id:categories ( category_id, category_name, category_img ) ),
                offer_carousel_images ( offer_carousel_image_id, image_url, image_alt_text, image_sort_order, main_image, deleted_at ),
                offer_list_details ( offer_list_detail_id, item_title, item_description, item_sort_order, deleted_at )
            `)
            .limit(12);

        if (error) {
            console.error("loadBestSellers:", error);
            set({ productsLoading: false, productsError: error.message });
            return;
        }

        const mapped = (data ?? []).map((row) => {
            const images = (row.offer_carousel_images ?? []).map((img) => ({
                id: img.offer_carousel_image_id,
                url: toStorageUrl(img.image_url, PRODUCT_IMAGES_BUCKET),
                alt: img.image_alt_text,
                isMain: img.main_image,
                sortOrder: img.image_sort_order,
            }));
            const mainImage = images.find((img) => img.isMain)?.url ?? images[0]?.url ?? null;

            return {
                id: row.offer_id,
                name: row.offer_title,
                description: row.offer_description,
                price: Number(row.offer_price ?? 0),
                regularPrice: Number(row.offer_regular_price ?? 0),
                startDate: row.offer_start_date,
                endDate: row.offer_end_date,
                validUntil: row.coupon_usage_deadline ?? row.offer_end_date ?? null,
                expiresAt: row.coupon_usage_deadline ?? row.offer_end_date ?? null,
                stock: Number(row.coupon_quantity_limit ?? 0),
                status: row.offer_status,
                companyId: row.company_id,
                businessName: row.company?.deleted_at ? "—" : (row.company?.company_name ?? "—"),
                companyPhoto: row.company?.company_photo ?? null,
                images,
                mainImage,
                salesCount: row.total_vendido
            };
        });

        set({ bestSellers: mapped, productsLoading: false });
    },

    loadEndingSoon: async () => {
        set({ productsLoading: true, productsError: null });

        // Consultamos directo a la vista de los que expiran pronto
        const { data, error } = await supabase
            .from("ofertas_por_terminar")
            .select(`
                offer_id, offer_title, offer_description, offer_regular_price, offer_price,
                offer_start_date, offer_end_date, coupon_usage_deadline, coupon_quantity_limit,
                offer_status, company_id, deleted_at,
                company:companies ( company_id, company_name, company_photo, deleted_at, category_id:categories ( category_id, category_name, category_img ) ),
                offer_carousel_images ( offer_carousel_image_id, image_url, image_alt_text, image_sort_order, main_image, deleted_at ),
                offer_list_details ( offer_list_detail_id, item_title, item_description, item_sort_order, deleted_at )
            `);

        if (error) {
            console.error("loadEndingSoon:", error);
            set({ productsLoading: false, productsError: error.message });
            return;
        }

        const mapped = (data ?? []).map((row) => {
            const images = (row.offer_carousel_images ?? []).map((img) => ({
                id: img.offer_carousel_image_id,
                url: toStorageUrl(img.image_url, PRODUCT_IMAGES_BUCKET),
                alt: img.image_alt_text,
                isMain: img.main_image,
                sortOrder: img.image_sort_order,
            }));
            const mainImage = images.find((img) => img.isMain)?.url ?? images[0]?.url ?? null;

            return {
                id: row.offer_id,
                name: row.offer_title,
                description: row.offer_description,
                price: Number(row.offer_price ?? 0),
                regularPrice: Number(row.offer_regular_price ?? 0),
                startDate: row.offer_start_date,
                endDate: row.offer_end_date,
                validUntil: row.coupon_usage_deadline ?? row.offer_end_date ?? null,
                expiresAt: row.coupon_usage_deadline ?? row.offer_end_date ?? null,
                stock: Number(row.coupon_quantity_limit ?? 0),
                status: row.offer_status,
                companyId: row.company_id,
                businessName: row.company?.deleted_at ? "—" : (row.company?.company_name ?? "—"),
                companyPhoto: row.company?.company_photo ?? null,
                images,
                mainImage
            };
        });

        set({ endingSoonOffers: mapped, productsLoading: false });
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

                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "success",
                    title: "Cantidad actualizada en el carrito",
                    showConfirmButton: false,
                    timer: 1400,
                    timerProgressBar: true,
                });

                return {
                    cart: state.cart.map((item) =>
                        item.id === product.id
                            ? { ...item, quantity: current + qty }
                            : item
                    ),
                };
            }

            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Agregado al carrito",
                showConfirmButton: false,
                timer: 1400,
                timerProgressBar: true,
            });

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

    clearCart: () => {
        const cart = get().cart;

        if (!cart || cart.length === 0) {
            Swal.fire({
                toast: true,
                position: "top-end",
                icon: "info",
                title: "El carrito ya está vacío",
                showConfirmButton: false,
                timer: 1400,
                timerProgressBar: true,
            });
            return;
        }

        Swal.fire({
            title: "¿Vaciar carrito?",
            text: "Se eliminarán todos los productos del carrito.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, vaciar",
            cancelButtonText: "Cancelar",
        }).then((r) => {
            if (r.isConfirmed) {
                set({ cart: [] });

                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "success",
                    title: "Carrito vaciado",
                    showConfirmButton: false,
                    timer: 1400,
                    timerProgressBar: true,
                });
            }
        });
    },

    // Acciones de cupones
    finalizePurchase: (meta = {}) =>
        set((state) => {
            const purchaseDate = meta.purchaseDate ?? toISO(new Date());

            // validFrom = fecha de compra
            const validFrom = meta.validFrom ?? purchaseDate;

            // validUntil:
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

    // validar compra en base de datos 
    validateCartAgainstDb: async () => {
        const cart = get().cart;
        if (!cart?.length) return { ok: false, issues: ["Carrito vacío"] };

        const today = todayDateSupabaseFormat();
        const ids = [...new Set(cart.map(i => i.id))];

        const { data: rows, error } = await supabase
            .from("offers")
            .select("offer_id, offer_status, deleted_at, coupon_quantity_limit, coupon_usage_deadline, offer_end_date")
            .in("offer_id", ids);

        if (error) throw error;

        const byId = new Map((rows ?? []).map(r => [r.offer_id, r]));
        const issues = [];

        for (const item of cart) {
            const r = byId.get(item.id);
            if (!r) {
                issues.push(`Oferta no encontrada: ${item.name}`);
                continue;
            }

            if (r.deleted_at) issues.push(`Oferta eliminada: ${item.name}`);
            if (r.offer_status !== "APPROVED") issues.push(`Oferta no aprobada: ${item.name}`);

            const stockDb = Number(r.coupon_quantity_limit ?? 0);
            const qty = Math.max(1, Number(item.quantity) || 1);
            if (stockDb < qty) issues.push(`Sin stock suficiente: ${item.name} (disp: ${stockDb}, pedís: ${qty})`);

            const validUntil = (r.coupon_usage_deadline ?? r.offer_end_date);
            const validUntilDate = validUntil ? String(validUntil).slice(0, 10) : null;
            if (validUntilDate && validUntilDate < today) issues.push(`Oferta vencida: ${item.name} (venció: ${validUntilDate})`);
        }

        return { ok: issues.length === 0, issues, offersDb: rows ?? [] };
    },

    // guardar compra en la base de datos 
    savePurchaseToSupabase: async ({ paymentRef, offersDb }) => {
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
            .maybeSingle();

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

            // Insert coupons (1 fila por unidad)
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

            // cambiar y ajustar stock de ofertas 
            const byId = new Map((offersDb ?? []).map(r => [r.offer_id, r]));

            for (const item of cart) {
                const r = byId.get(item.id);
                if (!r) continue;

                const oldStock = Number(r.coupon_quantity_limit ?? 0);
                const qty = Math.max(1, Number(item.quantity) || 1);
                const newStock = oldStock - qty;

                // solo actualiza si el stock no cambió
                const { data: updated, error: updErr } = await supabase
                    .from("offers")
                    .update({ coupon_quantity_limit: newStock })
                    .eq("offer_id", item.id)
                    .eq("coupon_quantity_limit", oldStock)
                    .select("offer_id");

                if (updErr) throw updErr;
                if (!updated || updated.length === 0) {
                    throw new Error(`Stock cambió mientras comprabas: ${item.name}. Reintentá.`);
                }
            }

            // limpiar carrito local
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

    // Logica para validacion y canjeo de cupones 
    fetchCouponForRedeem: async (couponCode) => {
        const code = String(couponCode || "").trim();
        if (!code) throw new Error("Código inválido.");

        // con login 
        const { data: authData, error: authErr } = await supabase.auth.getUser();
        const user = authData?.user;
        if (authErr || !user) throw new Error("Debés iniciar sesión para canjear.");

        // Traer info del cupón + oferta/negocio + order customer (para validar)
        const { data, error } = await supabase
            .from("coupons")
            .select(`
      coupon_id, coupon_code, coupon_status, coupon_expires_at, coupon_redeemed_at, coupon_redeemed_by,
      order_items (
        order_item_id,
        offers ( offer_id, offer_title, companies ( company_id, company_name ) ),
        orders ( order_id, customer_id )
      )
    `)
            .eq("coupon_code", code)
            .maybeSingle();

        if (error) throw error;

        const expires = data.coupon_expires_at;
        const today = todayDateSupabaseFormat();

        const isExpired = expires && expires < today;
        const isRedeemed = data.coupon_status === "REDEEMED";

        // validación
        const ownerId = data.order_items?.orders?.customer_id;
        if (ownerId && ownerId !== user.id) throw new Error("No autorizado para canjear este cupón.");

        return {
            coupon_id: data.coupon_id,
            coupon_code: data.coupon_code,
            coupon_status: data.coupon_status,
            coupon_expires_at: data.coupon_expires_at,
            coupon_redeemed_at: data.coupon_redeemed_at,
            offerName: data.order_items?.offers?.offer_title ?? "Cupón",
            businessName: data.order_items?.offers?.companies?.company_name ?? "—",
            isExpired,
            isRedeemed,
        };
    },

    redeemCouponByCode: async (couponCode) => {
        const code = String(couponCode || "").trim();
        if (!code) throw new Error("Código inválido.");

        const { data: authData, error: authErr } = await supabase.auth.getUser();
        const user = authData?.user;
        if (authErr || !user) throw new Error("Debés iniciar sesión para canjear.");

        const today = todayDateSupabaseFormat();

        // Update atómico: solo canjea si está AVAILABLE y no vencido
        const { data, error } = await supabase
            .from("coupons")
            .update({
                coupon_status: "REDEEMED",
                coupon_redeemed_at: today,
                coupon_redeemed_by: user.id,
            })
            .eq("coupon_code", code)
            .eq("coupon_status", "AVAILABLE")
            .gte("coupon_expires_at", today)
            .select("coupon_id, coupon_code, coupon_status, coupon_redeemed_at")
            .maybeSingle();

        if (error) throw error;

        return data;
    },
}));