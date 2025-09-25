import React, { createContext, useContext, useState } from "react";
import { loginUser, signupUser } from "../api/authAPI";

const AuthContext = createContext();

const getStoredUser = () => {
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    console.error("Invalid user in localStorage:", e);
    localStorage.removeItem("user");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(getStoredUser);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const login = async (data) => {
    const res = await loginUser(data);
    setAuthUser(res.user);
    setToken(res.token);
    localStorage.setItem("user", JSON.stringify(res.user));
    localStorage.setItem("token", res.token);
    return res.user;
  };

  const signup = async (data) => {
    const res = await signupUser(data);
    setAuthUser(res.user);
    setToken(res.token);
    localStorage.setItem("user", JSON.stringify(res.user));
    localStorage.setItem("token", res.token);
    return res.user;
  };

  const logout = () => {
    setAuthUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ authUser, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
