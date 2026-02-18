import React, { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

const linkDesktop = ({ isActive }) =>
    `text-sm transition ${
        isActive
            ? "text-black font-semibold underline underline-offset-4"
            : "opacity-80 hover:opacity-100 hover:underline hover:underline-offset-4"
    }`;

const linkMobile = ({ isActive }) =>
    `px-5 py-5 text-base transition border-b border-gray-200 ${
        isActive
            ? "bg-secondary-hover text-white font-semibold"
            : "text-gray-900 hover:bg-gray-50"
    }`;

export default function RootLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);

    // Cerrar con ESC
    useEffect(() => {
        function onKeyDown(e) {
            if (e.key === "Escape") setMobileOpen(false);
        }
        if (mobileOpen) document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [mobileOpen]);

    // Bloquear scroll del body cuando el drawer está abierto
    useEffect(() => {
        if (!mobileOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [mobileOpen]);

    return (
        <div className="min-h-screen flex flex-col bg-bg text-ink">
            {/* ===== DESKTOP HEADER ===== */}
            <header className="hidden sm:block border-b border-border bg-bg py-2">
                <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-5">
                    <NavLink to="/" className="flex items-center gap-x-3">
                        <img
                            src="src/assets/logo_mundo_cupones.svg"
                            alt="Logo"
                            className="size-12"
                        />
                        <h1 className="font-bold text-primary text-lg font-heading">
                            Mundo{" "}
                            <span className="text-secondary">Cupones</span>
                        </h1>
                    </NavLink>

                    <div className="flex-1 flex justify-center gap-6">
                        <NavLink to="/" className={linkDesktop}>
                            Inicio
                        </NavLink>
                        <NavLink to="/offers" className={linkDesktop}>
                            Ofertas
                        </NavLink>
                        <NavLink to="/mis-cupones" className={linkDesktop}>
                            Mis cupones
                        </NavLink>
                    </div>

                    <div className="flex items-center gap-4">
                        <NavLink
                            to="/cart"
                            className={(props) =>
                                linkDesktop(props) +
                                " hover:scale-110 transition duration-300"
                            }
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className="size-9 bg-surface rounded-full p-2 fill-current"
                            >
                                <path d="M6 2a1 1 0 0 1 .993 .883l.007 .117v1.068l13.071 .935a1 1 0 0 1 .929 1.024l-.01 .114l-1 7a1 1 0 0 1 -.877 .853l-.113 .006h-12v2h10a3 3 0 1 1 -2.995 3.176l-.005 -.176l.005 -.176c.017 -.288 .074 -.564 .166 -.824h-5.342a3 3 0 1 1 -5.824 1.176l-.005 -.176l.005 -.176a3.002 3.002 0 0 1 1.995 -2.654v-12.17h-1a1 1 0 0 1 -.993 -.883l-.007 -.117a1 1 0 0 1 .883 -.993l.117 -.007h2zm0 16a1 1 0 1 0 0 2a1 1 0 0 0 0 -2zm11 0a1 1 0 1 0 0 2a1 1 0 0 0 0 -2z" />
                            </svg>
                        </NavLink>
                        <NavLink to="/login" className={linkDesktop}>
                            Crear cuenta
                        </NavLink>
                    </div>
                </nav>
            </header>

            {/* ===== MOBILE HEADER ===== */}
            <header className="sm:hidden border-b border-border bg-bg">
                <div className="px-4 h-14 flex items-center justify-between">
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

                    <button
                        type="button"
                        onClick={() => setMobileOpen(true)}
                        aria-expanded={mobileOpen}
                        aria-controls="mobile-drawer"
                        className="grid size-10 place-items-center rounded-full bg-surface text-ink ring-1 ring-black/5 hover:opacity-90 transition"
                    >
                        <span className="sr-only">Open main menu</span>
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
                    </button>
                </div>

                {/* Drawer overlay (estilo filtros) */}
                {mobileOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden" role="dialog">
                        {/* backdrop */}
                        <button
                            className="absolute inset-0 bg-black/25"
                            onClick={() => setMobileOpen(false)}
                        />

                        <div className="absolute inset-0 flex">
                            <div className="ml-auto h-full w-full max-w-sm bg-white shadow-xl flex flex-col">
                                {/* HEADER */}
                                <div className="flex items-center justify-between px-5 py-4 bg-gray-50 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Menú
                                    </h2>

                                    <button
                                        onClick={() => setMobileOpen(false)}
                                        className="size-10 p-2 rounded-md overflow-hidden text-gray-400 focus:ring-secondary-hover focus:outline-none focus:ring-2"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="size-6"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        >
                                            <path d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* LISTA */}
                                <nav className="flex flex-col">
                                    <NavLink
                                        to="/"
                                        className={linkMobile}
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        Inicio
                                    </NavLink>

                                    <NavLink
                                        to="/offers"
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

                                    <NavLink
                                        to="/cart"
                                        className={linkMobile}
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        Mi carrito
                                    </NavLink>

                                    <NavLink
                                        to="/login"
                                        className={linkMobile}
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        Crear cuenta
                                    </NavLink>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            <main className="flex-1">
                <Outlet />
            </main>

            <footer className="mt-10 border-t border-border bg-secondary-hover text-white">
                <div className="max-w-6xl mx-auto px-20 xl:px-4 py-10">
                    <div className="grid gap-10 md:grid-cols-2">
                        {/* Brand */}
                        <div>
                            <div className="flex items-center gap-3">
                                <img
                                    src="src/assets/logo_mundo_cupones.svg"
                                    alt="Mundo Cupones"
                                    className="size-11"
                                />

                                <div>
                                    <p className="text-md font-semibold">
                                        Mundo{" "}
                                        <span className="text-primary">
                                            Cupones
                                        </span>
                                    </p>

                                    <p className="text-sm text-white">
                                        Todo un mundo de ofertas a tu alcance
                                    </p>
                                </div>
                            </div>

                            <p className="mt-4 text-sm text-white/80 leading-relaxed">
                                Encuentra ofertas, compra cupones y
                                adminístralos fácilmente desde tu cuenta.
                            </p>
                        </div>

                        {/* Navegación */}
                        <div className="justify-self-center md:justify-self-end">
                            <h3 className="text-sm font-semibold tracking-wide">
                                Navegación
                            </h3>

                            <ul className="mt-4 space-y-2 text-sm text-white/80">
                                <li>
                                    <NavLink
                                        to="/"
                                        className="hover:text-white transition"
                                    >
                                        Inicio
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/ofertas"
                                        className="hover:text-white transition"
                                    >
                                        Ofertas
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/mis-cupones"
                                        className="hover:text-white transition"
                                    >
                                        Mis cupones
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/carrito"
                                        className="hover:text-white transition"
                                    >
                                        Carrito
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/login"
                                        className="hover:text-white transition"
                                    >
                                        Crear cuenta
                                    </NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="mt-10 border-t border-white/15 pt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-center sm:text-left text-xs text-white/70">
                            &copy; {new Date().getFullYear()} Mundo Cupones.
                            Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}