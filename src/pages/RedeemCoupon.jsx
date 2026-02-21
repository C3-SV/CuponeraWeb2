import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useShopStore } from "../store/useShop";

export const RedeemCoupon = () => {
  const [params] = useSearchParams();
  const code = useMemo(() => params.get("code") || "", [params]);

  const fetchCouponForRedeem = useShopStore((s) => s.fetchCouponForRedeem);
  const redeemCouponByCode = useShopStore((s) => s.redeemCouponByCode);

  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [couponInfo, setCouponInfo] = useState(null);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  // use effect del canejo del cupon 
  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError("");
      setCouponInfo(null);
      setDone(false);

      try {
        const info = await fetchCouponForRedeem(code);
        setCouponInfo(info);
      } catch (e) {
        setError(e?.message ?? "No se pudo validar el cupón.");
      } finally {
        setLoading(false);
      }
    };

    if (!code) {
      setLoading(false);
      setError("Falta el código en el link.");
      return;
    }
    run();
  }, [code, fetchCouponForRedeem]);

  // si se puede o no canjear 
  const canRedeem =
    couponInfo &&
    !couponInfo.isExpired &&
    !couponInfo.isRedeemed &&
    couponInfo.coupon_status === "AVAILABLE";

  // manejar el canje
  const handleRedeem = async () => {
    try {
      setRedeeming(true);
      setError("");
      await redeemCouponByCode(code);
      setDone(true);
      const refreshed = await fetchCouponForRedeem(code);
      setCouponInfo(refreshed);
    } catch (e) {
      setError(e?.message ?? "No se pudo canjear.");
    } finally {
      setRedeeming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white grid place-items-center px-6">
        <p className="text-gray-600">Validando cupón...</p>
      </div>
    );
  }

  // Pantalla de “Cupón canjeado”
  if (done) {
    return (
      <div className="min-h-screen bg-white px-6 py-16">
        <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-green-100 grid place-items-center">
              ✓
            </div>
            <h1 className="text-xl font-semibold text-gray-900">
              Cupón canjeado
            </h1>
          </div>

          <p className="mt-4 text-gray-700">
            El cupón fue canjeado correctamente.
          </p>

          {couponInfo ? (
            <div className="mt-6 space-y-2 text-sm text-gray-700">
              <div><span className="text-gray-500">Código:</span> <span className="font-mono">{couponInfo.coupon_code}</span></div>
              <div><span className="text-gray-500">Oferta:</span> <span className="font-medium">{couponInfo.offerName}</span></div>
              <div><span className="text-gray-500">Negocio:</span> <span className="font-medium">{couponInfo.businessName}</span></div>
              <div><span className="text-gray-500">Estado:</span> <span className="font-medium">REDEEMED</span></div>
            </div>
          ) : null}

          <div className="mt-8 flex gap-3">
            <Link
              to="/coupons"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition"
            >
              Ir a Mis Cupones
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Errores de validación
  if (error) {
    return (
      <div className="min-h-screen bg-white px-6 py-16">
        <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 p-8">
          <h1 className="text-xl font-semibold text-gray-900">Canje de cupón</h1>
          <p className="mt-4 text-red-600">{error}</p>
          <p className="mt-4 text-gray-600 text-sm">
            Verificá que el QR sea válido y que hayas iniciado sesión.
          </p>
        </div>
      </div>
    );
  }

  // Pantalla principal de validación
  return (
    <div className="min-h-screen bg-white px-6 py-16">
      <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-900">Canje de cupón</h1>

        {couponInfo ? (
          <>
            <div className="mt-6 space-y-2 text-sm text-gray-700">
              <div><span className="text-gray-500">Código:</span> <span className="font-mono">{couponInfo.coupon_code}</span></div>
              <div><span className="text-gray-500">Oferta:</span> <span className="font-medium">{couponInfo.offerName}</span></div>
              <div><span className="text-gray-500">Negocio:</span> <span className="font-medium">{couponInfo.businessName}</span></div>
              <div><span className="text-gray-500">Vence:</span> <span className="font-medium">{couponInfo.coupon_expires_at}</span></div>
              <div><span className="text-gray-500">Estado:</span> <span className="font-medium">{couponInfo.coupon_status}</span></div>
            </div>

            <div className="mt-8">
              <button
                type="button"
                onClick={handleRedeem}
                disabled={!canRedeem || redeeming}
                className="w-full rounded-md bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-60 transition"
              >
                {redeeming ? "Canjeando..." : "Canjear cupón"}
              </button>

              {!canRedeem ? (
                <p className="mt-3 text-sm text-gray-500">
                  Este cupón no puede canjearse (ya canjeado o vencido).
                </p>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};