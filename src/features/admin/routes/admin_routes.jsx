import React from "react";
import { Navigate } from "react-router-dom";
import RequireAdmin from "../components/RequireAdmin";
import AdminLayout from "../components/AdminLayout";
import AdminUsersPage from "../pages/AdminUsersPage";
import AdminCategoriesPage from "../pages/AdminCategoriesPage";
import AdminCustomersPage from "../pages/AdminCustomersPage";

export const adminRoutes = [
  {
    path: "admin",
    element: (
      <RequireAdmin>
        <AdminLayout />
      </RequireAdmin>
    ),
    children: [
      { index: true, element: <Navigate to="usuarios" replace /> },
      { path: "usuarios", element: <AdminUsersPage /> },
      { path: "rubros", element: <AdminCategoriesPage /> },
      { path: "clientes", element: <AdminCustomersPage /> },
    ],
  },
];
