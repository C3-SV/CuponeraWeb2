import { TruckIcon, HeadsetIcon, ShieldCheckIcon } from "../ui/Icons";

export const FeaturesSection = () => {
    const features = [
        {
            title: "ENTREGA DIGITAL AL INSTANTE",
            desc: "Entrega gratuita en pedidos superiores a $140",
            icon: TruckIcon,
        },
        {
            title: "SOPORTE 24/7",
            desc: "Atención al cliente amigable todo el día",
            icon: HeadsetIcon,
        },
        {
            title: "GARANTÍA DE DEVOLUCIÓN",
            desc: "Te devolvemos tu dinero en 30 días",
            icon: ShieldCheckIcon,
        },
    ];

    return (
        <div className="bg-white py-16 sm:py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-heading uppercase">
                        ¿Por qué elegirnos?
                    </h2>
                    <p className="mt-4 text-lg leading-8 text-gray-600">
                        Nos aseguramos de brindarte la mejor experiencia de
                        compra.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-y-12 gap-x-8 md:grid-cols-3 text-center">
                    <div className="flex flex-col items-center">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-black ring-8 ring-gray-200">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="fill-none stroke-white size-10"
                            >
                                <path d="M15 5l0 2" />
                                <path d="M15 11l0 2" />
                                <path d="M15 17l0 2" />
                                <path d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-3a2 2 0 0 0 0 -4v-3a2 2 0 0 1 2 -2" />
                            </svg>
                        </div>
                        <h3 className="mb-3 text-lg font-bold uppercase tracking-tight text-gray-900 font-heading">
                            ENTREGA DIGITAL AL INSTANTE
                        </h3>
                        <p className="text-sm font-medium text-gray-500">
                            Compra y recibe tu cupón directamente en tu correo o
                            perfil. ¡Listo para usar!
                        </p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-black ring-8 ring-gray-200">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="fill-none stroke-white size-10"
                            >
                                <path d="M4 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
                                <path d="M7 17l0 .01" />
                                <path d="M14 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
                                <path d="M7 7l0 .01" />
                                <path d="M4 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
                                <path d="M17 7l0 .01" />
                                <path d="M14 14l3 0" />
                                <path d="M20 14l0 .01" />
                                <path d="M14 14l0 3" />
                                <path d="M14 20l3 0" />
                                <path d="M17 17l3 0" />
                                <path d="M20 17l0 3" />
                            </svg>
                        </div>
                        <h3 className="mb-3 text-lg font-bold uppercase tracking-tight text-gray-900 font-heading">
                            CANJE FÁCIL Y SIN PAPELES
                        </h3>
                        <p className="text-sm font-medium text-gray-500">
                            Olvídate de imprimir. Solo muestra el código desde
                            tu pantalla al llegar al establecimiento.
                        </p>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-black ring-8 ring-gray-200">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="fill-none stroke-white size-10"
                            >
                                <path d="M9 15l6 -6" />
                                <circle
                                    cx="9.5"
                                    cy="9.5"
                                    r=".5"
                                    fill="currentColor"
                                />
                                <circle
                                    cx="14.5"
                                    cy="14.5"
                                    r=".5"
                                    fill="currentColor"
                                />
                                <path d="M5 7.2a2.2 2.2 0 0 1 2.2 -2.2h1a2.2 2.2 0 0 0 1.55 -.64l.7 -.7a2.2 2.2 0 0 1 3.12 0l.7 .7a2.2 2.2 0 0 0 1.55 .64h1a2.2 2.2 0 0 1 2.2 2.2v1a2.2 2.2 0 0 0 .64 1.55l.7 .7a2.2 2.2 0 0 1 0 3.12l-.7 .7a2.2 2.2 0 0 0 -.64 1.55v1a2.2 2.2 0 0 1 -2.2 2.2h-1a2.2 2.2 0 0 0 -1.55 .64l-.7 .7a2.2 2.2 0 0 1 -3.12 0l-.7 -.7a2.2 2.2 0 0 0 -1.55 -.64h-1a2.2 2.2 0 0 1 -2.2 -2.2v-1a2.2 2.2 0 0 0 -.64 -1.55l-.7 -.7a2.2 2.2 0 0 1 0 -3.12l.7 -.7a2.2 2.2 0 0 0 .64 -1.55v-1" />
                            </svg>
                        </div>
                        <h3 className="mb-3 text-lg font-bold uppercase tracking-tight text-gray-900 font-heading">
                            OFERTAS VERIFICADAS
                        </h3>
                        <p className="text-sm font-medium text-gray-500">
                            Trabajamos de la mano con los comercios para
                            garantizarte descuentos reales y transparentes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
