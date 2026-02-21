import React, { useState, useEffect, useMemo } from "react";
import { OfferCatalogHeader } from "../components/offers/OfferCatalogHeader";
import { MobileFiltersDialog } from "../components/offers/MobileFiltersDialog";
import { OfferGrid } from "../components/offers/OfferGrid";
import { FiltersLayout } from "../components/offers/FiltersLayout";
import { useShopStore } from "../store/useShop";

export const Offers = ({ title }) => {
    const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
    const [endDate, setEndDate] = useState("");
    const [selectedRubros, setSelectedRubros] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const [sortOption, setSortOption] = useState("");

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

    useEffect(() => {
        if (selectedCategory) {
            setSelectedRubros([selectedCategory]);
            setCategory(null);
        }
    }, [selectedCategory, setCategory]);

    const handleRubroChange = (value) => {
        setSelectedRubros((prev) =>
            prev.includes(value)
                ? prev.filter((v) => v !== value)
                : [...prev, value],
        );
    };

    // Auto-apply filters whenever any filter state or products change
    useEffect(() => {
        if (products.length === 0) return;

        const hasActiveFilters =
            selectedRubros.length > 0 ||
            priceRange.min !== 0 ||
            priceRange.max !== 5000 ||
            endDate;

        if (!hasActiveFilters) {
            setFilteredProducts(null);
            return;
        }

        let result = [...products];

        if (selectedRubros.length > 0) {
            result = result.filter((p) =>
                selectedRubros.includes(p.categoryId),
            );
        }

        if (priceRange.min !== 0 || priceRange.max !== 5000) {
            result = result.filter(
                (p) =>
                    Number(p.price || 0) >= priceRange.min &&
                    Number(p.price || 0) <= priceRange.max,
            );
        }

        if (endDate) {
            result = result.filter((p) => p.endDate && p.endDate <= endDate);
        }

        setFilteredProducts(result);
    }, [selectedRubros, priceRange, endDate, products]);

    const handleClear = () => {
        setPriceRange({ min: 0, max: 5000 });
        setEndDate("");
        setSelectedRubros([]);
        setFilteredProducts(null);
    };

    const filterProps = {
        priceRange,
        setPriceRange,
        endDate,
        setEndDate,
        rubrosOptions,
        selectedRubros,
        onRubroChange: handleRubroChange,
        onClear: handleClear,
    };

    const sortOptions = [
        { label: "Todos", value: "" },
        { label: "Nombre: A-Z", value: "name_asc" },
        { label: "Nombre: Z-A", value: "name_desc" },
        { label: "Precio: Menor a Mayor", value: "price_asc" },
        { label: "Precio: Mayor a Menor", value: "price_desc" },
    ];

    const baseProducts = filteredProducts ?? products;
    const displayedProducts = searchQuery
        ? baseProducts.filter((p) => {
              const q = searchQuery.toLowerCase();
              return (
                  p.name?.toLowerCase().includes(q) ||
                  p.description?.toLowerCase().includes(q) ||
                  p.businessName?.toLowerCase().includes(q)
              );
          })
        : baseProducts;

    const sortedProducts = useMemo(() => {
        const result = [...displayedProducts];

        if (!sortOption) return result;

        const byNameAsc = (a, b) =>
            (a.name || "").localeCompare(b.name || "", undefined, {
                sensitivity: "base",
            });

        const byNameDesc = (a, b) =>
            (b.name || "").localeCompare(a.name || "", undefined, {
                sensitivity: "base",
            });

        const byPriceAsc = (a, b) =>
            Number(a.price || 0) - Number(b.price || 0);

        const byPriceDesc = (a, b) =>
            Number(b.price || 0) - Number(a.price || 0);

        switch (sortOption) {
            case "name_asc":
                return result.sort(byNameAsc);
            case "name_desc":
                return result.sort(byNameDesc);
            case "price_asc":
                return result.sort(byPriceAsc);
            case "price_desc":
                return result.sort(byPriceDesc);
            default:
                return result;
        }
    }, [displayedProducts, sortOption]);

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
                        onSortSelect={setSortOption}
                        currentSort={sortOption}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                    />
                    <section className="pt-6 pb-24">
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
                            <aside className="hidden lg:block">
                                <FiltersLayout {...filterProps} />
                            </aside>
                            <section>
                                <OfferGrid products={sortedProducts} />
                            </section>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
};
