import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import StatCard from "../components/dashboard/StateCard";
import RecentTransfers from "../components/dashboard/RecentTransfers";
import WarehouseOverview from "../components/dashboard/WarehouseOverview";

import useWarehouses from "../hooks/useWarehouses";
import useTransfers from "../hooks/useTransfers";
import useInventory from "../hooks/useInventory";

const defaultTransfers = [
  {
    id: "TR-1024",
    source: "Delhi Central",
    destination: "Noida Hub",
    items: 4,
    status: "COMPLETED",
  },
  {
    id: "TR-1023",
    source: "Gurgaon Hub",
    destination: "Delhi Central",
    items: 2,
    status: "IN_TRANSIT",
  },
  {
    id: "TR-1022",
    source: "Noida Hub",
    destination: "Gurgaon Hub",
    items: 6,
    status: "PENDING",
  },
];

const defaultWarehouses = [
  {
    id: "1",
    name: "Delhi Central",
    location: "New Delhi",
    utilization: 74,
    usedCapacity: 37000,
    capacity: 50000,
  },
  {
    id: "2",
    name: "Noida Hub",
    location: "Noida, UP",
    utilization: 52,
    usedCapacity: 26000,
    capacity: 50000,
  },
  {
    id: "3",
    name: "Gurgaon Hub",
    location: "Gurgaon, Haryana",
    utilization: 81,
    usedCapacity: 40500,
    capacity: 50000,
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { warehouses } = useWarehouses();
  const { transfers, stats: transferStats } = useTransfers();
  const { inventory, lowStockItems } = useInventory();

  const totalStockUnits = inventory.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  const displayStock =
    inventory.length > 0
      ? totalStockUnits > 1000
        ? `${(totalStockUnits / 1000).toFixed(1)}K`
        : String(totalStockUnits)
      : "48.2K";

  const displayPending =
    transfers.length > 0 ? String(transferStats.pending) : "12";

  const displayInTransit =
    transfers.length > 0 ? String(transferStats.inTransit) : "08";

  const displayLowStock =
    inventory.length > 0 ? String(lowStockItems.length) : "17";

  const formattedRecentTransfers =
    transfers.length > 0
      ? transfers.slice(0, 5).map((t) => ({
          id: t.transferNumber || t._id || t.id,
          source: t.sourceWarehouse?.name || t.sourceWarehouse || "Source",
          destination:
            t.destinationWarehouse?.name || t.destinationWarehouse || "Destination",
          items: t.items?.length || 0,
          status: t.status,
        }))
      : defaultTransfers;

  const displayWarehouses =
    warehouses.length > 0
      ? warehouses.map((w) => ({
          id: w._id || w.id,
          name: w.name,
          location: w.location,
          utilization: w.utilization || 0,
          usedCapacity: w.usedCapacity || 0,
          capacity: w.capacity || 100,
        }))
      : defaultWarehouses;

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#77736b]">
            Operations
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            Dashboard
          </h1>

          <p className="mt-1 text-[11px] text-[#77736b]">
            Overview of warehouse operations and stock transfers.
          </p>
        </div>

        <button
          onClick={() => navigate("/transfers")}
          className="flex items-center gap-2 text-[10px] font-semibold underline underline-offset-2"
        >
          View Transfers
          <ArrowRight size={12} />
        </button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="TOTAL STOCK"
          value={displayStock}
          change="+4.8%"
          description="Units across all warehouses"
        />

        <StatCard
          label="PENDING TRANSFERS"
          value={displayPending}
          change="+2"
          description="Awaiting approval"
        />

        <StatCard
          label="IN TRANSIT"
          value={displayInTransit}
          description="Active stock movements"
        />

        <StatCard
          label="LOW STOCK ITEMS"
          value={displayLowStock}
          change="-5"
          description="Products below threshold"
        />
      </div>

      {/* Recent transfers */}
      <RecentTransfers transfers={formattedRecentTransfers} />

      {/* Warehouses */}
      <WarehouseOverview warehouses={displayWarehouses} />
    </div>
  );
}