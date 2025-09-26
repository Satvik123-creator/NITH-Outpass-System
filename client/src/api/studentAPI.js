import axios from "axios";

// Make sure this points to your backend, not Vite dev server
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Get all outpasses of the logged-in student
 * @param {string} token - JWT token
 */
export const getOutpasses = async (token) => {
  if (!token) throw new Error("No token provided for getOutpasses");

  const res = await axios.get(`${API_URL}/outpass/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * Create a new outpass
 * @param {FormData} formData - Form data including optional file
 * @param {string} token - JWT token
 */
export const createOutpass = async (formData, token) => {
  if (!token) throw new Error("No token provided for createOutpass");

  // Send JSON to the server (no file upload expected). The server
  // mounts student routes under /api/outpass (see backend/server.js).
  const res = await axios.post(`${API_URL}/outpass/apply`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

/**
 * Get a single outpass by id for the logged-in student
 */
export const getOutpassById = async (id, token) => {
  if (!token) throw new Error("No token provided for getOutpassById");
  const res = await axios.get(`${API_URL}/outpass/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
