import { useNavigate } from "react-router-dom";
import {
  Users,
  Warehouse,
  ArrowLeftRight,
  Package,
  Activity,
  ShieldCheck,
} from "lucide-react";

import StatCard from "../components/dashboard/StateCard";
import { useAuth } from "../context";
import useWarehouses from "../hooks/useWarehouses";
import useTransfers from "../hooks/useTransfers";
import useInventory from "../hooks/useInventory";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { warehouses } = useWarehouses();
  const { transfers } = useTransfers();
  const { inventory, lowStockItems } = useInventory();

  const warehouseCount = warehouses.length || 8;
  const transferCount = transfers.length || 156;
  const lowStockCount = inventory.length > 0 ? lowStockItems.length : 12;

  const stats = [
    {
      label: "TOTAL USERS",
      value: "24",
      description: "Registered system users",
    },
    {
      label: "WAREHOUSES",
      value: String(warehouseCount),
      description: "Active warehouse locations",
    },
    {
      label: "TRANSFERS",
      value: String(transferCount),
      description: "Total transfer requests",
    },
    {
      label: "LOW STOCK",
      value: String(lowStockCount),
      description: "Products requiring attention",
    },
  ];

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} />

            <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#77736b]">
              Administration
            </span>
          </div>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            Admin Dashboard
          </h1>

          <p className="mt-1 text-[11px] text-[#77736b]">
            Welcome back, {user?.name || "Administrator"}. Manage users,
            warehouses and system activity.
          </p>
        </div>

        <div className="border border-[#d8d4cc] bg-[#f1efe9] px-4 py-2">
          <p className="text-[9px] uppercase tracking-wide text-[#77736b]">
            Current Role
          </p>

          <p className="mt-1 text-[10px] font-bold">
            {user?.role || "ADMIN"}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            description={stat.description}
          />
        ))}
      </div>

      {/* System overview */}
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="border border-[#ddd9d1] bg-[#fbfaf7]">
          <div className="border-b border-[#ddd9d1] px-5 py-4">
            <h2 className="text-sm font-semibold">System Overview</h2>

            <p className="mt-1 text-[10px] text-[#77736b]">
              Current system activity.
            </p>
          </div>

          <div className="divide-y divide-[#ebe8e1]">
            <SystemRow
              icon={Users}
              title="User Management"
              description="Manage system users and roles"
              value="24 users"
              onClick={() => navigate("/admin/users")}
            />

            <SystemRow
              icon={Warehouse}
              title="Warehouse Management"
              description="Manage warehouse locations"
              value={`${warehouseCount} active`}
              onClick={() => navigate("/warehouses")}
            />

            <SystemRow
              icon={ArrowLeftRight}
              title="Transfer Management"
              description="Monitor stock transfers"
              value={`${transferCount} transfers`}
              onClick={() => navigate("/transfers")}
            />

            <SystemRow
              icon={Package}
              title="Inventory"
              description="Monitor stock levels"
              value={`${lowStockCount} alerts`}
              onClick={() => navigate("/inventory")}
            />
          </div>
        </div>

        {/* Activity */}
        <div className="border border-[#ddd9d1] bg-[#fbfaf7]">
          <div className="border-b border-[#ddd9d1] px-5 py-4">
            <h2 className="text-sm font-semibold">Recent Activity</h2>

            <p className="mt-1 text-[10px] text-[#77736b]">
              Latest administrative events.
            </p>
          </div>

          <div className="divide-y divide-[#ebe8e1]">
            <ActivityRow
              title="New user created"
              user="admin@stockflow.com"
              time="5 min ago"
            />

            <ActivityRow
              title="Warehouse updated"
              user="manager@stockflow.com"
              time="24 min ago"
            />

            <ActivityRow
              title="Transfer approved"
              user="manager@stockflow.com"
              time="1 hour ago"
            />

            <ActivityRow
              title="User role changed"
              user="admin@stockflow.com"
              time="2 hours ago"
            />
          </div>

          <div className="border-t border-[#ddd9d1] p-4">
            <button
              onClick={() => navigate("/admin/audit-logs")}
              className="text-[10px] font-semibold underline underline-offset-2"
            >
              View All Audit Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SystemRow({ icon: Icon, title, description, value, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 transition hover:bg-[#f6f4ef]"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center border border-[#d8d4cc] bg-[#f1efe9]">
          <Icon size={14} />
        </div>

        <div>
          <p className="text-[11px] font-semibold">{title}</p>
          <p className="mt-1 text-[9px] text-[#77736b]">{description}</p>
        </div>
      </div>

      <span className="text-[10px] font-semibold">{value}</span>
    </div>
  );
}

function ActivityRow({ title, user, time }) {
  return (
    <div className="flex items-start gap-3 px-5 py-4">
      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center bg-black text-white">
        <Activity size={11} />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-semibold">{title}</p>
        <p className="mt-1 text-[9px] text-[#77736b]">{user}</p>
        <p className="mt-1 text-[8px] text-[#99958d]">{time}</p>
      </div>
    </div>
  );
}