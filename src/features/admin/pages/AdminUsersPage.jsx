import { startTransition, useDeferredValue, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAuthStore } from "../../../store/authStore";
import { showError, showSuccess } from "../../../utils/errorHandler";
import {
  createAdminUser,
  deleteAdminUser,
  listAdminUsers,
  updateAdminUser,
} from "../adminService";

const EMPTY_FORM = {
  email: "",
  password: "",
  first_names: "",
  last_names: "",
  phone: "",
  dui: "",
  address: "",
  is_active: true,
};

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("es-SV");
};

const toForm = (user) => ({
  email: user.email ?? "",
  password: "",
  first_names: user.first_names ?? "",
  last_names: user.last_names ?? "",
  phone: user.phone ?? "",
  dui: user.dui ?? "",
  address: user.address ?? "",
  is_active: user.is_active ?? true,
});

export default function AdminUsersPage() {
  const session = useAuthStore((state) => state.session);
  const accessToken = session?.access_token ?? null;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const loadItems = async () => {
    if (!accessToken) return;
    setLoading(true);

    try {
      const data = await listAdminUsers(accessToken, { search: deferredSearch });
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
      setSelectedUser(null);
      setForm(EMPTY_FORM);
    });
  };

  const handleEdit = (item) => {
    startTransition(() => {
      setSelectedUser(item);
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
      if (selectedUser) {
        await updateAdminUser(accessToken, selectedUser.user_id, form);
        showSuccess("Éxito", "Administrador actualizado.");
      } else {
        await createAdminUser(accessToken, form);
        showSuccess("Éxito", "Administrador creado.");
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
      title: "¿Eliminar administrador?",
      text: `Se desactivará a ${item.first_names} ${item.last_names}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirmation.isConfirmed) return;

    try {
      await deleteAdminUser(accessToken, item.user_id);
      showSuccess("Éxito", "Administrador eliminado.");
      if (selectedUser?.user_id === item.user_id) {
        resetForm();
      }
      await loadItems();
    } catch (error) {
      showError("Error", error.message);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.4fr_0.95fr]">
      <section className="rounded-3xl border border-border bg-surface p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold font-heading text-ink">
              Usuarios administradores
            </h2>
            <p className="mt-1 text-sm text-muted">
              {items.length} usuario{items.length === 1 ? "" : "s"} visible
              {items.length === 1 ? "" : "s"}.
            </p>
          </div>

          <div className="flex gap-3">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre, email o DUI"
              className="w-full rounded-full border border-border bg-white px-4 py-2.5 text-sm outline-none transition focus:border-primary sm:w-72"
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
              <thead className="bg-surface">
                <tr className="text-left text-muted">
                  <th className="px-4 py-3 font-medium">Administrador</th>
                  <th className="px-4 py-3 font-medium">Contacto</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 font-medium">Creado</th>
                  <th className="px-4 py-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-muted">
                      Cargando administradores...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-muted">
                      No hay administradores que coincidan con la búsqueda.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.user_id} className="border-t border-border">
                      <td className="px-4 py-4">
                        <p className="font-medium text-ink">
                          {item.first_names} {item.last_names}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-primary">
                          {item.role}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-muted">
                        <p>{item.email}</p>
                        <p className="mt-1">{item.phone || "Sin teléfono"}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            item.is_active
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {item.is_active ? "Activo" : "Inactivo"}
                        </span>
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
          {selectedUser ? "Editar administrador" : "Crear administrador"}
        </h2>
        <p className="mt-1 text-sm text-muted">
          Los cambios impactan tanto en `auth.users` como en `profiles`.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-ink">
              <span>Nombres</span>
              <input
                value={form.first_names}
                onChange={(event) => handleChange("first_names", event.target.value)}
                className="w-full rounded-2xl border border-border px-4 py-3 outline-none transition focus:border-primary"
                required
              />
            </label>

            <label className="space-y-2 text-sm text-ink">
              <span>Apellidos</span>
              <input
                value={form.last_names}
                onChange={(event) => handleChange("last_names", event.target.value)}
                className="w-full rounded-2xl border border-border px-4 py-3 outline-none transition focus:border-primary"
                required
              />
            </label>
          </div>

          <label className="space-y-2 text-sm text-ink">
            <span>Correo</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => handleChange("email", event.target.value)}
              className="w-full rounded-2xl border border-border px-4 py-3 outline-none transition focus:border-primary"
              required
            />
          </label>

          <label className="space-y-2 text-sm text-ink">
            <span>
              {selectedUser ? "Nueva contraseña (opcional)" : "Contraseña"}
            </span>
            <input
              type="password"
              value={form.password}
              onChange={(event) => handleChange("password", event.target.value)}
              className="w-full rounded-2xl border border-border px-4 py-3 outline-none transition focus:border-primary"
              required={!selectedUser}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-ink">
              <span>Teléfono</span>
              <input
                value={form.phone}
                onChange={(event) => handleChange("phone", event.target.value)}
                className="w-full rounded-2xl border border-border px-4 py-3 outline-none transition focus:border-primary"
              />
            </label>

            <label className="space-y-2 text-sm text-ink">
              <span>DUI</span>
              <input
                value={form.dui}
                onChange={(event) => handleChange("dui", event.target.value)}
                className="w-full rounded-2xl border border-border px-4 py-3 outline-none transition focus:border-primary"
              />
            </label>
          </div>

          <label className="space-y-2 text-sm text-ink">
            <span>Dirección</span>
            <input
              value={form.address}
              onChange={(event) => handleChange("address", event.target.value)}
              className="w-full rounded-2xl border border-border px-4 py-3 outline-none transition focus:border-primary"
            />
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-ink">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(event) => handleChange("is_active", event.target.checked)}
              className="size-4 rounded border-border text-primary focus:ring-primary"
            />
            Usuario activo
          </label>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover disabled:opacity-60"
            >
              {submitting ? "Guardando..." : selectedUser ? "Guardar cambios" : "Crear administrador"}
            </button>

            {selectedUser ? (
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
