import { Link } from "react-router-dom";
import { useShopStore } from "../../store/useShop";
import { OfferCard } from "../offers/OfferCard";

export const BestSellingSection = ({ isLoading }) => {
    const bestSellers = useShopStore((s) => s.bestSellers);
    const addToCart = useShopStore((s) => s.addToCart);

    return (
        <section className="mt-16 mb-12">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3">
                            <span className="h-8 w-3 rounded bg-primary" />
                            <p className="text-md font-semibold text-primary">
                                Más vendidos
                            </p>
                        </div>
                        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900 font-heading">
                            Ofertas más populares del mes
                        </h2>
                    </div>

                    <div className="mx-auto md:mx-0">
                        <Link
                            to="/offers"
                            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-white shadow-sm hover:bg-primary-hover transition-transform hover:scale-105 font-heading"
                        >
                            Ver todas las ofertas
                        </Link>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={`skeleton-best-${i}`}
                                className="w-full h-100 bg-gray-100 rounded-xl animate-pulse"
                            />
                        ))}
                    </div>
                ) : bestSellers && bestSellers.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                        {bestSellers.map((product) => (
                            <div key={product.id} className="w-full">
                                <OfferCard
                                    product={product}
                                    onAddToCart={() => addToCart(product)}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-gray-50 rounded-2xl border border-gray-100 dash-border">
                        <p className="mt-4 text-lg font-medium text-gray-900">
                            Aún no hay favoritos destacando
                        </p>
                        <p className="mt-2 text-sm text-gray-500 max-w-sm">
                            Parece que este mes los usuarios están explorando de
                            todo un poco. ¡Sé el primero en comprar y definir
                            las tendencias!
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};
