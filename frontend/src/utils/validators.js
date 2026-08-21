export function isRequired(value) {
  return (
    value !== null &&
    value !== undefined &&
    String(value).trim() !== ""
  );
}

export function isValidEmail(email) {
  if (!email) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  );
}

export function isPositiveNumber(value) {
  return (
    Number.isFinite(Number(value)) &&
    Number(value) > 0
  );
}

export function isNonNegativeNumber(value) {
  return (
    Number.isFinite(Number(value)) &&
    Number(value) >= 0
  );
}

export function validateWarehouse(
  data
) {
  const errors = {};

  if (!isRequired(data.name)) {
    errors.name =
      "Warehouse name is required.";
  }

  if (!isRequired(data.location)) {
    errors.location =
      "Location is required.";
  }

  if (
    !isPositiveNumber(
      data.capacity
    )
  ) {
    errors.capacity =
      "Capacity must be greater than 0.";
  }

  return {
    isValid:
      Object.keys(errors).length === 0,

    errors,
  };
}

export function validateTransfer(
  data
) {
  const errors = {};

  if (!data.sourceWarehouse) {
    errors.sourceWarehouse =
      "Source warehouse is required.";
  }

  if (!data.destinationWarehouse) {
    errors.destinationWarehouse =
      "Destination warehouse is required.";
  }

  if (
    data.sourceWarehouse ===
    data.destinationWarehouse
  ) {
    errors.destinationWarehouse =
      "Source and destination must be different.";
  }

  if (
    !data.items ||
    data.items.length === 0
  ) {
    errors.items =
      "At least one item is required.";
  }

  return {
    isValid:
      Object.keys(errors).length === 0,

    errors,
  };
}