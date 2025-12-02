import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const API_URL = "https://backend-vdocs.onrender.com";

  // ===== Load user từ AsyncStorage khi app/web khởi động =====
  useEffect(() => {
    const loadUser = async () => {
      try {
        const json = await AsyncStorage.getItem("user");
        if (json) setUser(JSON.parse(json));
      } catch (err) {
        console.error("Load user error:", err);
      } finally {
        setAuthChecked(true); // luôn set true dù lỗi
      }
    };
    loadUser();
  }, []);

  // ===== Login =====
  const login = async ({ userId, password }) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { userId, password });

      const { user: userData, token } = res.data;

      if (userData && token) {
        setUser(userData);

        // Lưu user
        await AsyncStorage.setItem("user", JSON.stringify(userData));

        // Lưu token cho web
        if (typeof window !== "undefined" && window.localStorage) {
          localStorage.setItem("token", token);
        }

        // Lưu token cho mobile
        await AsyncStorage.setItem("token", token);

        console.log("Login success, token saved:", token);
        return { success: true, token };
      }

      return { success: false, message: res.data.message || "Login failed" };
    } catch (err) {
      console.error("Login error response:", err.response?.data || err.message);
      return {
        success: false,
        message: err.response?.data?.message || err.message || "Login failed",
      };
    }
  };

  // ===== Register =====
  const register = async ({ userId, name, deptname, department, password }) => {
    try {
      // ===== Validate client trước =====
      const allowedDepartments = ["HDCX", "PVHL", "ULD"];
      if (!userId || !name || !deptname || !department || !password) {
        return { success: false, message: "Thiếu thông tin đăng ký" };
      }
      if (!allowedDepartments.includes(department)) {
        return { success: false, message: "Department không hợp lệ" };
      }

      const res = await axios.post(`${API_URL}/api/auth/register`, {
        userId,
        name,
        deptname,
        department,
        password,
      });

      const { user: userData, token } = res.data;

      if (userData && token) {
        setUser(userData);

        // Lưu user
        await AsyncStorage.setItem("user", JSON.stringify(userData));

        // Lưu token cho web
        if (typeof window !== "undefined" && window.localStorage) {
          localStorage.setItem("token", token);
        }

        // Lưu token cho mobile
        await AsyncStorage.setItem("token", token);

        console.log("Register success, token saved:", token);
        return { success: true, token };
      }

      return { success: false, message: res.data.message || "Register failed" };
    } catch (err) {
      console.error("Register error response:", err.response?.data || err.message);
      return {
        success: false,
        message: err.response?.data?.message || err.message || "Register failed",
      };
    }
  };

  // ===== Logout =====
  const logout = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");

      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.removeItem("token");
      }

      console.log("Logout success");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <UserContext.Provider value={{ user, authChecked, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
};
