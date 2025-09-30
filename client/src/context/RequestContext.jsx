import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import { getOutpasses, createOutpass } from "../api/studentAPI"; // Import your API functions

// Provide a safe default so components won't crash if context isn't available briefly
const RequestContext = createContext({
  requests: [],
  loading: false,
  fetchRequests: async () => {},
  requestOutpass: async () => {},
});

export const RequestProvider = ({ children }) => {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all outpasses
  const fetchRequests = async () => {
    // If no token yet, still attempt: axios instance will try refresh if needed
    try {
      setLoading(true);
      const res = await getOutpasses(); // Use API function (no token param)
      // API returns { data, page, limit, total } for history endpoint
      const outpasses = res?.data || res;
      setRequests(outpasses || []);
    } catch (err) {
      // show a user-friendly toast but avoid noisy console stack in dev
      const msg =
        err?.response?.data?.message ||
        err.message ||
        "Failed to fetch outpasses";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Create new outpass
  const requestOutpass = async (formData) => {
    try {
      setLoading(true);
      const newOutpass = await createOutpass(formData); // Use API function
      toast.success("Outpass requested successfully!");
      setRequests((prev) => [newOutpass, ...prev]); // Add newly created outpass
      return newOutpass;
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err.message ||
        "Failed to request outpass";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Automatically fetch requests when token changes (or on mount)
  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <RequestContext.Provider
      value={{ requests, loading, fetchRequests, requestOutpass }}
    >
      {children}
    </RequestContext.Provider>
  );
};

export const useRequests = () => useContext(RequestContext);
