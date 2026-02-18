import React from "react";
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import NotFoundPage from "../pages/NotFoundPage";
import { Index } from "../pages/Index";

//! AQUI VAMOS A RECIBIR LAS RUTAS QUE CADA PAREJA VAYA HACIENDO
import { offerRoutes } from "../features/offers/offer_routes.jsx";
//import { authRoutes } from "../features/auth/routes/auth.rotes.jsx";
//import { profileRoutes } from "../features/profile/routes/profile.routes.jsx";
import { cartRoutes } from "../features/cart/routes/cart_routes";
//import { couponsRoutes } from "../features/coupons/routes/coupons.routes.jsx";

const appRoutes = [
    ...offerRoutes,
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
            { index: true, element: <Index /> },
            ...appRoutes,
            { path: "*", element: <NotFoundPage /> },
        ],
    },
]);
