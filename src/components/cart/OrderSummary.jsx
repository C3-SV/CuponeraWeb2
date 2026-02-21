import { useState } from "react";
import Swal from "sweetalert2";
import { useShopStore } from "../../store/useShop";

export const OrderSummary = () => {
  const cart = useShopStore((state) => state.cart);
  // Cálculos dinámicos
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const serviceFee = 8.32; // se puede hacer mas dinámico (ej: subtotal * 0.05)
  const total = subtotal + serviceFee;

  const [loading, setLoading] = useState(false);
  const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:4242";

  const handlePay = async () => {
    if (cart.length === 0) {
      await Swal.fire({
        title: "Carrito vacío",
        text: "Agregá al menos un producto para continuar.",
        icon: "info",
      });
      return;
    }

    const confirm = await Swal.fire({
      title: "Confirmar pago",
      html: `
        <div style="text-align:left">
          <div>Subtotal: <b>$${subtotal.toFixed(2)}</b></div>
          <div>Comisión: <b>$${serviceFee.toFixed(2)}</b></div>
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

      const r = await fetch(`${API}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountCents, cart }),
      });

      let data = null;
      try {
        data = await r.json();
      } catch {
        // ignore parse
      }

      if (r.ok && data?.ok && data?.status === "succeeded") {
        const paymentRef = data.paymentIntentId ?? null;

        await useShopStore.getState().savePurchaseToSupabase({ paymentRef });
        await useShopStore.getState().loadMyCouponsFromSupabase();

        Swal.close();
        await Swal.fire({
          title: "¡Pago exitoso!",
          text: "Tu compra fue confirmada y tus cupones ya están listos.",
          icon: "success",
        });

        return;
      }

      Swal.close();
      await Swal.fire({
        title: "Pago no completado",
        text: data?.error || "Intenta de nuevo.",
        icon: "error",
      });
    } catch (e) {
      Swal.close();
      await Swal.fire({
        title: "Error técnico",
        text: (e?.message || "No se pudo procesar el pago."),
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
        <div className="flex items-center justify-between">
          <dt className="text-sm text-gray-600">Subtotal</dt>
          <dd className="text-sm font-medium text-gray-900">
            ${subtotal.toFixed(2)}
          </dd>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <dt className="flex items-center text-sm text-gray-600">
            <span>Comisión por servicio</span>
            {/* Tooltip con Group Hover */}
            <div className="group relative ml-2">
              <button
                type="button"
                className="flex items-center text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  className="size-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-64 -translate-x-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="relative rounded-lg bg-gray-900 px-4 py-3 text-xs leading-5 text-white shadow-xl">
                  <p>
                    Nos permite cubrir costos operativos y seguir ofreciéndote un
                    servicio de calidad en cada compra.
                  </p>
                  <div className="absolute top-full left-1/2 -mt-1.5 h-3 w-3 -translate-x-1/2 rotate-45 bg-gray-900"></div>
                </div>
              </div>
            </div>
          </dt>
          <dd className="text-sm font-medium text-gray-900">
            ${serviceFee.toFixed(2)}
          </dd>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <dt className="text-base font-medium text-gray-900">Total</dt>
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
          className="w-full rounded-md border border-transparent bg-primary px-4 py-3 text-base font-medium text-white shadow-xs hover:bg-primary-hover focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-hidden transition disabled:opacity-60"
        >
          {loading ? "Procesando..." : "Proceder al pago"}
        </button>
      </div>
    </section>
  );
};