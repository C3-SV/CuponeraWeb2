import Swal from "sweetalert2";

export const CouponCard = ({ coupon, category, onDownloadPdf }) => {
  const isAvailable = category === "available";

  const handleDownload = async () => {
    if (!onDownloadPdf) {
      await Swal.fire({
        title: "Acción no disponible",
        text: "No hay función de descarga configurada.",
        icon: "info",
      });
      return;
    }

    try {
      Swal.fire({
        title: "Generando PDF...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await onDownloadPdf(coupon);

      Swal.close();
      await Swal.fire({
        title: "Listo",
        text: "PDF generado.",
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
      });
    } catch (e) {
      Swal.close();
      await Swal.fire({
        title: "No se pudo generar el PDF",
        text: e?.message || "Intenta de nuevo.",
        icon: "error",
      });
    }
  };

  return (
    <li className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6">
      <div className="flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {coupon.offerName || "Cupón"}
            </p>
            <p className="text-sm text-gray-600">
              Negocio: <span className="font-medium">{coupon.businessName || "—"}</span>
            </p>
          </div>

          {/* Badge estado */}
          <span
            className={[
              "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
              isAvailable
                ? "bg-green-50 text-green-700"
                : category === "redeemed"
                ? "bg-blue-50 text-blue-700"
                : "bg-red-50 text-red-700",
            ].join(" ")}
          >
            {isAvailable ? "Disponible" : category === "redeemed" ? "Canjeado" : "Vencido"}
          </span>
        </div>

        {/* Código */}
        <div className="mt-3">
          <p className="text-xs text-gray-500">Código</p>
          <p className="mt-1 inline-block rounded-md bg-gray-100 px-3 py-1 font-mono text-sm text-gray-900">
            {coupon.code || "—"}
          </p>
        </div>

        {/* Fechas */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-700">
          <div>
            <p className="text-xs text-gray-500">Fecha de compra</p>
            <p className="font-medium">{coupon.purchaseDate || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Válido desde</p>
            <p className="font-medium">{coupon.validFrom || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Válido hasta</p>
            <p className="font-medium">{coupon.validUntil || "—"}</p>
          </div>
        </div>

        {/* Info extra */}
        {category === "redeemed" && coupon.redeemedAt ? (
          <p className="mt-3 text-sm text-gray-600">
            Canjeado el: <span className="font-medium">{coupon.redeemedAt}</span>
          </p>
        ) : null}
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-3">
        {isAvailable ? (
          <button
            type="button"
            onClick={handleDownload}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition"
          >
            Descargar PDF
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed"
          >
            PDF no disponible
          </button>
        )}
      </div>
    </li>
  );
};