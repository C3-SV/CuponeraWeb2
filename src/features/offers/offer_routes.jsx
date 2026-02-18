import React from "react";
import { Offers } from "../../pages/Offers";
import { OfferDetails } from "../../pages/OfferDetails";

export const offerRoutes = [
    { path: "offers", element: <Offers title="Nuestras Ofertas" /> },
    { path: "offer/:id", element: <OfferDetails /> },
];
