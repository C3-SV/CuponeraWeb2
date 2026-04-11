import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";

export default function RequireAdmin({ children }) {
  const session = useAuthStore((state) => state.session);
  const profile = useAuthStore((state) => state.profile);
  const loading = useAuthStore((state) => state.loading);
  const profileLoading = useAuthStore((state) => state.profileLoading);

  if (loading || profileLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
          <p className="text-sm text-muted">Cargando panel administrativo...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (profile?.role !== "admin.general") {
    return <Navigate to="/" replace />;
  }

  return children;
}
