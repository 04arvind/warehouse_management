import { AlertCircle } from "lucide-react";

export default function ErrorMessage({
  message = "Something went wrong.",
}) {
  return (
    <div className="flex items-center gap-3 border border-[#d8d4cc] bg-[#f1efe9] px-4 py-3">
      <AlertCircle size={16} />

      <p className="text-[11px] text-[#333]">
        {message}
      </p>
    </div>
  );
}