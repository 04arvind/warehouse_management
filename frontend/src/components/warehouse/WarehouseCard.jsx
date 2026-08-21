import {
  MapPin,
  ArrowUpRight,
} from "lucide-react";

export default function WarehouseCard({
  warehouse,
  onViewInventory,
}) {
  const utilization = warehouse.utilization || 0;

  return (
    <div className="border border-[#ddd9d1] bg-[#fbfaf7] p-5 transition hover:border-black">

      <div className="flex items-start justify-between">

        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">
              {warehouse.name}
            </h3>

            <span className="border border-[#d8d4cc] bg-[#f1efe9] px-1.5 py-0.5 text-[8px] font-semibold uppercase">
              {warehouse.status || "ACTIVE"}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#77736b]">
            <MapPin size={11} />

            {warehouse.location}
          </div>
        </div>

        <ArrowUpRight size={15} />
      </div>

      <div className="mt-7">

        <div className="flex items-end justify-between">
          <span className="text-[9px] text-[#77736b]">
            Capacity Utilization
          </span>

          <span className="text-2xl font-semibold">
            {utilization}%
          </span>
        </div>

        <div className="mt-2 h-1.5 bg-[#e5e2db]">
          <div
            className="h-full bg-black"
            style={{
              width: `${utilization}%`,
            }}
          />
        </div>

        <div className="mt-2 flex justify-between text-[9px] text-[#77736b]">
          <span>
            {warehouse.usedCapacity?.toLocaleString() || 0} units
          </span>

          <span>
            {warehouse.capacity?.toLocaleString() || 0} units
          </span>
        </div>

      </div>

      <button
        onClick={() =>
          onViewInventory?.(warehouse)
        }
        className="mt-6 flex w-full items-center justify-center border border-[#d8d4cc] py-2 text-[9px] font-semibold uppercase tracking-wide transition hover:bg-[#ebe8e1]"
      >
        View Inventory
      </button>

    </div>
  );
}