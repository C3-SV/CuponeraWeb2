import React from "react";
import { useState, useId } from "react";

export const FilterSection = ({ title, defaultOpen = false, options }) => {
    const [open, setOpen] = useState(defaultOpen);
    const baseId = useId();

    return (
        <div className="border-t border-gray-200 px-4 py-6 lg:px-0">
            <h3 className="-mx-2 -my-3 flow-root">
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500"
                    aria-expanded={open}
                >
                    <span className="font-medium text-gray-900">{title}</span>

                    <span className="ml-6 flex items-center">
                        {!open ? (
                            <svg
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                                className="size-5"
                            >
                                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                            </svg>
                        ) : (
                            <svg
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                                className="size-5"
                            >
                                <path
                                    d="M4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10Z"
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                />
                            </svg>
                        )}
                    </span>
                </button>
            </h3>

            {open && (
                <div className="pt-6">
                    <div className="space-y-6">
                        {options.map((opt, idx) => {
                            const id = `${baseId}-${idx}`;
                            return (
                                <div key={id} className="flex gap-3">
                                    <div className="flex h-5 shrink-0 items-center">
                                        <div className="group grid size-4 grid-cols-1">
                                            <input
                                                id={id}
                                                type="checkbox"
                                                name={`${title.toLowerCase()}[]`}
                                                value={opt.value}
                                                defaultChecked={!!opt.checked}
                                                className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-secondary-hover checked:bg-secondary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-hover"
                                            />
                                            <svg
                                                viewBox="0 0 14 14"
                                                fill="none"
                                                className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white"
                                            >
                                                <path
                                                    d="M3 8L6 11L11 3.5"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="opacity-0 group-has-checked:opacity-100"
                                                />
                                            </svg>
                                        </div>
                                    </div>

                                    <label
                                        htmlFor={id}
                                        className="min-w-0 flex-1 text-gray-500"
                                    >
                                        {opt.label}
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
