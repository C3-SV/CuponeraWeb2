import React, { useState } from "react";
import { OfferCatalogHeader } from "../components/offers/OfferCatalogHeader";
import { MobileFiltersDialog } from "../components/offers/MobileFiltersDialog";
import { OfferGrid } from "../components/offers/OfferGrid";
import { FiltersLayout } from "../components/offers/FiltersLayout";
import { useShopStore } from "../store/useShop";
import { useEffect } from "react";

export const Offers = ({ title }) => {
    const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
    const [endDate, setEndDate] = useState("");
    const [selectedRubros, setSelectedRubros] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState(null);

    const loadOffers = useShopStore((s) => s.loadOffers);
    const loadCategories = useShopStore((s) => s.loadCategories);
    const products = useShopStore((state) => state.products);
    const categories = useShopStore((state) => state.categories);
    const selectedCategory = useShopStore((s) => s.selectedCategory);
    const setCategory = useShopStore((s) => s.setCategory);

    const rubrosOptions = categories.map((cat) => ({
        label: cat.category_name,
        value: cat.category_id,
    }));

    useEffect(() => {
        loadOffers();
        loadCategories();
    }, [loadOffers, loadCategories]);

    // When coming from the home page with a selected category, pre-select it
    useEffect(() => {
        if (selectedCategory) {
            setSelectedRubros([selectedCategory]);
            setCategory(null);
        }
    }, [selectedCategory, setCategory]);

    // Auto-apply filter once products are loaded and a rubro is pre-selected
    useEffect(() => {
        if (products.length > 0 && selectedRubros.length > 0 && filteredProducts === null) {
            setFilteredProducts(products.filter((p) => selectedRubros.includes(p.categoryId)));
        }
    }, [products, selectedRubros, filteredProducts]);

    const handleRubroChange = (value) => {
        setSelectedRubros((prev) =>
            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
        );
    };

    const handleApply = () => {
        let result = [...products];

        if (selectedRubros.length > 0) {
            result = result.filter((p) => selectedRubros.includes(p.categoryId));
        }

        if (priceRange.min > 0 || priceRange.max < 5000) {
            result = result.filter(
                (p) => p.price >= priceRange.min && p.price <= priceRange.max
            );
        }

        if (endDate) {
            result = result.filter((p) => p.endDate && p.endDate <= endDate);
        }

        setFilteredProducts(result);
    };

    const handleClear = () => {
        setPriceRange({ min: 0, max: 5000 });
        setEndDate("");
        setSelectedRubros([]);
        setFilteredProducts(null);
    };

    // Objeto de props compartido para no repetir código
    const filterProps = {
        priceRange,
        setPriceRange,
        endDate,
        setEndDate,
        rubrosOptions,
        selectedRubros,
        onRubroChange: handleRubroChange,
        onApply: handleApply,
        onClear: handleClear,
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
        <>
            <title>{title}</title>
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
                                <OfferGrid products={filteredProducts ?? products} />
                            </section>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
};
