import { X } from "lucide-react";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}) {
  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`
          relative
          z-10
          w-full
          ${sizes[size]}
          border
          border-[#d8d4cc]
          bg-[#fbfaf7]
          shadow-xl
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#ddd9d1] px-5 py-4">
          <h2 className="text-sm font-semibold">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-[#77736b] transition hover:text-black"
          >
            <X size={17} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
}