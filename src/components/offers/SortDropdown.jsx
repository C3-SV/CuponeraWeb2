import React, { useEffect, useRef, useState } from "react";

export const SortDropdown = ({ options = [], onSelect }) => {
    const [open, setOpen] = useState(false);
    const rootRef = useRef(null);

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
                className="text-sm font-medium bg-surface rounded-full px-4 py-2 flex items-center gap-x-1 hover:scale-105 transition duration-300"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="stroke-0 fill-black size-6"
                >
                    <path d="M9.5 4a1.5 1.5 0 0 1 1.5 1.5v4a1.5 1.5 0 0 1 -1.5 1.5h-4a1.5 1.5 0 0 1 -1.5 -1.5v-4a1.5 1.5 0 0 1 1.5 -1.5z" />
                    <path d="M9.5 13a1.5 1.5 0 0 1 1.5 1.5v4a1.5 1.5 0 0 1 -1.5 1.5h-4a1.5 1.5 0 0 1 -1.5 -1.5v-4a1.5 1.5 0 0 1 1.5 -1.5z" />
                    <path d="M17 5a1 1 0 0 1 1 1v9.584l1.293 -1.291a1 1 0 0 1 1.32 -.083l.094 .083a1 1 0 0 1 0 1.414l-3 3a1 1 0 0 1 -.112 .097l-.11 .071l-.114 .054l-.105 .035l-.149 .03l-.117 .006l-.075 -.003l-.126 -.017l-.111 -.03l-.111 -.044l-.098 -.052l-.096 -.067l-.09 -.08l-3 -3a1 1 0 0 1 1.414 -1.414l1.293 1.293v-9.586a1 1 0 0 1 1 -1" />
                </svg>
                Ordenar por
            </button>

            {open && (
                <div className="absolute right-0 z-50 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5">
                    <div className="py-1">
                        {options.map((opt, i) => (
                            <button
                                key={opt.value ?? i}
                                onClick={() => {
                                    onSelect?.(opt);
                                    setOpen(false);
                                }}
                                className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
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
