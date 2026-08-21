import api from "./api";

const userService = {
  async getAll(params = {}) {
    const response =
      await api.get("/users", {
        params,
      });

    return response.data;
  },

  async getById(id) {
    const response =
      await api.get(
        `/users/${id}`
      );

    return response.data;
  },

  async create(data) {
    const response =
      await api.post(
        "/users",
        data
      );

    return response.data;
  },

  async update(id, data) {
    const response =
      await api.put(
        `/users/${id}`,
        data
      );

    return response.data;
  },

  async updateRole(
    id,
    role
  ) {
    const response =
      await api.patch(
        `/users/${id}/role`,
        {
          role,
        }
      );

    return response.data;
  },

  async toggleStatus(id) {
    const response =
      await api.patch(
        `/users/${id}/status`
      );

    return response.data;
  },

  async remove(id) {
    const response =
      await api.delete(
        `/users/${id}`
      );

    return response.data;
  },
};

export default userService;