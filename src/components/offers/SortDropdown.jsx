import React, { useEffect, useRef, useState, useMemo } from "react";

export const SortDropdown = ({ options = [], onSelect, value }) => {
    const [open, setOpen] = useState(false);
    const rootRef = useRef(null);

    const selectedLabel = useMemo(() => {
        const selected = options.find((opt) => opt.value === value);
        return selected ? selected.label : "Ordenar por";
    }, [options, value]);

    useEffect(() => {
        function handleOutsideClick(e) {
            if (!rootRef.current) return;
            if (!rootRef.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener("mousedown", handleOutsideClick);
        return () =>
            document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    return (
        <div ref={rootRef} className="relative inline-block text-left">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className={`text-sm font-medium rounded-full px-4 py-2 flex items-center gap-x-1 transition duration-300 border ${
                    value
                        ? "bg-secondary-hover text-white border-transparent"
                        : "bg-surface text-gray-900 border-gray-200 hover:scale-105"
                }`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className={`size-6 fill-current ${value ? "text-white" : "text-black"}`}
                >
                    <path d="M9.5 4a1.5 1.5 0 0 1 1.5 1.5v4a1.5 1.5 0 0 1 -1.5 1.5h-4a1.5 1.5 0 0 1 -1.5 -1.5v-4a1.5 1.5 0 0 1 1.5 -1.5z" />
                    <path d="M9.5 13a1.5 1.5 0 0 1 1.5 1.5v4a1.5 1.5 0 0 1 -1.5 1.5h-4a1.5 1.5 0 0 1 -1.5 -1.5v-4a1.5 1.5 0 0 1 1.5 -1.5z" />
                    <path d="M17 5a1 1 0 0 1 1 1v9.584l1.293 -1.291a1 1 0 0 1 1.32 -.083l.094 .083a1 1 0 0 1 0 1.414l-3 3a1 1 0 0 1 -.112 .097l-.11 .071l-.114 .054l-.105 .035l-.149 .03l-.117 .006l-.075 -.003l-.126 -.017l-.111 -.03l-.111 -.044l-.098 -.052l-.096 -.067l-.09 -.08l-3 -3a1 1 0 0 1 1.414 -1.414l1.293 1.293v-9.586a1 1 0 0 1 1 -1" />
                </svg>
                {selectedLabel}
            </button>

            {open && (
                <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden">
                    <div className="py-1">
                        {options.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => {
                                    onSelect?.(opt.value);
                                    setOpen(false);
                                }}
                                className={`block w-full px-4 py-2 text-left text-sm transition-colors ${
                                    value === opt.value
                                        ? "bg-gray-100 font-bold text-primary"
                                        : "text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
