import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useShopStore } from "../store/useShop";

import { OfferGalery } from "../components/offer_details/OfferGalery";
import { OfferInfo } from "../components/offer_details/OfferInfo";
import { CartForm } from "../components/offer_details/CartForm";
import { OfferDetailsTable } from "../components/offer_details/OfferDetailsTable";
import { RelatedOffers } from "../components/offer_details/RelatedOffers";

export const OfferDetails = () => {
    const { id } = useParams();

    const getOfferById = useShopStore((state) => state.getOfferById);
    const loadOffers = useShopStore((state) => state.loadOffers);
    const products = useShopStore((state) => state.products);
    const addToCart = useShopStore((state) => state.addToCart);

    const [offer, setOffer] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCurrentOffer = async () => {
            setIsLoading(true);
            const fetchedOffer = await getOfferById(id);
            setOffer(fetchedOffer);

            if (products.length === 0) {
                await loadOffers();
            }

            setIsLoading(false);
        };

        fetchCurrentOffer();
    }, [id]);

    const relatedOffers = useMemo(() => {
        if (!offer || products.length === 0) return [];
        return products
            .filter(
                (p) =>
                    p.categoryName === offer.categoryName && p.id !== offer.id,
            )
            .slice(0, 4);
    }, [products, offer]);

    const displayOffer = useMemo(() => {
        if (!offer) return null;
        return {
            ...offer,
            title: offer.name,
        };
    }, [offer]);

    const handleAddToCart = useCallback(
        (qty) => {
            if (offer) addToCart(offer, qty);
        },
        [offer, addToCart],
    );

    const handleAddRelatedToCart = useCallback(
        (p) => {
            addToCart(p, 1);
        },
        [addToCart],
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!offer) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <h2 className="text-2xl font-bold text-gray-800">
                    Producto no encontrado
                </h2>
                <p className="text-gray-500 mt-2">
                    Es posible que esta oferta ya no esté disponible.
                </p>
            </div>
        );
    }

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
                            />

                            <CartForm
                                stock={displayOffer.stock}
                                categoryName={displayOffer.categoryName}
                                businessName={offer.businessName}
                                companyPhoto={offer.companyPhoto}
                                onAddToCart={handleAddToCart}
                            />

                            <OfferDetailsTable details={offer.details || []} />
                        </div>
                    </div>

                    <RelatedOffers
                        offers={relatedOffers}
                        onAddToCart={handleAddRelatedToCart}
                    />
                </div>
            </div>
        </>
    );
};
