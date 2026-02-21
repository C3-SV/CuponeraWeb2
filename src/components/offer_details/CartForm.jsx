import { useState } from "react";

export const CartForm = ({
    stock,
    categoryName,
    businessName,
    companyPhoto,
    onAddToCart,
}) => {
    const max =
        Number.isFinite(Number(stock)) && Number(stock) > 0
            ? Number(stock)
            : 999;
    const [qty, setQty] = useState(1);

    const decQty = () => setQty((q) => Math.max(1, Number(q) - 1));
    const incQty = () => setQty((q) => Math.min(max, Number(q) + 1));

    const handleSubmit = (e) => {
        e.preventDefault();
        const safeQty = Math.max(1, Math.min(max, Number(qty) || 1));
        onAddToCart(safeQty);
    };

    return (
        <form
            className="mt-6 border-t border-gray-200 pt-6"
            onSubmit={handleSubmit}
        >
            {/* Contenedor de Rubro y Empresa centrado en móviles */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-12 gap-y-6 text-center sm:text-left">
                {/* Rubro */}
                <div className="flex flex-col items-center sm:items-start">
                    <h3 className="text-sm font-bold font-heading text-gray-600 mb-3">
                        Rubro
                    </h3>
                    <p className="inline-flex items-center px-4 py-2 rounded-full text-white text-sm bg-secondary-hover shadow-sm">
                        {categoryName}
                    </p>
                </div>

                {/* Info de la Empresa */}
                {(businessName || companyPhoto) && (
                    <div className="flex flex-col items-center sm:items-start">
                        <h3 className="text-sm font-bold font-heading text-gray-600 mb-3">
                            Ofrecido por
                        </h3>
                        <div className="flex items-center justify-center sm:justify-start gap-3 group cursor-default">
                            {companyPhoto && (
                                <div className="h-10 w-auto min-w-12 bg-white rounded-md border border-gray-200 overflow-hidden flex items-center justify-center p-1 shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:shadow-md">
                                    <img
                                        src={companyPhoto}
                                        alt={businessName ?? "Logo empresa"}
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                            )}
                            {businessName && (
                                /* Texto normal, sin hover rojo */
                                <p className="text-sm font-semibold text-gray-800">
                                    {businessName}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Selector de cantidad y botón */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex sm:block justify-center">
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
                                if (qty === "" || !Number.isFinite(Number(qty)))
                                    setQty(1);
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
                    className="flex-1 rounded-md bg-primary px-6 text-sm font-medium text-white font-heading hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 whitespace-nowrap py-3 transition-transform active:scale-95"
                >
                    Añadir al carrito
                </button>
            </div>
        </form>
    );
};
