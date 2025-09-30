import axios from "./axiosInstance";

export const loginUser = async (data) => {
  const res = await axios.post(`/auth/login`, data);
  return res.data;
};

export const signupUser = async (data) => {
  const res = await axios.post(`/auth/signup`, data);
  return res.data;
};

export const forgotPassword = async (email) => {
  const res = await axios.post(`/auth/forgot-password`, { email });
  return res.data;
};

export const resetPassword = async ({ token, email, newPassword }) => {
  const res = await axios.post(`/auth/reset-password`, {
    token,
    email,
    newPassword,
  });
  return res.data;
};
