import { startTransition, useDeferredValue, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAuthStore } from "../../../store/authStore";
import { showError, showSuccess } from "../../../utils/errorHandler";
import {
  createCategory,
  deleteCategory,
  listCategoriesAdmin,
  updateCategory,
} from "../adminService";

const EMPTY_FORM = {
  category_name: "",
  alt_text: "",
  category_img: "",
  category_img_hover: "",
};

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("es-SV");
};

const toForm = (item) => ({
  category_name: item.category_name ?? "",
  alt_text: item.alt_text ?? "",
  category_img: item.category_img ?? "",
  category_img_hover: item.category_img_hover ?? "",
});

export default function AdminCategoriesPage() {
  const session = useAuthStore((state) => state.session);
  const accessToken = session?.access_token ?? null;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const loadItems = async () => {
    if (!accessToken) return;
    setLoading(true);

    try {
      const data = await listCategoriesAdmin(accessToken, {
        search: deferredSearch,
      });
      setItems(data.items ?? []);
    } catch (error) {
      showError("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadItems();
  }, [accessToken, deferredSearch]);

  const resetForm = () => {
    startTransition(() => {
      setSelectedCategory(null);
      setForm(EMPTY_FORM);
    });
  };

  const handleEdit = (item) => {
    startTransition(() => {
      setSelectedCategory(item);
      setForm(toForm(item));
    });
  };

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!accessToken) return;

    setSubmitting(true);
    try {
      if (selectedCategory) {
        await updateCategory(accessToken, selectedCategory.category_id, form);
        showSuccess("Éxito", "Rubro actualizado.");
      } else {
        await createCategory(accessToken, form);
        showSuccess("Éxito", "Rubro creado.");
      }

      resetForm();
      await loadItems();
    } catch (error) {
      showError("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item) => {
    if (!accessToken) return;

    const confirmation = await Swal.fire({
      title: "¿Eliminar rubro?",
      text: `Se ocultará el rubro ${item.category_name}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirmation.isConfirmed) return;

    try {
      await deleteCategory(accessToken, item.category_id);
      showSuccess("Éxito", "Rubro eliminado.");
      if (selectedCategory?.category_id === item.category_id) {
        resetForm();
      }
      await loadItems();
    } catch (error) {
      showError("Error", error.message);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
      <section className="rounded-3xl border border-border bg-surface p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold font-heading text-ink">Rubros</h2>
            <p className="mt-1 text-sm text-muted">
              Administrá el catálogo visible en el home y en el filtro de ofertas.
            </p>
          </div>

          <div className="flex gap-3">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar rubro"
              className="w-full rounded-full border border-border bg-white px-4 py-2.5 text-sm outline-none transition focus:border-primary sm:w-64"
            />
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover"
            >
              Nuevo
            </button>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-surface text-left text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Rubro</th>
                  <th className="px-4 py-3 font-medium">Alt</th>
                  <th className="px-4 py-3 font-medium">Creado</th>
                  <th className="px-4 py-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-muted">
                      Cargando rubros...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-muted">
                      No hay rubros para mostrar.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.category_id} className="border-t border-border">
                      <td className="px-4 py-4">
                        <p className="font-medium text-ink">{item.category_name}</p>
                        <p className="mt-1 text-xs text-muted">
                          {item.category_img || "Sin imagen principal"}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-muted">
                        {item.alt_text || "Sin alt text"}
                      </td>
                      <td className="px-4 py-4 text-muted">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(item)}
                            className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-surface"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            className="rounded-full border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-50"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <aside className="rounded-3xl border border-border bg-white p-5">
        <h2 className="text-xl font-semibold font-heading text-ink">
          {selectedCategory ? "Editar rubro" : "Crear rubro"}
        </h2>
        <p className="mt-1 text-sm text-muted">
          Las rutas de imágenes pueden ser URLs públicas o paths de Supabase Storage.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="space-y-2 text-sm text-ink">
            <span>Nombre del rubro</span>
            <input
              value={form.category_name}
              onChange={(event) => handleChange("category_name", event.target.value)}
              className="w-full rounded-2xl border border-border px-4 py-3 outline-none transition focus:border-primary"
              required
            />
          </label>

          <label className="space-y-2 text-sm text-ink">
            <span>Texto alternativo</span>
            <input
              value={form.alt_text}
              onChange={(event) => handleChange("alt_text", event.target.value)}
              className="w-full rounded-2xl border border-border px-4 py-3 outline-none transition focus:border-primary"
            />
          </label>

          <label className="space-y-2 text-sm text-ink">
            <span>Imagen principal</span>
            <input
              value={form.category_img}
              onChange={(event) => handleChange("category_img", event.target.value)}
              placeholder="ej: categories-icons/restaurantes.svg"
              className="w-full rounded-2xl border border-border px-4 py-3 outline-none transition focus:border-primary"
            />
          </label>

          <label className="space-y-2 text-sm text-ink">
            <span>Imagen hover</span>
            <input
              value={form.category_img_hover}
              onChange={(event) => handleChange("category_img_hover", event.target.value)}
              placeholder="ej: categories-icons/restaurantes-hover.svg"
              className="w-full rounded-2xl border border-border px-4 py-3 outline-none transition focus:border-primary"
            />
          </label>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover disabled:opacity-60"
            >
              {submitting ? "Guardando..." : selectedCategory ? "Guardar cambios" : "Crear rubro"}
            </button>

            {selectedCategory ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-surface"
              >
                Cancelar
              </button>
            ) : null}
          </div>
        </form>
      </aside>
    </div>
  );
}
