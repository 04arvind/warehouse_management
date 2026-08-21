export const ROLES = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  STAFF: "STAFF",
};

export const TRANSFER_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  IN_TRANSIT: "IN_TRANSIT",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

export const USER_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

export const STOCK_STATUS = {
  IN_STOCK: "IN_STOCK",
  LOW_STOCK: "LOW_STOCK",
  OUT_OF_STOCK: "OUT_OF_STOCK",
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: "Administrator",
  [ROLES.MANAGER]: "Manager",
  [ROLES.STAFF]: "Staff",
};

export const TRANSFER_STATUS_LABELS = {
  [TRANSFER_STATUS.PENDING]:
    "Pending",

  [TRANSFER_STATUS.APPROVED]:
    "Approved",

  [TRANSFER_STATUS.REJECTED]:
    "Rejected",

  [TRANSFER_STATUS.IN_TRANSIT]:
    "In Transit",

  [TRANSFER_STATUS.COMPLETED]:
    "Completed",

  [TRANSFER_STATUS.CANCELLED]:
    "Cancelled",
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

export const STORAGE_KEYS = {
  TOKEN: "accessToken",
  USER: "user",
};