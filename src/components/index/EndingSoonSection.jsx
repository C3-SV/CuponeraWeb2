import { useEffect, useRef, useState } from "react";
import { useShopStore } from "../../store/useShop";
import { OfferCard } from "../offers/OfferCard";

export const EndingSoonSection = ({ isLoading }) => {
    const endingSoonOffers = useShopStore((s) => s.endingSoonOffers);
    const addToCart = useShopStore((s) => s.addToCart);

    const [showButtons, setShowButtons] = useState(false);
    const scrollerRef = useRef(null);

    const checkOverflow = () => {
        if (scrollerRef.current) {
            const { scrollWidth, clientWidth } = scrollerRef.current;
            setShowButtons(scrollWidth > clientWidth);
        }
    };

    useEffect(() => {
        if (!isLoading) {
            checkOverflow();
        }
        window.addEventListener("resize", checkOverflow);
        return () => window.removeEventListener("resize", checkOverflow);
    }, [endingSoonOffers, isLoading]);

    const step = 320;

    const scrollByDir = (dir) => {
        const el = scrollerRef.current;
        if (!el) return;
        el.scrollBy({ left: dir * step, behavior: "smooth" });
    };

    return (
        <section className="mt-16 mb-12">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
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

                    {showButtons &&
                        !isLoading &&
                        endingSoonOffers?.length > 0 && (
                            <div className="mx-auto sm:mx-0 flex items-center gap-2 transition-opacity duration-300">
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
                        )}
                </div>

                {isLoading ? (
                    <div className="relative -mx-6 px-6 lg:mx-0 lg:px-0">
                        <div className="flex gap-6 overflow-hidden pb-8 pt-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div
                                    key={`skeleton-ending-${i}`}
                                    className="min-w-70 w-70 md:min-w-[320px] md:w-[320px] shrink-0 h-100 bg-gray-100 rounded-xl animate-pulse"
                                />
                            ))}
                        </div>
                    </div>
                ) : endingSoonOffers && endingSoonOffers.length > 0 ? (
                    <div className="relative -mx-6 px-6 lg:mx-0 lg:px-0">
                        <div
                            ref={scrollerRef}
                            className="flex gap-6 overflow-x-auto scroll-smooth pb-8 pt-2 [scrollbar-width:none] [-ms-overflow-style:none]"
                        >
                            <style>{`div::-webkit-scrollbar { display: none; }`}</style>
                            {endingSoonOffers.map((product) => (
                                <div
                                    key={product.id}
                                    className="min-w-70 w-70 md:min-w-[320px] md:w-[320px] shrink-0"
                                >
                                    <OfferCard
                                        product={product}
                                        onAddToCart={() => addToCart(product)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-gray-50 rounded-2xl border border-gray-100 dash-border">
                        <p className="mt-4 text-lg font-medium text-gray-900">
                            ¡Tienes tiempo de sobra!
                        </p>
                        <p className="mt-2 text-sm text-gray-500 max-w-sm">
                            Por el momento, ninguna de nuestras ofertas
                            principales está próxima a vencer. Explora con
                            calma.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

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
