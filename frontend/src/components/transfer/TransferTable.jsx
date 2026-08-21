import StatusBadge from "../common/statusBadge";

export default function TransferTable({ transfers = [], onView }) {
  const getWarehouseName = (val) => {
    if (!val) return "-";
    if (typeof val === "object") return val.name || val.location || val._id || "-";
    return val;
  };

  const getUserName = (val) => {
    if (!val) return "-";
    if (typeof val === "object") return val.name || val.email || "-";
    return val;
  };

  return (
    <div className="overflow-x-auto border border-[#ddd9d1] bg-[#fbfaf7]">
      <table className="w-full min-w-[1000px] border-collapse">
        <thead>
          <tr className="border-b border-[#ddd9d1] bg-[#f1efe9]">
            <th className="table-head">TRANSFER ID</th>
            <th className="table-head">SOURCE</th>
            <th className="table-head">DESTINATION</th>
            <th className="table-head">ITEMS</th>
            <th className="table-head">REQUESTED BY</th>
            <th className="table-head">DATE</th>
            <th className="table-head">STATUS</th>
            <th className="table-head text-right">ACTION</th>
          </tr>
        </thead>

        <tbody>
          {transfers.map((transfer) => (
            <tr
              key={transfer._id || transfer.id}
              className="border-b border-[#ebe8e1] last:border-0 hover:bg-[#f6f4ef]"
            >
              <td className="table-cell font-semibold">
                {transfer.transferNumber || transfer._id || transfer.id}
              </td>

              <td className="table-cell">
                {getWarehouseName(transfer.sourceWarehouse)}
              </td>

              <td className="table-cell">
                {getWarehouseName(transfer.destinationWarehouse)}
              </td>

              <td className="table-cell">{transfer.items?.length || 0}</td>

              <td className="table-cell">
                {getUserName(transfer.requestedBy)}
              </td>

              <td className="table-cell">
                {transfer.createdAt
                  ? new Date(transfer.createdAt).toLocaleDateString()
                  : transfer.date || "-"}
              </td>

              <td className="table-cell">
                <StatusBadge status={transfer.status} />
              </td>

              <td className="table-cell text-right">
                <button
                  onClick={() => onView?.(transfer)}
                  className="text-[10px] font-medium underline underline-offset-2"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}