import { useEffect } from "react";
import "./index.css";
// tomar las rutas del router
import { router } from "./routes/router.jsx";
import { RouterProvider } from "react-router-dom";
import { useAuthStore } from "./store/authStore.js";

function App() {
    const initialize = useAuthStore((state) => state.initialize);
    const loading = useAuthStore((state) => state.loading);

    useEffect(() => {
        initialize();
    }, []);

    if(loading){
        return (<></>);
    }
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
