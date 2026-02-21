import { Link } from "react-router-dom";
import React from "react";
import logo from "../../assets/logo_mundo_cupones.svg";

export const CtaSection = () => {
    return (
        <div className="flex flex-col lg:flex-row min-h-166">
            <div className="relative h-128 w-full lg:h-auto lg:w-1/2 bg-secondary-hover flex items-center">
                <img
                    src={logo}
                    alt="Logo"
                    className="h-6/10 w-auto mx-auto"
                />
            </div>

            <div className="flex flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-8 lg:py-24">
                <div className="mx-auto max-w-2xl lg:mx-0 lg:mr-auto lg:w-full lg:max-w-xl xl:max-w-2xl">
                    <h2 className="text-center lg:text-left text-4xl font-heading font-semibold tracking-wide leading-[1.05] text-gray-900 sm:text-5xl">
                        Deja de pagar precio completo
                    </h2>
                    <p className="text-center lg:text-left mt-6 text-lg leading-8 text-gray-600">
                        ¿Por qué gastar de más cuando puedes tener lo mismo por
                        menos? Únete a la nueva forma de comprar y haz que tu
                        presupuesto rinda el doble en tus marcas favoritas.
                    </p>
                    <div className="mt-10 flex items-center justify-center lg:justify-start gap-x-6">
                        <Link
                            to="/offers"
                            className="rounded-md bg-primary px-8 py-3 text-md font-medium text-white shadow-xs hover:bg-primary-hover hover:scale-105 transition duration-300 font-heading"
                        >
                            Ver ofertas
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
