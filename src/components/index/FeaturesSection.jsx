import { TruckIcon, HeadsetIcon, ShieldCheckIcon } from "../ui/Icons";

export const FeaturesSection = () => {
    const features = [
        {
            title: "ENVÍO RÁPIDO Y GRATIS",
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
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="flex flex-col items-center"
                            >
                                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-black ring-8 ring-gray-200">
                                    <Icon className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="mb-3 text-lg font-bold uppercase tracking-tight text-gray-900 font-heading">
                                    {feature.title}
                                </h3>
                                <p className="text-sm font-medium text-gray-500">
                                    {feature.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
