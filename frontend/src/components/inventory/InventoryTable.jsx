import StockBadge from "./StockBadge";

export default function InventoryTable({
  inventory = [],
  onView,
}) {
  return (
    <div className="overflow-x-auto border border-[#ddd9d1] bg-[#fbfaf7]">

      <table className="w-full min-w-[900px] border-collapse">

        <thead>
          <tr className="border-b border-[#ddd9d1] bg-[#f1efe9]">

            <th className="table-head">
              SKU
            </th>

            <th className="table-head">
              PRODUCT
            </th>

            <th className="table-head">
              WAREHOUSE
            </th>

            <th className="table-head">
              AVAILABLE
            </th>

            <th className="table-head">
              MINIMUM
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

          {inventory.map((item) => (
            <tr
              key={item._id || item.id}
              className="border-b border-[#ebe8e1] last:border-0 hover:bg-[#f6f4ef]"
            >

              <td className="table-cell font-semibold">
                {item.sku}
              </td>

              <td className="table-cell">
                {item.product || item.productName}
              </td>

              <td className="table-cell">
                {item.warehouse || item.warehouseName}
              </td>

              <td className="table-cell font-semibold">
                {item.quantity?.toLocaleString()}
              </td>

              <td className="table-cell">
                {item.minimumStock}
              </td>

              <td className="table-cell">
                <StockBadge
                  quantity={item.quantity}
                  minimumStock={item.minimumStock}
                />
              </td>

              <td className="table-cell text-right">
                <button
                  onClick={() => onView?.(item)}
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