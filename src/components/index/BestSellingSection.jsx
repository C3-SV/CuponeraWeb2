import { Link } from "react-router-dom";
import { OfferCard } from "../offers/OfferCard";

export const BestSellingSection = ({ offers, onAddToCart }) => {
    // Si no hay ofertas, no mostramos nada
    if (!offers || offers.length === 0) return null;

    // Limitamos a 12 productos máximo (Grid 4x3)
    const displayOffers = offers.slice(0, 12);

    return (
        <section className="mt-16 mb-12">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* --- Header: Título y Botón "Ver Todos" --- */}
                <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
                    <div>
                        {/* Etiqueta roja "Este mes" */}
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
                    </div>

                    {/* Botón Ver Todos (Reemplaza a las flechas) */}
                    <div class="mx-auto md:mx-0">
                        <Link
                            to="/offers"
                            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-white shadow-sm hover:bg-primary-hover transition-transform hover:scale-105 font-heading"
                        >
                            Ver todas las ofertas
                        </Link>
                    </div>
                </div>

                {/* --- Grid de Productos (4x3) --- */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                    {displayOffers.map((product) => (
                        <div key={product.id} className="w-full">
                            <OfferCard
                                product={product}
                                onAddToCart={() => onAddToCart(product)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
