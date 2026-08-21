import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context";

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f1efe9]">
        <div className="text-center">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-black border-t-transparent" />

          <p className="mt-3 text-[10px] text-[#77736b]">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}