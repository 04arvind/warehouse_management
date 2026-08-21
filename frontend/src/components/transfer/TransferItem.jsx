import {
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

export default function TransferItem({
  item,
  onIncrease,
  onDecrease,
  onQuantityChange,
  onRemove,
}) {
  const maxAvailable = Math.max(1, Number(item.available || 9999));

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
            Available in Origin:{" "}
            <span className="font-semibold text-black">
              {item.available} units
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => onRemove?.(item)}
          className="p-1 text-[#77736b] hover:text-black"
          title="Remove item"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-[9px] uppercase tracking-wide text-[#77736b]">
          Transfer Units
        </span>

        <div className="flex items-center border border-[#d8d4cc] bg-[#fbfaf7]">
          <button
            type="button"
            onClick={() => onDecrease?.(item)}
            disabled={item.quantity <= 1}
            className="flex h-7 w-7 items-center justify-center border-r border-[#d8d4cc] hover:bg-[#ebe8e1] disabled:opacity-30"
          >
            <Minus size={12} />
          </button>

          <input
            type="number"
            min="1"
            max={maxAvailable}
            value={item.quantity}
            onChange={(e) => {
              const val = Math.max(1, Math.min(maxAvailable, Number(e.target.value) || 1));
              onQuantityChange?.(item, val);
            }}
            className="h-7 w-14 text-center text-[11px] font-semibold outline-none bg-transparent"
          />

          <button
            type="button"
            onClick={() => onIncrease?.(item)}
            disabled={item.quantity >= maxAvailable}
            className="flex h-7 w-7 items-center justify-center border-l border-[#d8d4cc] hover:bg-[#ebe8e1] disabled:opacity-30"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}