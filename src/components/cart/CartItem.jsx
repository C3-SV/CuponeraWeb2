import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { useShopStore } from "../../store/useShop";

export const CartItem = ({ item }) => {
    //console.log("CART ITEM RENDER:", item);
    const removeFromCart = useShopStore((state) => state.removeFromCart);
    const updateQuantity = useShopStore((state) => state.updateQuantity);

    // para mostrar el limite
    const max = useMemo(() => {
        const s = Number(item.stock);
        return Number.isFinite(s) && s > 0 ? s : 999;
    }, [item.stock]);

    const [qty, setQty] = useState(String(item.quantity ?? 1));

    // Sincroniza si el store cambia quantity
    useEffect(() => {
        setQty(String(item.quantity ?? 1));
    }, [item.quantity]);

    const commitQty = (raw) => {
        const num = Math.max(1, Math.min(max, Number(raw) || 1));
        setQty(String(num));
        updateQuantity(item.id, num); // number
    };

    const decQty = () => commitQty((Number(qty) || 1) - 1);
    const incQty = () => commitQty((Number(qty) || 1) + 1);

    const confirmRemove = async () => {
        const r = await Swal.fire({
            title: "¿Eliminar del carrito?",
            text: item.name || "Este producto",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (r.isConfirmed) {
            removeFromCart(item.id);
            Swal.fire({
                title: "Eliminado",
                icon: "success",
                timer: 900,
                showConfirmButton: false,
            });
        }
    };

    return (
        <li className="flex py-6 sm:py-10">
            {/* Imagen */}
            <div className="shrink-0">
                <img
                    src={item.imageUrl || item.images?.[0]}
                    alt={item.name}
                    className="size-24 rounded-md object-cover sm:size-48"
                />
            </div>

            {/* Info */}
            <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    <div>
                        <div className="flex justify-between">
                            <h3 className="text-sm">
                                <Link
                                    to={`/offer/${item.id}`}
                                    className="font-medium text-gray-700 hover:text-gray-800"
                                >
                                    {item.name}
                                </Link>
                            </h3>
                        </div>
                        <div className="mt-1 flex text-sm">
                            <p className="text-gray-500">
                                {item.variant || "Standard"}
                            </p>
                        </div>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                            ${item.price}
                        </p>
                    </div>

                    <div className="mt-4 sm:mt-0 sm:pr-9">
                        {/*Control de cantidad*/}
                        <div className="flex sm:block">
                            <div className="inline-flex w-8/10 sm:w-fit items-center overflow-hidden rounded-md border border-gray-300 bg-white mx-auto sm:mx-0">
                                <button
                                    type="button"
                                    onClick={decQty}
                                    className="size-10 grid place-items-center hover:bg-gray-50 transition"
                                >
                                    <span className="text-xl leading-none">−</span>
                                </button>

                                <input
                                    value={qty}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/[^\d]/g, "");
                                        if (val === "") {
                                            setQty("");
                                            return;
                                        }
                                        const next = Math.max(1, Math.min(max, Number(val)));
                                        setQty(String(next));
                                    }}
                                    onBlur={() => {
                                        commitQty(qty);
                                    }}
                                    inputMode="numeric"
                                    className="h-10 w-14 sm:w-16 text-center text-sm font-medium text-gray-900 outline-none border-x border-gray-300 bg-white flex-1"
                                />
                                <button
                                    type="button"
                                    onClick={incQty}
                                    className="size-10 grid place-items-center bg-primary text-white hover:bg-primary-hover transition"
                                >
                                    <span className="text-xl leading-none">+</span>
                                </button>
                            </div>
                        </div>

                        <div className="absolute top-0 right-0">
                            <button
                                type="button"
                                onClick={confirmRemove}
                                className="-m-2 inline-flex p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <span className="sr-only">Eliminar</span>
                                <svg
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                    className="size-5"
                                >
                                    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                    {item.stock > 0 ? (
                        <>
                            <svg
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                                className="size-5 shrink-0 text-green-500"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>En stock</span>
                        </>
                    ) : (
                        <span className="text-red-500">Agotado</span>
                    )}
                </p>
            </div>
        </li>
    );
};