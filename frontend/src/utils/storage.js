import {
  STORAGE_KEYS,
} from "./constants";

export const storage = {
  getToken() {
    return localStorage.getItem(
      STORAGE_KEYS.TOKEN
    );
  },

  setToken(token) {
    localStorage.setItem(
      STORAGE_KEYS.TOKEN,
      token
    );
  },

  removeToken() {
    localStorage.removeItem(
      STORAGE_KEYS.TOKEN
    );
  },

  getUser() {
    const user =
      localStorage.getItem(
        STORAGE_KEYS.USER
      );

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  },

  setUser(user) {
    localStorage.setItem(
      STORAGE_KEYS.USER,
      JSON.stringify(user)
    );
  },

  removeUser() {
    localStorage.removeItem(
      STORAGE_KEYS.USER
    );
  },

  clear() {
    localStorage.removeItem(
      STORAGE_KEYS.TOKEN
    );

    localStorage.removeItem(
      STORAGE_KEYS.USER
    );
  },
};