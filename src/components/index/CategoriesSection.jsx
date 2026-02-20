import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useShopStore } from "../../store/useShop";
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    AllIcon,
    RestaurantIcon,
    TechIcon,
    BeautyIcon,
    TravelIcon,
    ServiceIcon,
    FunIcon,
} from "../ui/Icons";

export const CategoriesSection = () => {
    const navigate = useNavigate();
    const scrollerRef = useRef(null);
    const setCategory = useShopStore((s) => s.setCategory);

    const categories = [
        { id: "Restaurantes", label: "Restaurantes", icon: RestaurantIcon },
        { id: "Tecnología", label: "Tecnología", icon: TechIcon },
        { id: "Belleza", label: "Belleza", icon: BeautyIcon },
        { id: "Viajes", label: "Viajes", icon: TravelIcon },
        { id: "Servicios", label: "Servicios", icon: ServiceIcon },
        { id: "Entretenimiento", label: "Entretenimiento", icon: FunIcon },
    ];

    const step = 176;

    const scrollByDir = (dir) => {
        const scroller = scrollerRef.current;
        if (!scroller) return;
        scroller.scrollBy({ left: dir * step, behavior: "smooth" });
    };

    const handleSelectCategory = (catId) => {
        setCategory(catId);
        navigate("/offers");
    };

    const cardClass =
        "group shrink-0 w-40 h-32 rounded-md border border-gray-200 bg-white text-gray-900 transition flex flex-col items-center justify-center gap-3 hover:bg-primary hover:text-white hover:border-primary cursor-pointer";

    return (
        <div className="mt-24 mb-16 mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <span className="h-8 w-3 rounded bg-primary" />
                        <p className="text-md font-semibold text-primary">
                            Nuestros rubros
                        </p>
                    </div>
                    <h2 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900 font-heading">
                        Explora ofertas por rubro
                    </h2>
                </div>

                <div className="mx-auto sm:mx-0 flex items-center gap-2">
                    <button
                        onClick={() => scrollByDir(-1)}
                        className="grid h-10 w-10 place-items-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95 transition"
                    >
                        <ArrowLeftIcon className="size-5" />
                    </button>
                    <button
                        onClick={() => scrollByDir(1)}
                        className="grid h-10 w-10 place-items-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95 transition"
                    >
                        <ArrowRightIcon className="size-5" />
                    </button>
                </div>
            </div>

            <div className="mt-10">
                <div
                    ref={scrollerRef}
                    className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none]"
                >
                    <style>{`div::-webkit-scrollbar { display: none; }`}</style>
                    <button
                        type="button"
                        onClick={() => {
                            setCategory(null);
                            navigate("/offers");
                        }}
                        className={cardClass}
                    >
                        <div>
                            <AllIcon className="h-8 w-8" />
                        </div>
                        <span className="text-sm font-medium">Todas</span>
                    </button>
                    {categories.map((cat) => {
                        const Icon = cat.icon;
                        return (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => handleSelectCategory(cat.id)}
                                className={cardClass}
                            >
                                <div>
                                    <Icon className="h-8 w-8" />
                                </div>
                                <span className="text-sm font-medium">
                                    {cat.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
                <div className="mt-8 h-px w-full bg-gray-200" />
            </div>
        </div>
    );
};
