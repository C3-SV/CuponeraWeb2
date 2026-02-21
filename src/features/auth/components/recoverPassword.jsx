import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabaseClient";
import Input from "./Input";
import Button from "./Button";

export default function RecoverPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMsg("Las contraseñas no coinciden");
      return;
    }

    setMsg("Actualizando...");

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setMsg("Contraseña actualizada correctamente");

      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {
      console.error(err);
      setMsg(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)] bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md p-8 shadow-sm rounded-sm">
        <h2 className="text-2xl font-semibold text-center mb-2">
          Nueva contraseña
        </h2>

        <p className="text-center text-gray-500 text-sm mb-6">
          Ingresa tu nueva contraseña
        </p>

        <form onSubmit={handleUpdatePassword} className="space-y-6">

          <Input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <div>
            <Button type="submit" variant="primary" className="w-full">
              Actualizar contraseña
            </Button>
          </div>

          {msg && (
            <p
              className={`text-sm text-center mt-3 ${
                msg.includes("correctamente")
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {msg}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}