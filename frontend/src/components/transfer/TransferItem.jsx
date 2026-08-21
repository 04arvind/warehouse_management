import {
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

export default function TransferItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}) {
  return (
    <div className="border-b border-[#ebe8e1] py-4 last:border-0">

      <div className="flex items-start justify-between gap-4">

        <div>
          <p className="text-[12px] font-semibold">
            {item.productName}
          </p>

          <p className="mt-1 text-[9px] text-[#77736b]">
            SKU: {item.sku}
          </p>

          <p className="mt-1 text-[9px] text-[#77736b]">
            Available:{" "}
            <span className="font-semibold text-black">
              {item.available}
            </span>
          </p>
        </div>

        <button
          onClick={() => onRemove?.(item)}
          className="text-[#77736b] hover:text-black"
        >
          <Trash2 size={14} />
        </button>

      </div>

      <div className="mt-4 flex items-center justify-between">

        <span className="text-[9px] uppercase tracking-wide text-[#77736b]">
          Quantity
        </span>

        <div className="flex items-center border border-[#d8d4cc]">

          <button
            onClick={() => onDecrease?.(item)}
            disabled={item.quantity <= 1}
            className="flex h-7 w-7 items-center justify-center border-r border-[#d8d4cc] disabled:opacity-30"
          >
            <Minus size={12} />
          </button>

          <span className="flex h-7 w-10 items-center justify-center text-[11px] font-semibold">
            {item.quantity}
          </span>

          <button
            onClick={() => onIncrease?.(item)}
            disabled={item.quantity >= item.available}
            className="flex h-7 w-7 items-center justify-center border-l border-[#d8d4cc] disabled:opacity-30"
          >
            <Plus size={12} />
          </button>

        </div>

      </div>

    </div>
  );
}