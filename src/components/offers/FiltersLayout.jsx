import React from "react";
import { FilterSection } from "./FilterSection";
import { PriceSlider } from "./PriceSlider";
import { PriceInput } from "./PriceInput";

export const FiltersLayout = ({
    priceRange,
    setPriceRange,
    endDate,
    setEndDate,
    rubrosOptions,
    selectedRubros,
    onRubroChange,
    onClear,
}) => {
    const handleSliderChange = (newValue) => {
        setPriceRange((prev) => ({
            ...prev,
            max: Math.max(newValue, prev.min),
        }));
    };

    return (
        <div className="flex flex-col gap-y-4">
            {/* 1. Rubros */}
            <FilterSection
                title="Rubros"
                defaultOpen={true}
                options={rubrosOptions}
                selectedValues={selectedRubros}
                onOptionChange={onRubroChange}
            />

            {/* 2. Precio */}
            <FilterSection title="Rango de Precio" defaultOpen={true}>
                <div className="flex flex-col gap-5 px-1">
                    <div className="flex items-center justify-between gap-4">
                        <PriceInput
                            label="Min"
                            value={priceRange.min}
                            onChange={(v) =>
                                setPriceRange((p) => ({ ...p, min: v }))
                            }
                        />
                        <span className="text-gray-400">-</span>
                        <PriceInput
                            label="Max"
                            value={priceRange.max}
                            onChange={(v) =>
                                setPriceRange((p) => ({ ...p, max: v }))
                            }
                        />
                    </div>

                    <PriceSlider
                        min={0}
                        max={5000}
                        value={priceRange.max}
                        onAfterChange={handleSliderChange}
                    />
                </div>
            </FilterSection>

            {/* 3. Fecha */}
            <FilterSection title="Fecha Límite" defaultOpen={false}>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="block w-full rounded-md border-gray-300 py-2 px-3 text-sm focus:ring-secondary-hover focus:border-secondary-hover shadow-sm"
                />
            </FilterSection>

            {/* --- BOTÓN LIMPIAR --- */}
            <button
                type="button"
                onClick={onClear}
                className="flex w-full items-center justify-center px-4 py-2 text-sm font-medium font-heading tracking-wide text-gray-400 hover:text-primary transition-colors"
            >
                Limpiar filtros
            </button>
        </div>
    );
};
