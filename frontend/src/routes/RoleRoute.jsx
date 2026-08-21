import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context";

export default function RoleRoute({
  allowedRoles = [],
}) {
  const {
    user,
    isAuthenticated,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f1efe9]">
        <div className="text-center">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-black border-t-transparent" />

          <p className="mt-3 text-[10px] text-[#77736b]">
            Checking permissions...
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
      />
    );
  }

  if (!allowedRoles.includes(user?.role)) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  return <Outlet />;
}