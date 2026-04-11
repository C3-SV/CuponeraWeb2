import { NavLink, Outlet } from "react-router-dom";

const navClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-primary text-white"
      : "bg-white text-ink hover:bg-surface"
  }`;

export default function AdminLayout() {
  return (
    <div className="bg-surface-2">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-border bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                Panel admin.general
              </p>
              <h1 className="mt-3 text-3xl font-semibold font-heading text-ink">
                Administración de la cuponera
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-muted">
                Gestioná usuarios admin, rubros y clientes desde un solo módulo.
              </p>
            </div>

            <nav className="flex flex-wrap gap-3">
              <NavLink to="/admin/usuarios" className={navClass}>
                Usuarios admin
              </NavLink>
              <NavLink to="/admin/rubros" className={navClass}>
                Rubros
              </NavLink>
              <NavLink to="/admin/clientes" className={navClass}>
                Clientes
              </NavLink>
            </nav>
          </div>

          <div className="pt-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
