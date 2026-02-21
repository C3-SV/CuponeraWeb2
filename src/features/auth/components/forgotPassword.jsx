import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import Input from "./Input";
import Button from "./Button";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg("");

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/recover-password`,
            });

            if (error) throw error;

            setMsg(
                "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña."
            );

        } catch (err) {
            console.error(err);
            setMsg("Ocurrió un error. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-160px)] bg-gray-100 px-4">
            <div className="bg-white w-full max-w-md p-8 shadow-sm rounded-sm">
                <h2 className="text-2xl font-semibold text-center mb-2">
                    Recuperar contraseña
                </h2>

                <p className="text-center text-gray-500 text-sm mb-6">
                    Ingresa tu correo
                </p>

                <form onSubmit={handleReset} className="space-y-6">

                    <Input
                        type="email"
                        placeholder="Correo"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <div>
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? "Enviando..." : "Enviar enlace"}
                        </Button>
                    </div>

                    {msg && (
                        <p className="text-sm text-center mt-3 text-gray-600">
                            {msg}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}