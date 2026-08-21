import { ArrowRight } from "lucide-react";

export default function TransferSummary({
  source,
  destination,
  items = [],
  onSubmit,
  loading = false,
}) {
  const totalItems = items.length;

  const totalQuantity = items.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  return (
    <div className="border border-black bg-black p-5 text-white">

      <p className="text-[9px] font-bold uppercase tracking-[0.15em]">
        Transfer Summary
      </p>

      <div className="mt-6">

        <div className="flex items-center justify-between">

          <div>
            <p className="text-[9px] text-[#aaa]">
              SOURCE
            </p>

            <p className="mt-1 text-[11px] font-semibold">
              {source || "Not selected"}
            </p>
          </div>

          <ArrowRight size={16} />

          <div className="text-right">
            <p className="text-[9px] text-[#aaa]">
              DESTINATION
            </p>

            <p className="mt-1 text-[11px] font-semibold">
              {destination || "Not selected"}
            </p>
          </div>

        </div>

      </div>

      <div className="mt-6 border-t border-[#333] pt-5">

        <div className="flex justify-between">
          <span className="text-[10px] text-[#aaa]">
            Total Items
          </span>

          <span className="text-[11px] font-semibold">
            {totalItems}
          </span>
        </div>

        <div className="mt-3 flex justify-between">
          <span className="text-[10px] text-[#aaa]">
            Total Quantity
          </span>

          <span className="text-[11px] font-semibold">
            {totalQuantity}
          </span>
        </div>

      </div>

      {onSubmit && (
        <div className="mt-6">
          <button
            type="button"
            disabled={
              loading || items.length === 0
            }
            onClick={onSubmit}
            className="flex w-full items-center justify-center gap-2 bg-white py-3 text-[10px] font-bold uppercase text-black transition hover:bg-[#e8e8e8] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Create Transfer
          </button>
        </div>
      )}

    </div>
  );
}