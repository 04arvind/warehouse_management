import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  ArrowRightLeft,
  Package,
  AlertTriangle,
  CheckCircle2,
  Boxes,
} from "lucide-react";

import InventoryTable from "../components/inventory/InventoryTable";
import Modal from "../components/common/Modal";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import ErrorMessage from "../components/common/ErrorMessage";
import StockBadge from "../components/inventory/StockBadge";

import useInventory from "../hooks/useInventory";
import useWarehouses from "../hooks/useWarehouses";
import useTransfers from "../hooks/useTransfers";
import useDebounce from "../hooks/useDebounce";
import useAuth from "../hooks/useAuth";

export default function Inventory() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    inventory,
    loading,
    error,
    refresh,
    search,
    create,
    updateStock,
  } = useInventory();

  const {
    transfers,
    approve,
    reject,
    ship,
    complete,
  } = useTransfers();

  const { warehouses } = useWarehouses();
  const { hasRole } = useAuth();
  const canManage = hasRole("ADMIN", "MANAGER");

  const [query, setQuery] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState(
    searchParams.get("warehouse") || ""
  );
  const [stockFilter, setStockFilter] = useState("");

  const currentWhObj = warehouses.find(
    (w) => String(w._id || w.id) === String(selectedWarehouse)
  );
  const selectedWhName = currentWhObj?.name || selectedWarehouse || "Selected Warehouse";

  // Filter transfers for the selected warehouse
  const relatedTransfers = transfers.filter((t) => {
    if (!selectedWarehouse) return false;
    const srcId = String(t.sourceWarehouseId || t.sourceWarehouse?._id || t.sourceWarehouse?.id || t.sourceWarehouse || "").toLowerCase();
    const destId = String(t.destinationWarehouseId || t.destinationWarehouse?._id || t.destinationWarehouse?.id || t.destinationWarehouse || "").toLowerCase();
    const curId = String(selectedWarehouse).toLowerCase();
    const curName = (currentWhObj?.name || "").toLowerCase();

    return (
      srcId === curId ||
      destId === curId ||
      (curName && (srcId.includes(curName) || destId.includes(curName)))
    );
  });

  // Sync if URL search params change
  useEffect(() => {
    const whParam = searchParams.get("warehouse");
    if (whParam) {
      setSelectedWarehouse(whParam);
    }
  }, [searchParams]);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [adjustItem, setAdjustItem] = useState(null);
  const [newStockQty, setNewStockQty] = useState("");
  const [viewItem, setViewItem] = useState(null);

  // New item form state
  const [newItem, setNewItem] = useState({
    name: "",
    sku: "",
    category: "General",
    warehouse: "",
    quantity: 100,
    minimumStock: 20,
  });

  const debouncedQuery = useDebounce(query, 300);
  const searchedInventory = search?.(debouncedQuery) || [];

  const filteredInventory = searchedInventory.filter((item) => {
    // Warehouse filter
    if (selectedWarehouse) {
      const itemWhId =
        item.warehouseId ||
        item.warehouse?._id ||
        item.warehouse?.id ||
        item.warehouse;
      if (
        String(itemWhId) !== String(selectedWarehouse) &&
        String(item.warehouse) !== String(selectedWarehouse)
      ) {
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

  // Calculate quick metrics
  const totalItems = inventory.length;
  const lowStockCount = inventory.filter((item) => {
    const qty = Number(item.quantity ?? 0);
    const min = Number(item.minimumStock ?? 0);
    return qty > 0 && qty <= min;
  }).length;
  const outOfStockCount = inventory.filter(
    (item) => Number(item.quantity ?? 0) === 0
  ).length;

  const handleCreateItem = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.warehouse) return;

    const selectedWh = warehouses.find(
      (w) => (w._id || w.id) === newItem.warehouse
    );

    await create({
      ...newItem,
      warehouseName: selectedWh?.name || "Warehouse",
    });

    setShowAddModal(false);
    setNewItem({
      name: "",
      sku: "",
      category: "General",
      warehouse: "",
      quantity: 100,
      minimumStock: 20,
    });
  };

  const handleAdjustStock = async () => {
    if (!adjustItem) return;
    const qty = Number(newStockQty);
    if (isNaN(qty) || qty < 0) return;

    await updateStock(adjustItem._id || adjustItem.id, qty);
    setAdjustItem(null);
    setNewStockQty("");
  };

  const handleQuickTransfer = (item) => {
    navigate(`/transfers/new`);
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#77736b]">
            Operations
          </p>

          <h1 className="mt-2 text-2xl font-semibold">Inventory</h1>

          <p className="mt-1 text-[11px] text-[#77736b]">
            Monitor and adjust stock levels across all warehouse facilities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate("/transfers/new")}
          >
            <ArrowRightLeft size={13} />
            Transfer Stock
          </Button>

          {canManage && (
            <Button
              onClick={() => {
                if (warehouses.length > 0) {
                  setNewItem((prev) => ({
                    ...prev,
                    warehouse: warehouses[0]._id || warehouses[0].id,
                  }));
                }
                setShowAddModal(true);
              }}
            >
              <Plus size={13} />
              Add Product
            </Button>
          )}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3.5 border border-[#ddd9d1] bg-[#fbfaf7] p-4">
          <div className="flex h-9 w-9 items-center justify-center border border-[#d8d4cc] bg-[#f1efe9]">
            <Boxes size={16} />
          </div>
          <div>
            <p className="text-[9px] font-semibold uppercase text-[#77736b]">
              Total Products
            </p>
            <p className="mt-0.5 text-xl font-semibold">{totalItems}</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 border border-[#ddd9d1] bg-[#fbfaf7] p-4">
          <div className="flex h-9 w-9 items-center justify-center border border-[#d8d4cc] bg-[#f1efe9]">
            <AlertTriangle size={16} className="text-[#a15c07]" />
          </div>
          <div>
            <p className="text-[9px] font-semibold uppercase text-[#77736b]">
              Low Stock Warnings
            </p>
            <p className="mt-0.5 text-xl font-semibold text-[#a15c07]">
              {lowStockCount}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 border border-[#ddd9d1] bg-[#fbfaf7] p-4">
          <div className="flex h-9 w-9 items-center justify-center border border-[#d8d4cc] bg-[#f1efe9]">
            <CheckCircle2 size={16} />
          </div>
          <div>
            <p className="text-[9px] font-semibold uppercase text-[#77736b]">
              Out of Stock
            </p>
            <p className="mt-0.5 text-xl font-semibold">{outOfStockCount}</p>
          </div>
        </div>
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
            placeholder="Search product name or SKU..."
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

      {/* Active Warehouse Transfers & Approvals Section */}
      {selectedWarehouse && (
        <div className="border border-[#ddd9d1] bg-[#fbfaf7] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#77736b]">
                Inbound & Outbound Transfers
              </p>
              <h2 className="mt-1 text-sm font-semibold">
                Transfers for {selectedWhName}
              </h2>
            </div>

            <Button
              variant="secondary"
              onClick={() => navigate("/transfers")}
            >
              All Transfers
            </Button>
          </div>

          {relatedTransfers.length === 0 ? (
            <p className="mt-4 border border-dashed border-[#d8d4cc] p-4 text-center text-[10px] text-[#77736b]">
              No active or pending transfers for this warehouse facility.
            </p>
          ) : (
            <div className="mt-4 divide-y divide-[#ebe8e1] border border-[#d8d4cc] bg-[#f1efe9]">
              {relatedTransfers.map((tr) => {
                const trId = tr._id || tr.id;
                const srcName =
                  tr.sourceWarehouse?.name || tr.sourceWarehouse || "Origin";
                const destName =
                  tr.destinationWarehouse?.name ||
                  tr.destinationWarehouse ||
                  "Destination";
                const isDestination =
                  destName.toLowerCase().includes(selectedWhName.toLowerCase()) ||
                  String(tr.destinationWarehouseId || tr.destinationWarehouse?._id || tr.destinationWarehouse?.id) === String(selectedWarehouse);

                return (
                  <div
                    key={trId}
                    className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-semibold text-black">
                          {tr.transferNumber || trId}
                        </span>
                        <StockBadge
                          quantity={tr.status === "COMPLETED" ? 100 : tr.status === "PENDING" ? 5 : 50}
                          minimumStock={10}
                        />
                        <span className="border border-[#d8d4cc] bg-[#fbfaf7] px-1.5 py-0.5 text-[8px] font-semibold uppercase">
                          {tr.status}
                        </span>
                      </div>

                      <p className="mt-1 text-[11px] text-[#77736b]">
                        <strong className="text-black">{srcName}</strong> →{" "}
                        <strong className="text-black">{destName}</strong>
                        {isDestination && (
                          <span className="ml-2 bg-[#d8d4cc] px-1 text-[8px] font-semibold text-black">
                            INCOMING TO THIS WAREHOUSE
                          </span>
                        )}
                      </p>

                      <p className="mt-1 text-[9px] text-[#77736b]">
                        {(tr.items || []).length} item(s):{" "}
                        {(tr.items || [])
                          .map((i) => `${i.productName || i.name || "Item"} (×${i.quantity})`)
                          .join(", ")}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {tr.status === "PENDING" && (
                        <>
                          <Button
                            size="sm"
                            onClick={async () => {
                              await approve(trId);
                              await refresh();
                            }}
                          >
                            <CheckCircle2 size={12} />
                            Approve
                          </Button>

                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={async () => {
                              await reject(trId, "Rejected by warehouse manager");
                              await refresh();
                            }}
                          >
                            <AlertTriangle size={12} />
                            Reject
                          </Button>
                        </>
                      )}

                      {tr.status === "APPROVED" && (
                        <Button
                          size="sm"
                          onClick={async () => {
                            await ship(trId);
                            await refresh();
                          }}
                        >
                          <ArrowRightLeft size={12} />
                          Dispatch / In Transit
                        </Button>
                      )}

                      {tr.status === "IN_TRANSIT" && (
                        <Button
                          size="sm"
                          onClick={async () => {
                            await complete(trId);
                            await refresh();
                          }}
                        >
                          <CheckCircle2 size={12} />
                          Receive & Complete
                        </Button>
                      )}

                      <button
                        onClick={() => navigate(`/transfers/${trId}`)}
                        className="text-[10px] font-medium underline underline-offset-2 text-[#77736b] hover:text-black ml-2"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div>
        <h2 className="mb-3 text-sm font-semibold">Inventory Stock Items</h2>

        {loading && <Loader text="Loading inventory..." />}

        {!loading && error && <ErrorMessage message={error} />}

        {!loading && !error && filteredInventory.length === 0 && (
          <EmptyState
            title="No inventory items found"
            description="Try adjusting your search or warehouse filters, or create a new inventory item."
            action={
              canManage ? (
                <Button
                  onClick={() => {
                    if (warehouses.length > 0) {
                      setNewItem((prev) => ({
                        ...prev,
                        warehouse: warehouses[0]._id || warehouses[0].id,
                      }));
                    }
                    setShowAddModal(true);
                  }}
                >
                  <Plus size={13} />
                  Add Product
                </Button>
              ) : null
            }
          />
        )}

        {!loading && !error && filteredInventory.length > 0 && (
          <InventoryTable
            inventory={filteredInventory}
            onView={(item) => setViewItem(item)}
            onAdjustStock={(item) => {
              setAdjustItem(item);
              setNewStockQty(String(item.quantity ?? 0));
            }}
            onTransfer={(item) => handleQuickTransfer(item)}
          />
        )}
      </div>

      {/* Modal: Add Product */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Inventory Product"
        size="md"
      >
        <form onSubmit={handleCreateItem} className="space-y-4">
          <div>
            <label className="form-label">Product Name</label>
            <input
              type="text"
              required
              value={newItem.name}
              onChange={(e) =>
                setNewItem({ ...newItem, name: e.target.value })
              }
              placeholder="e.g. Industrial Steel Bolt M8"
              className="form-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">SKU (Stock Unit)</label>
              <input
                type="text"
                value={newItem.sku}
                onChange={(e) =>
                  setNewItem({ ...newItem, sku: e.target.value })
                }
                placeholder="Auto-generated if empty"
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Category</label>
              <select
                value={newItem.category}
                onChange={(e) =>
                  setNewItem({ ...newItem, category: e.target.value })
                }
                className="form-input"
              >
                <option value="Electronics">Electronics</option>
                <option value="Hardware">Hardware</option>
                <option value="Packaging">Packaging</option>
                <option value="Raw Materials">Raw Materials</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Warehouse Facility</label>
            <select
              required
              value={newItem.warehouse}
              onChange={(e) =>
                setNewItem({ ...newItem, warehouse: e.target.value })
              }
              className="form-input"
            >
              <option value="">Select Warehouse</option>
              {warehouses.map((wh) => (
                <option key={wh._id || wh.id} value={wh._id || wh.id}>
                  {wh.name} ({wh.code})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Initial Quantity</label>
              <input
                type="number"
                min="0"
                required
                value={newItem.quantity}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    quantity: Number(e.target.value),
                  })
                }
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Minimum Stock Alert</label>
              <input
                type="number"
                min="0"
                required
                value={newItem.minimumStock}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    minimumStock: Number(e.target.value),
                  })
                }
                className="form-input"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Item</Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Adjust Stock */}
      <Modal
        isOpen={Boolean(adjustItem)}
        onClose={() => setAdjustItem(null)}
        title="Adjust Inventory Stock"
        size="sm"
      >
        {adjustItem && (
          <div className="space-y-4">
            <div className="border border-[#ddd9d1] bg-[#f1efe9] p-3 text-[11px]">
              <p className="font-semibold text-black">
                {adjustItem.product || adjustItem.productName}
              </p>
              <p className="mt-1 text-[#77736b]">SKU: {adjustItem.sku}</p>
              <p className="text-[#77736b]">
                Warehouse: {adjustItem.warehouse || adjustItem.warehouseName}
              </p>
              <p className="mt-2 font-semibold">
                Current Available: {adjustItem.quantity?.toLocaleString()} units
              </p>
            </div>

            <div>
              <label className="form-label">New Stock Quantity</label>
              <input
                type="number"
                min="0"
                value={newStockQty}
                onChange={(e) => setNewStockQty(e.target.value)}
                className="form-input"
                placeholder="Enter new stock level"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setAdjustItem(null)}
              >
                Cancel
              </Button>
              <Button onClick={handleAdjustStock}>Update Stock</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal: View Details */}
      <Modal
        isOpen={Boolean(viewItem)}
        onClose={() => setViewItem(null)}
        title="Product Details"
        size="sm"
      >
        {viewItem && (
          <div className="space-y-4">
            <div className="border border-[#ddd9d1] bg-[#fbfaf7] p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold">
                    {viewItem.product || viewItem.productName}
                  </h3>
                  <p className="mt-1 font-mono text-[9px] text-[#77736b]">
                    {viewItem.sku}
                  </p>
                </div>
                <StockBadge
                  quantity={viewItem.quantity}
                  minimumStock={viewItem.minimumStock}
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#ebe8e1] pt-3 text-[11px]">
                <div>
                  <p className="text-[#77736b]">Warehouse</p>
                  <p className="font-semibold">
                    {viewItem.warehouse || viewItem.warehouseName}
                  </p>
                </div>
                <div>
                  <p className="text-[#77736b]">Available Stock</p>
                  <p className="font-semibold">
                    {Number(viewItem.quantity || 0).toLocaleString()} units
                  </p>
                </div>
                <div>
                  <p className="text-[#77736b]">Minimum Threshold</p>
                  <p className="font-semibold">{viewItem.minimumStock} units</p>
                </div>
                <div>
                  <p className="text-[#77736b]">Category</p>
                  <p className="font-semibold">
                    {viewItem.category || "General"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={() => {
                  const target = viewItem;
                  setViewItem(null);
                  setAdjustItem(target);
                  setNewStockQty(String(target.quantity || 0));
                }}
              >
                Adjust Stock
              </Button>
              <Button
                onClick={() => {
                  setViewItem(null);
                  navigate("/transfers/new");
                }}
              >
                Create Transfer
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}