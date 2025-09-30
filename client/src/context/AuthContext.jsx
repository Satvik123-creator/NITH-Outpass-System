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
    // Backend sometimes returns the access token as `accessToken` (login)
    // and signup returns it as `token`. Accept either to be robust.
    const savedToken = res.token || res.accessToken || res.access_token || null;
    setToken(savedToken);
    localStorage.setItem("user", JSON.stringify(res.user));
    if (savedToken) localStorage.setItem("token", savedToken);
    // If backend provided a plain refresh token (dev only), store it for refresh attempts
    if (res.refreshToken) {
      localStorage.setItem("refreshToken", res.refreshToken);
    }
    return res.user;
  };

  const signup = async (data) => {
    const res = await signupUser(data);
    setAuthUser(res.user);
    // Accept either token field name from backend
    const savedToken = res.token || res.accessToken || res.access_token || null;
    setToken(savedToken);
    localStorage.setItem("user", JSON.stringify(res.user));
    if (savedToken) localStorage.setItem("token", savedToken);
    if (res.refreshToken) {
      localStorage.setItem("refreshToken", res.refreshToken);
    }
    return res.user;
  };

  const logout = () => {
    setAuthUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  };

  return (
    <AuthContext.Provider value={{ authUser, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
