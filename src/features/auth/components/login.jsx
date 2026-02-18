import { useState } from "react";
import { loginUser, logoutUser } from "../authService";
import LoginForm from "../components/LoginForm"

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("Cargando...");

    try {
      const res = await loginUser(email, password);
      console.log(res);
      setMsg("Login exitoso");
    } catch (err) {
      console.error(err);
      setMsg(err.message);
    }
  };

  /*const handleLogout = async () => {
    await logoutUser();
    setMsg("Sesión cerrada");
  };*/

  return (
    //aqui va el formulario de login
   <div className="flex items-center justify-center min-h-[calc(100vh-160px)] bg-gray-100 px-4">
      <LoginForm />
    </div>
  );
}
