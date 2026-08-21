import {
  useCallback,
  useEffect,
} from "react";

import {
  useInventory as useInventoryContext,
} from "../context";

export default function useInventory({
  autoFetch = true,
} = {}) {
  const {
    inventory,
    loading,
    error,
    fetchInventory,
    getWarehouseInventory,
    updateStock,
    getLowStock,
  } = useInventoryContext();

  const refresh = useCallback(
    (filters = {}) => {
      return fetchInventory(filters);
    },
    [fetchInventory]
  );

  useEffect(() => {
    if (autoFetch) {
      refresh().catch(() => {});
    }
  }, [autoFetch, refresh]);

  const search = useCallback(
    (query = "") => {
      const normalized =
        query.trim().toLowerCase();

      if (!normalized) {
        return inventory;
      }

      return inventory.filter((item) => {
        const sku =
          item?.sku?.toLowerCase() || "";

        const product =
          item?.product?.toLowerCase() ||
          item?.productName?.toLowerCase() ||
          "";

        const warehouse =
          item?.warehouse?.toLowerCase() ||
          item?.warehouseName?.toLowerCase() ||
          "";

        return (
          sku.includes(normalized) ||
          product.includes(normalized) ||
          warehouse.includes(normalized)
        );
      });
    },
    [inventory]
  );

  const lowStockItems = useCallback(() => {
    return inventory.filter((item) => {
      const quantity = Number(
        item?.quantity ?? 0
      );

      const minimumStock = Number(
        item?.minimumStock ?? 0
      );

      return (
        quantity === 0 ||
        quantity <= minimumStock
      );
    });
  }, [inventory]);

  return {
    inventory,
    loading,
    error,

    refresh,

    getWarehouseInventory,

    updateStock,

    search,

    getLowStock,

    lowStockItems: lowStockItems(),
  };
}