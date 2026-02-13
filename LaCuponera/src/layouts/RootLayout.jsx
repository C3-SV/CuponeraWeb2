import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const link = ({ isActive }) =>
  `text-sm transition ${isActive ? "font-semibold underline" : "opacity-80 hover:opacity-100"}`;

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-ink">
      <header className="border-b border-border bg-bg">
        <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-5">
          <NavLink to="/" className="font-semibold">CUPONES (FALTA NOMBRE) </NavLink>

          <NavLink to="/ofertas" className={link}>Ofertas</NavLink>
          <NavLink to="/mis-cupones" className={link}>Mis cupones</NavLink>

          <div className="ml-auto flex items-center gap-4">
            <NavLink to="/carrito" className={link}>Carrito</NavLink>
            <NavLink to="/login" className={link}>Login</NavLink>
            <NavLink to="/perfil" className={link}>Perfil</NavLink>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

        {/* EL FOOTER */}
      <footer className="border-t border-border bg-bg">
        <div className="max-w-6xl mx-auto px-4 py-6 text-xs opacity-70">
          CUPONES -- FOOTER 
        </div>
      </footer>
    </div>
  );
}
