import axios from "./axiosInstance";

// Backend mounts warden routes under /api/outpasses
export const getAllOutpasses = async () => {
  const res = await axios.get(`/outpasses/all`);
  return res.data;
};

export const updateOutpass = async (id, status) => {
  const res = await axios.put(`/outpasses/update/${id}`, { status });
  return res.data;
};

export const getOutpassById = async (id) => {
  const res = await axios.get(`/outpasses/${id}`);
  return res.data;
};
