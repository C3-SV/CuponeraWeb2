import { useEffect, useState } from "react";
import { useShopStore } from "../store/useShop";

import { HeroSection } from "../components/index/HeroSection";
import { CategoriesSection } from "../components/index/CategoriesSection";
import { FeaturesSection } from "../components/index/FeaturesSection";
import { EndingSoonSection } from "../components/index/EndingSoonSection";
import { BestSellingSection } from "../components/index/BestSellingSection";
import { CtaSection } from "../components/index/CtaSection";

export const Index = () => {
    const setCategory = useShopStore((s) => s.setCategory);
    const loadCategories = useShopStore((s) => s.loadCategories);
    const loadEndingSoon = useShopStore((s) => s.loadEndingSoon);
    const loadBestSellers = useShopStore((s) => s.loadBestSellers);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setCategory(null);

        const fetchAllData = async () => {
            setIsLoading(true);

            await Promise.all([
                loadCategories(),
                loadEndingSoon(),
                loadBestSellers(),
            ]);

            setIsLoading(false);
        };

        fetchAllData();
    }, []);

    return (
        <div className="relative bg-white w-full">
            <HeroSection />

            <CategoriesSection isLoading={isLoading} />
            <FeaturesSection />
            <EndingSoonSection isLoading={isLoading} />
            <BestSellingSection isLoading={isLoading} />

            <CtaSection />
        </div>
    );
};
