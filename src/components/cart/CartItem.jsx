import { Link } from "react-router-dom";
import { useShopStore } from "../../store/useShop";

export const CartItem = ({ item }) => {
    const removeFromCart = useShopStore((state) => state.removeFromCart);
    const updateQuantity = useShopStore((state) => state.updateQuantity);

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
                        {/* Selector de Cantidad */}
                        <div className="grid w-full max-w-16 grid-cols-1">
                            <select
                                value={item.quantity}
                                onChange={(e) =>
                                    updateQuantity(item.id, e.target.value)
                                }
                                className="col-start-1 row-start-1 appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-secondary-hover sm:text-sm/6"
                            >
                                {[...Array(10).keys()].map((n) => (
                                    <option key={n + 1} value={n + 1}>
                                        {n + 1}
                                    </option>
                                ))}
                            </select>
                            <svg
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                aria-hidden="true"
                                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>

                        {/* Botón Eliminar */}
                        <div className="absolute top-0 right-0">
                            <button
                                type="button"
                                onClick={() => removeFromCart(item.id)}
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
