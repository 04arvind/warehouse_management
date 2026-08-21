import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import Login from "../pages/Login";
import Signup from "../pages/Signup";

import Dashboard from "../pages/Dashboard";
import Warehouses from "../pages/Warehouses";
import Inventory from "../pages/Inventory";
import Transfers from "../pages/Transfers";
import NewTransfer from "../pages/NewTransfer";
import TransferDetails from "../pages/TransferDetails";
import Settings from "../pages/Settings";
import NotFound from "../pages/NotFound";

import AdminDashboard from "../admin/AdminDashBoard";
import Users from "../admin/Users";
import AuditLogs from "../admin/AuditLogs";

import DashboardLayout from "../components/layout/DashboardLayout";

function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f1efe9]">
      <div className="text-center">

        <p className="text-5xl font-bold">
          403
        </p>

        <h1 className="mt-3 text-lg font-semibold">
          Access Denied
        </h1>

        <p className="mt-2 text-[10px] text-[#77736b]">
          You don't have permission to access this page.
        </p>

        <Link
          to="/dashboard"
          className="mt-5 inline-block text-[10px] font-semibold underline underline-offset-2"
        >
          Back to Dashboard
        </Link>

      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            PUBLIC
        ========================== */}

        <Route
          path="/login/*"
          element={<Login />}
        />

        <Route
          path="/signup/*"
          element={<Signup />}
        />

        <Route
          path="/unauthorized"
          element={<Unauthorized />}
        />


        {/* =========================
            PROTECTED
        ========================== */}

        <Route element={<ProtectedRoute />}>

          <Route element={<DashboardLayout />}>

            {/* "/" → "/dashboard" */}
            <Route
              index
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
            />

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/warehouses"
              element={<Warehouses />}
            />

            <Route
              path="/inventory"
              element={<Inventory />}
            />

            <Route
              path="/transfers"
              element={<Transfers />}
            />

            <Route
              path="/transfers/new"
              element={<NewTransfer />}
            />

            <Route
              path="/transfers/:id"
              element={<TransferDetails />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />


            {/* =========================
                ADMIN
            ========================== */}

            <Route
              element={
                <RoleRoute
                  allowedRoles={["ADMIN"]}
                />
              }
            >

              <Route
                path="/admin"
                element={<AdminDashboard />}
              />

              <Route
                path="/admin/users"
                element={<Users />}
              />

              <Route
                path="/admin/audit-logs"
                element={<AuditLogs />}
              />

            </Route>

          </Route>

        </Route>


        {/* =========================
            404
        ========================== */}

        <Route
          path="/404"
          element={<NotFound />}
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/404"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}