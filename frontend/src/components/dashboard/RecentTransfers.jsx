import StatusBadge from "../common/statusBadge";

export default function RecentTransfers({
  transfers = [],
}) {
  return (
    <div className="border border-[#ddd9d1] bg-[#fbfaf7]">

      <div className="border-b border-[#ddd9d1] px-5 py-4">
        <h3 className="text-sm font-semibold">
          Transfer History
        </h3>

        <p className="mt-1 text-[10px] text-[#77736b]">
          Recent stock movements across warehouses.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse">

          <thead>
            <tr className="border-b border-[#ddd9d1] bg-[#f1efe9]">

              <th className="table-head">
                TRANSFER ID
              </th>

              <th className="table-head">
                SOURCE
              </th>

              <th className="table-head">
                DESTINATION
              </th>

              <th className="table-head">
                ITEMS
              </th>

              <th className="table-head">
                STATUS
              </th>

              <th className="table-head text-right">
                ACTION
              </th>

            </tr>
          </thead>

          <tbody>
            {transfers.map((transfer) => (
              <tr
                key={transfer.id}
                className="border-b border-[#ebe8e1] last:border-0 hover:bg-[#f6f4ef]"
              >

                <td className="table-cell font-semibold">
                  {transfer.id}
                </td>

                <td className="table-cell">
                  {transfer.source}
                </td>

                <td className="table-cell">
                  {transfer.destination}
                </td>

                <td className="table-cell">
                  {transfer.items}
                </td>

                <td className="table-cell">
                  <StatusBadge
                    status={transfer.status}
                  />
                </td>

                <td className="table-cell text-right">
                  <button className="text-[10px] font-medium underline underline-offset-2">
                    View
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}