import React from "react";
import { FilterSection } from "./FilterSection";

export const MobileFiltersDialog = ({ sections }) => {
    return (
        <el-dialog>
            <dialog
                id="mobile-filters"
                className="overflow-hidden backdrop:bg-transparent lg:hidden"
            >
                <el-dialog-backdrop className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0" />

                <div
                    tabIndex={0}
                    className="fixed inset-0 flex focus:outline-none"
                >
                    <el-dialog-panel className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-white pt-4 pb-6 shadow-xl transition duration-300 ease-in-out data-closed:translate-x-full">
                        <div className="flex items-center justify-between px-4">
                            <h2 className="text-lg font-semibold font-heading tracking-widest text-gray-900">
                                Filtros
                            </h2>

                            <button
                                type="button"
                                command="close"
                                commandfor="mobile-filters"
                                className="relative -mr-2 flex size-10 items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-50 focus:ring-2 focus:ring-secondary-hover focus:outline-hidden"
                            >
                                <span className="absolute -inset-0.5" />

                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    data-slot="icon"
                                    aria-hidden="true"
                                    className="size-6"
                                >
                                    <path
                                        d="M6 18 18 6M6 6l12 12"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        </div>

                        <form className="mt-4 border-t border-gray-200">
                            {sections.map((s) => (
                                <FilterSection
                                    key={s.id}
                                    title={s.name}
                                    options={s.options}
                                />
                            ))}
                        </form>
                    </el-dialog-panel>
                </div>
            </dialog>
        </el-dialog>
    );
};
