import { useState } from "react";
import { Search } from "lucide-react";

import InventoryTable from "../components/inventory/InventoryTable";
import useInventory from "../hooks/useInventory";
import useWarehouses from "../hooks/useWarehouses";
import useDebounce from "../hooks/useDebounce";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import ErrorMessage from "../components/common/ErrorMessage";

export default function Inventory() {
  const { inventory, loading, error, search } = useInventory();
  const { warehouses } = useWarehouses();

  const [query, setQuery] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [stockFilter, setStockFilter] = useState("");

  const debouncedQuery = useDebounce(query, 300);

  const searchedInventory = search?.(debouncedQuery) || [];

  const filteredInventory = searchedInventory.filter((item) => {
    // Warehouse filter
    if (selectedWarehouse) {
      const itemWhId =
        item.warehouseId || item.warehouse?._id || item.warehouse?.id || item.warehouse;
      if (String(itemWhId) !== String(selectedWarehouse)) {
        return false;
      }
    }

    // Stock status filter
    const qty = Number(item.quantity ?? 0);
    const min = Number(item.minimumStock ?? 0);

    if (stockFilter === "LOW") {
      return qty > 0 && qty <= min;
    }
    if (stockFilter === "OUT") {
      return qty === 0;
    }
    if (stockFilter === "HEALTHY") {
      return qty > min;
    }

    return true;
  });

  return (
    <div className="space-y-7">
      <div>
        <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#77736b]">
          Operations
        </p>

        <h1 className="mt-2 text-2xl font-semibold">Inventory</h1>

        <p className="mt-1 text-[11px] text-[#77736b]">
          Monitor stock levels across all warehouses.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-3 border border-[#ddd9d1] bg-[#fbfaf7] p-4 md:flex-row">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#77736b]"
          />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="form-input pl-9"
            placeholder="Search product or SKU..."
          />
        </div>

        <select
          value={selectedWarehouse}
          onChange={(e) => setSelectedWarehouse(e.target.value)}
          className="form-input md:w-48"
        >
          <option value="">All Warehouses</option>
          {warehouses.map((wh) => (
            <option key={wh._id || wh.id} value={wh._id || wh.id}>
              {wh.name}
            </option>
          ))}
        </select>

        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="form-input md:w-40"
        >
          <option value="">All Stock</option>
          <option value="HEALTHY">In Stock</option>
          <option value="LOW">Low Stock</option>
          <option value="OUT">Out of Stock</option>
        </select>
      </div>

      {/* Table */}
      {loading && <Loader text="Loading inventory..." />}

      {!loading && error && <ErrorMessage message={error} />}

      {!loading && !error && filteredInventory.length === 0 && (
        <EmptyState
          title="No inventory found"
          description="Try adjusting your search or warehouse filters."
        />
      )}

      {!loading && !error && filteredInventory.length > 0 && (
        <InventoryTable inventory={filteredInventory} onView={() => {}} />
      )}
    </div>
  );
}