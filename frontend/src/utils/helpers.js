export function getInitials(
  name = ""
) {
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function classNames(
  ...classes
) {
  return classes
    .filter(Boolean)
    .join(" ");
}

export function sleep(
  milliseconds
) {
  return new Promise((resolve) =>
    setTimeout(
      resolve,
      milliseconds
    )
  );
}

export function capitalize(
  value = ""
) {
  if (!value) {
    return "";
  }

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1).toLowerCase()
  );
}

export function getErrorMessage(
  error
) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong."
  );
}

export function truncate(
  text = "",
  maxLength = 50
) {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(
    0,
    maxLength
  )}...`;
}