import api from "../utils/axiosConfig.js";

const register = async (userData) => {
  const response = await api.post("/auth/register", userData);

  const user = response?.data?.data;

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  return user;
};

const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);

  const user = response?.data?.data;

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }
  return user;
};

const logout = () => {
  localStorage.removeItem("user");
};

const getMe = async () => {
  return await api.get("/me");
};

export { register, login, logout, getMe };
