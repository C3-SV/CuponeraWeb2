import { useState } from "react";
import "./index.css";
// tomar las rutas del router
import { router } from "./routes/router.jsx";
import { Router } from "react-router";
import { RouterProvider } from "react-router-dom";

function App() {
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
