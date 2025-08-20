/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

// Backend Base URL (update if needed)
const API_BASE = "http://192.168.2.63:3000/api/adminuser";

export interface AdminUser {
  id?: number;
  name: string;
  username: string;
  password: string;
  role: string;
  mobile_number: string;
  active_status?: number;
}

// 🔹 Login API
export const loginUser = async (username: string, password: string): Promise<AdminUser | null> => {
  try {
    const res = await axios.post(`${API_BASE}/login`, { username, password });
    return res.data as AdminUser;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Login API Error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Login failed");
    }
    throw error;
  }
};

// 🔹 Register API (optional if you use your POST `/` route)
export const registerUser = async (payload: AdminUser): Promise<AdminUser> => {
  try {
    const res = await axios.post(`${API_BASE}/`, payload);
    return res.data as AdminUser;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Register API Error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Registration failed");
    }
    throw error;
  }
};

// 🔹 Get Active Users (pagination support)
export const getActiveUsers = async (page = 1, limit = 10): Promise<AdminUser[]> => {
  try {
    const res = await axios.get(`${API_BASE}?page=${page}&limit=${limit}`);
    return res.data as AdminUser[];
  } catch (error: any) {
    console.error("Fetch Users Error:", error);
    throw error;
  }
};
