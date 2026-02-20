import React, { useState, useEffect } from "react";

export const PriceSlider = ({ min, max, value, onAfterChange }) => {
    // 1. Estado local para que el movimiento sea instantáneo
    const [localValue, setLocalValue] = useState(value);

    // Sincronizar si el valor cambia externamente (ej: por los inputs numéricos)
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const percentage = ((localValue - min) / (max - min)) * 100;

    const sliderStyle = {
        background: `linear-gradient(to right, #031b30 ${percentage}%, #e5e7eb ${percentage}%)`,
    };

    return (
        <div className="px-1 mt-4 relative">
            <input
                type="range"
                min={min}
                max={max}
                step="1"
                value={localValue}
                // ACTUALIZACIÓN LOCAL: Ultra rápida, sin lag
                onChange={(e) => setLocalValue(Number(e.target.value))}
                // ACTUALIZACIÓN GLOBAL: Solo ocurre al soltar el click
                onMouseUp={() => onAfterChange(localValue)}
                // Soporte para pantallas táctiles
                onTouchEnd={() => onAfterChange(localValue)}
                style={sliderStyle}
                className="w-full h-2 cursor-pointer accent-secondary-hover rounded-lg appearance-none transition-none"
            />

            {/* Tooltip opcional o indicador de valor actual mientras arrastras */}
            <div className="flex justify-between text-[10px] text-gray-400 mt-2 select-none font-medium">
                <span>${min}</span>
                <span className="text-secondary-hover font-bold text-xs">
                    ${localValue}
                </span>
                <span>${max}+</span>
            </div>

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                input[type='range']::-webkit-slider-thumb {
                    appearance: none;
                    width: 18px;
                    height: 18px;
                    background: #031b30;
                    border: 2px solid #031b30;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                }
            `,
                }}
            />
        </div>
    );
};
