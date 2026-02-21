import { useAuthStore } from "../../../store/authStore";
import { useNavigate, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { showError, showSuccess } from "../../../utils/errorHandler";
import { supabase } from "../../../lib/supabaseClient";

export default function Profile() {
  const session = useAuthStore((state) => state.session);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [dui, setDui] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!session) return;
    const md = session.user?.user_metadata || {};
    setName(md.name || "");
    setLastname(md.lastname || "");
    setPhone(md.phone || "");
    setDui(md.dui || "");
    setAddress(md.address || "");
  }, [session]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  const duiRegex = /^\d{9}$/;
  const phoneRegex = /^\d{8}$/;
  const handleUpdate = async (e) => {
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
    
      if (!dui.trim()) {
        return showError("Error", "El DUI es requerido");
      }
    
      if (!duiRegex.test(dui)) {
        return showError("Error", "El DUI debe tener 9 números");
      }
    
      if (!phone.trim()) {
        return showError("Error", "El teléfono es requerido");
      }
    
      if (!phoneRegex.test(phone)) {
        return showError("Error", "El teléfono debe tener 8 números");
      }
    
    setLoading(true);
    setMsg("");

    try {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          name: name,
          lastname: lastname,
          phone: phone,
          dui: dui,
          address: address,
        },
      });

      if (error) throw error;
      showSuccess("Perfil actualizado correctamente");
    } catch (err) {
      console.error(err);
      showError("Error al actualizar", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Mi Perfil</h2>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700">Email</label>
          <p className="text-sm text-gray-800">{session?.user?.email}</p>
        </div>

        <div>
          <label className="block text-sm text-gray-700">Nombre</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700">Apellido</label>
          <input
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-700">Teléfono</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700">DUI</label>
            <input
              value={dui}
              onChange={(e) => setDui(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700">Dirección</label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {msg && <p className={`text-sm ${msg.includes("correcto") ? "text-green-600" : "text-red-600"}`}>{msg}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-orange-500 text-white rounded"
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>

          <button
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => navigate("/recover-password")}
          >
            Cambiar contraseña
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Cerrar sesión
          </button>
        </div>
      </form>
    </div>
  );
}