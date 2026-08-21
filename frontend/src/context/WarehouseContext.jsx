import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

import warehouseService from "../services/warehouseService";

const WarehouseContext = createContext(null);

const defaultWarehouses = [
  {
    _id: "wh-1",
    id: "wh-1",
    name: "Delhi Central",
    code: "DEL-001",
    location: "New Delhi",
    address: "Plot 12, Okhla Phase III, New Delhi",
    capacity: 50000,
    usedCapacity: 37000,
    utilization: 74,
    status: "ACTIVE",
  },
  {
    _id: "wh-2",
    id: "wh-2",
    name: "Noida Hub",
    code: "NOI-002",
    location: "Noida, UP",
    address: "Sector 63, Noida, Uttar Pradesh",
    capacity: 50000,
    usedCapacity: 26000,
    utilization: 52,
    status: "ACTIVE",
  },
  {
    _id: "wh-3",
    id: "wh-3",
    name: "Gurgaon Hub",
    code: "GUR-003",
    location: "Gurgaon, Haryana",
    address: "Udyog Vihar Phase IV, Gurgaon, Haryana",
    capacity: 50000,
    usedCapacity: 40500,
    utilization: 81,
    status: "ACTIVE",
  },
];

export function WarehouseProvider({ children }) {
  const [warehouses, setWarehouses] = useState(defaultWarehouses);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: defaultWarehouses.length,
    pages: 1,
  });

  const fetchWarehouses = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await warehouseService.getAll(params);
      const data = response?.data || response;

      const items = data?.warehouses || data?.items || data || [];
      if (Array.isArray(items) && items.length > 0) {
        setWarehouses(items);
      }

      if (data?.pagination) {
        setPagination(data.pagination);
      }

      return data;
    } catch (err) {
      // Keep local state on error
      return defaultWarehouses;
    } finally {
      setLoading(false);
    }
  }, []);

  const getWarehouse = useCallback(
    async (id) => {
      try {
        setLoading(true);
        setError(null);
        const response = await warehouseService.getById(id);
        return response?.data || response;
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to fetch warehouse.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createWarehouse = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);

      let created;
      try {
        const response = await warehouseService.create(data);
        created = response?.data || response;
      } catch (e) {
        // Fallback local creation
        const capacityNum = Number(data.capacity || 50000);
        created = {
          _id: `wh_${Date.now()}`,
          id: `wh_${Date.now()}`,
          name: data.name,
          code: data.code || `WH-${Math.floor(Math.random() * 900 + 100)}`,
          location: data.location,
          address: data.address || "",
          capacity: capacityNum,
          usedCapacity: 0,
          utilization: 0,
          status: data.status || "ACTIVE",
          createdAt: new Date().toISOString(),
        };
      }

      setWarehouses((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create warehouse.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateWarehouse = useCallback(async (id, data) => {
    try {
      setLoading(true);
      setError(null);

      let updated;
      try {
        const response = await warehouseService.update(id, data);
        updated = response?.data || response;
      } catch (e) {
        updated = { _id: id, id, ...data };
      }

      setWarehouses((prev) =>
        prev.map((warehouse) =>
          warehouse._id === id || warehouse.id === id ? { ...warehouse, ...updated } : warehouse
        )
      );

      return updated;
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update warehouse.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteWarehouse = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);

      try {
        await warehouseService.remove(id);
      } catch (e) {
        // Fallback local deletion
      }

      setWarehouses((prev) =>
        prev.filter((w) => w._id !== id && w.id !== id)
      );
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete warehouse.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <WarehouseContext.Provider
      value={{
        warehouses,
        loading,
        error,
        pagination,

        fetchWarehouses,
        getWarehouse,
        createWarehouse,
        updateWarehouse,
        deleteWarehouse,

        setWarehouses,
      }}
    >
      {children}
    </WarehouseContext.Provider>
  );
}

export function useWarehouses() {
  const context = useContext(WarehouseContext);
  if (!context) {
    throw new Error("useWarehouses must be used inside WarehouseProvider");
  }
  return context;
}