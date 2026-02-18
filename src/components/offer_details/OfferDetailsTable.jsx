import React from "react";

export const OfferDetailsTable = ({ details }) => {
    return (
        <section className="mt-12">
            <h2 className="text-lg font-semibold text-gray-900 font-heading">
                Detalles de la oferta
            </h2>
            <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                    <tbody className="divide-y divide-gray-200">
                        {details.map((row) => (
                            <tr key={row.key} className="align-top">
                                <th className="w-40 sm:w-52 text-left font-semibold text-gray-900 px-4 py-3 border-r border-gray-200 bg-white">
                                    {row.key}
                                </th>
                                <td className="px-4 py-3 text-gray-700">
                                    {row.value}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};
