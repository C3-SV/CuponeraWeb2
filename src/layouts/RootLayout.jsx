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
    const [showScrollTop, setShowScrollTop] = useState(false); // Estado para el botón

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

    // Lógica para mostrar/ocultar el botón de scroll
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="min-h-screen flex flex-col bg-bg text-ink relative">
            {" "}
            {/* relative para contexto si fuera necesario */}
            {/* ===== DESKTOP HEADER ===== */}
            <header className="hidden sm:block border-b border-border bg-bg py-2">
                {/* ... (código del header desktop igual) ... */}
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
                {/* ... (código del header mobile igual) ... */}
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
                        className="grid size-10 place-items-center rounded-full "
                    >
                        <svg
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            className="size-8 stroke-secondary-hover"
                        >
                            <path
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>

                {mobileOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden" role="dialog">
                        <button
                            className="absolute inset-0 bg-black/25"
                            onClick={() => setMobileOpen(false)}
                        />
                        <div className="absolute inset-0 flex">
                            <div className="ml-auto h-full w-full max-w-sm bg-white shadow-xl flex flex-col">
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
            {/* BOTÓN SCROLL TO TOP */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-8 right-8 z-50 p-3 rounded-full bg-primary text-white shadow-lg transition-all duration-300 hover:bg-primary-hover hover:-translate-y-1 ${
                    showScrollTop
                        ? "opacity-100 visible"
                        : "opacity-0 invisible"
                }`}
                aria-label="Volver arriba"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-6 fill-white"
                    viewBox="0 0 24 24"
                >
                    <path d="M11.293 7.293a1 1 0 0 1 1.32 -.083l.094 .083l6 6l.083 .094l.054 .077l.054 .096l.017 .036l.027 .067l.032 .108l.01 .053l.01 .06l.004 .057l.002 .059l-.002 .059l-.005 .058l-.009 .06l-.01 .052l-.032 .108l-.027 .067l-.07 .132l-.065 .09l-.073 .081l-.094 .083l-.077 .054l-.096 .054l-.036 .017l-.067 .027l-.108 .032l-.053 .01l-.06 .01l-.057 .004l-.059 .002h-12c-.852 0 -1.297 -.986 -.783 -1.623l.076 -.084l6 -6z" />
                </svg>
            </button>
            <footer className="bg-secondary-hover text-white relative z-40">
                {/* ... (código del footer igual) ... */}
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
                    <div className="border-t border-white/15 mt-10 pt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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
