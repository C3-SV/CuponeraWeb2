import React from "react";
import { OfferCard } from "./OfferCard";

export const OfferGrid = ({ products }) => {
    return (
        <div
            className="
      grid gap-6
      grid-cols-1
      sm:grid-cols-2
      xl:grid-cols-3
    "
        >
            {products.map((p) => (
                <OfferCard key={p.id} product={p} />
            ))}
        </div>
    );
};
