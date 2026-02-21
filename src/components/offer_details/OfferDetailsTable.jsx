import React from "react";

export const OfferDetailsTable = ({ details }) => {
    // Filter out sentinel entries (e.g. { categoryName }) that have no displayable key/value
    const rows = (details ?? []).filter((row) => row.title && row.description);

    if (rows.length === 0) return null;

    return (
        <section className="mt-12">
            <h2 className="text-lg font-semibold text-gray-900 font-heading">
                Detalles de la oferta
            </h2>
            <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                    <tbody className="divide-y divide-gray-200">
                        {rows.map((row) => (
                            <tr key={row.id ?? row.title} className="align-top">
                                <th className="w-40 sm:w-52 text-left font-semibold text-gray-900 px-4 py-3 border-r border-gray-200 bg-white">
                                    {row.title}
                                </th>
                                <td className="px-4 py-3 text-gray-700">
                                    {row.description}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};
