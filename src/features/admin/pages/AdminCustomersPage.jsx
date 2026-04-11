import { useDeferredValue, useEffect, useState } from "react";
import { useAuthStore } from "../../../store/authStore";
import { showError } from "../../../utils/errorHandler";
import { listCustomers } from "../adminService";

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("es-SV");
};

const formatMoney = (value) =>
  new Intl.NumberFormat("es-SV", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Number(value ?? 0));

export default function AdminCustomersPage() {
  const session = useAuthStore((state) => state.session);
  const accessToken = session?.access_token ?? null;

  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], meta: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPage(1);
  }, [deferredSearch]);

  useEffect(() => {
    if (!accessToken) return;

    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const response = await listCustomers(accessToken, {
          page,
          pageSize: 12,
          search: deferredSearch,
        });

        if (!cancelled) {
          setData({
            items: response.items ?? [],
            meta: response.meta ?? null,
          });
        }
      } catch (error) {
        if (!cancelled) {
          showError("Error", error.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [accessToken, deferredSearch, page]);

  const meta = data.meta ?? { page: 1, totalPages: 1, total: 0 };

  return (
    <section className="rounded-3xl border border-border bg-surface p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold font-heading text-ink">
            Clientes de la cuponera
          </h2>
          <p className="mt-1 text-sm text-muted">
            {meta.total} cliente{meta.total === 1 ? "" : "s"} registrado
            {meta.total === 1 ? "" : "s"}.
          </p>
        </div>

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por nombre, correo, teléfono o DUI"
          className="w-full rounded-full border border-border bg-white px-4 py-2.5 text-sm outline-none transition focus:border-primary lg:w-80"
        />
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-surface text-left text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Contacto</th>
                <th className="px-4 py-3 font-medium">Compras</th>
                <th className="px-4 py-3 font-medium">Cupones</th>
                <th className="px-4 py-3 font-medium">Total gastado</th>
                <th className="px-4 py-3 font-medium">Última compra</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-muted">
                    Cargando clientes...
                  </td>
                </tr>
              ) : data.items.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-muted">
                    No se encontraron clientes.
                  </td>
                </tr>
              ) : (
                data.items.map((item) => (
                  <tr key={item.user_id} className="border-t border-border">
                    <td className="px-4 py-4">
                      <p className="font-medium text-ink">
                        {item.first_names} {item.last_names}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        Alta: {formatDate(item.created_at)}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-muted">
                      <p>{item.email || "Sin correo"}</p>
                      <p className="mt-1">{item.phone || "Sin teléfono"}</p>
                    </td>
                    <td className="px-4 py-4 text-ink">{item.orders_count}</td>
                    <td className="px-4 py-4 text-ink">{item.coupons_count}</td>
                    <td className="px-4 py-4 text-ink">
                      {formatMoney(item.total_spent)}
                    </td>
                    <td className="px-4 py-4 text-muted">
                      {formatDate(item.last_purchase_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-sm text-muted">
          Página {meta.page} de {meta.totalPages}
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page <= 1}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium text-ink transition hover:bg-white disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={() =>
              setPage((current) => Math.min(meta.totalPages || current, current + 1))
            }
            disabled={page >= meta.totalPages}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium text-ink transition hover:bg-white disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </section>
  );
}
