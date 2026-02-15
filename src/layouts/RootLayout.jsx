import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

const linkDesktop = ({ isActive }) =>
    `text-sm transition ${
        isActive
            ? "text-black font-semibold underline underline-offset-4"
            : "opacity-80 hover:opacity-100 hover:underline hover:underline-offset-4"
    }`;

const linkMobile = ({ isActive }) =>
    `text-sm px-3 py-2 rounded-md transition-colors ${
        isActive
            ? "bg-secondary-hover text-white font-semibold"
            : "opacity-80 hover:opacity-100 hover:bg-secondary-hover hover:text-white"
    }`;

export default function RootLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-bg text-ink">
            {/* ===== DESKTOP HEADER (TU HEADER ACTUAL) ===== */}
            <header className="hidden sm:block border-b border-border bg-bg py-2">
                <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-5">
                    <NavLink to="/" className="flex items-center gap-x-3">
                        <img
                            src="src/assets/logo_mundo_cupones.svg"
                            alt="Logo"
                            className="size-12"
                        />
                        <h1 className="font-bold text-primary">
                            Mundo{" "}
                            <span className="text-secondary ml-1">Cupones</span>
                        </h1>
                    </NavLink>

                    <div className="flex-1 flex justify-center gap-6">
                        <NavLink to="/" className={linkDesktop}>
                            Inicio
                        </NavLink>
                        <NavLink to="/ofertas" className={linkDesktop}>
                            Ofertas
                        </NavLink>
                        <NavLink to="/mis-cupones" className={linkDesktop}>
                            Mis cupones
                        </NavLink>
                    </div>

                    <div className="flex items-center gap-4">
                        <NavLink to="/carrito" className={linkDesktop}>
                            {/* tu svg */}
                            Carrito
                        </NavLink>
                        <NavLink to="/login" className={linkDesktop}>
                            Crear cuenta
                        </NavLink>
                    </div>
                </nav>
            </header>

            {/* ===== MOBILE HEADER (SOLO MOBILE) ===== */}
            <header className="sm:hidden border-b border-border bg-bg">
                <div className="px-4 h-14 flex items-center justify-between">
                    {/* Logo compact */}
                    <NavLink to="/" className="flex items-center gap-x-3">
                        <img
                            src="src/assets/logo_mundo_cupones.svg"
                            alt="Logo"
                            className="size-10"
                        />
                        <h1 className="font-bold text-primary">
                            Mundo{" "}
                            <span className="text-secondary ml-1">Cupones</span>
                        </h1>
                    </NavLink>

                    {/* Mobile menu button */}
                    <button
                        type="button"
                        onClick={() => setMobileOpen((v) => !v)}
                        aria-expanded={mobileOpen}
                        aria-controls="mobile-menu"
                        className="relative inline-flex items-center justify-center rounded-md p-2 opacity-80 hover:opacity-100"
                    >
                        <span className="sr-only">Open main menu</span>

                        {/* icono hamburguesa / cerrar */}
                        {!mobileOpen ? (
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                className="size-6"
                            >
                                <path
                                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        ) : (
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                className="size-6"
                            >
                                <path
                                    d="M6 18 18 6M6 6l12 12"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile dropdown */}
                {mobileOpen && (
                    <div id="mobile-menu" className="px-4 pb-3 pt-2">
                        <div className="flex flex-col gap-2">
                            <NavLink
                                to="/"
                                className={linkMobile}
                                onClick={() => setMobileOpen(false)}
                            >
                                Inicio
                            </NavLink>
                            <NavLink
                                to="/ofertas"
                                className={linkMobile}
                                onClick={() => setMobileOpen(false)}
                            >
                                Ofertas
                            </NavLink>
                            <NavLink
                                to="/mis-cupones"
                                className={linkMobile}
                                onClick={() => setMobileOpen(false)}
                            >
                                Mis cupones
                            </NavLink>

                            <div className="h-px bg-border my-2" />

                            <NavLink
                                to="/carrito"
                                className={linkMobile}
                                onClick={() => setMobileOpen(false)}
                            >
                                Carrito
                            </NavLink>
                            <NavLink
                                to="/login"
                                className={linkMobile}
                                onClick={() => setMobileOpen(false)}
                            >
                                Crear cuenta
                            </NavLink>
                        </div>
                    </div>
                )}
            </header>

            <main className="flex-1">
                <Outlet />
            </main>

            <footer className="border-t border-border bg-secondary-hover">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <h1 className="text-xs text-white text-center">
                        &copy; 2026 Mundo Cupones. Todos los derechos
                        reservados.
                    </h1>
                </div>
            </footer>
        </div>
    );
}
