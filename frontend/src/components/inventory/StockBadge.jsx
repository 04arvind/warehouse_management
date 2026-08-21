export default function StockBadge({
  quantity,
  minimumStock,
}) {
  let status = "Healthy";

  if (quantity === 0) {
    status = "Out of Stock";
  } else if (quantity <= minimumStock) {
    status = "Low Stock";
  }

  const styles = {
    Healthy:
      "bg-[#e9eee8] text-[#354d35] border-[#cbd8ca]",

    "Low Stock":
      "bg-[#f3eee0] text-[#5d4d25] border-[#ddd2b5]",

    "Out of Stock":
      "bg-[#eee9e7] text-[#5c3932] border-[#d9c8c3]",
  };

  return (
    <span
      className={`
        inline-flex
        border
        px-2
        py-1
        text-[9px]
        font-semibold
        ${styles[status]}
      `}
    >
      {status}
    </span>
  );
}