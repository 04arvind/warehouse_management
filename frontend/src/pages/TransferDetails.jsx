import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Check,
  X,
  Truck,
  PackageCheck,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import StatusBadge from "../components/common/statusBadge";
import TransferTimeline from "../components/transfer/TransferTimeline";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

import useTransfers from "../hooks/useTransfers";
import useAuth from "../hooks/useAuth";
import transferService from "../services/transferService";

export default function TransferDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    getById,
    approve,
    reject,
    ship,
    complete,
    loading: actionLoading,
  } = useTransfers({
    autoFetch: false,
  });

  const { hasRole } = useAuth();
  const contextTransfer = getById(id);

  const [transfer, setTransfer] = useState(contextTransfer || null);
  const [loading, setLoading] = useState(!contextTransfer);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadTransfer() {
      if (contextTransfer) {
        setTransfer(contextTransfer);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await transferService.getById(id);
        if (isMounted) {
          setTransfer(data?.data || data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Unable to load transfer details."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadTransfer();

    return () => {
      isMounted = false;
    };
  }, [id, contextTransfer]);

  const canManageTransfer = hasRole("ADMIN", "MANAGER");

  if (loading) {
    return <Loader text="Loading transfer details..." />;
  }

  if (error || !transfer) {
    return (
      <div className="space-y-4 border border-[#ddd9d1] bg-[#fbfaf7] p-10 text-center">
        {error && <ErrorMessage message={error} />}
        <h2 className="text-sm font-semibold">Transfer not found</h2>
        <button
          onClick={() => navigate("/transfers")}
          className="mt-3 text-[10px] font-semibold underline underline-offset-2"
        >
          Back to Transfers
        </button>
      </div>
    );
  }

  const transferId = transfer?._id || transfer?.id || id;

  const handleApprove = async () => {
    const updated = await approve(transferId);
    if (updated) setTransfer((prev) => ({ ...prev, ...updated, status: "APPROVED" }));
  };

  const handleReject = async () => {
    const updated = await reject(transferId, "Rejected by manager");
    if (updated) setTransfer((prev) => ({ ...prev, ...updated, status: "REJECTED" }));
  };

  const handleShip = async () => {
    const updated = await ship(transferId);
    if (updated) setTransfer((prev) => ({ ...prev, ...updated, status: "IN_TRANSIT" }));
  };

  const handleComplete = async () => {
    const updated = await complete(transferId);
    if (updated) setTransfer((prev) => ({ ...prev, ...updated, status: "COMPLETED" }));
  };

  const sourceName =
    transfer.sourceWarehouse?.name ||
    transfer.sourceWarehouse ||
    "Source Warehouse";

  const destinationName =
    transfer.destinationWarehouse?.name ||
    transfer.destinationWarehouse ||
    "Destination Warehouse";

  const isActionLoading = actionLoading || loading;

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate("/transfers")}
          className="flex items-center gap-2 text-[10px] font-semibold text-[#77736b] hover:text-black"
        >
          <ArrowLeft size={13} />
          Back to Transfers
        </button>

        <div className="mt-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-[9px] uppercase tracking-[0.15em] text-[#77736b]">
              Transfer Request
            </p>

            <h1 className="mt-2 text-2xl font-semibold">
              {transfer.transferNumber || transferId}
            </h1>

            <p className="mt-1 text-[10px] text-[#77736b]">
              Created{" "}
              {transfer.createdAt
                ? new Date(transfer.createdAt).toLocaleString()
                : "Recently"}
            </p>
          </div>

          <StatusBadge status={transfer.status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main */}
        <div className="space-y-5">
          {/* Route */}
          <div className="border border-[#ddd9d1] bg-[#fbfaf7] p-5">
            <h2 className="text-sm font-semibold">Transfer Route</h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <WarehouseBox label="SOURCE" name={sourceName} />
              <WarehouseBox label="DESTINATION" name={destinationName} />
            </div>
          </div>

          {/* Items */}
          <div className="border border-[#ddd9d1] bg-[#fbfaf7]">
            <div className="border-b border-[#ddd9d1] px-5 py-4">
              <h2 className="text-sm font-semibold">Transfer Items</h2>
            </div>

            <div className="divide-y divide-[#ebe8e1]">
              {(transfer.items || []).map((item, index) => (
                <div
                  key={item.productId || item._id || index}
                  className="flex items-center justify-between px-5 py-4"
                >
                  <div>
                    <p className="text-[11px] font-semibold">
                      {item.productName || item.product?.name || item.name || "Item"}
                    </p>

                    {item.sku && (
                      <p className="mt-1 text-[9px] text-[#77736b]">
                        SKU: {item.sku}
                      </p>
                    )}
                  </div>

                  <span className="text-[11px] font-semibold">
                    × {item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          {canManageTransfer && (
            <div className="border border-[#ddd9d1] bg-[#fbfaf7] p-5">
              <h2 className="text-sm font-semibold">Transfer Actions</h2>

              <div className="mt-5 flex flex-wrap gap-2">
                {transfer.status === "PENDING" && (
                  <>
                    <Button onClick={handleApprove} loading={isActionLoading}>
                      <Check size={13} />
                      Approve
                    </Button>

                    <Button
                      variant="secondary"
                      onClick={handleReject}
                      loading={isActionLoading}
                    >
                      <X size={13} />
                      Reject
                    </Button>
                  </>
                )}

                {transfer.status === "APPROVED" && (
                  <Button onClick={handleShip} loading={isActionLoading}>
                    <Truck size={13} />
                    Mark In Transit
                  </Button>
                )}

                {transfer.status === "IN_TRANSIT" && (
                  <Button onClick={handleComplete} loading={isActionLoading}>
                    <PackageCheck size={13} />
                    Complete Transfer
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="lg:sticky lg:top-24 lg:h-fit">
          <TransferTimeline status={transfer.status} />
        </div>
      </div>
    </div>
  );
}

function WarehouseBox({ label, name }) {
  return (
    <div className="border border-[#d8d4cc] bg-[#f1efe9] p-4">
      <p className="text-[8px] font-semibold tracking-[0.12em] text-[#77736b]">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold">{name}</p>
    </div>
  );
}