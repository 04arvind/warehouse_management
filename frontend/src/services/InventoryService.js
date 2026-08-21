import api from "./api";

const inventoryService = {
  async getAll(params = {}) {
    const response = await api.get("/inventory", {
      params,
    });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/inventory/${id}`);
    return response.data;
  },

  async getByWarehouse(warehouseId, params = {}) {
    const response = await api.get(`/inventory/warehouse/${warehouseId}`, {
      params,
    });
    return response.data;
  },

  async updateStock(id, quantity) {
    const response = await api.patch(`/inventory/${id}/stock`, {
      quantity,
    });
    return response.data;
  },

  async getLowStock(params = {}) {
    const response = await api.get("/inventory/low-stock", {
      params,
    });
    return response.data;
  },

  async create(data) {
    const response = await api.post("/inventory", data);
    return response.data;
  },

  async search(query) {
    const response = await api.get("/inventory/search", {
      params: {
        q: query,
      },
    });
    return response.data;
  },
};

export default inventoryService;