import React from "react";
import { Link } from "react-router-dom";
import { useShopStore } from "../../store/useShop";

export const OfferCard = ({ product }) => {
    const addToCart = useShopStore((state) => state.addToCart);

    const { id, name, mainImage, price, regularPrice, discountPercent } =
        product;
    const hasDiscount = regularPrice && regularPrice > price;

    const badge =
        discountPercent ??
        (hasDiscount
            ? Math.round(((regularPrice - price) / regularPrice) * 100)
            : null);

    return (
        <article className="rounded-xl bg-white shadow-sm hover:shadow-md transition flex flex-col overflow-hidden">
            <Link to={`/offer/${id}`} className="contents">
                <div className="relative h-40 w-full bg-gray-100">
                    {badge && (
                        <span className="absolute left-3 top-3 rounded bg-red-500 px-2 py-0.5 text-xs font-semibold text-white z-10">
                            -{badge}%
                        </span>
                    )}

                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addToCart(product, 1);
                        }}
                        className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-white shadow ring-1 ring-black/5 hover:scale-110 transition z-10"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="size-5 fill-current"
                        >
                            <path d="M6 2a1 1 0 0 1 .993 .883l.007 .117v1.068l13.071 .935a1 1 0 0 1 .929 1.024l-.01 .114l-1 7a1 1 0 0 1 -.877 .853l-.113 .006h-12v2h10a3 3 0 1 1 -2.995 3.176l-.005 -.176l.005 -.176c.017 -.288 .074 -.564 .166 -.824h-5.342a3 3 0 1 1 -5.824 1.176l-.005 -.176l.005 -.176a3.002 3.002 0 0 1 1.995 -2.654v-12.17h-1a1 1 0 0 1 -.993 -.883l-.007 -.117a1 1 0 0 1 .883 -.993l.117 -.007h2zm0 16a1 1 0 1 0 0 2a1 1 0 0 0 0 -2zm11 0a1 1 0 1 0 0 2a1 1 0 0 0 0 -2z" />
                        </svg>
                    </button>

                    <img
                        src={mainImage}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex flex-col flex-1 justify-between p-4 space-y-3">
                    <h3 className="text-sm font-medium text-ink line-clamp-2 min-h-10">
                        {name}
                    </h3>

                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-red-600">
                            ${price}
                        </span>

                        {hasDiscount && (
                            <span className="text-xs text-muted line-through">
                                ${regularPrice}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </article>
    );
};
