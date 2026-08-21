import api from "./api";

const auditService = {
  async getAll(params = {}) {
    const response =
      await api.get("/audit-logs", {
        params,
      });

    return response.data;
  },

  async getById(id) {
    const response =
      await api.get(
        `/audit-logs/${id}`
      );

    return response.data;
  },

  async getByUser(userId) {
    const response =
      await api.get(
        `/users/${userId}/audit-logs`
      );

    return response.data;
  },
};

export default auditService;