import {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";

import transferService from "../services/transferService";
import { useInventory } from "./InventoryContext";

const TransferContext = createContext(null);

const defaultTransfers = [
  {
    _id: "TR-1024",
    id: "TR-1024",
    transferNumber: "TR-1024",
    sourceWarehouse: "Delhi Central",
    destinationWarehouse: "Noida Hub",
    sourceWarehouseId: "wh-1",
    destinationWarehouseId: "wh-2",
    requestedBy: "Rahul Sharma",
    createdAt: new Date().toISOString(),
    status: "COMPLETED",
    items: [
      {
        productId: "inv-1",
        productName: "Heavy Duty Pallet Racks",
        sku: "SKU-PL-101",
        quantity: 4,
      },
    ],
  },
  {
    _id: "TR-1023",
    id: "TR-1023",
    transferNumber: "TR-1023",
    sourceWarehouse: "Gurgaon Hub",
    destinationWarehouse: "Delhi Central",
    sourceWarehouseId: "wh-3",
    destinationWarehouseId: "wh-1",
    requestedBy: "Amit Kumar",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    status: "IN_TRANSIT",
    items: [
      {
        productId: "inv-2",
        productName: "Forklift Batteries 48V",
        sku: "SKU-FK-202",
        quantity: 2,
      },
    ],
  },
  {
    _id: "TR-1022",
    id: "TR-1022",
    transferNumber: "TR-1022",
    sourceWarehouse: "Noida Hub",
    destinationWarehouse: "Gurgaon Hub",
    sourceWarehouseId: "wh-2",
    destinationWarehouseId: "wh-3",
    requestedBy: "Rahul Sharma",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    status: "PENDING",
    items: [
      {
        productId: "inv-3",
        productName: "Cardboard Packaging Boxes L",
        sku: "SKU-BX-303",
        quantity: 6,
      },
    ],
  },
];

export function TransferProvider({ children }) {
  const [transfers, setTransfers] = useState(defaultTransfers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { adjustStockForCompletedTransfer } = useInventory();

  /*
   * GET /api/transfers
   */
  const fetchTransfers = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await transferService.getAll(filters);
      const data = response?.data || response;

      const items = data?.transfers || data?.items || data || [];
      if (Array.isArray(items) && items.length > 0) {
        setTransfers(items);
      }

      return data;
    } catch (err) {
      // Keep local transfers fallback
      return transfers;
    } finally {
      setLoading(false);
    }
  };

  /*
   * GET /api/transfers/:id
   */
  const getTransferById = (id) => {
    return transfers.find(
      (transfer) => transfer.id === id || transfer._id === id
    );
  };

  /*
   * POST /api/transfers
   */
  const createTransfer = async (transferData) => {
    try {
      setLoading(true);
      setError(null);

      let newTransfer;
      try {
        const response = await transferService.create(transferData);
        newTransfer = response?.data || response;
      } catch (e) {
        // Fallback local transfer creation
        const num = 1025 + transfers.length;
        newTransfer = {
          _id: `TR-${num}`,
          id: `TR-${num}`,
          transferNumber: `TR-${num}`,
          sourceWarehouse: transferData.sourceWarehouseName || transferData.sourceWarehouse || "Source",
          destinationWarehouse: transferData.destinationWarehouseName || transferData.destinationWarehouse || "Destination",
          sourceWarehouseId: transferData.sourceWarehouse,
          destinationWarehouseId: transferData.destinationWarehouse,
          requestedBy: transferData.requestedBy || "Current User",
          createdAt: new Date().toISOString(),
          status: "PENDING",
          priority: transferData.priority || "STANDARD",
          notes: transferData.notes || "",
          items: transferData.items || [],
        };
      }

      setTransfers((prev) => [newTransfer, ...prev]);
      return newTransfer;
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create transfer.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /*
   * PATCH /api/transfers/:id/status
   */
  const updateTransferStatus = async (id, updater, fallbackStatus) => {
    try {
      setLoading(true);
      setError(null);

      let updatedTransfer;
      try {
        const response = await updater(id);
        updatedTransfer = response?.data || response;
      } catch (e) {
        const existing = transfers.find(
          (t) => t._id === id || t.id === id
        );
        updatedTransfer = {
          ...existing,
          status: fallbackStatus,
          updatedAt: new Date().toISOString(),
        };
      }

      const targetId = updatedTransfer?._id || updatedTransfer?.id || id;

      setTransfers((prev) =>
        prev.map((t) =>
          (t._id || t.id) === targetId ? { ...t, ...updatedTransfer, status: fallbackStatus } : t
        )
      );

      // Feature #4: If status changed to COMPLETED, adjust inventory stock levels
      if (fallbackStatus === "COMPLETED") {
        const targetTransfer = updatedTransfer || getTransferById(id);
        if (targetTransfer) {
          adjustStockForCompletedTransfer(targetTransfer);
        }
      }

      return updatedTransfer;
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update transfer status.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const approveTransfer = async (id) => {
    return updateTransferStatus(id, transferService.approve, "APPROVED");
  };

  const rejectTransfer = async (id, reason = "") => {
    return updateTransferStatus(id, (tid) => transferService.reject(tid, reason), "REJECTED");
  };

  const shipTransfer = async (id) => {
    return updateTransferStatus(id, transferService.ship, "IN_TRANSIT");
  };

  const completeTransfer = async (id) => {
    return updateTransferStatus(id, transferService.complete, "COMPLETED");
  };

  const getTransferStats = () => {
    const total = transfers.length;
    const pending = transfers.filter((t) => t.status === "PENDING").length;
    const approved = transfers.filter((t) => t.status === "APPROVED").length;
    const inTransit = transfers.filter((t) => t.status === "IN_TRANSIT").length;
    const completed = transfers.filter((t) => t.status === "COMPLETED").length;
    const rejected = transfers.filter((t) => t.status === "REJECTED").length;

    return {
      total,
      pending,
      approved,
      inTransit,
      completed,
      rejected,
    };
  };

  const value = {
    transfers,

    loading,
    error,

    fetchTransfers,
    getTransferById,

    createTransfer,

    updateTransferStatus,

    approveTransfer,
    rejectTransfer,
    shipTransfer,
    completeTransfer,

    getTransferStats,
  };

  return (
    <TransferContext.Provider value={value}>
      {children}
    </TransferContext.Provider>
  );
}

export function useTransfer() {
  const context = useContext(TransferContext);
  if (!context) {
    throw new Error("useTransfer must be used inside TransferProvider");
  }
  return context;
}