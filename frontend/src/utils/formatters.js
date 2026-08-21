export function formatNumber(
  value,
  options = {}
) {
  if (
    value === null ||
    value === undefined
  ) {
    return "0";
  }

  return new Intl.NumberFormat(
    "en-IN",
    options
  ).format(value);
}

export function formatDate(
  date,
  options = {}
) {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      ...options,
    }
  ).format(new Date(date));
}

export function formatDateTime(date) {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(new Date(date));
}

export function formatCurrency(
  amount
) {
  if (
    amount === null ||
    amount === undefined
  ) {
    return "₹0";
  }

  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }
  ).format(amount);
}

export function formatStatus(status) {
  if (!status) {
    return "-";
  }

  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}