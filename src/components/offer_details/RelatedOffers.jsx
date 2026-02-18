import { OfferCard } from "../offers/OfferCard";
export const RelatedOffers = ({ offers, onAddToCart }) => {
    if (!offers || offers.length === 0) return null;

    return (
        <section className="mt-14">
            <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-semibold text-gray-900 font-heading">
                    Más ofertas de este rubro
                </h2>
            </div>

            <div className="mt-6">
                <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                    {offers.slice(0, 5).map((p) => (
                        <OfferCard
                            product={p}
                            key={p.id}
                            onAddToCart={() => onAddToCart(p)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
