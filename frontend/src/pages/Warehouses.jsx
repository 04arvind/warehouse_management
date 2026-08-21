import {
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import {
  Plus,
} from "lucide-react";

import WarehouseCard from "../components/warehouse/WarehouseCard";
import WarehouseTable from "../components/warehouse/WarehouseTable";
import WarehouseForm from "../components/warehouse/WarehouseForm";

import Modal from "../components/common/Modal";
import Button from "../components/common/Button";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import ErrorMessage from "../components/common/ErrorMessage";

import useWarehouses from "../hooks/useWarehouses";
import useAuth from "../hooks/useAuth";

export default function Warehouses() {
  const navigate = useNavigate();
  const {
    warehouses,
    loading,
    error,
    create,
    update,
    remove,
  } = useWarehouses();

  const {
    isAdmin,
    hasRole,
  } = useAuth();

  const canManageWarehouses =
    hasRole("ADMIN", "MANAGER");

  const [showForm, setShowForm] =
    useState(false);

  const [editingWarehouse, setEditingWarehouse] =
    useState(null);

  const [deleteWarehouse, setDeleteWarehouse] =
    useState(null);

  const openCreate = () => {
    setEditingWarehouse(null);
    setShowForm(true);
  };

  const openEdit = (warehouse) => {
    setEditingWarehouse(warehouse);
    setShowForm(true);
  };

  const handleSubmit = async (data) => {
    if (editingWarehouse) {
      await update(
        editingWarehouse._id ||
          editingWarehouse.id,
        data
      );
    } else {
      await create(data);
    }

    setShowForm(false);
    setEditingWarehouse(null);
  };

  const handleDelete = async () => {
    if (!deleteWarehouse) return;

    await remove(
      deleteWarehouse._id ||
        deleteWarehouse.id
    );

    setDeleteWarehouse(null);
  };

  return (
    <div className="space-y-7">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#77736b]">
            Operations
          </p>

          <h1 className="mt-2 text-2xl font-semibold">
            Warehouses
          </h1>

          <p className="mt-1 text-[11px] text-[#77736b]">
            Manage warehouse locations and capacity.
          </p>
        </div>

        <Button onClick={openCreate}>
          <Plus size={13} />
          Create Warehouse
        </Button>

      </div>

      {loading && (
        <Loader text="Loading warehouses..." />
      )}

      {!loading && error && (
        <ErrorMessage message={error} />
      )}

      {!loading && !error && warehouses.length === 0 && (
        <EmptyState
          title="No warehouses found"
          description="Create your first warehouse to start managing inventory and transfers."
          action={
            <Button onClick={openCreate}>
              <Plus size={13} />
              Create Warehouse
            </Button>
          }
        />
      )}

      {!loading && !error && warehouses.length > 0 && (
        <>
          {/* Cards */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {warehouses.map((warehouse) => (
              <WarehouseCard
                key={warehouse._id || warehouse.id}
                warehouse={warehouse}
                onViewInventory={(wh) =>
                  navigate(`/inventory?warehouse=${wh._id || wh.id}`)
                }
              />
            ))}
          </div>

          {/* Table */}
          <div>

            <div className="mb-4">
              <h2 className="text-sm font-semibold">
                Warehouse Directory
              </h2>

              <p className="mt-1 text-[10px] text-[#77736b]">
                Complete list of warehouse locations.
              </p>
            </div>

            <WarehouseTable
              warehouses={warehouses}
              onEdit={openEdit}
              onDelete={setDeleteWarehouse}
            />

          </div>
        </>
      )}

      {/* Create / Edit */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingWarehouse(null);
        }}
        title={
          editingWarehouse
            ? "Edit Warehouse"
            : "Create Warehouse"
        }
        size="lg"
      >

        <WarehouseForm
          initialData={editingWarehouse}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingWarehouse(null);
          }}
          loading={loading}
        />

      </Modal>

      {/* Delete */}
      <ConfirmDialog
        isOpen={!!deleteWarehouse}
        onClose={() =>
          setDeleteWarehouse(null)
        }
        onConfirm={handleDelete}
        title="Delete Warehouse"
        message={`Are you sure you want to delete ${
          deleteWarehouse?.name || "this warehouse"
        }? This action cannot be undone.`}
        confirmText="Delete"
        loading={loading}
      />

    </div>
  );
}