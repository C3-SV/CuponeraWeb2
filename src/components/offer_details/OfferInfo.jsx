import React from "react";

export const OfferInfo = ({ title, price, oldPrice, stock, description }) => {
    return (
        <>
            <h1 className="text-2xl font-semibold tracking-wider text-gray-900 font-heading">
                {title}
            </h1>

            <div className="mt-3 flex items-center">
                <p className="text-2xl tracking-tight font-heading text-gray-900">
                    ${price}
                </p>
                {oldPrice && (
                    <p className="ml-3 text-lg tracking-tight font-heading text-primary line-through">
                        ${oldPrice}
                    </p>
                )}
            </div>

            <div className="mt-3">
                <p className="text-sm text-gray-800">
                    <span className="font-heading font-bold">Stock: </span>
                    {stock} unidades disponibles
                </p>
            </div>

            <div className="mt-6">
                <div className="space-y-4 text-md text-gray-700">
                    <p>{description}</p>
                </div>
            </div>
        </>
    );
};
