import { create } from "zustand";
import { MOCK_PRODUCTS } from "../data/mockData";

const toISO = (d) => new Date(d).toISOString();

const generateCode = (businessName) => {
    const prefix = businessName[0] || "X";
    const random7Digits = () => String(Math.floor(Math.random() * 10_000_000)).padStart(7, "0");
    return `${prefix}-${random7Digits()}`;
}

const computeStatus = ({ validUntil, redeemedAt }) => {
  if (redeemedAt) return "redeemed";
  if (validUntil && new Date(validUntil) < new Date()) return "expired";
  return "available";
};

export const useShopStore = create((set, get) => ({
    // Estado inicial
    products: MOCK_PRODUCTS,
    cart: [],
    selectedCategory: null,

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
            const existingItem = state.cart.find((item) => item.id === product.id);
            if (existingItem) {
                return {
                    cart: state.cart.map((item) =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    ),
                };
            }
            return { cart: [...state.cart, { ...product, quantity }] };
        }),

    removeFromCart: (productId) =>
        set((state) => ({
            cart: state.cart.filter((item) => item.id !== productId),
        })),

    updateQuantity: (productId, quantity) =>
        set((state) => ({
            cart: state.cart.map((item) =>
                item.id === productId ? { ...item, quantity: Number(quantity) } : item
            ),
        })),

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
                coupons: [...newCoupons, ...state.coupons],
                cart: [], // limpiar el carrito
            };
        }),

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