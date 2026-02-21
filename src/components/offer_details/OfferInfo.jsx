import React from "react";

export const OfferInfo = ({
    title,
    price,
    regularPrice,
    stock,
    description,
    businessName,
    companyPhoto,
    categoryName,
}) => {
    return (
        <>
            {/* Company info */}
            {(businessName || companyPhoto || categoryName) && (
                <div className="mb-4 flex items-center gap-3">
                    {companyPhoto && (
                        <img
                            src={companyPhoto}
                            alt={businessName ?? ""}
                            className="h-10 w-10 rounded-full object-cover border border-gray-200"
                        />
                    )}
                    <div>
                        {businessName && (
                            <p className="text-sm font-semibold text-gray-800">{businessName}</p>
                        )}
                        {categoryName && (
                            <p className="text-xs text-gray-500">{categoryName}</p>
                        )}
                    </div>
                </div>
            )}

            <h1 className="text-2xl font-semibold tracking-wider text-gray-900 font-heading">
                {title}
            </h1>

            <div className="mt-3 flex items-center">
                <p className="text-2xl tracking-tight font-heading text-gray-900">
                    ${price}
                </p>
                {regularPrice && (
                    <p className="ml-3 text-lg tracking-tight font-heading text-primary line-through">
                        ${regularPrice}
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
