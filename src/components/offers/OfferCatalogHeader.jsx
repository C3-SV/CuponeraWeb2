import React from "react";
import { SortDropdown } from "./SortDropdown";

export const OfferCatalogHeader = ({ sortOptions, onSortSelect }) => {
    return (
        <div className="pt-10 pb-6">
            <div
                className="
          grid gap-4
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-[auto_1fr_auto]
          items-center
        "
            >
                <h1 className="text-center sm:text-left text-2xl font-semibold tracking-wider text-gray-900 font-heading">
                    Nuestras ofertas
                </h1>

                <div className="relative w-full max-w-xl justify-self-start md:justify-self-end lg:justify-self-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-500"
                    >
                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                        <path d="M21 21l-6 -6" />
                    </svg>

                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="w-full rounded-full bg-surface py-2 pl-10 pr-4 text-sm outline-none ring-1 ring-black/5 focus:ring-2 focus:ring-secondary-hover"
                    />
                </div>

                <div
                    className="
            flex items-center w-full
            justify-between
            md:col-span-2
            lg:col-span-1 lg:justify-end lg:gap-3
          "
                >
                    <SortDropdown
                        options={sortOptions}
                        onSelect={onSortSelect}
                    />

                    <button
                        type="button"
                        command="show-modal"
                        commandfor="mobile-filters"
                        className="rounded-full bg-surface p-2 text-gray-600 hover:text-gray-900 lg:hidden"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="size-5 stroke-black fill-black"
                        >
                            <path d="M20 3h-16a1 1 0 0 0 -1 1v2.227l.008 .223a3 3 0 0 0 .772 1.795l4.22 4.641v8.114a1 1 0 0 0 1.316 .949l6 -2l.108 -.043a1 1 0 0 0 .576 -.906v-6.586l4.121 -4.12a3 3 0 0 0 .879 -2.123v-2.171a1 1 0 0 0 -1 -1z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};
