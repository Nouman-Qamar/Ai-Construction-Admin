import axiosInstance from "./axiosInstance";

export const loginUser = (data) => axiosInstance.post("/auth/login", data);
