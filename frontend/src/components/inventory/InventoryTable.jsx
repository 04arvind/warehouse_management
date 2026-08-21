import StockBadge from "./StockBadge";

export default function InventoryTable({
  inventory = [],
  onView,
  onAdjustStock,
  onTransfer,
}) {
  return (
    <div className="overflow-x-auto border border-[#ddd9d1] bg-[#fbfaf7]">
      <table className="w-full min-w-[900px] border-collapse">
        <thead>
          <tr className="border-b border-[#ddd9d1] bg-[#f1efe9]">
            <th className="table-head">SKU</th>
            <th className="table-head">PRODUCT</th>
            <th className="table-head">WAREHOUSE</th>
            <th className="table-head">AVAILABLE</th>
            <th className="table-head">MINIMUM</th>
            <th className="table-head">STATUS</th>
            <th className="table-head text-right">ACTIONS</th>
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
                <div>
                  <p className="font-semibold text-black">
                    {item.product || item.productName}
                  </p>
                  {item.category && (
                    <p className="text-[9px] text-[#77736b]">
                      {item.category}
                    </p>
                  )}
                </div>
              </td>

              <td className="table-cell">
                {item.warehouse || item.warehouseName}
              </td>

              <td className="table-cell font-semibold">
                {Number(item.quantity || 0).toLocaleString()}
              </td>

              <td className="table-cell text-[#77736b]">
                {item.minimumStock}
              </td>

              <td className="table-cell">
                <StockBadge
                  quantity={item.quantity}
                  minimumStock={item.minimumStock}
                />
              </td>

              <td className="table-cell text-right">
                <div className="flex items-center justify-end gap-3">
                  {onAdjustStock && (
                    <button
                      onClick={() => onAdjustStock(item)}
                      className="border border-[#d8d4cc] bg-[#f1efe9] px-2 py-1 text-[9px] font-semibold hover:border-black"
                    >
                      Adjust
                    </button>
                  )}

                  {onTransfer && (
                    <button
                      onClick={() => onTransfer(item)}
                      className="text-[10px] font-medium underline underline-offset-2 text-black hover:text-[#555]"
                    >
                      Transfer
                    </button>
                  )}

                  <button
                    onClick={() => onView?.(item)}
                    className="text-[10px] font-medium underline underline-offset-2 text-[#77736b] hover:text-black"
                  >
                    View
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