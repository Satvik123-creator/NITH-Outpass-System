import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const loginUser = async (data) => {
  const res = await axios.post(`${API_URL}/auth/login`, data);
  return res.data;
};

export const signupUser = async (data) => {
  const res = await axios.post(`${API_URL}/auth/signup`, data);
  return res.data;
};
