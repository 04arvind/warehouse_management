import { ArrowUpRight } from "lucide-react";

export default function WarehouseOverview({
  warehouses = [],
}) {
  return (
    <div>

      <div className="mb-4 flex items-end justify-between">
        <div>
          <h3 className="text-sm font-semibold">
            Warehouse Overview
          </h3>

          <p className="mt-1 text-[10px] text-[#77736b]">
            Current capacity utilization.
          </p>
        </div>

        <button className="text-[10px] font-medium underline underline-offset-2">
          View All
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

        {warehouses.map((warehouse) => (
          <div
            key={warehouse.id}
            className="border border-[#ddd9d1] bg-[#fbfaf7] p-4"
          >

            <div className="flex items-start justify-between">

              <div>
                <p className="text-[12px] font-semibold">
                  {warehouse.name}
                </p>

                <p className="mt-1 text-[9px] text-[#77736b]">
                  {warehouse.location}
                </p>
              </div>

              <ArrowUpRight size={14} />
            </div>

            <div className="mt-5 flex items-end justify-between">
              <span className="text-[9px] text-[#77736b]">
                Capacity Utilization
              </span>

              <span className="text-xl font-semibold">
                {warehouse.utilization}%
              </span>
            </div>

            <div className="mt-2 h-1.5 bg-[#e4e1da]">
              <div
                className="h-full bg-black"
                style={{
                  width: `${warehouse.utilization}%`,
                }}
              />
            </div>

            <p className="mt-2 text-[9px] text-[#77736b]">
              {warehouse.usedCapacity?.toLocaleString()} /{" "}
              {warehouse.capacity?.toLocaleString()} units
            </p>

          </div>
        ))}

      </div>
    </div>
  );
}