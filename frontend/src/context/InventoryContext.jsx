import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

import inventoryService from "../services/inventoryService";

const InventoryContext = createContext(null);

const defaultInventory = [
  {
    _id: "inv-1",
    id: "inv-1",
    sku: "SKU-PL-101",
    product: "Heavy Duty Pallet Racks",
    productName: "Heavy Duty Pallet Racks",
    warehouse: "Delhi Central",
    warehouseName: "Delhi Central",
    warehouseId: "wh-1",
    quantity: 450,
    minimumStock: 100,
  },
  {
    _id: "inv-2",
    id: "inv-2",
    sku: "SKU-FK-202",
    product: "Forklift Batteries 48V",
    productName: "Forklift Batteries 48V",
    warehouse: "Gurgaon Hub",
    warehouseName: "Gurgaon Hub",
    warehouseId: "wh-3",
    quantity: 18,
    minimumStock: 25,
  },
  {
    _id: "inv-3",
    id: "inv-3",
    sku: "SKU-BX-303",
    product: "Cardboard Packaging Boxes L",
    productName: "Cardboard Packaging Boxes L",
    warehouse: "Noida Hub",
    warehouseName: "Noida Hub",
    warehouseId: "wh-2",
    quantity: 1200,
    minimumStock: 300,
  },
  {
    _id: "inv-4",
    id: "inv-4",
    sku: "SKU-SC-404",
    product: "Barcode Scanners Wireless",
    productName: "Barcode Scanners Wireless",
    warehouse: "Delhi Central",
    warehouseName: "Delhi Central",
    warehouseId: "wh-1",
    quantity: 0,
    minimumStock: 15,
  },
];

export function InventoryProvider({ children }) {
  const [inventory, setInventory] = useState(defaultInventory);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: defaultInventory.length,
    pages: 1,
  });

  const fetchInventory = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await inventoryService.getAll(params);
      const data = response?.data || response;

      const items = data?.inventory || data?.items || data || [];
      if (Array.isArray(items) && items.length > 0) {
        setInventory(items);
      }

      if (data?.pagination) {
        setPagination(data.pagination);
      }

      return data;
    } catch (err) {
      // Keep local state fallback
      return defaultInventory;
    } finally {
      setLoading(false);
    }
  }, []);

  const getWarehouseInventory = useCallback(
    async (warehouseId, params = {}) => {
      try {
        setLoading(true);
        setError(null);

        const response = await inventoryService.getByWarehouse(
          warehouseId,
          params
        );
        const data = response?.data || response;
        const items = data?.inventory || data?.items || data || [];
        if (Array.isArray(items) && items.length > 0) {
          setInventory(items);
        }
        return data;
      } catch (err) {
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateStock = useCallback(async (id, quantity) => {
    try {
      setLoading(true);
      setError(null);

      let updated;
      try {
        const response = await inventoryService.updateStock(id, quantity);
        updated = response?.data || response;
      } catch (e) {
        updated = { _id: id, id, quantity: Number(quantity) };
      }

      setInventory((prev) =>
        prev.map((item) =>
          item._id === id || item.id === id ? { ...item, ...updated, quantity: Number(quantity) } : item
        )
      );

      return updated;
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update stock.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const adjustStockForCompletedTransfer = useCallback((transfer) => {
    if (!transfer || !Array.isArray(transfer.items)) return;

    setInventory((prev) => {
      let updatedList = [...prev];

      transfer.items.forEach((transferItem) => {
        const qty = Number(transferItem.quantity || 0);

        // Deduct from source
        updatedList = updatedList.map((item) => {
          if (
            item._id === transferItem.productId ||
            item.id === transferItem.productId
          ) {
            return {
              ...item,
              quantity: Math.max(0, Number(item.quantity || 0) - qty),
            };
          }
          return item;
        });

        // Add to destination warehouse (if item exists or create new)
        const destWhName =
          transfer.destinationWarehouse?.name ||
          transfer.destinationWarehouse ||
          "Destination";
        const destWhId =
          transfer.destinationWarehouseId ||
          transfer.destinationWarehouse?._id ||
          transfer.destinationWarehouse?.id ||
          "dest_wh";

        const existingInDest = updatedList.find(
          (item) =>
            (item.sku === transferItem.sku || item.product === transferItem.productName) &&
            (item.warehouse === destWhName || item.warehouseId === destWhId)
        );

        if (existingInDest) {
          updatedList = updatedList.map((item) =>
            item._id === existingInDest._id
              ? { ...item, quantity: Number(item.quantity || 0) + qty }
              : item
          );
        } else {
          updatedList.push({
            _id: `inv_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
            id: `inv_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
            sku: transferItem.sku || `SKU-TR-${Math.floor(Math.random() * 900 + 100)}`,
            product: transferItem.productName || "Transferred Item",
            productName: transferItem.productName || "Transferred Item",
            warehouse: destWhName,
            warehouseName: destWhName,
            warehouseId: destWhId,
            quantity: qty,
            minimumStock: 10,
          });
        }
      });

      return updatedList;
    });
  }, []);

  const getLowStock = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await inventoryService.getLowStock(params);
      return response?.data || response;
    } catch (err) {
      return inventory.filter(
        (item) => Number(item.quantity ?? 0) <= Number(item.minimumStock ?? 0)
      );
    } finally {
      setLoading(false);
    }
  }, [inventory]);

  const getInventoryItem = useCallback(
    async (id) => {
      const existing = inventory.find(
        (item) => item._id === id || item.id === id
      );
      if (existing) return existing;

      try {
        const response = await inventoryService.getById(id);
        return response?.data || response;
      } catch (e) {
        return null;
      }
    },
    [inventory]
  );

  const searchInventory = useCallback(
    (query) => {
      const normalized = (query || "").trim().toLowerCase();

      if (!normalized) {
        return inventory;
      }

      return inventory.filter((item) => {
        const sku = item?.sku?.toLowerCase() || "";
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

  const getLowStockItems = useCallback(() => {
    return inventory.filter((item) => {
      const quantity = Number(item?.quantity ?? 0);
      const minimumStock = Number(item?.minimumStock ?? 0);
      return quantity === 0 || quantity <= minimumStock;
    });
  }, [inventory]);

  const createInventory = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);

      let created;
      try {
        const response = await inventoryService.create(data);
        created = response?.data || response?.inventory || response;
      } catch (e) {
        created = {
          _id: `inv_${Date.now()}`,
          id: `inv_${Date.now()}`,
          sku: data.sku || `SKU-${Math.floor(Math.random() * 9000 + 1000)}`,
          product: data.name || data.product || data.productName,
          productName: data.name || data.product || data.productName,
          category: data.category || "General",
          quantity: Number(data.quantity || 0),
          minimumStock: Number(data.minimumStock || 10),
          warehouse: data.warehouseName || "Main Warehouse",
          warehouseId: data.warehouse,
          status: Number(data.quantity) > 0 ? "IN_STOCK" : "OUT_OF_STOCK",
        };
      }

      setInventory((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add inventory.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <InventoryContext.Provider
      value={{
        inventory,
        loading,
        error,
        pagination,

        fetchInventory,
        getWarehouseInventory,
        getInventoryItem,
        searchInventory,
        createInventory,
        updateStock,
        adjustStockForCompletedTransfer,
        getLowStock,
        getLowStockItems,

        setInventory,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used inside InventoryProvider");
  }
  return context;
}