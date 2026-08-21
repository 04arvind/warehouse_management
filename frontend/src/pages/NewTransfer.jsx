import { useState } from "react";
import { useNavigate } from "react-router-dom";

import TransferForm from "../components/transfer/TransferForm";
import TransferSummary from "../components/transfer/TransferSummary";

import useWarehouses from "../hooks/useWarehouses";
import useTransfers from "../hooks/useTransfers";
import useInventory from "../hooks/useInventory";
import ErrorMessage from "../components/common/ErrorMessage";

export default function NewTransfer() {
  const navigate = useNavigate();

  const {
    warehouses,
    loading: warehousesLoading,
    error: warehousesError,
  } = useWarehouses();

  const {
    inventory,
    loading: inventoryLoading,
    error: inventoryError,
  } = useInventory();

  const {
    create,
    loading,
    error,
  } = useTransfers({
    autoFetch: false,
  });

  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState({
    items: [],
  });

  const source = warehouses.find(
    (w) => (w._id || w.id) === formData.sourceWarehouse
  );

  const destination = warehouses.find(
    (w) => (w._id || w.id) === formData.destinationWarehouse
  );

  const handleSubmit = async (data) => {
    setSubmitError("");

    const srcWh = warehouses.find((w) => (w._id || w.id) === data.sourceWarehouse);
    const destWh = warehouses.find((w) => (w._id || w.id) === data.destinationWarehouse);

    const payload = {
      ...data,
      sourceWarehouseName: srcWh?.name || "Source Warehouse",
      destinationWarehouseName: destWh?.name || "Destination Warehouse",
    };

    try {
      const transfer = await create(payload);
      if (transfer) {
        navigate(`/transfers/${transfer._id || transfer.id}`);
      }
    } catch (err) {
      setSubmitError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to create transfer. Please try again."
      );
    }
  };

  const products = inventory.map((item) => ({
    id: item._id || item.id,
    name: item.product || item.productName,
    sku: item.sku,
    available: Number(item.quantity || 0),
    warehouseId:
      item.warehouseId || item.warehouse?._id || item.warehouse?.id,
  }));

  return (
    <div className="space-y-7">
      <div>
        <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#77736b]">
          Operations / Transfers
        </p>

        <h1 className="mt-2 text-2xl font-semibold">New Transfer Request</h1>

        <p className="mt-1 text-[11px] text-[#77736b]">
          Create a request to move stock between warehouses.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        {(warehousesError || inventoryError || error || submitError) && (
          <ErrorMessage
            message={
              submitError || error || warehousesError || inventoryError
            }
          />
        )}

        <TransferForm
          warehouses={warehouses}
          products={products}
          onSubmit={(data) => {
            setFormData(data);
            handleSubmit(data);
          }}
          loading={loading || warehousesLoading || inventoryLoading}
        />

        <div className="xl:sticky xl:top-24 xl:h-fit">
          <TransferSummary
            source={source?.name}
            destination={destination?.name}
            items={formData.items || []}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}