import React, { useState } from "react";
import { OfferCatalogHeader } from "../components/offers/OfferCatalogHeader";
import { MobileFiltersDialog } from "../components/offers/MobileFiltersDialog";
import { OfferGrid } from "../components/offers/OfferGrid";
import { FiltersLayout } from "../components/offers/FiltersLayout";
import { useShopStore } from "../store/useShop";

export const Offers = ({ title }) => {
    const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
    const [endDate, setEndDate] = useState("");

    const rubrosOptions = [
        { label: "Tecnología", value: "tech" },
        { label: "Hogar", value: "home", checked: true },
    ];

    const products = useShopStore((state) => state.products);
    const addToCart = useShopStore((state) => state.addToCart);

    // Objeto de props compartido para no repetir código
    const filterProps = {
        priceRange,
        setPriceRange,
        endDate,
        setEndDate,
        rubrosOptions,
    };

    const sortOptions = [
        { label: "Más vendidos", value: "best_selling" },
        { label: "Nombre: A-Z", value: "name_asc" },
        { label: "Nombre: Z-A", value: "name_desc" },
        { label: "Precio: Menor a Mayor", value: "price_asc" },
        { label: "Precio: Mayor a Menor", value: "price_desc" },
        { label: "Fecha de Vencimiento Próxima", value: "end_date" },
    ];

    return (
        <div className="bg-white">
            <MobileFiltersDialog>
                <FiltersLayout {...filterProps} />
            </MobileFiltersDialog>

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <OfferCatalogHeader
                    title="Nuevas Ofertas"
                    sortOptions={sortOptions}
                    onSortSelect={() => {}}
                />
                <section className="pt-6 pb-24">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
                        <aside className="hidden lg:block">
                            <FiltersLayout {...filterProps} />
                        </aside>
                        <section>
                            <OfferGrid
                                products={products}
                                onAddToCart={(p) => addToCart(p, 1)}
                            />
                        </section>
                    </div>
                </section>
            </main>
        </div>
    );
};
