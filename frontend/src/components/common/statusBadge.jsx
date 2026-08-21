const statusStyles = {
  PENDING:
    "bg-[#f3eee0] text-[#5d4d25] border-[#ddd2b5]",

  APPROVED:
    "bg-[#ecebe7] text-[#30302d] border-[#d3d1ca]",

  REJECTED:
    "bg-[#eee9e7] text-[#5c3932] border-[#d9c8c3]",

  COMPLETED:
    "bg-[#e9eee8] text-[#354d35] border-[#cbd8ca]",

  SHIPPED:
    "bg-[#e9eee8] text-[#354d35] border-[#cbd8ca]",

  IN_TRANSIT:
    "bg-[#ecebe7] text-[#30302d] border-[#d3d1ca]",
};

export default function StatusBadge({
  status,
}) {
  const normalizedStatus = status?.toUpperCase();

  return (
    <span
      className={`
        inline-flex
        items-center
        border
        px-2
        py-1
        text-[9px]
        font-semibold
        uppercase
        tracking-wide
        ${
          statusStyles[normalizedStatus] ||
          "border-[#d8d4cc] bg-[#f1efe9] text-[#444]"
        }
      `}
    >
      {status?.replaceAll("_", " ") || "UNKNOWN"}
    </span>
  );
}