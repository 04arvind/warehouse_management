import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Warehouse,
  ArrowLeftRight,
  Package,
  Settings,
  ShieldCheck,
  Users,
  FileText,
} from "lucide-react";

import { useAuth } from "../../context";

const navigation = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    label: "Warehouses",
    icon: Warehouse,
    path: "/warehouses",
  },
  {
    label: "New Transfer",
    icon: ArrowLeftRight,
    path: "/transfers/new",
  },
  {
    label: "Transfers",
    icon: ArrowLeftRight,
    path: "/transfers",
  },
  {
    label: "Inventory",
    icon: Package,
    path: "/inventory",
  },
  {
    label: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

const adminNavigation = [
  {
    label: "Admin Dashboard",
    icon: ShieldCheck,
    path: "/admin",
  },
  {
    label: "Users",
    icon: Users,
    path: "/admin/users",
  },
  {
    label: "Audit Logs",
    icon: FileText,
    path: "/admin/audit-logs",
  },
];

export default function Sidebar() {
  const { isAdmin } = useAuth();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-60 flex-col border-r border-[#ddd9d1] bg-[#f1efe9] lg:flex">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-[#ddd9d1] px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center bg-black text-white">
            <Warehouse size={15} />
          </div>

          <span className="text-[15px] font-bold tracking-tight">
            STOCKFLOW
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#77736b]">
          Operations
        </p>

        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/transfers"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 text-[12px] font-medium transition ${
                    isActive
                      ? "bg-black text-white"
                      : "text-[#242424] hover:bg-[#e5e2db]"
                  }`
                }
              >
                <Icon size={16} strokeWidth={1.7} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Admin Navigation */}
        <div className="mt-8">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#77736b]">
            Administration
          </p>

          <div className="space-y-1">
            {adminNavigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/admin"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 text-[12px] font-medium transition ${
                      isActive
                        ? "bg-black text-white"
                        : "text-[#242424] hover:bg-[#e5e2db]"
                    }`
                  }
                >
                  <Icon size={16} strokeWidth={1.7} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-[#ddd9d1] p-4">
        <div className="border border-[#ddd9d1] bg-[#f7f5f0] p-3">
          <p className="text-[11px] font-semibold">StockFlow</p>
          <p className="mt-1 text-[10px] text-[#77736b]">
            Warehouse Management
          </p>
        </div>
      </div>
    </aside>
  );
}