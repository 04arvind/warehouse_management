import {
  useCallback,
  useEffect,
} from "react";

import {
  useWarehouses as useWarehousesContext,
} from "../context";

export default function useWarehouses({
  autoFetch = true,
} = {}) {
  const {
    warehouses,
    loading,
    error,
    fetchWarehouses,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
    getWarehouse,
  } = useWarehousesContext();

  const refresh = useCallback(() => {
    return fetchWarehouses();
  }, [fetchWarehouses]);

  useEffect(() => {
    if (autoFetch) {
      refresh().catch(() => {});
    }
  }, [autoFetch, refresh]);

  return {
    warehouses,
    loading,
    error,

    refresh,

    create: createWarehouse,
    update: updateWarehouse,
    remove: deleteWarehouse,

    getById: getWarehouse,
  };
}