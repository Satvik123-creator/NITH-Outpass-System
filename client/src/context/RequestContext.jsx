import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import { getOutpasses, createOutpass } from "../api/studentAPI"; // Import your API functions

const RequestContext = createContext();

export const RequestProvider = ({ children }) => {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all outpasses
  const fetchRequests = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await getOutpasses(token); // Use API function
      setRequests(data);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error(err?.response?.data?.message || "Failed to fetch outpasses");
    } finally {
      setLoading(false);
    }
  };

  // Create new outpass
  const requestOutpass = async (formData) => {
    if (!token) {
      toast.error("You must be logged in to request outpass");
      return;
    }

    try {
      setLoading(true);
      const newOutpass = await createOutpass(formData, token); // Use API function
      toast.success("Outpass requested successfully!");
      setRequests((prev) => [newOutpass, ...prev]); // Add newly created outpass
      return newOutpass;
    } catch (err) {
      console.error("Request error:", err);
      toast.error(err?.response?.data?.message || "Failed to request outpass");
    } finally {
      setLoading(false);
    }
  };

  // Automatically fetch requests when token is available
  useEffect(() => {
    if (token) fetchRequests();
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
