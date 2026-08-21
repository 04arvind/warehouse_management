import {
  useCallback,
  useEffect,
} from "react";

import {
  useTransfer,
} from "../context";

export default function useTransfers({
  autoFetch = true,
} = {}) {
  const {
    transfers,
    loading,
    error,

    fetchTransfers,
    getTransferById,

    createTransfer,

    approveTransfer,
    rejectTransfer,
    shipTransfer,
    completeTransfer,

    getTransferStats,
  } = useTransfer();

  const refresh = useCallback(
    (filters = {}) => {
      return fetchTransfers(filters);
    },
    [fetchTransfers]
  );

  useEffect(() => {
    if (autoFetch) {
      refresh().catch(() => {});
    }
  }, [autoFetch, refresh]);

  return {
    transfers,

    loading,
    error,

    refresh,

    getById: getTransferById,

    create: createTransfer,

    approve: approveTransfer,
    reject: rejectTransfer,
    ship: shipTransfer,
    complete: completeTransfer,

    stats: getTransferStats(),
  };
}