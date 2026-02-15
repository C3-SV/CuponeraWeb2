import React from "react";

const Page = ({ title }) => (
  <div className="max-w-5xl mx-auto px-4 py-10">
    <h1 className="text-2xl font-semibold">{title}</h1>
  </div>
);

export const cartRoutes = [
  { path: "carrito", element: <Page title="Carrito" /> },
  { path: "pago/exitoso", element: <Page title="Pago exitoso" /> },
  { path: "pago/fallido", element: <Page title="Pago fallido" /> },
];
