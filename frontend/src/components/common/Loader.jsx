import { Loader2 } from "lucide-react";

export default function Loader({
  size = 22,
  text = "Loading...",
}) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-3">
      <Loader2
        size={size}
        className="animate-spin text-black"
      />

      <p className="text-[11px] text-[#77736b]">
        {text}
      </p>
    </div>
  );
}