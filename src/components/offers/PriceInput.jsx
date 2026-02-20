import React from "react";

export const PriceInput = ({ label, value, onChange }) => (
    <div className="relative rounded-md shadow-sm w-full">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 sm:text-sm">
            $
        </span>
        <input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="block w-full rounded-md border-gray-300 py-1.5 pl-7 pr-3 text-gray-900 
                       focus:ring-2 focus:ring-secondary-hover focus:outline-none 
                       sm:text-sm [&::-webkit-inner-spin-button]:appearance-none"
            placeholder={label}
        />
    </div>
);
