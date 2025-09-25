import axios from "axios";
// const API_URL = "http://localhost:5000/api/warden";
const API_URL = import.meta.env.VITE_API_URL;

// Backend mounts warden routes under /api/outpasses
export const getAllOutpasses = async (token) => {
  if (!token) throw new Error("No token provided for getAllOutpasses");

  const res = await axios.get(`${API_URL}/outpasses/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateOutpass = async (id, status, token) => {
  if (!token) throw new Error("No token provided for updateOutpass");

  const res = await axios.put(
    `${API_URL}/outpasses/update/${id}`,
    { status },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const getOutpassById = async (id, token) => {
  if (!token) throw new Error("No token provided for getOutpassById");

  const res = await axios.get(`${API_URL}/outpasses/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
