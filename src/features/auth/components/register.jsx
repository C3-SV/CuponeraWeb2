import React from 'react'
import { useState } from "react";
import {registerUser} from "../authService";
import RegisterForm from "../components/RegisterForm"

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  
  const handleRegister = async () => {
    setMsg("Registrando...");
    try {
      await registerUser(email, password, name);
      setMsg("Revisa tu correo para confirmar");
    } catch (err) {
      setMsg(err.message);
    }
  };
  return (
    //aqui va el formulario de registro
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)] bg-gray-100 px-4">
      <RegisterForm />
    </div>
  )
}
