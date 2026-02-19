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
    onApply, // Nueva prop para ejecutar la acción
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

            {/* --- BOTÓN DE APLICAR --- */}
            <div className="pt-6 flex flex-col items-center lg:items-stretch">
                {/* Contenedor con max-w en mobile para que no sea gigante */}
                <div className="w-full max-w-50 lg:max-w-none">
                    <button
                        type="button"
                        onClick={onApply}
                        className="flex w-full items-center justify-center rounded-lg border border-transparent bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover focus:outline-none focus:ring-2 focus:primary focus:ring-offset-2 transition-all active:scale-95"
                    >
                        Aplicar Filtros
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setPriceRange({ min: 0, max: 5000 });
                            setEndDate("");
                        }}
                        className="mt-3 flex w-full items-center justify-center px-4 py-2 text-sm font-medium font-heading tracking-wide text-gray-400 hover:text-primary transition-colors"
                    >
                        Limpiar filtros
                    </button>
                </div>
            </div>
        </div>
    );
};
