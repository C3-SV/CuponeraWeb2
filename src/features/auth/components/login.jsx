import { useState } from "react";
import { loginUser } from "../authService";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import Input from "./Input";
import Button from "./Button";

export default function Login() {
  const session = useAuthStore((state) => state.session);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("Cargando...");

    try {
      const res = await loginUser(email, password);
      console.log(res);
      setMsg("Login exitoso");
      navigate("/");
    } catch (err) {
      console.error(err);
      setMsg(err.message);
    }
  };

   if (session) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)] bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md p-8 shadow-sm rounded-sm">
        <h2 className="text-2xl font-semibold text-center mb-2">
          Inicio de sesión
        </h2>

        <p className="text-center text-gray-500 text-sm mb-6">
          Ingrese su cuenta
        </p>

        <form onSubmit={handleLogin} className="space-y-6">

          <Input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div>
            <Button type="submit" variant="primary" className="w-full">
              Iniciar sesión
            </Button>
          </div>

          <p className="text-center text-sm">
            ¿Aún no tienes cuenta?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              Regístrate aquí
            </a>
          </p>

          <p className="text-center text-sm">
            ¿Haz olvidado tu contraseña?{" "}
            <a href="" className="text-blue-500 hover:underline"> 
              Recuperarla aquí
            </a>
          </p>

          {msg && (
            <p className={`text-sm text-center mt-3 ${msg === "Login exitoso" ? "text-green-600" : "text-red-500"
              }`}>
              {msg}
            </p>
          )}
        </form>

      </div>
    </div>
  );
}
