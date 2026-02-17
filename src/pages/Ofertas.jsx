import React from "react";

import { OfferCatalogHeader } from "../components/offers/OfferCatalogHeader";
import { DesktopFilterSidebar } from "../components/offers/DesktopFilterSidebar";
import { MobileFiltersDialog } from "../components/offers/MobileFiltersDialog";
import { OfferGrid } from "../components/offers/OfferGrid";

export const Ofertas = () => {
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

    const products = [
        {
            id: "p1",
            name: "Nomad Pouch",
            variant: "White & Black",
            imageUrl:
                "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-07-product-01.jpg",
            alt: "Nomad pouch white and black",
            price: 50,
            oldPrice: 80,
            discountPercent: 40,
        },
        {
            id: "p2",
            name: "Zip Tote Basket",
            variant: "Washed Black",
            imageUrl:
                "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-07-product-02.jpg",
            alt: "Zip tote basket washed black",
            price: 140,
            oldPrice: 180,
            discountPercent: 22,
        },
        {
            id: "p3",
            name: "Medium Stuff Satchel",
            variant: "Blue",
            imageUrl:
                "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-07-product-03.jpg",
            alt: "Medium satchel blue",
            price: 220,
            oldPrice: 260,
            discountPercent: 15,
        },
        {
            id: "p4",
            name: "High Wall Tote",
            variant: "Black & Orange",
            imageUrl:
                "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-07-product-04.jpg",
            alt: "High wall tote black orange",
            price: 210,
            oldPrice: 280,
            discountPercent: 25,
        },
        {
            id: "p5",
            name: "Zip Tote Basket",
            variant: "White & Black",
            imageUrl:
                "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-07-product-05.jpg",
            alt: "Zip tote white black",
            price: 140,
            oldPrice: 160,
            discountPercent: 12,
        },
        {
            id: "p6",
            name: "Zip High Wall Tote",
            variant: "White & Blue",
            imageUrl:
                "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-07-product-06.jpg",
            alt: "Zip high wall tote white blue",
            price: 150,
            oldPrice: 200,
            discountPercent: 25,
        },
        {
            id: "p7",
            name: "Throwback Hip Bag",
            variant: "Salmon",
            imageUrl:
                "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-07-product-07.jpg",
            alt: "Throwback hip bag salmon",
            price: 90,
            oldPrice: 120,
            discountPercent: 25,
        },
        {
            id: "p8",
            name: "Halfsize Tote",
            variant: "Clay",
            imageUrl:
                "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-07-product-08.jpg",
            alt: "Halfsize tote clay",
            price: 210,
            oldPrice: 260,
            discountPercent: 19,
        },
    ];

    function onAddToCart(product) {
        console.log("add to cart:", product);
    }

    return (
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
                            <DesktopFilterSidebar sections={filterSections} />
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
    );
};
