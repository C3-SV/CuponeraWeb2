import { useEffect } from "react";
import { useShopStore } from "../store/useShop";

// Importamos las secciones
import { HeroSection } from "../components/index/HeroSection";
import { CategoriesSection } from "../components/index/CategoriesSection";
import { FeaturesSection } from "../components/index/FeaturesSection";
import { EndingSoonSection } from "../components/index/EndingSoonSection";
import { BestSellingSection } from "../components/index/BestSellingSection";
import { CtaSection } from "../components/index/CtaSection";

export const Index = () => {
    const setCategory = useShopStore((s) => s.setCategory);
    const offers = useShopStore((s) => s.products);

    // Lógica de Reinicio: Reseteamos filtro al entrar a la página
    useEffect(() => {
        setCategory(null);
    }, [setCategory]);

    // Preparamos los datos para las secciones de productos
    const expiringOffers =
        offers && offers.length > 0 ? offers.slice(0, 3) : [];
    const bestSellingOffers =
        offers && offers.length > 0 ? offers.slice(0, 12) : [];

    return (
        <div className="relative bg-white w-full">
            <HeroSection />
            <CategoriesSection />
            <FeaturesSection />

            <EndingSoonSection offers={expiringOffers} />

            <BestSellingSection offers={bestSellingOffers} />

            <CtaSection />
        </div>
    );
};
