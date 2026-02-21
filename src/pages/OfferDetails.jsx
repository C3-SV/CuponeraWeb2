import { useMemo } from "react";

import { OfferGalery } from "../components/offer_details/OfferGalery";
import { OfferInfo } from "../components/offer_details/OfferInfo";
import { CartForm } from "../components/offer_details/CartForm";
import { OfferDetailsTable } from "../components/offer_details/OfferDetailsTable";
import { RelatedOffers } from "../components/offer_details/RelatedOffers";

import { useShopStore } from "../store/useShop";
import { useParams } from "react-router-dom";

export const OfferDetails = () => {
    const { id } = useParams();

    // Usamos Zustand para obtener datos y la acción
    const products = useShopStore((state) => state.products);
    const addToCart = useShopStore((state) => state.addToCart);

    // Lógica de búsqueda (igual que antes)
    const offer = products.find((p) => p.id === id);
    const relatedOffers = products.filter(
        (p) => p.categoryName === offer?.categoryName && p.id !== offer?.id,
    );

    if (!offer)
        return <div className="p-10 text-center">Producto no encontrado</div>;

    // Adaptador de datos
    const displayOffer = {
        ...offer,
        title: offer.name,
    };

    return (
        <>
            <title>{offer.name}</title>
            <div className="bg-white">
                <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:max-w-7xl lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-10">
                        <OfferGalery
                            images={offer.images || [offer.imageUrl]}
                            title={offer.name}
                        />

                        <div className="mt-10 px-0 sm:mt-14 lg:mt-0">
                            <OfferInfo
                                title={displayOffer.title}
                                price={displayOffer.price}
                                regularPrice={displayOffer.regularPrice}
                                stock={displayOffer.stock}
                                description={displayOffer.description}
                                businessName={offer.businessName}
                                companyPhoto={offer.companyPhoto}
                                categoryName={offer.categoryName}
                            />

                            <CartForm
                                stock={displayOffer.stock}
                                categoryName={displayOffer.categoryName}
                                onAddToCart={(qty) => addToCart(offer, qty)}
                            />

                            <OfferDetailsTable details={offer.details || []} />
                        </div>
                    </div>

                    <RelatedOffers
                        offers={relatedOffers}
                        onAddToCart={(p) => addToCart(p, 1)}
                    />
                </div>
            </div>
        </>
    );
};
