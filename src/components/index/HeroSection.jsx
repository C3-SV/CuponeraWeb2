import { Link } from "react-router-dom";
import heroImg from "../../assets/hero_img.svg";

export const HeroSection = () => {
    return (
        <div className="flex flex-col lg:flex-row min-h-166">
            <div className="flex flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-8 lg:py-24">
                <div className="mx-auto max-w-2xl lg:mx-0 lg:ml-auto lg:w-full lg:max-w-xl xl:max-w-2xl">
                    <h1 className="text-center lg:text-left text-4xl sm:text-5xl font-heading font-semibold tracking-wide text-pretty leading-[1.05] text-secondary-hover">
                        Descuentos reales en tus lugares favoritos
                    </h1>
                    <p className="text-center lg:text-left mt-6 text-lg leading-8 text-gray-600">
                        Descubre ofertas exclusivas en los rubros que más te
                        gustan. Compra en línea en pocos pasos y recibe tu cupón
                        digital al instante.
                    </p>
                    <div className="mt-10 flex items-center justify-center lg:justify-start gap-x-6">
                        <Link
                            to="/offers"
                            className="rounded-md bg-primary px-5 py-2.5 text-md font-medium text-white shadow-xs hover:bg-primary-hover hover:scale-110 transition duration-300 font-heading"
                        >
                            Ver ofertas
                        </Link>
                    </div>
                </div>
            </div>
            <div className="relative h-128 w-full lg:h-auto lg:w-1/2 bg-secondary-hover lg:bg-transparent">
                <img
                    src={heroImg}
                    alt=""
                    className="absolute inset-0 h-full w-full object-contain lg:object-cover"
                />
            </div>
        </div>
    );
};
