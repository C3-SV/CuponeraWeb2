import React from 'react'
import { useState } from "react";
import { registerUser } from "../authService";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import Input from './Input';
import Button from './Button';

export default function Register() {
  const session = useAuthStore((state) => state.session);
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [dui, setDui] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");


  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg("Registrando...");
    try {
      await registerUser(
        email,
        password,
        name,
        lastname,
        phone,
        dui,
        address
      );

      alert("Revisa tu correo");
    } catch (err) {
      alert(err.message);
    }
  };

  if (session) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)] bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md p-8 shadow-sm rounded-sm">

        <h2 className="text-2xl font-semibold text-center mb-2">
          Crear cuenta
        </h2>

        <p className="text-center text-gray-500 text-sm mb-6">
          Ingrese su información abajo
        </p>

        <form onSubmit={handleRegister} className="space-y-6">

          <Input type="text" placeholder="Nombres"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input type="text" placeholder="Apellidos"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />

          <Input type="email" placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input type="text" placeholder="DUI"
            value={dui}
            onChange={(e) => setDui(e.target.value)}
          />

          <Input type="text" placeholder="Telefono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Input type="text" placeholder="Direccion"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <Input type="password" placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" variant="primary" className="w-full">
            Crear cuenta
          </Button>

        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tiene una cuenta?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Inicie sesión
          </a>
        </p>

      </div>
    </div>
  )
}
