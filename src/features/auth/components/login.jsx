import { useState } from "react";
import { loginUser, logoutUser } from "../authService";

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
    <div>login</div>
  );
}
