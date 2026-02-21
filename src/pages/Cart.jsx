import { Link } from "react-router-dom";
import { useShopStore } from "../store/useShop";
import { CartItem } from "../components/cart/CartItem";
import { OrderSummary } from "../components/cart/OrderSummary";

export const Cart = () => {
    const cart = useShopStore((state) => state.cart);
    return (
        <>
            <title>Mi carrito</title>
            <div className="bg-white">
                <div className="mx-auto max-w-2xl px-4 pt-12 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
                    <h1 className="text-center sm:text-left text-2xl font-semibold tracking-wider text-gray-900 font-heading">
                        Mi carrito
                    </h1>

                    <div className="mt-12">
                        {cart.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 mb-6">
                                    Tu carrito está vacío.
                                </p>
                                <Link
                                    to="/offers"
                                    className="inline-block rounded-md bg-primary px-6 py-3 text-base font-medium text-white hover:bg-primary-hover"
                                >
                                    Seguir comprando
                                </Link>
                            </div>
                        ) : (
                            <form className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
                                <section
                                    aria-labelledby="cart-heading"
                                    className="lg:col-span-7"
                                >
                                    <ul
                                        role="list"
                                        className="divide-y divide-gray-200 border-t border-b border-gray-200"
                                    >
                                        {cart.map((item) => (
                                            <CartItem
                                                key={item.id}
                                                item={item}
                                            />
                                        ))}
                                    </ul>
                                </section>

                                {/* Resumen de orden */}
                                <OrderSummary />
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
