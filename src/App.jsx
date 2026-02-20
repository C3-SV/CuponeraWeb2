import { useState, useEffect } from "react";
import "./index.css";
// tomar las rutas del router
import { router } from "./routes/router.jsx";
import { Router } from "react-router";
import { RouterProvider } from "react-router-dom";
import { useAuthStore } from "./store/authStore.js";

function App() {
    const session = useAuthStore((state) => state.session);
    const initialize = useAuthStore((state) => state.initialize);
    const loading = useAuthStore((state) => state.loading);

    useEffect(() => {
        initialize();
    }, []);

    if(loading){
        return (<></>);
    }
    console.log("SESSION:", session);
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
