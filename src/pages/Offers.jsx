import React from "react";

import { OfferCatalogHeader } from "../components/offers/OfferCatalogHeader";
import { DesktopFilterSidebar } from "../components/offers/DesktopFilterSidebar";
import { MobileFiltersDialog } from "../components/offers/MobileFiltersDialog";
import { OfferGrid } from "../components/offers/OfferGrid";
import { useShopStore } from "../store/useShop";

export const Offers = ({ title }) => {
    const filterSections = [
        {
            id: "color",
            name: "Color",
            options: [
                { label: "White", value: "white" },
                { label: "Beige", value: "beige" },
                { label: "Blue", value: "blue", checked: true },
                { label: "Brown", value: "brown" },
                { label: "Green", value: "green" },
                { label: "Purple", value: "purple" },
            ],
        },
        {
            id: "category",
            name: "Category",
            options: [
                { label: "New Arrivals", value: "new-arrivals" },
                { label: "Sale", value: "sale" },
                { label: "Travel", value: "travel", checked: true },
                { label: "Organization", value: "organization" },
                { label: "Accessories", value: "accessories" },
            ],
        },
        {
            id: "size",
            name: "Size",
            options: [
                { label: "2L", value: "2l" },
                { label: "6L", value: "6l" },
                { label: "12L", value: "12l" },
                { label: "18L", value: "18l" },
                { label: "20L", value: "20l" },
                { label: "40L", value: "40l", checked: true },
            ],
        },
    ];

    const sortOptions = [
        { label: "Most Popular", value: "popular" },
        { label: "Best Rating", value: "rating" },
        { label: "Newest", value: "newest" },
        { label: "Price: Low to High", value: "price_asc" },
        { label: "Price: High to Low", value: "price_desc" },
    ];

    const products = useShopStore((state) => state.products);
    const addToCart = useShopStore((state) => state.addToCart);

    function onAddToCart(product) {
        console.log("add to cart:", product);
        addToCart(product, 1);
    }

    return (
        <>
            <title>{title}</title>

            <div className="bg-white">
                <MobileFiltersDialog sections={filterSections} />

                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <OfferCatalogHeader
                        title="New Arrivals"
                        sortOptions={sortOptions}
                        onSortSelect={(opt) => console.log("sort:", opt.value)}
                    />

                    <section
                        aria-labelledby="products-heading"
                        className="pt-6 pb-24"
                    >
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
                            <aside className="hidden lg:block">
                                <DesktopFilterSidebar
                                    sections={filterSections}
                                />
                            </aside>

                            <section>
                                <OfferGrid
                                    products={products}
                                    onAddToCart={onAddToCart}
                                />
                            </section>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
};
