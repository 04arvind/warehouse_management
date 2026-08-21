import { PackageOpen } from "lucide-react";

export default function EmptyState({
  title = "No data found",
  description = "There are no records to display.",
  action = null,
}) {
  return (
    <div className="flex min-h-[250px] flex-col items-center justify-center border border-dashed border-[#d8d4cc] bg-[#fbfaf7] px-6 text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center border border-[#d8d4cc] bg-[#f1efe9]">
        <PackageOpen size={18} />
      </div>

      <h3 className="text-sm font-semibold">
        {title}
      </h3>

      <p className="mt-1 max-w-sm text-[11px] text-[#77736b]">
        {description}
      </p>

      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
}