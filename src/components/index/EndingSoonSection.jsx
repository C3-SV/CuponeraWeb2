import { useRef } from "react";
import { OfferCard } from "../offers/OfferCard"; // Ajusta la ruta si es necesario

export const EndingSoonSection = ({ offers, onAddToCart }) => {
    const scrollerRef = useRef(null);

    // Si no hay ofertas, no mostramos nada
    if (!offers || offers.length === 0) return null;

    // Cantidad de px a desplazar
    const step = 320;

    const scrollByDir = (dir) => {
        const el = scrollerRef.current;
        if (!el) return;
        el.scrollBy({ left: dir * step, behavior: "smooth" });
    };

    return (
        <section className="mt-16 mb-12">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Header Unificado (Estilo Categorías) */}
                <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3">
                            <span className="h-8 w-3 rounded bg-primary" />
                            <p className="text-md font-semibold text-primary">
                                ¡Se acaban pronto!
                            </p>
                        </div>
                        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900 font-heading">
                            Ofertas que no querrás perderte
                        </h2>
                    </div>

                    {/* Controles de Navegación (Visibles siempre) */}
                    <div className="mx-auto sm:mx-0 flex items-center gap-2">
                        <button
                            onClick={() => scrollByDir(-1)}
                            className="grid h-10 w-10 place-items-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95 transition"
                            aria-label="Anterior"
                        >
                            <ArrowLeftIcon className="size-5" />
                        </button>
                        <button
                            onClick={() => scrollByDir(1)}
                            className="grid h-10 w-10 place-items-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95 transition"
                            aria-label="Siguiente"
                        >
                            <ArrowRightIcon className="size-5" />
                        </button>
                    </div>
                </div>

                {/* Contenedor del Carrusel */}
                <div className="relative -mx-6 px-6 lg:mx-0 lg:px-0">
                    <div
                        ref={scrollerRef}
                        className="
                            flex gap-6 overflow-x-auto scroll-smooth pb-8 pt-2
                            [scrollbar-width:none] [-ms-overflow-style:none]
                        "
                    >
                        {/* Ocultar scrollbar en Chrome/Safari */}
                        <style>{`div::-webkit-scrollbar { display: none; }`}</style>

                        {offers.map((product) => (
                            <div
                                key={product.id}
                                className="min-w-70 w-70 md:min-w-[320px] md:w-[320px] shrink-0"
                            >
                                <OfferCard
                                    product={product}
                                    onAddToCart={() => onAddToCart(product)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

/* --- Iconos Flechas --- */
function ArrowLeftIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M13.883 5.007l.058 -.005h.118l.058 .005l.06 .009l.052 .01l.108 .032l.067 .027l.132 .07l.09 .065l.081 .073l.083 .094l.054 .077l.054 .096l.017 .036l.027 .067l.032 .108l.01 .053l.01 .06l.004 .057l.002 .059v12c0 .852 -.986 1.297 -1.623 .783l-.084 -.076l-6 -6a1 1 0 0 1 -.083 -1.32l.083 -.094l6 -6l.094 -.083l.077 -.054l.096 -.054l.036 -.017l.067 -.027l.108 -.032l.053 -.01l.06 -.01z" />
        </svg>
    );
}

function ArrowRightIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M9 6c0 -.852 .986 -1.297 1.623 -.783l.084 .076l6 6a1 1 0 0 1 .083 1.32l-.083 .094l-6 6l-.094 .083l-.077 .054l-.096 .054l-.036 .017l-.067 .027l-.108 .032l-.053 .01l-.06 .01l-.057 .004l-.059 .002l-.059 -.002l-.058 -.005l-.06 -.009l-.052 -.01l-.108 -.032l-.067 -.027l-.132 -.07l-.09 -.065l-.081 -.073l-.083 -.094l-.054 -.077l-.054 -.096l-.017 -.036l-.027 -.067l-.032 -.108l-.01 -.053l-.01 -.06l-.004 -.057l-.002 -12.059z" />
        </svg>
    );
}
