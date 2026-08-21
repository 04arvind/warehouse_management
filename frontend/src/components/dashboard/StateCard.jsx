import { MoreHorizontal } from "lucide-react";

export default function StatCard({
  label,
  value,
  change,
  description,
}) {
  return (
    <div className="border border-[#ddd9d1] bg-[#fbfaf7] p-5">

      <div className="flex items-start justify-between">

        <p className="text-[10px] font-semibold tracking-[0.08em] text-[#77736b]">
          {label}
        </p>

        <MoreHorizontal
          size={15}
          className="text-[#99958d]"
        />
      </div>

      <div className="mt-3 flex items-end gap-2">
        <p className="text-3xl font-semibold tracking-tight">
          {value}
        </p>

        {change && (
          <span className="mb-1 text-[9px] text-[#77736b]">
            {change}
          </span>
        )}
      </div>

      {description && (
        <p className="mt-1 text-[9px] text-[#99958d]">
          {description}
        </p>
      )}

      <div className="mt-5 h-px bg-[#ddd9d1]" />

    </div>
  );
}