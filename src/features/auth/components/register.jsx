import React from 'react'
import { useState } from "react";
import {registerUser} from "../authService";

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
    <div>register</div>
  )
}
