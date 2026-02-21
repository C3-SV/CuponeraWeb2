import React from 'react'
import { useState } from "react";
import { registerUser } from "../authService";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import { showError, showSuccess } from "../../../utils/errorHandler";
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
  const [loading, setLoading] = useState(false);

  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  const duiRegex = /^\d{8}-\d{1}$/;
  const phoneRegex = /^\d{8}$/;
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
    return showError("Error", "El nombre es requerido");
  }

  if (!nameRegex.test(name)) {
    return showError("Error", "El nombre solo puede contener letras y espacios");
  }

  if (!lastname.trim()) {
    return showError("Error", "El apellido es requerido");
  }

  if (!nameRegex.test(lastname)) {
    return showError("Error", "El apellido solo puede contener letras y espacios");
  }

  if (!email.trim()) {
    return showError("Error", "El email es requerido");
  }

  if (!dui.trim()) {
    return showError("Error", "El DUI es requerido");
  }

  if (!duiRegex.test(dui)) {
    return showError("Error", "El DUI debe tener formato 00000000-0");
  }

  if (!phone.trim()) {
    return showError("Error", "El teléfono es requerido");
  }

  if (!phoneRegex.test(phone)) {
    return showError("Error", "El teléfono debe tener 8 números");
  }

  if (!password.trim()) {
    return showError("Error", "La contraseña es requerida");
  }

  if (password.length <= 6) {
  return showError("Error", "La contraseña debe tener más de 6 caracteres");
}
    setLoading(true);
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

      showSuccess("¡Éxito!", "Revisa tu correo para confirmar tu cuenta");
      setName("");
      setLastname("");
      setEmail("");
      setDui("");
      setPhone("");
      setAddress("");
      setPassword("");
    } catch (err) {
      showError("Error en el registro", err.message);
    } finally {
      setLoading(false);
      setMsg("");
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
            disabled={loading}
          />

          <Input type="text" placeholder="Apellidos"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            disabled={loading}
          />

          <Input type="email" placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <Input type="text" placeholder="DUI"
            value={dui}
            onChange={(e) => setDui(e.target.value)}
            disabled={loading}
          />

          <Input type="text" placeholder="Telefono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading}
          />

          <Input type="text" placeholder="Direccion"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            disabled={loading}
          />

          <Input type="password" placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? "Registrando..." : "Crear cuenta"}
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