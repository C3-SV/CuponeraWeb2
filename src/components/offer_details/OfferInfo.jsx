import React from "react";

export const OfferInfo = ({
    title,
    price,
    regularPrice,
    stock,
    description,
}) => {
    return (
        <>
            <h1 className="text-3xl font-semibold tracking-wider text-gray-900 font-heading">
                {title}
            </h1>

            <div className="mt-3 flex items-end gap-3">
                <p className="text-3xl tracking-tight font-heading text-primary font-bold">
                    ${price}
                </p>
                {regularPrice && (
                    <p className="text-xl tracking-tight font-heading text-gray-500 line-through mb-0.5">
                        ${regularPrice}
                    </p>
                )}
            </div>

            <div className="mt-4">
                <p className="text-sm text-gray-800 bg-gray-100 inline-block px-3 py-1 rounded-md">
                    <span className="font-heading font-bold text-gray-600">
                        Stock:{" "}
                    </span>
                    {stock} unidades disponibles
                </p>
            </div>

            <div className="mt-6">
                <div className="space-y-4 text-md text-gray-700 leading-relaxed">
                    <p>{description}</p>
                </div>
            </div>
        </>
    );
};
