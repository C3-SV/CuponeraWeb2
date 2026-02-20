import { create } from "zustand";
import { MOCK_PRODUCTS } from "../data/mockData";

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
}));