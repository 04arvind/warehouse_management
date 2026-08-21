import StatusBadge from "../common/statusBadge";

export default function WarehouseTable({
  warehouses = [],
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-x-auto border border-[#ddd9d1] bg-[#fbfaf7]">

      <table className="w-full min-w-[800px] border-collapse">

        <thead>
          <tr className="border-b border-[#ddd9d1] bg-[#f1efe9]">

            <th className="table-head">
              CODE
            </th>

            <th className="table-head">
              WAREHOUSE
            </th>

            <th className="table-head">
              LOCATION
            </th>

            <th className="table-head">
              CAPACITY
            </th>

            <th className="table-head">
              UTILIZATION
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
          {warehouses.map((warehouse) => (
            <tr
              key={warehouse._id || warehouse.id}
              className="border-b border-[#ebe8e1] last:border-0 hover:bg-[#f6f4ef]"
            >

              <td className="table-cell font-semibold">
                {warehouse.code}
              </td>

              <td className="table-cell">
                {warehouse.name}
              </td>

              <td className="table-cell">
                {warehouse.location}
              </td>

              <td className="table-cell">
                {warehouse.capacity?.toLocaleString()}
              </td>

              <td className="table-cell">
                {warehouse.utilization || 0}%
              </td>

              <td className="table-cell">
                <StatusBadge
                  status={warehouse.status}
                />
              </td>

              <td className="table-cell">
                <div className="flex justify-end gap-3">

                  <button
                    onClick={() => onEdit?.(warehouse)}
                    className="text-[10px] font-medium underline underline-offset-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete?.(warehouse)}
                    className="text-[10px] font-medium underline underline-offset-2"
                  >
                    Delete
                  </button>

                </div>
              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}