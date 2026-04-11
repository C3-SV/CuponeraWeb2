import { useState } from "react";
import Swal from "sweetalert2";
import { useShopStore } from "../../store/useShop";
import { apiRequest } from "../../lib/apiClient";

export const OrderSummary = () => {
    const cart = useShopStore((state) => state.cart);
    const total = cart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
    );

    const [loading, setLoading] = useState(false);

    const handlePay = async () => {
        if (cart.length === 0) {
            await Swal.fire({
                title: "Carrito vacío",
                text: "Agregá al menos un producto para continuar.",
                icon: "info",
            });
            return;
        }

        const check = await useShopStore.getState().validateCartAgainstDb();
        if (!check.ok) {
            await Swal.fire({
                title: "No se puede comprar",
                html: `<ul style="text-align:left">${check.issues.map((i) => `<li>${i}</li>`).join("")}</ul>`,
                icon: "warning",
            });
            return;
        }

        const confirm = await Swal.fire({
            title: "Confirmar pago",
            html: `
        <div style="text-align:center">
          <div style="margin-top:8px">Total: <b>$${total.toFixed(2)}</b></div>
        </div>
      `,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Proceder",
            cancelButtonText: "Cancelar",
        });

        if (!confirm.isConfirmed) return;

        try {
            setLoading(true);

            Swal.fire({
                title: "Procesando pago...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            const amountCents = Math.round(total * 100);
            const data = await apiRequest("/pay", {
                method: "POST",
                body: { amountCents, cart },
            });

            if (data?.status === "succeeded") {
                const paymentRef = data.paymentIntentId ?? null;

                await useShopStore.getState().savePurchaseToSupabase({
                    paymentRef,
                    offersDb: check.offersDb,
                });

                await useShopStore.getState().loadMyCouponsFromSupabase();

                Swal.close();
                await Swal.fire({
                    title: "¡Pago exitoso!",
                    text: "Tu compra fue confirmada y tus cupones ya están listos.",
                    icon: "success",
                });

                useShopStore.persist.clearStorage();
                return;
            }

            Swal.close();
            await Swal.fire({
                title: "Pago no completado",
                text: data?.error || "Intenta de nuevo.",
                icon: "error",
            });
        } catch (error) {
            Swal.close();
            await Swal.fire({
                title: "Error técnico",
                text: error?.message || "No se pudo procesar el pago.",
                icon: "error",
            });
        } finally {
            setLoading(false);
            Swal.close();
        }
    };

    return (
        <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
        >
            <h2
                id="summary-heading"
                className="text-lg font-medium font-heading tracking-wide text-gray-900"
            >
                Resumen de la orden
            </h2>

            <dl className="mt-6 space-y-4">
                <div className="space-y-3">
                    {cart.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-start justify-between gap-4"
                        >
                            <dt className="flex-1 text-sm text-gray-600">
                                <span className="line-clamp-2">
                                    {item.name}
                                </span>
                                {item.quantity > 1 && (
                                    <span className="mt-0.5 block text-xs text-gray-400">
                                        {item.quantity} x $
                                        {item.price.toFixed(2)}
                                    </span>
                                )}
                            </dt>
                            <dd className="shrink-0 text-sm font-medium text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
                            </dd>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <dt className="text-base font-medium text-gray-900">
                        Total
                    </dt>
                    <dd className="text-base font-medium text-gray-900">
                        ${total.toFixed(2)}
                    </dd>
                </div>
            </dl>

            <div className="mt-6">
                <button
                    type="button"
                    onClick={handlePay}
                    disabled={loading || cart.length === 0}
                    className="w-full rounded-md border border-transparent bg-primary px-4 py-3 text-base font-medium text-white shadow-xs transition hover:bg-primary-hover focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-hidden disabled:opacity-60"
                >
                    {loading ? "Procesando..." : "Proceder al pago"}
                </button>
            </div>
        </section>
    );
};
