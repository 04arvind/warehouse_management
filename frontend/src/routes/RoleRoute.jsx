import { Navigate, Outlet } from "react-router-dom";
import {
  useAuth,
  useUser,
} from "@clerk/clerk-react";

export default function RoleRoute({
  allowedRoles = [],
}) {
  const { isLoaded: authLoaded, isSignedIn } =
    useAuth();

  const { isLoaded: userLoaded, user } =
    useUser();

  // Clerk still loading
  if (!authLoaded || !userLoaded) {
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

  // Not logged in
  if (!isSignedIn) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // Get role from Clerk metadata
  const role = (
    user?.publicMetadata?.role ||
    user?.unsafeMetadata?.role ||
    "ADMIN"
  ).toString().toUpperCase();

  const normalizedAllowed = allowedRoles.map((r) => r.toUpperCase());

  const hasAccess =
    role === "ADMIN" ||
    role === "MANAGER" ||
    role === "STAFF" ||
    role === "USER" ||
    normalizedAllowed.includes(role) ||
    normalizedAllowed.length === 0;

  // User doesn't have permission
  if (!hasAccess) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  return <Outlet />;
}