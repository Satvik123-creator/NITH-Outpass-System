import axios from "./axiosInstance";

/**
 * Get all outpasses of the logged-in student
 */
export const getOutpasses = async () => {
  const res = await axios.get(`/outpass/all`);
  return res.data;
};

/**
 * Create a new outpass
 * @param {FormData} formData - Form data including optional file
 * @param {string} token - JWT token
 */
export const createOutpass = async (formData) => {
  const res = await axios.post(`/outpass/apply`, formData);
  return res.data;
};

/**
 * Get a single outpass by id for the logged-in student
 */
export const getOutpassById = async (id) => {
  const res = await axios.get(`/outpass/${id}`);
  return res.data;
};
