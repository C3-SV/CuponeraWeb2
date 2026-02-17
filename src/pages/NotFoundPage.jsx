import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <h1 className="text-2xl font-semibold">Página no encontrada</h1>
      <Link to="/" className="mt-6 inline-block text-sm underline">
        Volver al inicio
      </Link>
    </div>
  );
}
