import {
  Plus,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import TransferTable from "../components/transfer/TransferTable";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import ErrorMessage from "../components/common/ErrorMessage";

import useTransfers from "../hooks/useTransfers";
import useAuth from "../hooks/useAuth";

export default function Transfers() {
  const navigate = useNavigate();

  const {
    transfers,
    loading,
    error,
  } = useTransfers();

  const {
    hasRole,
  } = useAuth();

  const canCreateTransfer = hasRole(
    "ADMIN",
    "MANAGER",
    "STAFF"
  );

  return (
    <div className="space-y-7">

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#77736b]">
            Operations
          </p>

          <h1 className="mt-2 text-2xl font-semibold">
            Transfers
          </h1>

          <p className="mt-1 text-[11px] text-[#77736b]">
            View and manage stock transfer requests.
          </p>
        </div>

        {canCreateTransfer && (
          <Button
            onClick={() =>
              navigate("/transfers/new")
            }
          >
            <Plus size={13} />
            New Transfer
          </Button>
        )}

      </div>

      <div className="border border-[#ddd9d1] bg-[#fbfaf7] p-4">

        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">

          <FilterStat
            label="ALL"
            value={transfers.length}
          />

          <FilterStat
            label="PENDING"
            value={
              transfers.filter(
                (t) =>
                  t.status === "PENDING"
              ).length
            }
          />

          <FilterStat
            label="APPROVED"
            value={
              transfers.filter(
                (t) =>
                  t.status === "APPROVED"
              ).length
            }
          />

          <FilterStat
            label="IN TRANSIT"
            value={
              transfers.filter(
                (t) =>
                  t.status === "IN_TRANSIT"
              ).length
            }
          />

          <FilterStat
            label="COMPLETED"
            value={
              transfers.filter(
                (t) =>
                  t.status === "COMPLETED"
              ).length
            }
          />

        </div>

      </div>

      {loading && (
        <Loader text="Loading transfers..." />
      )}

      {!loading && error && (
        <ErrorMessage message={error} />
      )}

      {!loading && !error && transfers.length === 0 && (
        <EmptyState
          title="No transfers found"
          description="Create a new transfer request to start moving stock between warehouses."
        />
      )}

      {!loading && !error && transfers.length > 0 && (
        <TransferTable
          transfers={transfers}
          onView={(transfer) =>
            navigate(
              `/transfers/${transfer._id || transfer.id}`
            )
          }
        />
      )}

    </div>
  );
}

function FilterStat({
  label,
  value,
}) {
  return (
    <div className="border-r border-[#ddd9d1] px-3 last:border-0">

      <p className="text-[8px] font-semibold tracking-wide text-[#77736b]">
        {label}
      </p>

      <p className="mt-1 text-lg font-semibold">
        {value}
      </p>

    </div>
  );
}