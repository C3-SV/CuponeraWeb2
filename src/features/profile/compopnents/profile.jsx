import { useAuthStore } from "../../../store/authStore";
import { useNavigate, Navigate } from "react-router-dom";

export default function Profile() {
  const session = useAuthStore((state) => state.session);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!session) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Mi Perfil</h2>

      <p className="mb-2">
        <strong>Email:</strong> {session?.user?.email}
      </p>

      <button
        onClick={handleLogout}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded"
      >
        Cerrar sesión
      </button>
    </div>
  );
}