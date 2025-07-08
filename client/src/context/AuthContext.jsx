import { createContext, useState, useEffect } from "react";
import axiosInstance from "../config/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${token}`;
          console.log("Checking auth with token:", token.slice(0, 20) + "...");
          const response = await axiosInstance.get("/auth/me");
          console.log("Auth check response:", response.data);
          setUser({ ...response.data.user, _id: response.data.user._id });
        } else {
          console.log("No token found in localStorage");
        }
      } catch (err) {
        console.error("Auth check error:", err.response?.data || err.message);
        setUser(null);
        delete axiosInstance.defaults.headers.common["Authorization"];
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
      console.log("Login successful:", { userId: user._id, role: user.role });
      setUser({ ...user, _id: user._id });
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      throw err.response?.data?.message || "Login failed";
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    delete axiosInstance.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
