import { useState } from "react";

export const CartForm = ({ stock, categoryName, onAddToCart }) => {
    const [qty, setQty] = useState(1);

    const decQty = () => setQty((q) => Math.max(1, q - 1));
    const incQty = () => setQty((q) => Math.min(stock ?? 999, q + 1));

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddToCart(qty);
    };

    return (
        <form className="mt-6" onSubmit={handleSubmit}>
            <div>
                <h3 className="text-sm font-bold font-heading text-gray-600 mb-3">
                    Rubro
                </h3>
                <p className="inline-flex items-center px-4 py-2 rounded-full text-white text-sm bg-secondary-hover">
                    {categoryName}
                </p>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                {/* Selector de cantidad */}
                <div className="flex sm:block">
                    <div className="inline-flex w-8/10 sm:w-fit items-center overflow-hidden rounded-md border border-gray-300 bg-white mx-auto sm:mx-0">
                        <button
                            type="button"
                            onClick={decQty}
                            className="size-10 grid place-items-center hover:bg-gray-50 transition"
                        >
                            <span className="text-xl leading-none">−</span>
                        </button>
                        <input
                            value={qty}
                            onChange={(e) => {
                                const val = e.target.value.replace(
                                    /[^\d]/g,
                                    "",
                                );
                                setQty(
                                    val === ""
                                        ? ""
                                        : Math.max(
                                              1,
                                              Math.min(stock, Number(val)),
                                          ),
                                );
                            }}
                            onBlur={() => {
                                if (qty === "") setQty(1);
                            }}
                            inputMode="numeric"
                            className="h-10 w-14 sm:w-16 text-center text-sm font-medium text-gray-900 outline-none border-x border-gray-300 bg-white flex-1"
                        />
                        <button
                            type="button"
                            onClick={incQty}
                            className="size-10 grid place-items-center bg-primary text-white hover:bg-primary-hover transition"
                        >
                            <span className="text-xl leading-none">+</span>
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="flex-1 rounded-md bg-primary px-6 text-sm font-medium text-white font-heading hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 whitespace-nowrap py-3"
                >
                    Añadir al carrito
                </button>
            </div>
        </form>
    );
};
