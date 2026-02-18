import { create } from "zustand";
import { MOCK_PRODUCTS } from "../data/mockData";

export const useShopStore = create((set, get) => ({
    // Estado inicial
    products: MOCK_PRODUCTS,
    cart: [],

    // Acción: Añadir al carrito
    addToCart: (product, quantity = 1) =>
        set((state) => {
            const existingItem = state.cart.find((item) => item.id === product.id);

            if (existingItem) {
                // Si existe, actualizamos la cantidad
                return {
                    cart: state.cart.map((item) =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    ),
                };
            }

            // Si es nuevo, lo agregamos al array
            return {
                cart: [...state.cart, { ...product, quantity }],
            };
        }),

    // Acción: Remover del carrito
    removeFromCart: (productId) =>
        set((state) => ({
            cart: state.cart.filter((item) => item.id !== productId),
        })),

    // Acción: Limpiar carrito (opcional)
    clearCart: () => set({ cart: [] }),
}));