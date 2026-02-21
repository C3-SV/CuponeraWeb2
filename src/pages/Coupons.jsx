import { useMemo, useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { useShopStore } from "../store/useShop";
import { CouponsTabs } from "../components/coupons/CouponsTabs";
import { CouponCard } from "../components/coupons/CouponCard";

const mockCoupons = [
    {
        id: "cp_1",
        code: "LC-9F2A-11",
        offerName: "2x1 Pizza Familiar",
        businessName: "Pizzería La 10",
        purchaseDate: "2026-02-10",
        validFrom: "2026-02-10",
        validUntil: "2026-03-10",
        status: "available",
    },
    {
        id: "cp_2",
        code: "LC-0B7C-22",
        offerName: "30% en Barbería",
        businessName: "Barber Shop Centro",
        purchaseDate: "2026-02-01",
        validFrom: "2026-02-01",
        validUntil: "2026-02-20",
        status: "redeemed",
        redeemedAt: "2026-02-05",
    },
    {
        id: "cp_3",
        code: "LC-77DD-33",
        offerName: "Helado Gratis",
        businessName: "La Michoacana",
        purchaseDate: "2026-01-10",
        validFrom: "2026-01-10",
        validUntil: "2026-01-20",
        status: "expired",
    },
];

export const Coupons = () => {
    const coupons = useShopStore((s) => s.coupons);
    const load = useShopStore((s) => s.loadMyCouponsFromSupabase);

    useEffect(() => { load(); }, []);

    const [active, setActive] = useState("available");

    const buckets = useMemo(() => {
        const available = [];
        const redeemed = [];
        const expired = [];

        for (const c of coupons) {
            if (c.status === "redeemed") redeemed.push(c);
            else if (c.status === "expired") expired.push(c);
            else available.push(c);
        }
        return { available, redeemed, expired };
    }, [coupons]);

    const counts = {
        available: buckets.available.length,
        redeemed: buckets.redeemed.length,
        expired: buckets.expired.length,
    };

    const list = buckets[active] || [];

    const handleDownloadPdf = (coupon) => {
        // Placeholder para el pdf, todavia no se tiene la logica para esto 
        console.log("TODO: generar PDF para cupón:", coupon);
        alert(`TODO: Generar PDF del cupón ${coupon.code}`);
    };

    return (
        <>
            <title>Mis Cupones</title>

            <div className="bg-white">
                <div className="mx-auto max-w-2xl px-4 pt-12 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
                    <h1 className="text-center sm:text-left text-2xl font-semibold tracking-wider text-gray-900 font-heading">
                        Mis Cupones
                    </h1>

                    <div className="mt-6">
                        <CouponsTabs active={active} onChange={setActive} counts={counts} />
                    </div>

                    <div className="mt-10">
                        {coupons.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 mb-6">
                                    Aún no tienes cupones comprados.
                                </p>
                                <Link
                                    to="/offers"
                                    className="inline-block rounded-md bg-primary px-6 py-3 text-base font-medium text-white hover:bg-primary-hover"
                                >
                                    Ver ofertas
                                </Link>
                            </div>
                        ) : list.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 mb-6">
                                    No tienes cupones en esta categoría.
                                </p>
                                <Link
                                    to="/offers"
                                    className="inline-block rounded-md bg-primary px-6 py-3 text-base font-medium text-white hover:bg-primary-hover"
                                >
                                    Ver ofertas
                                </Link>
                            </div>
                        ) : (
                            <section className="mt-6">
                                <ul className="divide-y divide-gray-200 border-t border-b border-gray-200">
                                    {list.map((coupon) => (
                                        <CouponCard
                                            key={coupon.id}
                                            coupon={coupon}
                                            category={active}
                                            onDownloadPdf={handleDownloadPdf}
                                        />
                                    ))}
                                </ul>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
