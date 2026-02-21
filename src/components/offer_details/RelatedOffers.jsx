import React from "react";
import { OfferCard } from "../offers/OfferCard";

export const RelatedOffers = React.memo(({ offers, onAddToCart }) => {
    return (
        <section className="mt-14">
            <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-semibold text-gray-900 font-heading">
                    Más ofertas de este rubro
                </h2>
            </div>

            <div className="mt-6">
                {!offers || offers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50 rounded-lg border border-gray-100 border-dashed">
                        <p className="text-gray-500 text-center font-medium">
                            Por el momento no hay más ofertas publicadas en este
                            rubro.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                        {offers.slice(0, 5).map((p) => (
                            <OfferCard
                                product={p}
                                key={p.id}
                                onAddToCart={() => onAddToCart(p)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
});
