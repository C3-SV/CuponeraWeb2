import React from "react";
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import NotFoundPage from "../pages/NotFoundPage";

//! AQUI VAMOS A RECIBIR LAS RUTAS QUE CADA PAREJA VAYA HACIENDO 
//import { offersRoutes } from "../features/offers/routes/offers.routes.jsx";
//import { authRoutes } from "../features/auth/routes/auth.routes.jsx";
//import { profileRoutes } from "../features/profile/routes/profile.routes.jsx";
import { cartRoutes } from "../features/cart/routes/cart_routes";
//import { couponsRoutes } from "../features/coupons/routes/coupons.routes.jsx";

const appRoutes = [
  //...offersRoutes,
  //...authRoutes,
  //...profileRoutes,
  ...cartRoutes,
  //...couponsRoutes,
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      ...appRoutes,
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
