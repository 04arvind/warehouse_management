import { Loader2 } from "lucide-react";

export default function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  onClick,
  className = "",
}) {
  const variants = {
    primary:
      "bg-black text-white border-black hover:bg-[#262626]",
    secondary:
      "bg-[#fbfaf7] text-black border-[#d8d4cc] hover:bg-[#ebe8e1]",
    danger:
      "bg-black text-white border-black hover:bg-[#262626]",
    ghost:
      "bg-transparent text-[#333] border-transparent hover:bg-[#ebe8e1]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-[10px]",
    md: "px-4 py-2 text-[11px]",
    lg: "px-5 py-2.5 text-[12px]",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        border
        font-medium
        transition
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {loading && <Loader2 size={14} className="animate-spin" />}

      {children}
    </button>
  );
}