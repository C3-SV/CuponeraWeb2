import React from "react";

export const OfferCard = ({ product, onAddToCart }) => {
    const { name, imageUrl, price, oldPrice, discountPercent } = product;

    const hasDiscount = oldPrice && oldPrice > price;

    const badge =
        discountPercent ??
        (hasDiscount
            ? Math.round(((oldPrice - price) / oldPrice) * 100)
            : null);

    return (
        <article className="rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition flex flex-col">
            {/* Image area (taller) */}
            <div className="relative flex items-center justify-center h-36 bg-surface rounded-lg mb-3">
                {/* Badge */}
                {badge && (
                    <span className="absolute left-2 top-2 rounded bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                        -{badge}%
                    </span>
                )}

                {/* Cart */}
                <button
                    onClick={() => onAddToCart?.(product)}
                    className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-white shadow ring-1 ring-black/5 hover:scale-110 transition"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="size-5 fill-current"
                    >
                        <path d="M6 2a1 1 0 0 1 .993 .883l.007 .117v1.068l13.071 .935a1 1 0 0 1 .929 1.024l-.01 .114l-1 7a1 1 0 0 1 -.877 .853l-.113 .006h-12v2h10a3 3 0 1 1 -2.995 3.176l-.005 -.176l.005 -.176c.017 -.288 .074 -.564 .166 -.824h-5.342a3 3 0 1 1 -5.824 1.176l-.005 -.176l.005 -.176a3.002 3.002 0 0 1 1.995 -2.654v-12.17h-1a1 1 0 0 1 -.993 -.883l-.007 -.117a1 1 0 0 1 .883 -.993l.117 -.007h2zm0 16a1 1 0 1 0 0 2a1 1 0 0 0 0 -2zm11 0a1 1 0 1 0 0 2a1 1 0 0 0 0 -2z" />
                    </svg>
                </button>

                {/* Image */}
                <img
                    src={imageUrl}
                    alt={name}
                    className="h-24 object-contain"
                />
            </div>

            {/* Text area grows */}
            <div className="flex flex-col flex-1 justify-between space-y-2">
                <h3 className="text-sm font-medium text-ink line-clamp-2 min-h-10">
                    {name}
                </h3>

                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-red-600">
                        ${price}
                    </span>

                    {hasDiscount && (
                        <span className="text-xs text-muted line-through">
                            ${oldPrice}
                        </span>
                    )}
                </div>
            </div>
        </article>
    );
};
