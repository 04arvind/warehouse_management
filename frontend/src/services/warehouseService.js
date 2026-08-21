import api from "./api";

const warehouseService = {
  async getAll(params = {}) {
    const response =
      await api.get("/warehouses", {
        params,
      });

    return response.data;
  },

  async getById(id) {
    const response =
      await api.get(
        `/warehouses/${id}`
      );

    return response.data;
  },

  async create(data) {
    const response =
      await api.post(
        "/warehouses",
        data
      );

    return response.data;
  },

  async update(id, data) {
    const response =
      await api.put(
        `/warehouses/${id}`,
        data
      );

    return response.data;
  },

  async remove(id) {
    const response =
      await api.delete(
        `/warehouses/${id}`
      );

    return response.data;
  },

  async getStats(id) {
    const response =
      await api.get(
        `/warehouses/${id}/stats`
      );

    return response.data;
  },
};

export default warehouseService;