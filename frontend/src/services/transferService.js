import api from "./api";

const transferService = {
  async getAll(params = {}) {
    const response =
      await api.get("/transfers", {
        params,
      });

    return response.data;
  },

  async getById(id) {
    const response =
      await api.get(
        `/transfers/${id}`
      );

    return response.data;
  },

  async create(data) {
    const response =
      await api.post(
        "/transfers",
        data
      );

    return response.data;
  },

  async approve(id) {
    const response =
      await api.patch(
        `/transfers/${id}/approve`
      );

    return response.data;
  },

  async reject(id, reason) {
    const response =
      await api.patch(
        `/transfers/${id}/reject`,
        {
          reason,
        }
      );

    return response.data;
  },

  async ship(id) {
    const response =
      await api.patch(
        `/transfers/${id}/ship`
      );

    return response.data;
  },

  async complete(id) {
    const response =
      await api.patch(
        `/transfers/${id}/complete`
      );

    return response.data;
  },

  async cancel(id, reason) {
    const response =
      await api.patch(
        `/transfers/${id}/cancel`,
        {
          reason,
        }
      );

    return response.data;
  },

  async getStats() {
    const response =
      await api.get(
        "/transfers/stats"
      );

    return response.data;
  },
};

export default transferService;